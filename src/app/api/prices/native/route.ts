import { NextResponse } from "next/server";

// In-memory cache for prices
const priceCache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_DURATION = 60 * 1000; // 1 minute cache

// Map chain IDs to CoinGecko IDs
const CHAIN_TO_COINGECKO: Record<number, string> = {
  1: "ethereum",
  137: "matic-network",
  42161: "ethereum",
  10: "ethereum",
  8453: "ethereum",
  56: "binancecoin",
  42220: "celo",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chainId = parseInt(searchParams.get("chainId") || "0");

  if (!chainId) {
    return NextResponse.json({ error: "Missing chainId" }, { status: 400 });
  }

  const coingeckoId = CHAIN_TO_COINGECKO[chainId];
  if (!coingeckoId) {
    return NextResponse.json({ error: "Unsupported chain" }, { status: 400 });
  }

  // Check cache first
  const cacheKey = `native_${chainId}`;
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  try {
    // Fetch from CoinGecko
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd&include_24hr_change=true`
    );

    if (!response.ok) {
      // If rate limited, try to return cached data if available
      if (cached) {
        return NextResponse.json(cached.data);
      }
      return NextResponse.json(
        { error: "Failed to fetch price", rateLimited: true },
        { status: response.status }
      );
    }

    const data = await response.json();
    const tokenData = data[coingeckoId];

    if (!tokenData) {
      return NextResponse.json({ error: "No price data" }, { status: 404 });
    }

    const result = {
      price: tokenData.usd || 0,
      change24h: tokenData.usd_24h_change || 0,
    };

    // Cache the result
    priceCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching native price:", error);
    
    // Return cached data if available, otherwise error
    if (cached) {
      return NextResponse.json(cached.data);
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
