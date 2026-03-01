// Polymarket Prediction Market Types

export interface Market {
  id: string;
  question: string;
  description?: string;
  slug: string;
  image?: string;
  volume: number;
  volume24hr: number;
  liquidity: number;
  clobTokenIds?: string[];
  endDate?: string;
  startDate?: string;
  gameStartTime?: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  outcomes: string[];
  prices: string[];
  traderCount: number;
  url: string;
  createdAt?: string;
}

export interface Position {
  id: string;
  marketId: string;
  marketQuestion: string;
  outcome: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  realizedPnl: number;
  clobTokenId: string;
  marketSlug: string;
}

export interface Trade {
  marketId: string;
  outcome: "YES" | "NO";
  amount: number;
  slippage?: number;
}

export interface TradeRequest {
  marketId: string;
  outcome: "YES" | "NO";
  amount: number; // In USDC
  walletAddress: string;
}

export interface TradeResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
  fee?: number;
  totalAmount?: number;
}

export interface UserPositions {
  positions: Position[];
  totalPnl: number;
  totalPnlPercent: number;
}

export interface MarketWithPrices extends Market {
  yesPrice: number;
  noPrice: number;
}

export interface TradePreview {
  amount: number;
  fee: number;
  totalAmount: number;
  potentialPayout: number;
  outcome: "YES" | "NO";
  marketQuestion: string;
}
