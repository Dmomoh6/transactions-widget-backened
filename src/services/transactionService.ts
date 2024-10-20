import { AppDataSource } from "../dataSource";
import { Transaction } from "../entities/Transaction";
import { Asset } from "../entities/Asset";
import { TransactionResponse } from "../types/transactions";
import axios from "axios";

const transactionRepository = AppDataSource.getRepository(Transaction);
const assetRepository = AppDataSource.getRepository(Asset);

export const getTransactions = async (
  walletAddress: string,
  page: number = 1,
  limit: number = 10
): Promise<{ transactions: Transaction[]; total: number }> => {
  // Calculate the number of transactions to skip
  const offset = (page - 1) * limit;

  // Fetch transactions from the local database
  const [transactions, total] = await transactionRepository.findAndCount({
    where: { walletAddress },
    order: { timestamp: "DESC" },
    skip: offset,
    take: limit,
  });

  // Determine if we need to fetch from Mobula (for pages like 1, 11, 21, ...). This is due to Mobula returning 100 entries at a time.
  const shouldFetchFromMobula =
    ((page - 1) % 10 === 0 && (page - 1) * limit >= total) || page === 1;

  if (shouldFetchFromMobula) {
    // Determine offset for Mobula API call based on the page
    const mobulaOffset = Math.floor((page - 1) / 10) * 100;

    // Fetch newer transactions from Mobula if needed
    const latestTransactionTimestamp = transactions[0]?.timestamp;
    const newTransactions = await fetchTransactionsFromMobula(
      walletAddress,
      latestTransactionTimestamp,
      mobulaOffset
    );

    // Store new transactions in the database if any
    if (newTransactions.length > 0) {
      await transactionRepository.save(newTransactions);

      // Refetch transactions to include the newly added ones
      const [updatedTransactions, updatedTotal] =
        await transactionRepository.findAndCount({
          where: { walletAddress },
          order: { timestamp: "DESC" },
          skip: offset,
          take: limit,
        });

      return { transactions: updatedTransactions, total: updatedTotal };
    }
  }

  // Return the combined transactions and the total count
  return { transactions, total };
};

// Function to fetch transactions from Mobula
const fetchTransactionsFromMobula = async (
  walletAddress: string,
  latestTransactionDate?: Date,
  offset: number = 0
) => {
  try {
    const response = await axios.get(
      `https://api.mobula.io/api/1/wallet/transactions`,
      {
        params: {
          wallet: walletAddress,
          from: latestTransactionDate
            ? Math.floor(latestTransactionDate.getTime() / 1000)
            : undefined,
          limit: 100, // Fetch 100 transactions per call to match our offset strategy
          offset, // Use the calculated offset to fetch the correct set of transactions
        },
        headers: {
          Authorization: `Bearer ${process.env.MOBULA_API_KEY}`,
        },
      }
    );

    const transactions = await Promise.all(
      response.data.data
        ? response.data.data
            .filter(
              (tx: TransactionResponse) =>
                !latestTransactionDate ||
                new Date(tx.timestamp) > latestTransactionDate
            )
            .map(async (tx: TransactionResponse) => {
              // Check if the asset already exists in the database
              let asset = await assetRepository.findOne({
                where: { contract: tx.asset.contract },
              });

              // If it doesn't exist, create a new one
              if (!asset) {
                asset = assetRepository.create({
                  name: tx.asset.name,
                  symbol: tx.asset.symbol,
                  contract: tx.asset.contract,
                  logo: tx.asset.logo,
                });
                asset = await assetRepository.save(asset);
              }

              // Create the transaction using the existing or newly created asset
              return transactionRepository.create({
                walletAddress,
                transactionType: tx.type,
                amountSpent: tx.type === "buy" ? tx.amount_usd : tx.amount,
                amountReceived: tx.type === "sell" ? tx.amount_usd : tx.amount,
                asset,
                receivingAddress: tx.to,
                sendingAddress: tx.from,
                transactionHash: tx.hash,
                timestamp: new Date(tx.timestamp),
              });
            })
        : []
    );

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions from Mobula:", error);
    return [];
  }
};
