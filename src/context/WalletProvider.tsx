"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAccount, useChain } from "@account-kit/react";
import { getAlchemy, isAlchemySupported, fetchAlchemyNativePrice } from "@/config/alchemy";
import { getChainMeta } from "@/config/chains";
import { formatUnits } from "viem";
import type { NativeBalance, TokenBalance, Transaction } from "@/types";
import { getLocalAccountAddress } from "@/components/auth/PrivateKeyLogin";

interface PriceData {
  price: number;
  change24h: number;
}

const nativePriceCache: Map<number, { data: PriceData; timestamp: number }> = new Map();
const PRICE_CACHE_DURATION = 60 * 1000; // 1 minute

// Fallback to CoinGecko for native token prices
const CHAIN_TO_COINGECKO: Record<number, string> = {
  1: "ethereum",
  137: "matic-network",
  42161: "ethereum",
  10: "ethereum",
  8453: "ethereum",
  56: "binancecoin",
  42220: "celo",
};

async function fetchNativeTokenPrice(chainId: number): Promise<PriceData | null> {
  const cached = nativePriceCache.get(chainId);
  if (cached && Date.now() - cached.timestamp < PRICE_CACHE_DURATION) {
    return cached.data;
  }

  // Try Alchemy first
  try {
    const alchemyPrice = await fetchAlchemyNativePrice(chainId);
    if (alchemyPrice) {
      nativePriceCache.set(chainId, { data: alchemyPrice, timestamp: Date.now() });
      return alchemyPrice;
    }
  } catch (error) {
    console.error("Error fetching Alchemy native price, falling back to CoinGecko:", error);
  }

  // Use Next.js API route to fetch from CoinGecko (avoids CORS)
  try {
    const response = await fetch(`/api/prices/native?chainId=${chainId}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.price !== undefined) {
        const priceData: PriceData = {
          price: data.price,
          change24h: data.change24h || 0,
        };
        nativePriceCache.set(chainId, { data: priceData, timestamp: Date.now() });
        return priceData;
      }
    }
  } catch (error) {
    console.error("Error fetching native token price from API:", error);
  }

  return null;
}

interface DataContextType {
  address: string | undefined;
  nativeBalance: NativeBalance | null;
  tokens: TokenBalance[];
  transactions: Transaction[];
  isLoadingBalance: boolean;
  setTokens: (tokens: TokenBalance[]) => void;
  setTransactions: (txs: Transaction[]) => void;
  refreshBalance: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  address: undefined,
  nativeBalance: null,
  tokens: [],
  transactions: [],
  isLoadingBalance: false,
  setTokens: () => {},
  setTransactions: () => {},
  refreshBalance: async () => {},
});

export function useDataContext() {
  return useContext(DataContext);
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { address: alchemyAddress } = useAccount({ type: "LightAccount" });
  const { chain } = useChain();
  
  // Use state for local address to enable reactive updates
  const [localAddress, setLocalAddress] = useState<string | null>(null);

  // Check for local signer on mount and when needed
  useEffect(() => {
    const getLocalAddress = () => {
      if (typeof window === "undefined") return null;
      // Check window first
      const windowAddress = (window as any).__localAccountAddress;
      if (windowAddress) return windowAddress;
      // Check sessionStorage
      return sessionStorage.getItem("localSignerAddress");
    };
    
    const addr = getLocalAddress();
    if (addr !== localAddress) {
      setLocalAddress(addr);
    }
  }, []);
  
  // Also check periodically for local signer changes (helps with direct page visits)
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
  
  const address = alchemyAddress || localAddress || undefined;
  const [nativeBalance, setNativeBalance] = useState<NativeBalance | null>(null);
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const fetchNativeBalance = useCallback(async () => {
    if (!address || !chain) return;

    setIsLoadingBalance(true);
    try {
      const alchemy = getAlchemy(chain.id);
      if (!alchemy) {
        setNativeBalance(null);
        return;
      }

      const [balance, priceData] = await Promise.all([
        alchemy.core.getBalance(address),
        fetchNativeTokenPrice(chain.id)
      ]);

      const meta = getChainMeta(chain.id);
      const formatted = formatUnits(BigInt(balance.toString()), 18);
      const valueUsd = priceData ? parseFloat(formatted) * priceData.price : null;

      setNativeBalance({
        symbol: chain.nativeCurrency.symbol,
        name: chain.nativeCurrency.name,
        balance: balance.toString(),
        balanceFormatted: formatted,
        logo: meta.logo,
        priceUsd: priceData?.price || null,
        valueUsd,
        change24h: priceData?.change24h || null,
      });
    } catch (error) {
      console.error("Error fetching native balance:", error);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [address, chain]);

  // Trigger balance fetch when address changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (address && chain) {
        fetchNativeBalance();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [address, chain, fetchNativeBalance]);

  useEffect(() => {
    fetchNativeBalance();
  }, [fetchNativeBalance]);

  // Additional effect to ensure balance is fetched when address becomes available
  useEffect(() => {
    // Small delay to ensure everything is initialized
    const timer = setTimeout(() => {
      if (address && chain) {
        fetchNativeBalance();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [address, chain]);

  // Reset data on chain switch
  useEffect(() => {
    setTokens([]);
    setTransactions([]);
  }, [chain?.id]);

  return (
    <DataContext.Provider
      value={{
        address,
        nativeBalance,
        tokens,
        transactions,
        isLoadingBalance,
        setTokens,
        setTransactions,
        refreshBalance: fetchNativeBalance,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
