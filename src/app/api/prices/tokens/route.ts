import { NextResponse } from "next/server";

// In-memory cache for prices
const priceCache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_DURATION = 60 * 1000; // 1 minute cache

// Map contract addresses to CoinGecko IDs
const TOKEN_ADDRESS_TO_ID: Record<string, string> = {
  // Ethereum
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "usd-coin",
  "0xdac17f958d2ee523a2206206994597c13d831ec7": "tether",
  "0x6b175474e89094c44da98b954eedeac495271d0f": "dai",
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "weth",
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": "wrapped-bitcoin",
  // Polygon
  "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359": "usd-coin",
  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f": "tether",
  "0x7ceb23fd6bc0add59e62ac25578270ccff1b9f619": "weth",
  "0x53e0bca35ec6bd2726a5b88920d7b9f8a4b9f6d3": "matic-network",
  "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6": "wrapped-bitcoin",
  "0x8f3cf7a23f223c3a7cde5dc3d3a7d9b3e7c8e5f": "dai",
  // Arbitrum
  "0xaf88d065e77c8cc2239327c5edb3a432268e5831": "usd-coin",
  "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9": "tether",
  "0x82af49447d8a07e3bd95bd0d56f35241523fbab1": "weth",
  // Optimism
  "0x0b2c639c533813f4aa9d7837caf62653d097ff85": "usd-coin",
  "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58": "tether",
  "0x4200000000000000000000000000000000000006": "weth",
  // Base
  "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": "usd-coin",
  "0x4ed4e862860bed51a9570b96d89af5e1b0efefed": "dai",
  // BSC
  "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d": "usd-coin",
  "0x55d398326f99059ff775485246999027b3197955": "tether",
  "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b": "binancecoin",
  // Celo
  "0xceba9300f2b948710d2653dd7b07f33a8b32118c": "usd-coin",
  "0x471ece3750da237f93b8e339c536989b8978a438": "celo",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const addresses = searchParams.get("addresses")?.split(",") || [];

  if (addresses.length === 0) {
    return NextResponse.json({ error: "Missing addresses" }, { status: 400 });
  }

  // Convert addresses to CoinGecko IDs
  const coingeckoIds: string[] = [];
  const addressToToken: Record<string, string> = {};

  for (const address of addresses) {
    const normalizedAddress = address.toLowerCase();
    const coingeckoId = TOKEN_ADDRESS_TO_ID[normalizedAddress];
    if (coingeckoId && !coingeckoIds.includes(coingeckoId)) {
      coingeckoIds.push(coingeckoId);
      addressToToken[coingeckoId] = normalizedAddress;
    }
  }

  if (coingeckoIds.length === 0) {
    return NextResponse.json({ prices: {} });
  }

  // Check cache first
  const cacheKey = `tokens_${coingeckoIds.sort().join(",")}`;
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  try {
    // Fetch from CoinGecko
    const ids = coingeckoIds.join(",");
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    );

    if (!response.ok) {
      // If rate limited, try to return cached data if available
      if (cached) {
        return NextResponse.json(cached.data);
      }
      return NextResponse.json(
        { error: "Failed to fetch prices", rateLimited: true },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Map back to contract addresses
    const prices: Record<string, { price: number; change24h: number }> = {};
    for (const [coingeckoId, priceData] of Object.entries(data)) {
      const address = addressToToken[coingeckoId];
      if (address && priceData) {
        prices[address] = {
          price: (priceData as any).usd || 0,
          change24h: (priceData as any).usd_24h_change || 0,
        };
      }
    }

    const result = { prices };

    // Cache the result
    priceCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching token prices:", error);
    
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
