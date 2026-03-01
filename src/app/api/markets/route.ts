import { NextResponse } from 'next/server';

// Polymarket GraphQL endpoint
const POLYMARKET_API = 'https://clob.polymarket.com/graphql';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    const cursor = searchParams.get('cursor') || '';

    const response = await fetch(POLYMARKET_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: MARKETS_QUERY,
        variables: {
          cursor,
          limit: parseInt(limit),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return NextResponse.json(
        { error: 'Failed to fetch markets', details: data.errors },
        { status: 500 }
      );
    }

    // Transform the data for our frontend
    const markets = data.data?.markets?.edges?.map((edge: any) => {
      const market = edge.node;
      const outcomePrices = market.outcomePrices ? JSON.parse(market.outcomePrices) : [];
      
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
        active: market.active,
        closed: market.closed,
        outcomes: market.outcomes || ['Yes', 'No'],
        prices: outcomePrices,
        traderCount: market.traderCounts || 0,
        url: `https://polymarket.com/market/${market.slug}`,
      };
    }) || [];

    return NextResponse.json({
      markets,
      pageInfo: data.data?.markets?.pageInfo || {
        hasNextPage: false,
        endCursor: null,
      },
    });
  } catch (error) {
    console.error('Error fetching markets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markets' },
      { status: 500 }
    );
  }
}
