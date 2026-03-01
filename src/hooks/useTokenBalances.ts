"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useChain } from "@account-kit/react";
import { useDataContext } from "@/context/WalletProvider";
import { getAlchemy, isAlchemySupported, fetchAlchemyTokenPrices } from "@/config/alchemy";
import type { TokenBalance } from "@/types";
import { formatUnits } from "viem";
import toast from "react-hot-toast";
import { getLocalAccountAddress } from "@/components/auth/PrivateKeyLogin";

const priceCache: Map<string, { price: number; change24h: number; timestamp: number }> = new Map();
const CACHE_DURATION = 60 * 1000; // 1 minute cache

export function useTokenBalances() {
  const { address: alchemyAddress } = useAccount({ type: "LightAccount" });
  const { chain } = useChain();
  const { setTokens } = useDataContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use state for local address to enable reactive updates
  const [localAddress, setLocalAddress] = useState<string | null>(null);

  // Check for local signer on mount
  useEffect(() => {
    const addr = getLocalAccountAddress();
    if (addr !== localAddress) {
      setLocalAddress(addr);
    }
  }, []);

  // Also check periodically for local signer changes
  useEffect(() => {
    const interval = setInterval(() => {
      const windowAddress = (window as any).__localAccountAddress;
      const sessionAddress = sessionStorage.getItem("localSignerAddress");
      const addr = windowAddress || sessionAddress;
      if (addr !== localAddress) {
        setLocalAddress(addr);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [localAddress]);

  // Use either alchemy address or local address
  const address = alchemyAddress || localAddress || undefined;

  const fetchTokenBalances = useCallback(async () => {
    if (!address || !chain) return;

    if (!isAlchemySupported(chain.id)) {
      setTokens([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const alchemy = getAlchemy(chain.id);
      if (!alchemy) return;

      const balances = await alchemy.core.getTokenBalances(address);

      const nonZeroBalances = balances.tokenBalances.filter(
        (token) =>
          token.tokenBalance &&
          token.tokenBalance !==
            "0x0000000000000000000000000000000000000000000000000000000000000000" &&
          BigInt(token.tokenBalance) > 0n
      );

      const tokenDataPromises = nonZeroBalances.slice(0, 50).map(async (token) => {
        try {
          const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
          const balance = token.tokenBalance || "0";
          const decimals = metadata.decimals || 18;
          const formatted = formatUnits(BigInt(balance), decimals);

          return {
            contractAddress: token.contractAddress,
            symbol: metadata.symbol || "???",
            name: metadata.name || "Unknown Token",
            decimals,
            balance,
            balanceFormatted: formatted,
            logo: metadata.logo || null,
            priceUsd: null,
            valueUsd: null,
            change24h: null,
          } as TokenBalance;
        } catch {
          return null;
        }
      });

      const tokenData = (await Promise.all(tokenDataPromises)).filter(
        (t): t is TokenBalance => t !== null
      );

      // Auto-add ZAMD token on Polygon (chain ID 137) if not already in list
      const ZAMD_CONTRACT = "0x0A46e040e135b967F501Bb46ad27375c8c979268";
      const ZAMD_DECIMALS = 6;
      const ZAMD_PRICE_USD = 1.0; // ZAMD is pegged at $1 (not yet on market)
      if (chain.id === 137) {
        const hasZamd = tokenData.some(
          (t) => t.contractAddress.toLowerCase() === ZAMD_CONTRACT.toLowerCase()
        );
        if (!hasZamd) {
          try {
            const zamdBalance = await alchemy.core.getTokenBalances(address, [ZAMD_CONTRACT]);
            const zamdTokenBalance = zamdBalance.tokenBalances[0];
            const zamdRawBalance = zamdTokenBalance?.tokenBalance || "0x0";
            const zamdFormatted = formatUnits(BigInt(zamdRawBalance), ZAMD_DECIMALS);
            const zamdValueUsd = parseFloat(zamdFormatted) * ZAMD_PRICE_USD;
            tokenData.push({
              contractAddress: ZAMD_CONTRACT,
              symbol: "ZAMD",
              name: "Zam Wallet Token",
              decimals: ZAMD_DECIMALS,
              balance: zamdRawBalance,
              balanceFormatted: zamdFormatted,
              logo: "/zamd-logo.png",
              priceUsd: ZAMD_PRICE_USD,
              valueUsd: zamdValueUsd,
              change24h: 0,
            });
          } catch (e) {
            console.error("Error fetching ZAMD balance:", e);
          }
        } else {
          // Update existing ZAMD token with price
          const zamdIndex = tokenData.findIndex(
            (t) => t.contractAddress.toLowerCase() === ZAMD_CONTRACT.toLowerCase()
          );
          if (zamdIndex !== -1) {
            const zamdToken = tokenData[zamdIndex];
            tokenData[zamdIndex] = {
              ...zamdToken,
              logo: "/zamd-logo.png",
              priceUsd: ZAMD_PRICE_USD,
              valueUsd: parseFloat(zamdToken.balanceFormatted) * ZAMD_PRICE_USD,
              change24h: 0,
            };
          }
        }
      }

      // Fetch prices using Alchemy's token price API
      const tokensToPrice = tokenData.map((t) => t.contractAddress.toLowerCase());
      
      // Check cache first
      const cachedPrices = new Map<string, { price: number; change24h: number }>();
      const tokensToFetch: string[] = [];
      
      for (const tokenAddress of tokensToPrice) {
        const cached = priceCache.get(tokenAddress);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          cachedPrices.set(tokenAddress, { price: cached.price, change24h: cached.change24h });
        } else {
          tokensToFetch.push(tokenAddress);
        }
      }
      
      // Fetch from Alchemy if there are tokens not in cache
      if (tokensToFetch.length > 0) {
        try {
          const alchemyPrices = await fetchAlchemyTokenPrices(chain.id, tokensToFetch);
          
          // Update cache and combine with cached prices
          for (const [address, priceData] of alchemyPrices) {
            cachedPrices.set(address, priceData);
            priceCache.set(address, { ...priceData, timestamp: Date.now() });
          }
          
          // If Alchemy returned no prices, try CoinGecko fallback
          if (alchemyPrices.size === 0) {
            console.log("No prices from Alchemy, trying CoinGecko fallback");
            await fetchCoinGeckoPrices(tokenData, cachedPrices);
          }
        } catch (e) {
          console.error("Error fetching Alchemy token prices:", e);
          // Fall back to CoinGecko if Alchemy fails
          await fetchCoinGeckoPrices(tokenData, cachedPrices);
        }
      } else {
        // No tokens to fetch from Alchemy, check CoinGecko for any missing prices
        await fetchCoinGeckoPrices(tokenData, cachedPrices);
      }

      // Apply prices to tokens
      const tokensWithPrices = tokenData.map((token) => {
        const priceInfo = cachedPrices.get(token.contractAddress.toLowerCase());
        if (priceInfo) {
          const valueUsd = parseFloat(token.balanceFormatted) * priceInfo.price;
          return {
            ...token,
            priceUsd: priceInfo.price,
            valueUsd,
            change24h: priceInfo.change24h,
          };
        }
        return token;
      });

      // Final pass: ensure ZAMD always has correct logo and price
      const finalTokens = tokensWithPrices.map((token) => {
        if (token.contractAddress.toLowerCase() === ZAMD_CONTRACT.toLowerCase()) {
          return {
            ...token,
            logo: "/zamd-logo.png",
            priceUsd: token.priceUsd || ZAMD_PRICE_USD,
            valueUsd: token.valueUsd || parseFloat(token.balanceFormatted) * ZAMD_PRICE_USD,
          };
        }
        return token;
      });

      finalTokens.sort((a, b) => (b.valueUsd || 0) - (a.valueUsd || 0));
      setTokens(finalTokens);
    } catch (err) {
      console.error("Error fetching token balances:", err);
      setError("Failed to load tokens");
      toast.error("Failed to load token balances. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [address, chain, setTokens]);

  useEffect(() => {
    fetchTokenBalances();
  }, [fetchTokenBalances]);

  // Additional effect to ensure balance is fetched when address becomes available
  useEffect(() => {
    // Delay to ensure everything is initialized
    const timer = setTimeout(() => {
      if (address && chain) {
        fetchTokenBalances();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [address, chain, alchemyAddress, fetchTokenBalances]);

  return { loading, error, refetch: fetchTokenBalances };
}

// Fallback to CoinGecko if Alchemy fails
async function fetchCoinGeckoPrices(
  tokenData: TokenBalance[],
  cachedPrices: Map<string, { price: number; change24h: number }>
): Promise<void> {
  // Get unique token addresses
  const addresses = [...new Set(tokenData.map(t => t.contractAddress.toLowerCase()))];
  
  if (addresses.length === 0) return;

  // Use Next.js API route to fetch from CoinGecko (avoids CORS)
  try {
    const response = await fetch(`/api/prices/tokens?addresses=${addresses.join(",")}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.prices) {
        Object.entries(data.prices).forEach(([address, priceInfo]) => {
          cachedPrices.set(address, priceInfo as { price: number; change24h: number });
          priceCache.set(address, { ...(priceInfo as { price: number; change24h: number }), timestamp: Date.now() });
        });
      }
    }
  } catch (error) {
    console.error("Error fetching token prices from API:", error);
  }
}
