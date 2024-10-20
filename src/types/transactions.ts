export interface TransactionResponse {
  type: string;
  amount_usd: number;
  amount: number;
  asset: {
    name: string;
    symbol: string;
    contract: string;
    logo: string;
    id: number;
  };
  to?: string;
  from?: string;
  hash: string;
  timestamp: string;
}
