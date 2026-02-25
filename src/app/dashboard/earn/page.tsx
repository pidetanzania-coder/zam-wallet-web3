"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useChain, useSmartAccountClient, useSendUserOperation, useSignerStatus } from "@account-kit/react";
import { useDataContext } from "@/context/WalletProvider";
import { useStaking } from "@/hooks/useStaking";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { CONTRACTS } from "@/config/contracts";
import { getLocalAccountAddress, getLocalPrivateKey } from "@/components/auth/PrivateKeyLogin";
import { encodeFunctionData, parseUnits } from "viem";
import { polygon } from "viem/chains";
import { getChainMeta } from "@/config/chains";
import { TrendingUp, Lock, Coins, ArrowRight, Info, Zap, Star, Clock, Unlock, CheckCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { StakingPosition } from "@/types";

interface EarnPool {
  id: string;
  name: string;
  token: string;
  logo: string;
  apy: string;
  tvl: string;
  type: "staking" | "liquidity" | "yield";
  network: string;
  description: string;
  minDeposit: string;
  lockPeriod: string;
  risk: "low" | "medium" | "high";
  available: boolean;
}

// ZAMD Staking configuration
const ZAMD_STAKING_CONFIG = {
  apy: 18,
  lockPeriodDays: 14,
  minDeposit: 25,
  token: "ZAMD",
  contractAddress: CONTRACTS.staking.address,
  rewardTokenAddress: CONTRACTS.zamdToken.address,
  network: "polygon",
};

const EARN_POOLS: EarnPool[] = [
  {
    id: "zamd-staking",
    name: "ZAMD Staking",
    token: "ZAMD",
    logo: "/zamd-logo.png",
    apy: "18%",
    tvl: "$1.2M",
    type: "staking",
    network: "Polygon",
    description: "Stake your ZAMD tokens to earn 18% APY with 14-day lock period. Rewards accumulate daily.",
    minDeposit: "25 ZAMD",
    lockPeriod: "14 days",
    risk: "low",
    available: true,
  },
  {
    id: "eth-staking",
    name: "ETH Liquid Staking",
    token: "ETH",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    apy: "4.2%",
    tvl: "$45M",
    type: "staking",
    network: "Ethereum",
    description: "Stake ETH and receive liquid staking tokens while earning rewards.",
    minDeposit: "0.01 ETH",
    lockPeriod: "None",
    risk: "low",
    available: false,
  },
  {
    id: "usdc-yield",
    name: "USDC Yield",
    token: "USDC",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg",
    apy: "8.5%",
    tvl: "$12M",
    type: "yield",
    network: "Polygon",
    description: "Earn yield on your USDC through optimized DeFi strategies.",
    minDeposit: "10 USDC",
    lockPeriod: "None",
    risk: "medium",
    available: false,
  },
  {
    id: "pol-staking",
    name: "POL Staking",
    token: "POL",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
    apy: "6.8%",
    tvl: "$8M",
    type: "staking",
    network: "Polygon",
    description: "Stake POL tokens to secure the Polygon network and earn rewards.",
    minDeposit: "1 POL",
    lockPeriod: "None",
    risk: "low",
    available: false,
  },
];

const RISK_COLORS = {
  low: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
  medium: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
  high: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10",
};

const TYPE_LABELS = {
  staking: "Staking",
  liquidity: "Liquidity",
  yield: "Yield",
};

// Generate random daily earning percentage (between 0.08% - 0.15% for 40.5% APY)
const generateDailyEarning = (): number => {
  return Math.random() * (0.15 - 0.08) + 0.08;
};

export default function EarnPage() {
  const { chain } = useChain();
  const { tokens, nativeBalance, address: contextAddress } = useDataContext();
  const { isConnected } = useSignerStatus();
  
  // Import token balances hook to ensure tokens are fetched when visiting this page directly
  const { loading: tokenLoading, refetch: refetchTokens } = useTokenBalances();
  const { address: accountAddress } = useAccount({ type: "LightAccount" });
  const { client } = useSmartAccountClient({ type: "LightAccount" });
  const { sendUserOperationAsync, isSendingUserOperation } = useSendUserOperation({ client });
  
  // Check for local signer - use state to ensure it only runs on client
  const [localSignerState, setLocalSignerState] = useState<{
    address: string | null;
    privateKey: string | null;
    isLocal: boolean;
  }>({ address: null, privateKey: null, isLocal: false });

  useEffect(() => {
    // Only run on client after hydration
    const addr = getLocalAccountAddress();
    const privateKey = getLocalPrivateKey();
    
    // Check sessionStorage for credential type
    if (typeof window !== "undefined") {
      const signerType = sessionStorage.getItem("localSignerType");
      const hasCredential = sessionStorage.getItem("localSignerCredential");
      // Local signer is true if we have a credential AND it's either privateKey or mnemonic type
      const isLocal = !!hasCredential && (signerType === "privateKey" || signerType === "mnemonic");
      
      setLocalSignerState({
        address: addr,
        privateKey,
        isLocal,
      });
      console.log("Earn page - Local signer state initialized:", { address: addr, hasPrivateKey: !!privateKey, isLocal });
    } else {
      setLocalSignerState({
        address: addr,
        privateKey,
        isLocal: false,
      });
    }
  }, []);

  const { address: localAddress, privateKey: localPrivateKey, isLocal: isLocalSigner } = localSignerState;
  
  // Use account address from useAccount if available, fallback to context address or local signer
  const userAddress = accountAddress || contextAddress || localAddress || undefined;
  console.log("Earn page - addresses:", { contextAddress, accountAddress, userAddress, localAddress, isLocalSigner });
  
  // Use the staking hook to fetch positions from contract
  const { positions: stakingPositions, refetch: refetchStaking, isLoading: isStakingLoading } = useStaking(userAddress);
  const [selectedType, setSelectedType] = useState<"all" | "staking" | "liquidity" | "yield">("all");
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);

  const filteredPools = EARN_POOLS.filter(
    (pool) => selectedType === "all" || pool.type === selectedType
  );

  // Calculate total portfolio value
  const totalValue =
    (nativeBalance?.valueUsd || 0) +
    tokens.reduce((sum, t) => sum + (t.valueUsd || 0), 0);

  // Get ZAMD balance
  const zamdToken = tokens.find(t => t.symbol === "ZAMD");
  const zamdBalance = zamdToken ? parseFloat(zamdToken.balanceFormatted) : 0;

  // Calculate total staked amount
  const totalStaked = stakingPositions.reduce((sum, pos) => sum + pos.amount, 0);

  // Calculate total earned
  const totalEarned = stakingPositions.reduce((sum, pos) => sum + pos.earned, 0);

  // Calculate daily earnings
  const dailyEarnings = totalStaked * (ZAMD_STAKING_CONFIG.apy / 100 / 365);

  // Note: Positions are now fetched from contract via useStaking hook
  // No need to simulate earnings - they're calculated from contract data

  // Handle stake submission
  const handleStake = useCallback(async () => {
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount < ZAMD_STAKING_CONFIG.minDeposit) {
      toast.error(`Minimum stake is ${ZAMD_STAKING_CONFIG.minDeposit} ZAMD`);
      return;
    }

    if (amount > zamdBalance) {
      toast.error("Insufficient ZAMD balance");
      return;
    }

    // Debug: Log account info
    // Debug logging
    console.log("Account check:", { isConnected, client: !!client, chainId: chain?.id });
    
    // Check if user is signed in (either Alchemy signer or local signer)
    const isLoggedIn = isConnected || isLocalSigner;
    if (!isLoggedIn) {
      toast.error("Please sign in first");
      setIsStaking(false);
      return;
    }

    if (!userAddress) {
      toast.error("Wallet not connected");
      setIsStaking(false);
      return;
    }

    // For local signers, use regular wallet client
    // Check for both private key and mnemonic
    const signerType = typeof window !== "undefined" ? sessionStorage.getItem("localSignerType") : null;
    const credential = typeof window !== "undefined" ? sessionStorage.getItem("localSignerCredential") : null;
    const hasLocalCredential = (signerType === "privateKey" && localPrivateKey) || (signerType === "mnemonic" && credential);
    
    if (hasLocalCredential) {
      try {
        setIsStaking(true);
        // Import needed for local signer
        const { privateKeyToAccount, mnemonicToAccount } = await import("viem/accounts");
        const { createWalletClient, http, createPublicClient } = await import("viem");
        
        // Get proper viem chain from chain ID (use Polygon as default for staking)
        const viemChain = chain?.id ? getChainMeta(chain.id).chain : polygon;
        
        // Get Alchemy RPC URL for the current chain - use new g.alchemy.com format
        const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "";
        let networkName = 'eth';
        if (chain?.id === 137) networkName = 'polygon';
        else if (chain?.id === 42161) networkName = 'arb';
        else if (chain?.id === 10) networkName = 'opt';
        else if (chain?.id === 8453) networkName = 'base';
        const rpcUrl = `https://${networkName}-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
        
        // Create account - handle both private key and mnemonic
        let account;
        if (signerType === "mnemonic" && credential) {
          account = mnemonicToAccount(credential);
        } else if (localPrivateKey) {
          account = privateKeyToAccount(localPrivateKey as `0x${string}`);
        } else {
          throw new Error("No valid credential found");
        }
        
        const walletClient = createWalletClient({
          account,
          chain: viemChain,
          transport: http(rpcUrl),
        }) as any;
        
        // Create public client for waiting for receipts
        const publicClient = createPublicClient({
          chain: viemChain,
          transport: http(rpcUrl),
        });

        const amountWei = parseUnits(stakeAmount, 6); // ZAMD has 6 decimals

        // First approve the staking contract to spend ZAMD
        const approveTx = await walletClient.writeContract({
          address: CONTRACTS.zamdToken.address as `0x${string}`,
          abi: [
            {
              name: "approve",
              type: "function",
              stateMutability: "nonpayable",
              inputs: [
                { name: "spender", type: "address" },
                { name: "amount", type: "uint256" },
              ],
              outputs: [{ name: "", type: "bool" }],
            },
          ],
          functionName: "approve",
          args: [CONTRACTS.staking.address as `0x${string}`, amountWei],
        });

        await publicClient.waitForTransactionReceipt({ hash: approveTx });

        // Then stake
        const stakeTx = await walletClient.writeContract({
          address: CONTRACTS.staking.address as `0x${string}`,
          abi: [
            {
              name: "stake",
              type: "function",
              stateMutability: "nonpayable",
              inputs: [{ name: "amount", type: "uint256" }],
              outputs: [],
            },
          ],
          functionName: "stake",
          args: [amountWei],
        });

        await publicClient.waitForTransactionReceipt({ hash: stakeTx });

        toast.success("Staking successful!");
        setStakeAmount("");
        setShowStakeModal(false);
        refetchStaking();
        return;
      } catch (err: any) {
        console.error("Staking error:", err);
        toast.error(err.message || "Staking failed");
        setIsStaking(false);
        return;
      }
    }

    // Original smart account logic
    if (!client) {
      toast.error("Smart account not available. Please try refreshing.");
      setIsStaking(false);
      return;
    }

    // Check if on correct network
    if (chain?.id !== 137) {
      toast.error("Please switch to Polygon network");
      setIsStaking(false);
      return;
    }

    setIsStaking(true);

    // Configuration for polling
    const maxAttempts = 60; // Increased from 30 to 60
    const pollInterval = 1000; // 1 second

    try {
      // Parse amount to Wei (6 decimals for ZAMD)
      const amountInWei = parseUnits(stakeAmount, 6);

      // First, we need to approve the staking contract to spend ZAMD
      // Encode approve function call
      const approveData = encodeFunctionData({
        abi: [
          {
            name: "approve",
            type: "function",
            inputs: [
              { name: "spender", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "nonpayable",
          },
        ],
        functionName: "approve",
        args: [ZAMD_STAKING_CONFIG.contractAddress, amountInWei],
      });

      // Send approval transaction first
      toast.loading("Step 1/2: Approving ZAMD tokens...", { id: "stake" });

      let approvalResult = null;
      let approvalAttempts = 0;
      const maxApprovalAttempts = 3;

      while (approvalAttempts < maxApprovalAttempts) {
        try {
          approvalResult = await sendUserOperationAsync({
            uo: {
              target: ZAMD_STAKING_CONFIG.rewardTokenAddress as `0x${string}`,
              data: approveData,
            },
          });
          console.log("Approval UserOp hash:", approvalResult.hash);
          toast.success("Approval submitted! Waiting for confirmation...", { id: "stake" });
          break; // Success, exit retry loop
        } catch (approveError: any) {
          approvalAttempts++;
          console.error(`Approval attempt ${approvalAttempts} failed:`, approveError);
          
          // Check if it's a nonce error (AA25)
          if (approveError.message?.includes("AA25") || approveError.message?.includes("invalid account nonce")) {
            if (approvalAttempts < maxApprovalAttempts) {
              toast.loading(`Nonce error. Retrying approval... (attempt ${approvalAttempts}/${maxApprovalAttempts})`, { id: "stake" });
              await new Promise(resolve => setTimeout(resolve, 3000));
              continue;
            }
          }
          
          // If it's not a nonce error or we've exhausted retries, throw the error
          console.error("Approval error:", approveError);
          toast.error(`Approval failed: ${approveError?.message || "Unknown error"}`, { id: "stake" });
          setIsStaking(false);
          return;
        }
      }

      if (!approvalResult) {
        toast.error("Failed to submit approval transaction", { id: "stake" });
        setIsStaking(false);
        return;
      }

      // Wait for the approval transaction to be confirmed before sending stake
      // This prevents nonce errors (AA25) that occur when UOs are sent too quickly
      toast.loading("Waiting for approval to confirm... (this may take up to 30 seconds)", { id: "stake" });
      
      // Poll for the transaction receipt - wait up to 60 seconds for smart account
      let approvalConfirmed = false;
      const maxAttempts = 60;
      const pollInterval = 1000; // 1 second
      
      console.log("Polling for approval confirmation with hash:", approvalResult?.hash);
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
        try {
          if (approvalResult?.hash) {
            // Check if transaction is confirmed by trying to get receipt
            // If it fails, the tx is still pending
            const receipt = await client.getUserOperationReceipt(approvalResult.hash);
            if (receipt) {
              approvalConfirmed = true;
              console.log("Approval confirmed! Receipt:", receipt);
              break;
            }
          }
          // Also check if approval succeeded by checking allowance
          console.log(`Waiting for approval confirmation... attempt ${attempt + 1}/${maxAttempts}`);
        } catch (e) {
          // Receipt not available yet, continue polling
          console.log(`Waiting for approval confirmation... attempt ${attempt + 1}/${maxAttempts}`);
        }
      }

      if (!approvalConfirmed) {
        // Don't proceed with stake if approval isn't confirmed - this causes the tokens not to transfer
        toast.error("Approval not confirmed. Please try staking again.", { id: "stake" });
        setIsStaking(false);
        return;
      }

      // Additional safety check: verify the actual allowance
      // For now, just confirm approval was submitted successfully
      toast.success("Approval confirmed - proceeding with stake", { id: "stake" });

      // Encode stake function call
      const stakeData = encodeFunctionData({
        abi: [
          {
            name: "stake",
            type: "function",
            inputs: [{ name: "_amount", type: "uint256" }],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        functionName: "stake",
        args: [amountInWei],
      });

      // Send stake transaction
      toast.loading("Staking ZAMD tokens...", { id: "stake" });

      let stakeResult = null;
      let stakeAttempts = 0;
      const maxStakeAttempts = 3;

      while (stakeAttempts < maxStakeAttempts) {
        try {
          stakeResult = await sendUserOperationAsync({
            uo: {
              target: ZAMD_STAKING_CONFIG.contractAddress as `0x${string}`,
              data: stakeData,
            },
          });
          console.log("Stake UserOp hash:", stakeResult.hash);
          break; // Success, exit retry loop
        } catch (stakeError: any) {
          stakeAttempts++;
          console.error(`Stake attempt ${stakeAttempts} failed:`, stakeError);
          
          // Check if it's a nonce error (AA25)
          if (stakeError.message?.includes("AA25") || stakeError.message?.includes("invalid account nonce")) {
            if (stakeAttempts < maxStakeAttempts) {
              toast.loading(`Nonce error. Retrying... (attempt ${stakeAttempts}/${maxStakeAttempts})`, { id: "stake" });
              // Wait a bit before retrying
              await new Promise(resolve => setTimeout(resolve, 3000));
              continue;
            }
          }
          
          // If it's not a nonce error or we've exhausted retries, throw the error
          throw stakeError;
        }
      }

      // Wait for stake transaction confirmation
      // toast.loading("Waiting for stake confirmation...", { id: "stake" });
      
      // let stakeConfirmed = false;
      // for (let attempt = 0; attempt < maxAttempts; attempt++) {
      //   await new Promise(resolve => setTimeout(resolve, pollInterval));
      //   
      //   try {
      //     if (stakeResult?.hash) {
      //       const receipt = await client.getUserOperationReceipt(stakeResult.hash);
      //       if (receipt) {
      //         stakeConfirmed = true;
      //         console.log("Stake confirmed! Receipt:", receipt);
      //         break;
      //       }
      //     }
      //   } catch (e) {
      //     console.log(`Waiting for stake confirmation... attempt ${attempt + 1}/${maxAttempts}`);
      //   }
      // }

      // if (!stakeConfirmed) {
      //   toast.success("Stake submitted! It may take a moment to confirm.", { id: "stake" });
      // } else {
      //   toast.success("ZAMD staked successfully!", { id: "stake" });
      // }

      // Wait for stake transaction to be confirmed
      toast.loading("Waiting for stake to confirm...", { id: "stake" });
      
      let stakeConfirmed = false;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
        try {
          if (stakeResult?.hash) {
            const receipt = await client.getUserOperationReceipt(stakeResult.hash);
            if (receipt) {
              stakeConfirmed = true;
              console.log("Stake confirmed! Receipt:", receipt);
              break;
            }
          }
        } catch (e) {
          console.log(`Waiting for stake confirmation... attempt ${attempt + 1}/${maxAttempts}`);
        }
      }

      if (!stakeConfirmed) {
        console.warn("Stake confirmation timeout");
        toast.success(`Staking transaction submitted! It will be confirmed shortly.`, { id: "stake" });
      } else {
        toast.success(`Successfully staked ${amount} ZAMD!`, { id: "stake" });
      }
      
      // Refetch staking positions from contract instead of adding to local state
      await refetchStaking();
      
      setShowStakeModal(false);
      setStakeAmount("");
    } catch (error: any) {
      console.error("Staking error full:", error);
      const errorMsg = error?.message || error?.cause?.message || "Failed to stake";
      toast.error(errorMsg, { id: "stake" });
    } finally {
      setIsStaking(false);
    }
  }, [stakeAmount, zamdBalance, client, sendUserOperationAsync, userAddress, isConnected, refetchStaking]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Earn</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Put your crypto to work and earn passive income
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Your Portfolio</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            ${totalValue.toFixed(2)}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Active Positions</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{stakingPositions.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Total Earned</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${totalEarned.toFixed(4)}</p>
        </div>
      </div>

      {/* Your Staking Positions */}
      {stakingPositions.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Your Staking Positions</h2>
          <div className="space-y-3">
            {stakingPositions.map((position) => (
              <div key={position.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[var(--surface-elevated)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center overflow-hidden">
                    {position.token === "ZAMD" ? (
                      <img src="/zamd-logo.png" alt="ZAMD" className="w-8 h-8 object-contain" />
                    ) : (
                      <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{position.amount} {position.token}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Locked for {position.lockPeriod} days • {position.apy}% APY
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-emerald-600 dark:text-emerald-400">+{position.earned.toFixed(4)} {position.token}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Earned</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ZAMD Highlight */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-24 translate-x-24" />
        <div className="relative flex items-center gap-4">
          <img src="/zamd-logo.png" alt="ZAMD" className="w-14 h-14 rounded-2xl" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold">ZAMD Staking</h3>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-white/20">FEATURED</span>
            </div>
            <p className="text-white/80 text-sm">
              Stake ZAMD tokens on Polygon to earn 18% APY with daily rewards
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black">18%</p>
            <p className="text-white/70 text-sm">APY</p>
          </div>
        </div>
        <div className="relative mt-4 flex items-center gap-3">
          <Link
            href="/dashboard/swap"
            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 font-semibold rounded-xl text-sm hover:bg-white/90 transition-colors"
          >
            Get ZAMD
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setShowStakeModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Stake Now
          </button>
        </div>
        {/* Daily earnings indicator */}
        {totalStaked > 0 && (
          <div className="relative mt-4 flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Daily earnings: ~${dailyEarnings.toFixed(4)}</span>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {(["all", "staking", "liquidity", "yield"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
              selectedType === type
                ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30"
                : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
          >
            {type === "all" ? "All" : TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Pools */}
      <div className="space-y-4">
        {filteredPools.map((pool) => (
          <div
            key={pool.id}
            className={`card transition-all ${pool.available ? "hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-md" : "opacity-75"}`}
          >
            <div className="flex items-start gap-4">
              {/* Token Logo */}
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[var(--surface-elevated)] flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={pool.logo}
                  alt={pool.token}
                  className="w-10 h-10 rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{pool.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RISK_COLORS[pool.risk]}`}>
                    {pool.risk} risk
                  </span>
                  {pool.id === "zamd-staking" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      14 Days
                    </span>
                  )}
                  {!pool.available && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{pool.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400 dark:text-slate-500">
                  <span>Network: <span className="text-slate-600 dark:text-slate-300">{pool.network}</span></span>
                  <span>Min: <span className="text-slate-600 dark:text-slate-300">{pool.minDeposit}</span></span>
                  <span>Lock: <span className="text-slate-600 dark:text-slate-300">{pool.lockPeriod}</span></span>
                  <span>TVL: <span className="text-slate-600 dark:text-slate-300">{pool.tvl}</span></span>
                </div>
              </div>

              {/* APY & Action */}
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{pool.apy}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">APY</p>
                {pool.available ? (
                  <button 
                    onClick={() => setShowStakeModal(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    Stake
                  </button>
                ) : (
                  <button disabled className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-400 text-sm font-semibold rounded-xl cursor-not-allowed">
                    Soon
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stake Modal */}
      {showStakeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[var(--surface-card)] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Stake ZAMD</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Amount to stake
                </label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="input-field"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Available: {zamdBalance.toFixed(2)} ZAMD
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[var(--surface-elevated)] space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">APY</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">18%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Lock Period</span>
                  <span className="font-medium text-slate-900 dark:text-white">14 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Min. Stake</span>
                  <span className="font-medium text-slate-900 dark:text-white">100 ZAMD</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowStakeModal(false)}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStake}
                disabled={isStaking || isSendingUserOperation || !stakeAmount}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isStaking || isSendingUserOperation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Staking...
                  </>
                ) : (
                  "Stake Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[var(--surface-elevated)] border border-slate-200 dark:border-[var(--surface-border)]">
        <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          ZAMD Staking features 40.5% APY with 14-day lock period. Daily rewards are distributed automatically. 
          Early withdrawal is not available during the lock period. APY is variable and may change. 
          Gas fees for staking transactions are sponsored by Zam Wallet.
        </p>
      </div>
    </div>
  );
}
