import { NextResponse } from "next/server";

// Polymarket API - simple REST endpoint for markets
const API_V1 = "https://clob.polymarket.com/markets?closed=false&archived=false&limit=20";

// In-memory cache for markets (30 seconds)
let marketsCache: {
  data: any;
  timestamp: number;
} | null = null;
const CACHE_DURATION = 30 * 1000; // 30 seconds

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
    // Fetch from Polymarket REST API
    const response = await fetch(API_V1, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Polymarket API response keys:", Object.keys(data || {}));

    let markets: any[] = [];

    if (data.markets && Array.isArray(data.markets)) {
      markets = data.markets.map((market: any) => {
        // Get prices from acceptedOrderState
        const prices = market.acceptedOrderState?.prices || [];
        const outcomePrices = Array.isArray(prices) ? prices : [];
        
        // Get volume info
        const volume = parseFloat(market.volume || "0");
        const volume24hr = parseFloat(market.volume24hr || "0");
        
        return {
          id: market.id || market.conditionId,
          question: market.question || market.title || "Unknown Market",
          description: market.description || "",
          slug: market.slug || market.conditionId,
          image: market.imageUrl || "",
          volume,
          volume24hr,
          liquidity: parseFloat(market.liquidity || "0"),
          clobTokenIds: market.clobTokenIds || [],
          endDate: market.endDate || null,
          startDate: market.startDate || null,
          gameStartTime: null,
          active: market.active !== false,
          closed: market.closed === true,
          archived: market.archived === true,
          outcomes: market.outcomes || ["Yes", "No"],
          prices: outcomePrices,
          traderCount: parseInt(market.traderCount || "0"),
          url: `https://polymarket.com/market/${market.slug || market.conditionId}`,
          createdAt: market.createdAt || new Date().toISOString(),
        };
      });
    }

    // If no markets, try alternative format
    if (markets.length === 0 && data.data) {
      const altMarkets = Array.isArray(data.data) ? data.data : [];
      markets = altMarkets.map((market: any) => ({
        id: market.id || market.conditionId,
        question: market.question || "Unknown Market",
        description: market.description || "",
        slug: market.slug || market.conditionId,
        image: "",
        volume: parseFloat(market.volume || "0"),
        volume24hr: parseFloat(market.volume24hr || "0"),
        liquidity: parseFloat(market.liquidity || "0"),
        clobTokenIds: [],
        endDate: null,
        startDate: null,
        active: true,
        closed: false,
        archived: false,
        outcomes: ["Yes", "No"],
        prices: [],
        traderCount: 0,
        url: `https://polymarket.com/market/${market.slug || market.conditionId}`,
        createdAt: new Date().toISOString(),
      }));
    }

    const responseData = {
      markets: markets.slice(0, limit),
      pageInfo: {
        hasNextPage: markets.length > limit,
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
