// Polymarket Client Utilities
import type { Position, TradePreview, MarketWithPrices } from "@/types/prediction";

// Service fee percentage (1%)
export const SERVICE_FEE_PERCENT = 1;

/**
 * Calculate the service fee for a trade
 */
export function calculateServiceFee(amount: number): number {
  return (amount * SERVICE_FEE_PERCENT) / 100;
}

/**
 * Format a price (decimal) to percentage display
 */
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(numPrice) || numPrice <= 0) return "N/A";
  return `${(numPrice * 100).toFixed(0)}%`;
}

/**
 * Calculate PnL for a position
 */
export function calculatePnL(
  amount: number,
  avgPrice: number,
  currentPrice: number,
  outcome: "YES" | "NO"
): { pnl: number; pnlPercent: number } {
  const investment = amount * avgPrice;
  if (investment === 0) return { pnl: 0, pnlPercent: 0 };

  const currentValue = outcome === "YES" 
    ? amount * currentPrice 
    : amount * (1 - currentPrice);
  
  const pnl = currentValue - investment;
  const pnlPercent = (pnl / investment) * 100;

  return { pnl, pnlPercent };
}

/**
 * Calculate potential payout for a trade
 */
export function calculatePotentialPayout(
  amount: number,
  price: number,
  outcome: "YES" | "NO"
): number {
  const fee = calculateServiceFee(amount);
  const netAmount = amount - fee;
  
  if (outcome === "YES") {
    return netAmount * (1 / price);
  } else {
    return netAmount * (1 / (1 - price));
  }
}

/**
 * Generate trade preview
 */
export function generateTradePreview(
  market: MarketWithPrices,
  amount: number,
  outcome: "YES" | "NO"
): TradePreview {
  const price = outcome === "YES" ? market.yesPrice : market.noPrice;
  const fee = calculateServiceFee(amount);
  const totalAmount = amount;
  const potentialPayout = calculatePotentialPayout(amount, price, outcome);

  return {
    amount,
    fee,
    totalAmount,
    potentialPayout,
    outcome,
    marketQuestion: market.question,
  };
}

/**
 * Format currency value
 */
export function formatCurrency(value: number, decimals = 2): string {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(decimals)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(decimals)}K`;
  }
  return `$${value.toFixed(decimals)}`;
}

/**
 * Format PnL with color indicator
 */
export function formatPnL(pnl: number): { text: string; isPositive: boolean } {
  const isPositive = pnl >= 0;
  const text = `${isPositive ? "+" : ""}${formatCurrency(pnl)}`;
  return { text, isPositive };
}

/**
 * Get market with parsed prices
 */
export function getMarketWithPrices(market: any): MarketWithPrices {
  const prices = market.prices || [];
  const yesPrice = prices.length > 0 ? parseFloat(prices[0]) : 0;
  const noPrice = prices.length > 1 ? parseFloat(prices[1]) : 0;

  return {
    ...market,
    yesPrice,
    noPrice,
  };
}

/**
 * Validate wallet address
 */
export function isValidWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate trade amount
 */
export function isValidTradeAmount(amount: number): boolean {
  return amount > 0 && amount <= 10000; // Max $10,000 per trade
}
