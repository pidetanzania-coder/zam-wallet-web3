import { NextRequest, NextResponse } from "next/server";
import { isValidWalletAddress, isValidTradeAmount, calculateServiceFee } from "@/lib/polymarket";

// Polymarket API endpoints
const POLYMARKET_API = "https://clob.polymarket.com";

// Service fee (1%)
const SERVICE_FEE_PERCENT = 1;

interface TradeParams {
  marketId: string;
  outcome: "YES" | "NO";
  amount: number;
  walletAddress: string;
}

async function executeTradeOnPolymarket(trade: TradeParams) {
  // In production, this would use the Polymarket Builder API
  // with API keys stored in environment variables
  // 
  // The actual implementation would:
  // 1. Get the CLOB token ID for the market/outcome
  // 2. Create an order on Polymarket
  // 3. Sign the transaction with user's wallet
  // 4. Submit to the Polygon network
  
  // For demo purposes, we simulate a successful trade
  // In production, replace with actual Polymarket API calls
  
  const fee = calculateServiceFee(trade.amount);
  const netAmount = trade.amount - fee;
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock transaction hash
  const txHash = `0x${Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;
  
  return {
    success: true,
    transactionHash: txHash,
    fee,
    netAmount,
    totalAmount: trade.amount,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { marketId, outcome, amount, walletAddress } = body;

    // Validate required fields
    if (!marketId || !outcome || !amount || !walletAddress) {
      return NextResponse.json(
        { error: "Missing required fields: marketId, outcome, amount, walletAddress" },
        { status: 400 }
      );
    }

    // Validate outcome
    if (outcome !== "YES" && outcome !== "NO") {
      return NextResponse.json(
        { error: "Outcome must be 'YES' or 'NO'" },
        { status: 400 }
      );
    }

    // Validate wallet address
    if (!isValidWalletAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    // Validate amount
    if (!isValidTradeAmount(amount)) {
      return NextResponse.json(
        { error: "Invalid trade amount. Must be between $0.01 and $10,000" },
        { status: 400 }
      );
    }

    // Calculate service fee (done on backend to prevent manipulation)
    const serviceFee = calculateServiceFee(amount);
    
    // Execute the trade
    const result = await executeTradeOnPolymarket({
      marketId,
      outcome,
      amount,
      walletAddress,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        transactionHash: result.transactionHash,
        fee: serviceFee,
        totalAmount: amount,
        netAmount: result.netAmount,
        message: `Successfully placed ${outcome} trade on market`,
      });
    }
    
    return NextResponse.json(
      { error: "Trade execution failed" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error executing trade:", error);
    return NextResponse.json(
      { error: "Failed to execute trade" },
      { status: 500 }
    );
  }
}

// Get trade preview (calculate fees without executing)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, outcome } = body;

    if (!amount || !outcome) {
      return NextResponse.json(
        { error: "Missing required fields: amount, outcome" },
        { status: 400 }
      );
    }

    if (outcome !== "YES" && outcome !== "NO") {
      return NextResponse.json(
        { error: "Outcome must be 'YES' or 'NO'" },
        { status: 400 }
      );
    }

    if (!isValidTradeAmount(amount)) {
      return NextResponse.json(
        { error: "Invalid trade amount" },
        { status: 400 }
      );
    }

    // Calculate fees
    const serviceFee = calculateServiceFee(amount);
    const netAmount = amount - serviceFee;

    return NextResponse.json({
      amount,
      fee: serviceFee,
      netAmount,
      feePercent: SERVICE_FEE_PERCENT,
      outcome,
    });
  } catch (error) {
    console.error("Error generating trade preview:", error);
    return NextResponse.json(
      { error: "Failed to generate trade preview" },
      { status: 500 }
    );
  }
}
