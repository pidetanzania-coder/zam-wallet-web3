"use client";

import { useState, useEffect } from "react";
import { useDataContext } from "@/context/WalletProvider";
import { useAccount, useChain, useSmartAccountClient, useSendUserOperation, useSignerStatus } from "@account-kit/react";
import { isAddress, parseEther, parseUnits, encodeFunctionData, createWalletClient, http } from "viem";
import { privateKeyToAccount, mnemonicToAccount } from "viem/accounts";
import { polygon } from "viem/chains";
import { Spinner } from "@/components/ui/Spinner";
import { getChainMeta } from "@/config/chains";
import { getLocalAccountAddress, getLocalSigner, getLocalPrivateKey } from "@/components/auth/PrivateKeyLogin";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import {
  ArrowUpRight,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Coins,
} from "lucide-react";
import toast from "react-hot-toast";

const erc20TransferAbi = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export default function SendPage() {
  const { nativeBalance, tokens, address } = useDataContext();
  const { isConnected } = useSignerStatus();
  const { account } = useAccount({ type: "LightAccount" });
  const { chain } = useChain();
  const { client } = useSmartAccountClient({ type: "LightAccount" });
  const { sendUserOperationAsync, isSendingUserOperation } = useSendUserOperation({ client });
  
  // Import token balances hook to ensure tokens are fetched when visiting this page directly
  const { loading: tokenLoading, refetch: refetchTokens } = useTokenBalances();

  // Check for local signer - use state to ensure it only runs on client
  const [localSignerState, setLocalSignerState] = useState<{
    address: string | null;
    privateKey: string | null;
    isLocal: boolean;
  }>({ address: null, privateKey: null, isLocal: false });

  // Gas fee estimation for local signer
  const [estimatedGas, setEstimatedGas] = useState<bigint | null>(null);
  const [isEstimatingGas, setIsEstimatingGas] = useState(false);
  const [gasFeeFormatted, setGasFeeFormatted] = useState<string>("...");

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
      console.log("Send page - Local signer state initialized:", { address: addr, hasPrivateKey: !!privateKey, isLocal });
    } else {
      setLocalSignerState({
        address: addr,
        privateKey,
        isLocal: false,
      });
    }
  }, []);

  const { address: localAddress, privateKey: localPrivateKey, isLocal: isLocalSigner } = localSignerState;
  const effectiveAddress = address || localAddress;
  const isLoggedIn = isConnected || isLocalSigner;

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("native");
  const [showTokenPicker, setShowTokenPicker] = useState(false);
  const [step, setStep] = useState<"form" | "confirm" | "success" | "error" | "sending">("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState("");

  const explorerUrl = chain?.blockExplorers?.default?.url || "https://etherscan.io";
  const chainMeta = getChainMeta(chain?.id || 1);
  const selectedTokenData =
    selectedToken === "native"
      ? null
      : tokens.find((t) => t.contractAddress === selectedToken);

  const currentBalance = selectedToken === "native"
    ? nativeBalance?.balanceFormatted || "0"
    : selectedTokenData?.balanceFormatted || "0";

  const currentSymbol = selectedToken === "native"
    ? nativeBalance?.symbol || chain?.nativeCurrency?.symbol || "ETH"
    : selectedTokenData?.symbol || "";

  const currentLogo = selectedToken === "native"
    ? chainMeta.logo
    : selectedTokenData?.logo || null;

  const currentPriceUsd = selectedToken === "native"
    ? nativeBalance?.priceUsd || 0
    : selectedTokenData?.priceUsd || 0;

  // Estimate gas fee for local signer
  useEffect(() => {
    const estimateGasFee = async () => {
      if (!isLocalSigner || !localPrivateKey || !to || !amount || !isAddress(to)) {
        setEstimatedGas(null);
        return;
      }

      setIsEstimatingGas(true);
      try {
        const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "";
        let networkName = 'eth';
        if (chain?.id === 137) networkName = 'polygon';
        else if (chain?.id === 42161) networkName = 'arb';
        else if (chain?.id === 10) networkName = 'opt';
        else if (chain?.id === 8453) networkName = 'base';
        const rpcUrl = `https://${networkName}-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;

        const viemChain = chain?.id ? getChainMeta(chain.id).chain : polygon;

        let account;
        const signerType = sessionStorage.getItem("localSignerType");
        const credential = sessionStorage.getItem("localSignerCredential");
        
        if (signerType === "mnemonic" && credential) {
          account = mnemonicToAccount(credential);
        } else {
          account = privateKeyToAccount(localPrivateKey as `0x${string}`);
        }

        const { createPublicClient, estimateGas } = require("viem");
        const publicClient = createPublicClient({
          chain: viemChain,
          transport: http(rpcUrl),
        });

        let gasEstimate: bigint;
        if (selectedToken === "native") {
          gasEstimate = await estimateGas(publicClient, {
            account,
            to: to as `0x${string}`,
            value: parseEther(amount),
          });
        } else {
          gasEstimate = await estimateGas(publicClient, {
            account,
            to: selectedToken as `0x${string}`,
            data: encodeFunctionData({
              abi: erc20TransferAbi,
              functionName: "transfer",
              args: [to as `0x${string}`, parseUnits(amount, selectedTokenData?.decimals || 18)],
            }),
          });
        }

        setEstimatedGas(gasEstimate);
      } catch (error) {
        console.error("Error estimating gas:", error);
        setEstimatedGas(null);
      } finally {
        setIsEstimatingGas(false);
      }
    };

    estimateGasFee();
  }, [to, amount, selectedToken, isLocalSigner, localPrivateKey, chain, selectedTokenData]);

  // Format gas fee for display
  const getGasFeeInNative = () => {
    return gasFeeFormatted;
  };

  // Update formatted gas fee when estimated gas changes
  useEffect(() => {
    const updateFormattedGas = async () => {
      if (!estimatedGas) {
        // Try to estimate gas if not available
        if (isLocalSigner && to && amount && isAddress(to)) {
          // Will be handled by the main estimation effect
          return;
        }
        setGasFeeFormatted("...");
        return;
      }
      try {
        const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "";
        let networkName = 'eth';
        if (chain?.id === 137) networkName = 'polygon';
        else if (chain?.id === 42161) networkName = 'arb';
        else if (chain?.id === 10) networkName = 'opt';
        else if (chain?.id === 8453) networkName = 'base';
        const rpcUrl = `https://${networkName}-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;

        const viemChain = chain?.id ? getChainMeta(chain.id).chain : polygon;
        const { createPublicClient } = require("viem");
        const publicClient = createPublicClient({
          chain: viemChain,
          transport: http(rpcUrl),
        });

        const gasPrice = await publicClient.getGasPrice();
        const feeWei = estimatedGas * gasPrice;
        const feeEth = Number(feeWei) / 1e18;
        setGasFeeFormatted(feeEth.toFixed(4));
      } catch (error) {
        console.error("Error getting gas price:", error);
        // Set a default estimate based on chain
        const defaultGasPrice = chain?.id === 137 ? 50000000000n : 20000000000n; // 50 gwei for polygon, 20 for others
        const defaultFee = estimatedGas * defaultGasPrice;
        const feeEth = Number(defaultFee) / 1e18;
        setGasFeeFormatted(feeEth.toFixed(4));
      }
    };

    updateFormattedGas();
  }, [estimatedGas, chain]);

  const handleReview = () => {
    if (!isAddress(to)) {
      toast.error("Invalid address");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setStep("confirm");
  };

  const handleSend = async () => {
    // Check if user is signed in
    if (!isLoggedIn) {
      setErrorMsg("Please sign in first");
      setStep("error");
      return;
    }

    // Check if using local signer (seed phrase)
    const signerType = typeof window !== "undefined" ? sessionStorage.getItem("localSignerType") : null;
    const credential = typeof window !== "undefined" ? sessionStorage.getItem("localSignerCredential") : null;
    const hasLocalCredential = (signerType === "privateKey" && localPrivateKey) || (signerType === "mnemonic" && credential);
    
    if (hasLocalCredential) {
      try {
        setStep("sending");
        setIsProcessing(true);
        
        // Get proper viem chain from chain ID
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
        });
        
        // Create public client for waiting for receipts
        const { createPublicClient } = require("viem");
        const publicClient = createPublicClient({
          chain: viemChain,
          transport: http(rpcUrl),
        });

        let txHash: string;

        if (selectedToken === "native") {
          // Send native token
          txHash = await walletClient.sendTransaction({
            to: to as `0x${string}`,
            value: parseEther(amount),
          });
        } else {
          // Send ERC20 token
          txHash = await walletClient.writeContract({
            address: selectedToken as `0x${string}`,
            abi: erc20TransferAbi,
            functionName: "transfer",
            args: [to as `0x${string}`, parseUnits(amount, selectedTokenData?.decimals || 18)],
          });
        }
        
        await publicClient.waitForTransactionReceipt({ hash: txHash });
        
        setTxHash(txHash);
        setStep("success");
        toast.success("Transaction sent!");
        setIsProcessing(false);
        return;
      } catch (err: any) {
        console.error("Send error:", err);
        setErrorMsg(err.message || "Transaction failed");
        setStep("error");
        setIsProcessing(false);
        return;
      }
    }

    // Original smart account logic
    // Check if we have a smart account client
    if (!client) {
      setErrorMsg("Smart account not available. Please try refreshing.");
      setStep("error");
      return;
    }

    // Check if using external wallet (MetaMask, etc.) - this will trigger external wallet confirmation
    const smartSignerType = (client.account as any)?.signer?.type || "unknown";
    console.log("Signer type:", smartSignerType);
    
    // If signer is not a LightAccount, warn the user
    if (smartSignerType !== "light-account" && smartSignerType !== "account-abstraction") {
      console.log("Using external wallet - transaction will be confirmed in external wallet");
    }

    try {
      let res;
      if (selectedTokenData) {
        const data = encodeFunctionData({
          abi: erc20TransferAbi,
          functionName: "transfer",
          args: [to as `0x${string}`, parseUnits(amount, selectedTokenData.decimals)],
        });
        res = await sendUserOperationAsync({
          uo: { target: selectedTokenData.contractAddress as `0x${string}`, data, value: 0n },
        });
      } else {
        res = await sendUserOperationAsync({
          uo: { target: to as `0x${string}`, data: "0x", value: parseEther(amount) },
        });
      }
      setTxHash(res?.hash || "");
      setStep("success");
      toast.success("Transaction sent successfully!");
    } catch (err: any) {
      console.error("Send error:", err);
      setErrorMsg(err?.message || "Transaction failed");
      setStep("error");
    }
  };

  const resetForm = () => {
    setTo("");
    setAmount("");
    setSelectedToken("native");
    setStep("form");
    setErrorMsg("");
    setTxHash("");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Send Tokens</h1>

      {step === "form" && (
        <div className="card space-y-5">
          {/* Token Selector */}
          <div>
            <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Select Token</label>
            <div className="relative">
              <button
                onClick={() => setShowTokenPicker(!showTokenPicker)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[var(--surface-elevated)] border border-slate-200 dark:border-[var(--surface-border)] hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {currentLogo ? (
                    <img src={currentLogo} alt={currentSymbol} className="w-8 h-8 rounded-full" />
                  ) : (
                    <Coins className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-slate-900 dark:text-white">{currentSymbol}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Balance: {parseFloat(currentBalance).toFixed(6)}
                  </p>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showTokenPicker ? 'rotate-180' : ''}`} />
              </button>

              {/* Token Dropdown */}
              {showTokenPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[var(--surface-card)] border border-slate-200 dark:border-[var(--surface-border)] rounded-xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                  {/* Native token */}
                  <button
                    onClick={() => { setSelectedToken("native"); setShowTokenPicker(false); }}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${selectedToken === "native" ? "bg-indigo-50 dark:bg-indigo-500/10" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src={chainMeta.logo} alt={chain?.nativeCurrency?.symbol} className="w-8 h-8 rounded-full" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-slate-900 dark:text-white">{chain?.nativeCurrency?.symbol || "ETH"}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Native Token</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {parseFloat(nativeBalance?.balanceFormatted || "0").toFixed(4)}
                      </p>
                      {nativeBalance?.valueUsd && (
                        <p className="text-xs text-slate-400">${nativeBalance.valueUsd.toFixed(2)}</p>
                      )}
                    </div>
                  </button>

                  {/* ERC20 tokens */}
                  {tokens.map((token) => (
                    <button
                      key={token.contractAddress}
                      onClick={() => { setSelectedToken(token.contractAddress); setShowTokenPicker(false); }}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${selectedToken === token.contractAddress ? "bg-indigo-50 dark:bg-indigo-500/10" : ""}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {token.logo ? (
                          <img src={token.logo} alt={token.symbol} className="w-10 h-10 rounded-full" />
                        ) : (
                          <Coins className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-slate-900 dark:text-white">{token.symbol}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{token.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {parseFloat(token.balanceFormatted).toFixed(4)}
                        </p>
                        {token.valueUsd && (
                          <p className="text-xs text-slate-400">${token.valueUsd.toFixed(2)}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recipient Address */}
          <div>
            <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Recipient Address</label>
            <div className="relative">
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="0x..."
                className={`input-field font-mono pr-10 ${to && !isAddress(to) ? 'border-red-300 dark:border-red-600' : ''}`}
              />
              {to && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isAddress(to) ? (
                    <div className="w-2 h-2 rounded-full bg-emerald-500" title="Valid address" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-red-500" title="Invalid address" />
                  )}
                </div>
              )}
            </div>
            {to && !isAddress(to) && (
              <p className="text-xs text-red-500 mt-1">Please enter a valid Ethereum address</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                step="any"
                min="0"
                className="input-field pr-16 text-lg"
              />
              <button
                onClick={() => setAmount(currentBalance)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-500 px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-500/20"
              >
                MAX
              </button>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <p className="text-slate-400 dark:text-slate-500">
                Balance: {parseFloat(currentBalance).toFixed(6)} {currentSymbol}
              </p>
              {amount && currentPriceUsd > 0 && (
                <p className="text-slate-400 dark:text-slate-500">
                  ≈ ${(currentPriceUsd * parseFloat(amount || "0")).toFixed(2)}
                </p>
              )}
            </div>
            <div className="flex justify-end mt-1">
              {isLocalSigner ? (
                <span className="text-xs px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium">
                  💰 You pay gas fee
                </span>
              ) : (
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium">
                  ⚡ Gas: Sponsored
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleReview}
            disabled={!to || !amount || !isAddress(to)}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            Review Transaction
          </button>
        </div>
      )}

      {/* Confirmation Step */}
      {step === "confirm" && (
        <div className="card space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm Transaction</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Review details before sending</p>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-[var(--surface-elevated)] border border-slate-200 dark:border-[var(--surface-border)]">
            {/* Token */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Token</span>
              <div className="flex items-center gap-2">
                {currentLogo && (
                  <img src={currentLogo} alt={currentSymbol} className="w-5 h-5 rounded-full" />
                )}
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{currentSymbol}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Amount</span>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {amount} {currentSymbol}
                </p>
                {currentPriceUsd > 0 && (
                  <p className="text-xs text-slate-400">≈ ${(currentPriceUsd * parseFloat(amount)).toFixed(2)} USD</p>
                )}
              </div>
            </div>

            {/* Recipient */}
            <div className="flex items-start justify-between gap-4">
              <span className="text-sm text-slate-500 dark:text-slate-400 flex-shrink-0">To</span>
              <p className="text-sm font-mono text-slate-900 dark:text-white text-right break-all">{to}</p>
            </div>

            {/* Network */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Network</span>
              <div className="flex items-center gap-2">
                <img src={chainMeta.logo} alt={chain?.name} className="w-4 h-4 rounded-full" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">{chain?.name}</span>
              </div>
            </div>

            {/* Gas Fee */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Network Fee</span>
              {isLocalSigner ? (
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  You pay with {chain?.nativeCurrency?.symbol || 'native token'}
                </span>
              ) : (
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">⚡ Sponsored (Free)</span>
              )}
            </div>
            {isLocalSigner && (
              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-2 rounded">
                ⚠️ Make sure you have enough {chain?.nativeCurrency?.symbol || 'native token'} to pay for gas for successful transaction
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("form")}
              className="flex-1 btn-secondary"
            >
              Edit
            </button>
            <button
              onClick={handleSend}
              disabled={isSendingUserOperation || isProcessing}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {isSendingUserOperation || isProcessing ? (
                <>
                  <Spinner size="sm" />
                  Sending...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirm & Send
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="card text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transaction Sent!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {amount} {currentSymbol} sent to {to.slice(0, 6)}...{to.slice(-4)}
          </p>
          {txHash && (
            <a
              href={`${explorerUrl}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              View on Explorer
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button onClick={resetForm} className="btn-secondary w-full">Send Another</button>
        </div>
      )}

      {step === "error" && (
        <div className="card text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 dark:bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transaction Failed</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 break-words">{errorMsg}</p>
          <button onClick={resetForm} className="btn-secondary w-full">Try Again</button>
        </div>
      )}

      {step === "sending" && (
        <div className="card text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Sending Transaction...</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Please wait while your transaction is being processed</p>
        </div>
      )}
    </div>
  );
}
