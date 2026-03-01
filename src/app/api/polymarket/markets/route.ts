import { NextResponse } from "next/server";

// Polymarket API - using the correct endpoints
const API_KEY = process.env.POLYMARKET_API_KEY;

// Polymarket CLOB API endpoints
const CLOB_API = "https://clob.polymarket.com";

// In-memory cache for markets (30 seconds)
let marketsCache: {
  data: any;
  timestamp: number;
} | null = null;
const CACHE_DURATION = 30 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "true";
  const limit = parseInt(searchParams.get("limit") || "20");

  // Check cache
  const now = Date.now();
  if (
    !forceRefresh &&
    marketsCache &&
    now - marketsCache.timestamp < CACHE_DURATION
  ) {
    return NextResponse.json(marketsCache.data);
  }

  try {
    // Build headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    // Add API key if available
    if (API_KEY) {
      headers["POLY-API-KEY"] = API_KEY;
    }

    // Try fetching markets from the CLOB API
    const marketsResponse = await fetch(
      `${CLOB_API}/info/markets?active=true&closed=false&limit=${limit}`,
      {
        method: "GET",
        headers,
        next: { revalidate: 30 },
      }
    );

    if (!marketsResponse.ok) {
      console.error("Markets API error:", marketsResponse.status, marketsResponse.statusText);
      throw new Error(`HTTP error! status: ${marketsResponse.status}`);
    }

    const marketsData = await marketsResponse.json();
    console.log("Markets data keys:", Object.keys(marketsData || {}));

    let markets: any[] = [];
    
    // Handle different response formats
    const rawMarkets = marketsData.markets || marketsData;

    if (Array.isArray(rawMarkets)) {
      markets = rawMarkets.slice(0, limit).map((market: any) => {
        // Extract prices - might be in different formats
        let prices: string[] = ["0.5", "0.5"];
        
        if (market.acceptedOrderState?.prices) {
          prices = market.acceptedOrderState.prices;
        } else if (market.candles && market.candles.length > 0) {
          // Use last candle close as price
          const lastCandle = market.candles[market.candles.length - 1];
          prices = [String(lastCandle.close || 0.5)];
        }

        return {
          id: market.id || market.conditionId,
          question: market.question || market.title || "Unknown Market",
          description: market.description || "",
          slug: market.slug || "",
          image: market.imageUrl || market.icon || "",
          volume: parseFloat(market.volume || "0"),
          volume24hr: parseFloat(market.volume24hr || "0"),
          liquidity: parseFloat(market.liquidity || "0"),
          clobTokenIds: market.clobTokenIds || [],
          endDate: market.endDate || null,
          startDate: market.startDate || null,
          gameStartTime: market.gameStartTime || null,
          active: market.active !== false,
          closed: market.closed === true,
          archived: market.archived === true,
          outcomes: market.outcomes || ["Yes", "No"],
          prices: prices,
          traderCount: parseInt(market.uniqueStakers || market.traderCount || "0"),
          url: `https://polymarket.com/market/${market.slug || market.conditionId}`,
          createdAt: market.createdAt || new Date().toISOString(),
        };
      });
    }

    const responseData = {
      markets,
      pageInfo: {
        hasNextPage: markets.length >= limit,
        endCursor: null,
      },
    };

    // Update cache
    marketsCache = {
      data: responseData,
      timestamp: now,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching markets from Polymarket:", error);
    return NextResponse.json(
      { error: "Failed to fetch markets", markets: [], details: String(error) },
      { status: 200 }
    );
  }
}
