import { NextResponse } from "next/server";
import { isValidWalletAddress } from "@/lib/polymarket";

// Polymarket API endpoints
const POLYMARKET_API = "https://clob.polymarket.com";
const POLYGON_RPC = process.env.POLYGON_RPC || "https://polygon-rpc.com";

// GraphQL query for fetching user positions
const POSITIONS_QUERY = `
  query GetPositions($address: String!) {
    positions(
      fts: ["0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"]
      userAddress: $address
    ) {
      edges {
        node {
          id
          market {
            id
            question
            slug
          }
          outcome
          size
          avgPrice
          realizedPnl
          marketClobTokenId
        }
      }
    }
  }
`;

// Alternative: Fetch positions from a simpler endpoint
async function fetchPositionsFromAPI(address: string) {
  try {
    const response = await fetch(
      `${POLYMARKET_API}/positions?address=${address}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch positions: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching positions from Polymarket:", error);
    return null;
  }
}

// Fallback: Generate mock positions for demo (remove in production)
function generateMockPositions(address: string) {
  return {
    positions: [
      {
        id: "1",
        marketId: "mock-market-1",
        marketQuestion: "Will Bitcoin exceed $100,000 by end of 2024?",
        outcome: "YES",
        amount: 100,
        avgPrice: 0.45,
        currentPrice: 0.52,
        pnl: 15.56,
        pnlPercent: 34.6,
        realizedPnl: 0,
        clobTokenId: "0x1234",
        marketSlug: "btc-100k-2024",
      },
      {
        id: "2",
        marketId: "mock-market-2",
        marketQuestion: "Will ETH merge to PoS by Q2 2024?",
        outcome: "NO",
        amount: 50,
        avgPrice: 0.3,
        currentPrice: 0.25,
        pnl: 8.33,
        pnlPercent: 55.6,
        realizedPnl: 0,
        clobTokenId: "0x5678",
        marketSlug: "eth-merge",
      },
    ],
    totalPnl: 23.89,
    totalPnlPercent: 40.2,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    // Validate wallet address
    if (!address) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    if (!isValidWalletAddress(address)) {
      return NextResponse.json(
        { error: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    // Try to fetch from Polymarket API first
    let positions = await fetchPositionsFromAPI(address);

    // If no positions from API, use mock data for demo
    if (!positions || !positions.length) {
      const mockData = generateMockPositions(address);
      return NextResponse.json(mockData);
    }

    // Transform API response to our format
    const transformedPositions = positions.map((pos: any) => ({
      id: pos.id || pos.marketClobTokenId,
      marketId: pos.market?.id || pos.marketId,
      marketQuestion: pos.market?.question || pos.marketQuestion,
      outcome: pos.outcome,
      amount: parseFloat(pos.size || pos.amount || 0),
      avgPrice: parseFloat(pos.avgPrice || 0),
      currentPrice: parseFloat(pos.currentPrice || pos.avgPrice || 0),
      pnl: parseFloat(pos.pnl || 0),
      pnlPercent: parseFloat(pos.pnlPercent || 0),
      realizedPnl: parseFloat(pos.realizedPnl || 0),
      clobTokenId: pos.marketClobTokenId || pos.clobTokenId,
      marketSlug: pos.market?.slug || pos.marketSlug,
    }));

    // Calculate totals
    const totalPnl = transformedPositions.reduce(
      (sum: number, pos: any) => sum + pos.pnl,
      0
    );
    const totalInvestment = transformedPositions.reduce(
      (sum: number, pos: any) => sum + pos.amount * pos.avgPrice,
      0
    );
    const totalPnlPercent = totalInvestment > 0
      ? (totalPnl / totalInvestment) * 100
      : 0;

    return NextResponse.json({
      positions: transformedPositions,
      totalPnl,
      totalPnlPercent,
    });
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      { error: "Failed to fetch positions" },
      { status: 500 }
    );
  }
}
