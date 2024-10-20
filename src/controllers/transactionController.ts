import { Request, Response } from "express";
import { getTransactions } from "../services/transactionService";

export const getTransactionHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { walletAddress } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!walletAddress) {
    res.status(400).json({ message: "Wallet address is required" });
  }

  try {
    // Parse page and limit to integers, in case they are passed as strings
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const { transactions } = await getTransactions(
      walletAddress,
      parsedPage,
      parsedLimit
    );

    res.status(200).json({
      transactions,
      page: parsedPage,
      perPage: parsedLimit,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
