import { NextResponse } from "next/server";

// Polymarket GraphQL endpoint
const POLYMARKET_API = "https://clob.polymarket.com/graphql";

// GraphQL query for fetching markets
const MARKETS_QUERY = `
  query GetMarkets($cursor: String, $limit: Int) {
    markets(
      cursor: $cursor
      limit: $limit
      closed: false
      archived: false
    ) {
      edges {
        node {
          id
          question
          description
          slug
          image
          volume
          volume24hr
          liquidity
          clobTokenIds
          createdAt
          endDate
          startDate
          gameStartTime
          active
          closed
          archived
          outcomes
          outcomePrices
          traderCounts
          liquidityLevels {
            bid
            ask
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Fallback mock markets data
const MOCK_MARKETS = [
  {
    id: "1",
    question: "Will Bitcoin reach $100,000 by end of 2025?",
    description: "Bitcoin price prediction market",
    slug: "bitcoin-100k-2025",
    image: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg",
    volume: 1250000,
    volume24hr: 85000,
    liquidity: 2500000,
    clobTokenIds: ["123", "124"],
    endDate: "2025-12-31T23:59:59Z",
    startDate: "2024-01-01T00:00:00Z",
    gameStartTime: null,
    active: true,
    closed: false,
    archived: false,
    outcomes: ["Yes", "No"],
    prices: ["0.45", "0.55"],
    traderCount: 5420,
    url: "https://polymarket.com/market/bitcoin-100k-2025",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    question: "Will ETH surpass $5,000 in 2025?",
    description: "Ethereum price prediction",
    slug: "eth-5000-2025",
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    volume: 890000,
    volume24hr: 45000,
    liquidity: 1200000,
    clobTokenIds: ["234", "235"],
    endDate: "2025-12-31T23:59:59Z",
    startDate: "2024-06-01T00:00:00Z",
    gameStartTime: null,
    active: true,
    closed: false,
    archived: false,
    outcomes: ["Yes", "No"],
    prices: ["0.32", "0.68"],
    traderCount: 3200,
    url: "https://polymarket.com/market/eth-5000-2025",
    createdAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "3",
    question: "Will there be a crypto ETF approved in 2025?",
    description: "Crypto ETF approval prediction",
    slug: "crypto-etf-2025",
    image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg",
    volume: 2100000,
    volume24hr: 120000,
    liquidity: 3500000,
    clobTokenIds: ["345", "346"],
    endDate: "2025-12-31T23:59:59Z",
    startDate: "2024-03-01T00:00:00Z",
    gameStartTime: null,
    active: true,
    closed: false,
    archived: false,
    outcomes: ["Yes", "No"],
    prices: ["0.65", "0.35"],
    traderCount: 8900,
    url: "https://polymarket.com/market/crypto-etf-2025",
    createdAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "4",
    question: "Will Solana flip Ethereum by market cap in 2025?",
    description: "SOL vs ETH market cap prediction",
    slug: "sol-flip-eth-2025",
    image: "https://cryptologos.cc/logos/solana-sol-logo.svg",
    volume: 560000,
    volume24hr: 28000,
    liquidity: 890000,
    clobTokenIds: ["456", "457"],
    endDate: "2025-12-31T23:59:59Z",
    startDate: "2024-08-01T00:00:00Z",
    gameStartTime: null,
    active: true,
    closed: false,
    archived: false,
    outcomes: ["Yes", "No"],
    prices: ["0.18", "0.82"],
    traderCount: 1800,
    url: "https://polymarket.com/market/sol-flip-eth-2025",
    createdAt: "2024-08-01T00:00:00Z",
  },
  {
    id: "5",
    question: "Will Bitcoin ETF daily volume exceed $10B in 2025?",
    description: "Bitcoin ETF volume prediction",
    slug: "btc-etf-volume-2025",
    image: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg",
    volume: 780000,
    volume24hr: 52000,
    liquidity: 1500000,
    clobTokenIds: ["567", "568"],
    endDate: "2025-12-31T23:59:59Z",
    startDate: "2024-10-01T00:00:00Z",
    gameStartTime: null,
    active: true,
    closed: false,
    archived: false,
    outcomes: ["Yes", "No"],
    prices: ["0.42", "0.58"],
    traderCount: 2600,
    url: "https://polymarket.com/market/btc-etf-volume-2025",
    createdAt: "2024-10-01T00:00:00Z",
  },
];

// In-memory cache for markets (60 seconds)
let marketsCache: {
  data: any;
  timestamp: number;
} | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const cursor = searchParams.get("cursor") || "";
    const forceRefresh = searchParams.get("refresh") === "true";

    // Check cache
    const now = Date.now();
    if (
      !forceRefresh &&
      marketsCache &&
      now - marketsCache.timestamp < CACHE_DURATION
    ) {
      return NextResponse.json(marketsCache.data);
    }

    let markets = [];
    let useMockData = false;

    try {
      const response = await fetch(POLYMARKET_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: MARKETS_QUERY,
          variables: {
            cursor,
            limit,
          },
        }),
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (!response.ok) {
        throw new Error(`Polymarket API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        console.error("GraphQL errors:", data.errors);
        useMockData = true;
      } else {
        // Transform the data for our frontend
        markets = data.data?.markets?.edges?.map((edge: any) => {
          const market = edge.node;
          const outcomePrices = market.outcomePrices
            ? JSON.parse(market.outcomePrices)
            : [];

          return {
            id: market.id,
            question: market.question,
            description: market.description,
            slug: market.slug,
            image: market.image,
            volume: parseFloat(market.volume) || 0,
            volume24hr: parseFloat(market.volume24hr) || 0,
            liquidity: parseFloat(market.liquidity) || 0,
            clobTokenIds: market.clobTokenIds,
            endDate: market.endDate,
            startDate: market.startDate,
            gameStartTime: market.gameStartTime,
            active: market.active,
            closed: market.closed,
            archived: market.archived,
            outcomes: market.outcomes || ["Yes", "No"],
            prices: outcomePrices,
            traderCount: market.traderCounts || 0,
            url: `https://polymarket.com/market/${market.slug}`,
            createdAt: market.createdAt,
          };
        }) || [];
      }
    } catch (apiError) {
      console.error("API fetch failed, using mock data:", apiError);
      useMockData = true;
    }

    // Use mock data if API failed
    if (useMockData || markets.length === 0) {
      markets = MOCK_MARKETS;
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
    console.error("Error fetching markets:", error);
    return NextResponse.json(
      { error: "Failed to fetch markets" },
      { status: 500 }
    );
  }
}
