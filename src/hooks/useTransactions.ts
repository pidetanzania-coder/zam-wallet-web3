"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useChain } from "@account-kit/react";
import { useDataContext } from "@/context/WalletProvider";
import { getAlchemy, isAlchemySupported } from "@/config/alchemy";
import type { Transaction } from "@/types";
import toast from "react-hot-toast";
import { getLocalAccountAddress } from "@/components/auth/PrivateKeyLogin";

export function useTransactions() {
  const { address: alchemyAddress } = useAccount({ type: "LightAccount" });
  const { chain } = useChain();
  const { setTransactions } = useDataContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for local signer address
  const localAddress = getLocalAccountAddress();
  const address = alchemyAddress || localAddress || undefined;

  const fetchTransactions = useCallback(async () => {
    if (!address || !chain) return;

    if (!isAlchemySupported(chain.id)) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const alchemy = getAlchemy(chain.id);
      if (!alchemy) return;

      // Get latest block to calculate timestamps
      const block = await alchemy.core.getBlock("latest");
      const currentBlockNum = Number(block.number);
      const blockTimestamp = Number(block.timestamp) * 1000; // Convert to ms
      
      console.log("Current block:", currentBlockNum, "timestamp:", blockTimestamp);

      const [sent, received] = await Promise.all([
        alchemy.core.getAssetTransfers({
          fromAddress: address,
          category: ["external" as any, "erc20" as any, "erc721" as any],
          maxCount: 50,
          order: "desc" as any,
        }),
        alchemy.core.getAssetTransfers({
          toAddress: address,
          category: ["external" as any, "erc20" as any, "erc721" as any],
          maxCount: 50,
          order: "desc" as any,
        }),
      ]);

      const allTxs: Transaction[] = [
        ...sent.transfers.map((tx) => {
          // Calculate timestamp based on block number
          const txBlock = Number(tx.blockNum);
          const blocksAgo = currentBlockNum - txBlock;
          // ~2 seconds per block on Polygon
          const estimatedTimestamp = Math.floor((blockTimestamp - blocksAgo * 2000) / 1000);
          
          return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value?.toString() || "0",
            asset: tx.asset || "ETH",
            category: tx.category,
            blockNum: tx.blockNum,
            timestamp: estimatedTimestamp.toString(),
            direction: "out" as const,
          };
        }),
        ...received.transfers.map((tx) => {
          // Calculate timestamp based on block number
          const txBlock = Number(tx.blockNum);
          const blocksAgo = currentBlockNum - txBlock;
          // ~2 seconds per block on Polygon
          const estimatedTimestamp = Math.floor((blockTimestamp - blocksAgo * 2000) / 1000);
          
          return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value?.toString() || "0",
            asset: tx.asset || "ETH",
            category: tx.category,
            blockNum: tx.blockNum,
            timestamp: estimatedTimestamp.toString(),
            direction: "in" as const,
          };
        }),
      ];

      allTxs.sort((a, b) => parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16));

      const uniqueTxs = allTxs.filter(
        (tx, index, self) =>
          index === self.findIndex((t) => t.hash === tx.hash && t.direction === tx.direction)
      );

      setTransactions(uniqueTxs.slice(0, 100));
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions");
      toast.error("Failed to load transaction history. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [address, chain, setTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { loading, error, refetch: fetchTransactions };
}
