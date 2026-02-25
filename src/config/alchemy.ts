import { Alchemy, Network } from "alchemy-sdk";

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "";

const networkMap: Record<number, Network> = {
  1: Network.ETH_MAINNET,
  137: Network.MATIC_MAINNET,
  42161: Network.ARB_MAINNET,
  10: Network.OPT_MAINNET,
  8453: Network.BASE_MAINNET,
  56: Network.BNB_MAINNET,
  42220: Network.CELO_MAINNET,
};

export function getAlchemy(chainId: number): Alchemy | null {
  const network = networkMap[chainId];
  if (!network) return null;

  return new Alchemy({
    apiKey: ALCHEMY_KEY,
    network,
  });
}

export function isAlchemySupported(chainId: number): boolean {
  return chainId in networkMap;
}

// Fetch token prices using Alchemy SDK (no CORS issues)
// Note: The Alchemy SDK has built-in support for price fetching
export async function fetchAlchemyTokenPrices(
  chainId: number,
  tokenAddresses: string[]
): Promise<Map<string, { price: number; change24h: number }>> {
  const prices = new Map<string, { price: number; change24h: number }>();
  
  if (tokenAddresses.length === 0) return prices;

  try {
    const alchemy = getAlchemy(chainId);
    if (!alchemy) return prices;

    // Use Alchemy SDK's token price method
    // This works without CORS issues in the browser
    for (const address of tokenAddresses) {
      try {
        // The SDK has a method to get token metadata which includes price info
        const tokenInfo = await alchemy.core.getTokenMetadata(address);
        // Note: getTokenMetadata doesn't include price, so we need another approach
        
        // For now, we'll try using the SDK's built-in price method if available
        // Or fall back to CoinGecko
      } catch (error) {
        // Continue to next token
      }
    }
    
    // Since Alchemy SDK doesn't have a direct token price method,
    // we'll return empty and let CoinGecko handle it
    console.log("Alchemy SDK doesn't support token prices directly, using CoinGecko");
    
  } catch (error) {
    console.error("Error fetching Alchemy token prices:", error);
  }

  return prices;
}

// Fetch native token price - Alchemy SDK approach
export async function fetchAlchemyNativePrice(chainId: number): Promise<{ price: number; change24h: number } | null> {
  try {
    const alchemy = getAlchemy(chainId);
    if (!alchemy) return null;

    // For native token price, we need to check if Alchemy SDK has a method
    // The SDK doesn't have a direct native price method, so we return null
    // to let CoinGecko handle it
    
    // Try using the SDK's methods
    // Note: Alchemy SDK doesn't expose native token prices directly
    // This will fall through to CoinGecko
    
  } catch (error) {
    console.error("Error fetching Alchemy native price:", error);
  }

  return null;
}
