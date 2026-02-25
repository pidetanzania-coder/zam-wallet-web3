"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useChain, useSmartAccountClient, useSendUserOperation, useSignerStatus } from "@account-kit/react";
import { useDataContext } from "@/context/WalletProvider";
import { parseUnits } from "viem";
import { polygon } from "viem/chains";
import { Spinner } from "@/components/ui/Spinner";
import { getLocalAccountAddress, getLocalPrivateKey } from "@/components/auth/PrivateKeyLogin";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import {
  getSwapQuote,
  getTokensForChain,
  formatTokenAmount,
  SAME_CHAIN_SWAP_CHAINS,
  CROSS_CHAIN_SWAP_CHAINS,
  NATIVE_TOKEN_ADDRESS,
  type SwapToken,
  type SwapQuoteResult,
} from "@/lib/swap";
import { SUPPORTED_CHAINS, getChainMeta } from "@/config/chains";
import {
  ArrowDownUp,
  Check,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Repeat,
  Zap,
  Globe,
  ChevronDown,
  Coins,
} from "lucide-react";
import toast from "react-hot-toast";

function TokenSelector({
  tokens,
  selected,
  onSelect,
  label,
}: {
  tokens: SwapToken[];
  selected: string;
  onSelect: (address: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const token = tokens.find((t) => t.address === selected);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[var(--surface-card)] border border-slate-200 dark:border-[var(--surface-border)] hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
          {token?.logo ? (
            <img src={token.logo} alt={token.symbol} className="w-9 h-9 rounded-full" />
          ) : (
            <Coins className="w-5 h-5 text-slate-400" />
          )}
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-slate-900 dark:text-white">{token?.symbol || "Select"}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{token?.name || "Token"}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[var(--surface-card)] border border-slate-200 dark:border-[var(--surface-border)] rounded-xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
            {tokens.map((t) => (
              <button
                key={t.address}
                type="button"
                onClick={() => { onSelect(t.address); setOpen(false); }}
                className={`w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${selected === t.address ? "bg-indigo-50 dark:bg-indigo-500/10" : ""}`}
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {t.logo ? (
                    <img src={t.logo} alt={t.symbol} className="w-9 h-9 rounded-full" />
                  ) : (
                    <Coins className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-slate-900 dark:text-white">{t.symbol}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{t.name}</p>
                </div>
                {selected === t.address && (
                  <Check className="w-4 h-4 text-indigo-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SwapPage() {
  const { address: accountAddress } = useAccount({ type: "LightAccount" });
  const { isConnected } = useSignerStatus();
  const { chain } = useChain();
  const { client } = useSmartAccountClient({ type: "LightAccount" });
  const { sendUserOperationAsync, isSendingUserOperation } = useSendUserOperation({ client });
  const { nativeBalance, tokens: walletTokens } = useDataContext();
  
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

  useEffect(() => {
    // Only run on client after hydration
    const address = getLocalAccountAddress();
    const privateKey = getLocalPrivateKey();
    
    // Check sessionStorage for credential type
    if (typeof window !== "undefined") {
      const signerType = sessionStorage.getItem("localSignerType");
      const hasCredential = sessionStorage.getItem("localSignerCredential");
      // Local signer is true if we have a credential AND it's either privateKey or mnemonic type
      const isLocal = !!hasCredential && (signerType === "privateKey" || signerType === "mnemonic");
      
      setLocalSignerState({
        address,
        privateKey,
        isLocal,
      });
    } else {
      setLocalSignerState({
        address,
        privateKey,
        isLocal: false,
      });
    }
  }, []);

  const { address: localAddress, privateKey: localPrivateKey, isLocal: isLocalSigner } = localSignerState;
  const address = accountAddress || localAddress;
  const isLoggedIn = isConnected || isLocalSigner;

  // Debug logging
  console.log("Swap page - signer status:", { isConnected, isLocalSigner, isLoggedIn, accountAddress, localAddress });

  const [crossChain, setCrossChain] = useState(false);
  const [destChainId, setDestChainId] = useState<number>(0);
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<SwapQuoteResult | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [step, setStep] = useState<"form" | "success" | "error">("form");
  const [txHash, setTxHash] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const sourceChainId = chain.id;
  const isSameChainSupported = SAME_CHAIN_SWAP_CHAINS.includes(sourceChainId);
  const isCrossChainSupported = CROSS_CHAIN_SWAP_CHAINS.includes(sourceChainId);
  const isSwapSupported = isSameChainSupported || isCrossChainSupported;

  const sourceTokens = getTokensForChain(sourceChainId);

  // Get user's balance for the selected from token
  const getFromTokenBalance = () => {
    if (!fromToken) return "0";
    if (fromToken === NATIVE_TOKEN_ADDRESS) {
      return nativeBalance?.balanceFormatted || "0";
    }
    const walletToken = walletTokens.find(
      (t) => t.contractAddress.toLowerCase() === fromToken.toLowerCase()
    );
    return walletToken?.balanceFormatted || "0";
  };
  const targetChainId = crossChain && destChainId ? destChainId : sourceChainId;
  const destTokens = getTokensForChain(targetChainId);

  const explorerUrl = chain?.blockExplorers?.default?.url || "https://etherscan.io";

  useEffect(() => {
    if (sourceTokens.length > 0 && !fromToken) {
      setFromToken(sourceTokens[0].address);
    }
  }, [sourceTokens, fromToken]);

  useEffect(() => {
    if (destTokens.length > 1) {
      const second = destTokens.find((t) => t.address !== fromToken);
      if (second) setToToken(second.address);
      else setToToken(destTokens[0].address);
    } else if (destTokens.length > 0) {
      setToToken(destTokens[0].address);
    }
  }, [destTokens, fromToken]);

  useEffect(() => {
    const available = CROSS_CHAIN_SWAP_CHAINS.filter((id) => id !== sourceChainId);
    if (available.length > 0 && !destChainId) {
      setDestChainId(available[0]);
    }
  }, [sourceChainId, destChainId]);

  useEffect(() => {
    setQuote(null);
    setQuoteError("");
  }, [fromToken, toToken, amount, crossChain, destChainId]);

  const fromTokenData = sourceTokens.find((t) => t.address === fromToken);
  const toTokenData = destTokens.find((t) => t.address === toToken);

  const fetchQuote = useCallback(async () => {
    if (!address || !fromToken || !toToken || !amount || parseFloat(amount) <= 0) return;
    if (fromToken === toToken && !crossChain) {
      setQuoteError("Select different tokens");
      return;
    }

    setQuoteLoading(true);
    setQuoteError("");
    setQuote(null);

    try {
      const decimals = fromTokenData?.decimals || 18;
      const fromAmount = parseUnits(amount, decimals);
      const result = await getSwapQuote({
        from: address,
        chainId: sourceChainId,
        fromToken,
        toToken,
        fromAmount,
        toChainId: crossChain ? destChainId : undefined,
      });
      setQuote(result);
    } catch (err: any) {
      setQuoteError(err.message || "Failed to get quote");
    } finally {
      setQuoteLoading(false);
    }
  }, [address, fromToken, toToken, amount, crossChain, destChainId, sourceChainId, fromTokenData]);

  const handleSwap = async () => {
    // Check if using local signer (either private key or mnemonic)
    const signerType = typeof window !== "undefined" ? sessionStorage.getItem("localSignerType") : null;
    const hasLocalCredential = signerType === "privateKey" || signerType === "mnemonic";
    
    if (isLocalSigner && hasLocalCredential) {
      try {
        setIsProcessing(true);
        const { privateKeyToAccount, mnemonicToAccount } = await import("viem/accounts");
        const { createWalletClient, http } = await import("viem");
        
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
        
        // Try private key first, fall back to mnemonic derivation
        let account;
        const credential = typeof window !== "undefined" ? sessionStorage.getItem("localSignerCredential") : null;
        
        if (signerType === "mnemonic" && credential) {
          // Use mnemonic directly to derive account
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
        
        // Also create a public client for waiting for receipts
        const { createPublicClient } = await import("viem");
        const publicClient = createPublicClient({
          chain: viemChain,
          transport: http(rpcUrl),
        });

        const calls = quote?.details?.data?.calls;
        if (!calls || calls.length === 0) {
          throw new Error("No swap calls returned from quote");
        }

        // Send each call as a transaction
        for (const call of calls) {
          const tx = await walletClient.sendTransaction({
            to: call.to as `0x${string}`,
            data: (call.data || "0x") as `0x${string}`,
            value: call.value ? BigInt(call.value) : undefined,
          });
          await publicClient.waitForTransactionReceipt({ hash: tx });
        }

        setStep("success");
        toast.success("Swap completed!");
        setIsProcessing(false);
        return;
      } catch (err: any) {
        console.error("Swap error:", err);
        setErrorMsg(err.message || "Swap failed");
        setStep("error");
        setIsProcessing(false);
        return;
      }
    }

    // Original smart account logic
    if (!isLoggedIn) {
      setErrorMsg("Please sign in first");
      setStep("error");
      return;
    }
    
    if (!quote || !client) {
      setErrorMsg("Smart account not available. Please try refreshing.");
      setStep("error");
      return;
    }

    try {
      const calls = quote.details?.data?.calls;
      if (!calls || calls.length === 0) {
        throw new Error("No swap calls returned from quote");
      }

      const result = await sendUserOperationAsync({
        uo: calls.map((call) => ({
          target: call.to as `0x${string}`,
          data: (call.data || "0x") as `0x${string}`,
          value: call.value ? BigInt(call.value) : 0n,
        })),
      });

      setTxHash(result?.hash || "");
      setStep("success");
      toast.success("Swap executed!");
    } catch (err: any) {
      setErrorMsg(err?.message || "Swap failed");
      setStep("error");
    }
  };

  const resetForm = () => {
    setAmount("");
    setQuote(null);
    setQuoteError("");
    setStep("form");
    setTxHash("");
    setErrorMsg("");
  };

  const swapDirection = () => {
    if (!crossChain) {
      const temp = fromToken;
      setFromToken(toToken);
      setToToken(temp);
      setQuote(null);
    }
  };

  if (!isSwapSupported) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card text-center py-16">
          <Repeat className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Swap Not Available</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Swap is not yet supported on {chain.name}. Switch to Ethereum, Polygon, Arbitrum, Optimism, Base, or BNB Chain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Swap</h1>
          {isLocalSigner ? (
            <span className="text-xs px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium">
              💰 Pay Gas Fee
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium">
              ⚡ Gas Sponsored
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {sourceTokens.length} tokens available
          </span>
          {isCrossChainSupported && (
            <button
              onClick={() => { setCrossChain(!crossChain); setQuote(null); }}
              title="Enable cross-chain swaps to swap tokens between different blockchains"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                crossChain
                  ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30"
                  : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-white/15"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {crossChain ? "Cross-chain ON" : "Cross-chain"}
            </button>
          )}
        </div>
      </div>

      {/* Cross-chain info banner */}
      {crossChain && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
          <Globe className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-600 dark:text-indigo-400">
            Cross-chain swap: Send tokens on {chain.name} and receive on a different blockchain. Bridge fees may apply.
          </p>
        </div>
      )}

      {step === "form" && (
        <div className="card space-y-5">
          {/* You Pay */}
          <div className="rounded-xl bg-slate-50 dark:bg-[var(--surface-elevated)] border border-slate-200 dark:border-[var(--surface-border)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">You Pay</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 dark:text-slate-500">{chain.name}</span>
                <button
                  onClick={() => setAmount(getFromTokenBalance())}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-500 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20"
                >
                  MAX
                </button>
              </div>
            </div>
            <TokenSelector tokens={sourceTokens} selected={fromToken} onSelect={setFromToken} label="" />
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                step="any"
                min="0"
                className="w-full bg-transparent text-3xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <span>Balance: {parseFloat(getFromTokenBalance()).toFixed(6)} {fromTokenData?.symbol}</span>
            </div>
          </div>

          {/* Swap direction button */}
          <div className="flex justify-center -my-1">
            <button
              onClick={swapDirection}
              disabled={crossChain}
              className="p-2.5 rounded-xl bg-white dark:bg-[var(--surface-card)] border border-slate-200 dark:border-[var(--surface-border)] hover:bg-slate-50 dark:hover:bg-[var(--surface-elevated)] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <ArrowDownUp className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* You Receive */}
          <div className="rounded-xl bg-slate-50 dark:bg-[var(--surface-elevated)] border border-slate-200 dark:border-[var(--surface-border)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">You Receive</span>
              {crossChain ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">On:</span>
                  <select
                    value={destChainId}
                    onChange={(e) => setDestChainId(Number(e.target.value))}
                    className="text-xs bg-transparent text-indigo-600 dark:text-indigo-400 font-medium focus:outline-none cursor-pointer"
                  >
                    {CROSS_CHAIN_SWAP_CHAINS.filter((id) => id !== sourceChainId).map((id) => (
                      <option key={id} value={id}>
                        {SUPPORTED_CHAINS[id]?.chain.name || `Chain ${id}`}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="text-xs text-slate-400 dark:text-slate-500">{chain.name}</span>
              )}
            </div>
            <TokenSelector tokens={destTokens} selected={toToken} onSelect={setToToken} label="" />
            <div className="text-3xl font-bold text-slate-900 dark:text-white min-h-[2.5rem] flex items-center">
              {quoteLoading && (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-slate-400">Getting best price...</span>
                </div>
              )}
              {quote && toTokenData && (
                <span>{formatTokenAmount(quote.quote.minimumToAmount, toTokenData.decimals)}</span>
              )}
              {!quote && !quoteLoading && (
                <span className="text-slate-300 dark:text-slate-600 text-2xl">0.0</span>
              )}
            </div>
            {/* Exchange rate */}
            {quote && fromTokenData && toTokenData && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Rate:</span>
                <span>1 {fromTokenData.symbol} ≈ {(parseFloat(formatTokenAmount(quote.quote.minimumToAmount, toTokenData.decimals)) / parseFloat(amount)).toFixed(6)} {toTokenData.symbol}</span>
              </div>
            )}
          </div>

          {/* Gas info */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              {isLocalSigner ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Gas: Paid in {chain?.nativeCurrency?.symbol || 'native'}</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Gas: Sponsored</span>
                </>
              )}
            </div>
            {crossChain && (
              <span className="text-xs text-slate-400 dark:text-slate-500">Cross-chain swap</span>
            )}
          </div>

          {/* Quote error */}
          {quoteError && (
            <div className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <p className="text-xs text-red-600 dark:text-red-400">{quoteError}</p>
            </div>
          )}

          {/* Actions */}
          {!quote ? (
            <button
              onClick={fetchQuote}
              disabled={quoteLoading || !amount || parseFloat(amount) <= 0}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {quoteLoading ? (
                <>
                  <Spinner size="sm" />
                  Getting Quote...
                </>
              ) : (
                <>
                  <Repeat className="w-4 h-4" />
                  Get Quote
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleSwap}
              disabled={isSendingUserOperation || isProcessing}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isSendingUserOperation || isProcessing ? (
                <>
                  <Spinner size="sm" />
                  Swapping...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  Confirm Swap
                </>
              )}
            </button>
          )}
        </div>
      )}

      {step === "success" && (
        <div className="card text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Swap Successful!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {crossChain ? "Cross-chain swap initiated. Tokens will arrive on the destination chain shortly." : "Your tokens have been swapped."}
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
          <button onClick={resetForm} className="btn-secondary w-full">Swap Again</button>
        </div>
      )}

      {step === "error" && (
        <div className="card text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 dark:bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Swap Failed</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 break-words">{errorMsg}</p>
          <button onClick={resetForm} className="btn-secondary w-full">Try Again</button>
        </div>
      )}
    </div>
  );
}
