const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "";
const ALCHEMY_POLICY_ID = process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID || "";

export const NATIVE_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export interface SwapToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
}

export const SWAP_TOKENS: Record<number, SwapToken[]> = {
  1: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "ETH", name: "Ethereum", decimals: 18, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg" },
    { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", name: "USD Coin", decimals: 6, logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg" },
    { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT", name: "Tether", decimals: 6, logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg" },
    { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", symbol: "DAI", name: "Dai", decimals: 18, logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg" },
    { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", symbol: "WETH", name: "Wrapped ETH", decimals: 18, logo: "https://assets.coingecko.com/coins/images/2518/small/weth.png" },
    { address: "0x2260FAC5E5542a773Aa44fBCfeDf7B1939E8f17E", symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8, logo: "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg" },
    { address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", symbol: "LINK", name: "Chainlink", decimals: 18, logo: "https://cryptologos.cc/logos/chainlink-link-logo.svg" },
    { address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", symbol: "UNI", name: "Uniswap", decimals: 18, logo: "https://cryptologos.cc/logos/uniswap-uni-logo.svg" },
    { address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", symbol: "AAVE", name: "Aave", decimals: 18, logo: "https://cryptologos.cc/logos/aave-aave-logo.svg" },
    { address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", symbol: "POL", name: "Polygon (POL)", decimals: 18, logo: "https://cryptologos.cc/logos/polygon-matic-logo.svg" },
    { address: "0x4d224452801ACEd8B2F0aaeE87D10b5cCE5B016", symbol: "APE", name: "ApeCoin", decimals: 18, logo: "https://cryptologos.cc/logos/apecoin-ape-logo.svg" },
    { address: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF", symbol: "BAT", name: "Basic Attention Token", decimals: 18, logo: "https://cryptologos.cc/logos/basic-attention-token-bat-logo.svg" },
    { address: "0xE41d2489571d322189246DaFD5B337b6289d8503", symbol: "ZRX", name: "0x Protocol", decimals: 18, logo: "https://cryptologos.cc/logos/0x-zrx-logo.svg" },
    { address: "0xD533a949740bb3306d119CC777fa900bA034cd52", symbol: "CRV", name: "Curve DAO", decimals: 18, logo: "https://cryptologos.cc/logos/curve-dao-token-crv-logo.svg" },
    { address: "0xc00e94Cb662C3520282E6f5717214004A7f26888", symbol: "COMP", name: "Compound", decimals: 18, logo: "https://cryptologos.cc/logos/compound-comp-logo.svg" },
  ],
  137: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "POL", name: "Polygon (POL)", decimals: 18, logo: "https://cryptologos.cc/logos/polygon-matic-logo.svg" },
    { address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", symbol: "USDC", name: "USD Coin", decimals: 6, logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg" },
    { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", symbol: "USDT", name: "Tether", decimals: 6, logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg" },
    { address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", symbol: "WETH", name: "Wrapped ETH", decimals: 18, logo: "https://assets.coingecko.com/coins/images/2518/small/weth.png" },
    { address: "0x53E0bca35eC356BD5ddDFEbdD1Fc0fD03FaBad39", symbol: "LINK", name: "Chainlink", decimals: 18, logo: "https://cryptologos.cc/logos/chainlink-link-logo.svg" },
    { address: "0xB5C064F955D8e7F38FE0460C556a72987494EE17", symbol: "QUICK", name: "QuickSwap", decimals: 18, logo: "https://assets.coingecko.com/coins/images/13970/small/1_pOU6pBMEmiL-ZJVb0CYRjQ.png" },
    { address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8, logo: "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg" },
    { address: "0x932992Af6b3305E3fbfAb811a4c3eA1531361A5a", symbol: "ZAMD", name: "Zam Wallet Token", decimals: 6, logo: "/zamd-logo.png" },
  ],
  42161: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "ETH", name: "Ethereum", decimals: 18, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg" },
    { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", symbol: "USDC", name: "USD Coin", decimals: 6, logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg" },
    { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", symbol: "USDT", name: "Tether", decimals: 6, logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg" },
    { address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", symbol: "WETH", name: "Wrapped ETH", decimals: 18, logo: "https://cryptologos.cc/logos/weth-weth-logo.svg" },
    { address: "0x2f2a2543B76a4166549F7aaB2e75BFE0fB1Ac41", symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8, logo: "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg" },
    { address: "0xf97f4df75117a78c1A5a0DB14d5A7E78cEE910e", symbol: "LINK", name: "Chainlink", decimals: 18, logo: "https://cryptologos.cc/logos/chainlink-link-logo.svg" },
    { address: "0xFa7F8980b5f9a5b02a1a4A1D3b7b3d8c5f4c8a1", symbol: "ARB", name: "Arbitrum", decimals: 18, logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg" },
  ],
  10: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "ETH", name: "Ethereum", decimals: 18, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg" },
    { address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", symbol: "USDC", name: "USD Coin", decimals: 6, logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg" },
    { address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", symbol: "USDT", name: "Tether", decimals: 6, logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg" },
    { address: "0x4200000000000000000000000000000000000006", symbol: "WETH", name: "Wrapped ETH", decimals: 18, logo: "https://cryptologos.cc/logos/weth-weth-logo.svg" },
    { address: "0x68f180fcCe6836688e9084f035309eCe96c2a688", symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8, logo: "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg" },
    { address: "0x350a791Bfc2C21F9Ed5d109dEbDa1a40ba48041a", symbol: "LINK", name: "Chainlink", decimals: 18, logo: "https://cryptologos.cc/logos/chainlink-link-logo.svg" },
    { address: "0x4200000000000000000000000000000000000042", symbol: "OP", name: "Optimism", decimals: 18, logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg" },
  ],
  8453: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "ETH", name: "Ethereum", decimals: 18, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg" },
    { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", symbol: "USDC", name: "USD Coin", decimals: 6, logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg" },
    { address: "0x4200000000000000000000000000000000000006", symbol: "WETH", name: "Wrapped ETH", decimals: 18, logo: "https://cryptologos.cc/logos/weth-weth-logo.svg" },
    { address: "0x4ed4e862860bed51a9570b96d89af5e1b0efefed", symbol: "DEGEN", name: "Degen", decimals: 18, logo: "https://cryptologos.cc/logos/degen-base-degen-logo.svg" },
    { address: "0x0578d8A44fa98aBfDDE8cf27356C8dCfb0B9dBAB", symbol: "USDbC", name: "USD Base Coin", decimals: 6, logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg" },
  ],
  56: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "BNB", name: "BNB", decimals: 18, logo: "https://cryptologos.cc/logos/bnb-bnb-logo.svg" },
    { address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", symbol: "USDC", name: "USD Coin", decimals: 18, logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg" },
    { address: "0x55d398326f99059fF775485246999027B3197955", symbol: "USDT", name: "Tether", decimals: 18, logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg" },
    { address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bd095", symbol: "WBNB", name: "Wrapped BNB", decimals: 18, logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.svg" },
    { address: "0x7130d2A12B9BCbFAe4f2634d864A1BCe1Cf3C37", symbol: "BTCB", name: "Bitcoin BEP2", decimals: 18, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg" },
    { address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", symbol: "WETH", name: "Wrapped ETH", decimals: 18, logo: "https://cryptologos.cc/logos/weth-weth-logo.svg" },
  ],
  42220: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "CELO", name: "Celo", decimals: 18, logo: "https://cryptologos.cc/logos/celo-celo-logo.svg" },
    { address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C", symbol: "USDC", name: "USD Coin", decimals: 6, logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg" },
  ],
};

export const SAME_CHAIN_SWAP_CHAINS = [1, 137, 42161, 10, 8453, 56];
export const CROSS_CHAIN_SWAP_CHAINS = [1, 137, 42161, 10, 8453, 56, 42220];

export interface SwapQuoteResult {
  quote: {
    fromAmount: string;
    minimumToAmount: string;
    expiry: string;
  };
  type: string;
  data: Record<string, unknown>;
  chainId: string;
  details: {
    data: {
      calls: Array<{ to: string; data: string; value?: string }>;
    };
  };
}

export function toHex(value: bigint): string {
  return `0x${value.toString(16)}`;
}

export function fromHex(hex: string): bigint {
  return BigInt(hex);
}

export function formatTokenAmount(hexAmount: string, decimals: number): string {
  const raw = BigInt(hexAmount);
  const divisor = BigInt(10 ** decimals);
  const whole = raw / divisor;
  const frac = raw % divisor;
  const fracStr = frac.toString().padStart(decimals, "0").slice(0, 6).replace(/0+$/, "");
  return fracStr ? `${whole}.${fracStr}` : whole.toString();
}

export async function getSwapQuote(params: {
  from: string;
  chainId: number;
  fromToken: string;
  toToken: string;
  fromAmount: bigint;
  toChainId?: number;
}): Promise<SwapQuoteResult> {
  const body: Record<string, unknown> = {
    from: params.from,
    chainId: toHex(BigInt(params.chainId)),
    fromToken: params.fromToken,
    toToken: params.toToken,
    fromAmount: toHex(params.fromAmount),
  };

  if (params.toChainId && params.toChainId !== params.chainId) {
    body.toChainId = toHex(BigInt(params.toChainId));
  }

  if (ALCHEMY_POLICY_ID) {
    body.capabilities = {
      paymasterService: { policyId: ALCHEMY_POLICY_ID },
    };
  }

  const res = await fetch(`https://api.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "wallet_requestQuote_v0",
      params: [body],
      id: 1,
    }),
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message || "Failed to get swap quote");
  }
  return data.result;
}

export function getTokensForChain(chainId: number): SwapToken[] {
  return SWAP_TOKENS[chainId] || [];
}
