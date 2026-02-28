"use client";

import { useState, useEffect, useCallback } from "react";
import { useChain } from "@account-kit/react";
import { CONTRACTS } from "@/config/contracts";
import { getAlchemy } from "@/config/alchemy";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";

interface StakingInfo {
  stakedAmount: bigint;
  lastClaimTime: bigint;
  totalEarned: bigint;
  lockEndTime: bigint;
}

interface StakingPosition {
  id: string;
  token: string;
  amount: number;
  startDate: Date;
  lockPeriod: number;
  apy: number;
  earned: number;
  canWithdraw: boolean;
}

// ABI for staking contract functions
const stakingAbi = [
  {
    name: "stakes",
    type: "function",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [
      { name: "stakedAmount", type: "uint256" },
      { name: "lastClaimTime", type: "uint256" },
      { name: "totalEarned", type: "uint256" },
      { name: "lockEndTime", type: "uint256" },
    ],
    stateMutability: "view",
  },
] as const;

const stakingStatsAbi = [
  {
    name: "totalStaked",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

const rewardPoolAbi = [
  {
    name: "rewardPoolBalance",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export function useStaking(userAddress?: string) {
  const { chain } = useChain();
  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalStaked, setTotalStaked] = useState<number>(0);
  const [rewardPool, setRewardPool] = useState<number>(0);

  const fetchStakingInfo = useCallback(async () => {
    console.log("useStaking: Fetching for address:", userAddress, "chain:", chain?.id);
    
    if (!userAddress) {
      console.log("useStaking: No user address, returning");
      return;
    }

    if (!chain) {
      console.log("useStaking: No chain, returning");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const alchemy = getAlchemy(chain.id);
      if (!alchemy) {
        throw new Error("Alchemy not available");
      }

      // Get RPC URL - always use Polygon mainnet since staking contract is on Polygon
      const rpcUrl = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
      
      // Create public client - always use Polygon chain
      const publicClient = createPublicClient({
        chain: polygon,
        transport: http(rpcUrl),
      });

      // Ensure we're on Polygon network
      if (chain?.id !== 137) {
        console.warn("Not on Polygon network, staking data may not be accurate");
      }

      // Read stake info from contract
      console.log("useStaking: Reading stakes from contract for:", userAddress);
      const stakingInfo = await publicClient.readContract({
        address: CONTRACTS.staking.address as `0x${string}`,
        abi: stakingAbi,
        functionName: "stakes",
        args: [userAddress as `0x${string}`],
      });
      
      console.log("useStaking: Raw staking info:", stakingInfo);

      // Get total staked
      const totalStakedResult = await publicClient.readContract({
        address: CONTRACTS.staking.address as `0x${string}`,
        abi: stakingStatsAbi,
        functionName: "totalStaked",
        args: [],
      });

      // Get reward pool
      const rewardPoolResult = await publicClient.readContract({
        address: CONTRACTS.staking.address as `0x${string}`,
        abi: rewardPoolAbi,
        functionName: "rewardPoolBalance",
        args: [],
      });

      // Parse results - contract returns array, not object
      console.log("useStaking: Raw staking info:", stakingInfo);
      
      // The contract returns: [stakedAmount, lastClaimTime, totalEarned, lockEndTime]
      const stakedAmount = stakingInfo[0];
      const lastClaimTime = stakingInfo[1];
      const totalEarned = stakingInfo[2];
      const lockEndTime = stakingInfo[3];
      
      console.log("useStaking: Parsed values:", { stakedAmount, lastClaimTime, totalEarned, lockEndTime });
      
      const now = BigInt(Math.floor(Date.now() / 1000));
      const canWithdraw = stakedAmount > 0n && lockEndTime <= now;

      // Calculate pending rewards (simplified) - ensure all are BigInt
      // APY = 18%, so daily rate = 18% / 365 = 0.00049315... per day
      const timeStaked = now - lastClaimTime;
      const apy = 18n; // 18%
      const secondsPerYear = 365n * 24n * 60n * 60n;
      
      // Calculate pending rewards: stakedAmount * (apy/100) * (timeStaked/secondsPerYear)
      // Using 100 instead of 10000 since apy is already 18, not 1800
      const pendingRewardsRaw =
        (stakedAmount * apy * timeStaked) /
        (100n * secondsPerYear);

      // Convert to human readable (6 decimals for ZAMD)
      const pendingRewards = Number(pendingRewardsRaw) / 1e6;
      const totalEarnedNum = Number(totalEarned) / 1e6;
      const earnedNum = totalEarnedNum + pendingRewards;
      
      const stakedAmountNum = Number(stakedAmount) / 1e6;
      const totalStakedNum = Number(totalStakedResult) / 1e6;
      const rewardPoolNum = Number(rewardPoolResult) / 1e6;
      
      console.log("useStaking: Calculated values:", { stakedAmountNum, earnedNum, canWithdraw });

      // Create position object
      if (stakedAmountNum > 0) {
        const newPosition: StakingPosition = {
          id: userAddress,
          token: "ZAMD",
          amount: stakedAmountNum,
          startDate: new Date(Number(lastClaimTime) * 1000),
          lockPeriod: 14,
          apy: 18,
          earned: earnedNum,
          canWithdraw,
        };
        console.log("useStaking: Setting positions:", newPosition);
        setPositions([newPosition]);
      } else {
        console.log("useStaking: No staked amount, clearing positions");
        setPositions([]);
      }

      setTotalStaked(totalStakedNum);
      setRewardPool(rewardPoolNum);
    } catch (err: any) {
      console.error("Error fetching staking info:", err);
      setError(err.message || "Failed to fetch staking info");
      setPositions([]);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, chain]);

  useEffect(() => {
    fetchStakingInfo();
  }, [fetchStakingInfo]);

  return {
    positions,
    isLoading,
    error,
    totalStaked,
    rewardPool,
    refetch: fetchStakingInfo,
  };
}
