"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { useDataContext } from "@/context/WalletProvider";
import { useChain, useSmartAccountClient, useSendUserOperation, useSignerStatus } from "@account-kit/react";
import { useSigner, useIsLocalSigner } from "@/hooks/useSigner";
import { getLocalPrivateKey, getLocalAccountAddress } from "@/components/auth/PrivateKeyLogin";
import { isAddress, parseEther, parseUnits, encodeFunctionData, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { ArrowUpRight, Check, AlertCircle, ExternalLink } from "lucide-react";
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

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendModal({ isOpen, onClose }: SendModalProps) {
  const { nativeBalance, tokens } = useDataContext();
  const { isConnected } = useSignerStatus();
  const { chain } = useChain();
  const { client } = useSmartAccountClient({ type: "LightAccount" });
  const { sendUserOperationAsync, isSendingUserOperation } = useSendUserOperation({ client });
  
  // Use the signer hook
  const signerInfo = useSigner();
  const isLocalSigner = useIsLocalSigner();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("native");
  const [step, setStep] = useState<"form" | "confirm" | "success" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [txHash, setTxHash] = useState("");

  const explorerUrl = chain?.blockExplorers?.default?.url || "https://etherscan.io";
  const selectedTokenData =
    selectedToken === "native"
      ? null
      : tokens.find((t) => t.contractAddress === selectedToken);

  // Check if user is logged in (either smart account or local signer)
  const isLoggedIn = isConnected || signerInfo.isConnected;

  const handleSend = async () => {
    if (!isAddress(to)) {
      toast.error("Invalid address");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Invalid amount");
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = async () => {
    // Debug logging
    console.log("handleConfirm - signerInfo:", signerInfo);
    console.log("handleConfirm - isLoggedIn:", isLoggedIn, "isConnected:", isConnected, "signerInfo.isConnected:", signerInfo.isConnected);
    
    // Check if user is signed in
    if (!isLoggedIn) {
      toast.error("Please sign in first");
      return;
    }

    try {
      let result;
      
      // Check if using local signer (seed phrase/private key)
      if (signerInfo.type === "local") {
        console.log("Using local signer for transaction");
        
        const privateKey = getLocalPrivateKey();
        const localAddress = getLocalAccountAddress();
        
        if (!privateKey || !localAddress) {
          toast.error("Local signer not available. Please login again.");
          return;
        }
        
        // Create wallet client from private key
        const account = privateKeyToAccount(privateKey as `0x${string}`);
        
        const walletClient = createWalletClient({
          account,
          chain: chain,
          transport: http(),
        });
        
        if (selectedTokenData) {
          // ERC-20 token transfer
          const hash = await walletClient.writeContract({
            account,
            address: selectedTokenData.contractAddress as `0x${string}`,
            abi: erc20TransferAbi,
            functionName: "transfer",
            args: [to as `0x${string}`, parseUnits(amount, selectedTokenData.decimals)],
          });
          result = { hash };
        } else {
          // Native ETH transfer
          const hash = await walletClient.sendTransaction({
            account,
            to: to as `0x${string}`,
            value: parseEther(amount),
          });
          result = { hash };
        }
        
        setTxHash(result?.hash || "");
        setStep("success");
        toast.success("Transaction sent!");
        return;
      }
      
      // Check if we have a smart account client (for smart account users)
      if (!client) {
        toast.error("Smart account not available. Please try refreshing.");
        return;
      }

      // Handle smart account transactions
      if (selectedTokenData) {
        const data = encodeFunctionData({
          abi: erc20TransferAbi,
          functionName: "transfer",
          args: [to as `0x${string}`, parseUnits(amount, selectedTokenData.decimals)],
        });
        result = await sendUserOperationAsync({
          uo: {
            target: selectedTokenData.contractAddress as `0x${string}`,
            data,
            value: 0n,
          },
        });
      } else {
        result = await sendUserOperationAsync({
          uo: {
            target: to as `0x${string}`,
            data: "0x",
            value: parseEther(amount),
          },
        });
      }
      
      setTxHash(result?.hash || "");
      setStep("success");
      toast.success("Transaction sent!");
    } catch (err: any) {
      console.error("Send error:", err);
      setErrorMsg(err?.message || "Transaction failed");
      setStep("error");
    }
  };

  const handleClose = () => {
    setTo("");
    setAmount("");
    setSelectedToken("native");
    setStep("form");
    setErrorMsg("");
    setTxHash("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Send">
      {step === "form" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Token</label>
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="input-field"
            >
              <option value="native">
                {nativeBalance?.symbol || chain.nativeCurrency.symbol} (Native)
              </option>
              {tokens.map((token) => (
                <option key={token.contractAddress} value={token.contractAddress}>
                  {token.symbol} - {token.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Recipient Address</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="0x..."
              className="input-field font-mono"
            />
          </div>

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
                className="input-field pr-16"
              />
              <button
                onClick={() => {
                  if (selectedToken === "native" && nativeBalance) {
                    setAmount(nativeBalance.balanceFormatted);
                  } else if (selectedTokenData) {
                    setAmount(selectedTokenData.balanceFormatted);
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-500"
              >
                MAX
              </button>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={!to || !amount}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            Continue
          </button>
        </div>
      )}

      {step === "confirm" && (
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-50 dark:bg-[var(--surface-elevated)] border border-slate-200 dark:border-[var(--surface-border)] p-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">To</span>
                <span className="text-sm text-slate-900 dark:text-white font-mono">
                  {to.slice(0, 8)}...{to.slice(-6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Amount</span>
                <span className="text-sm text-slate-900 dark:text-white font-semibold">
                  {amount} {selectedTokenData?.symbol || nativeBalance?.symbol || chain.nativeCurrency.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Network</span>
                <span className="text-sm text-slate-900 dark:text-white">{chain.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Gas</span>
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  {signerInfo.type === "local" ? "Network fees apply" : "Sponsored"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("form")} className="btn-secondary flex-1">
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSendingUserOperation}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isSendingUserOperation ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
              {isSendingUserOperation ? "Sending..." : "Confirm"}
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transaction Sent!</h3>
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
          <button onClick={handleClose} className="btn-secondary w-full">Done</button>
        </div>
      )}

      {step === "error" && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 dark:bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transaction Failed</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 break-words">{errorMsg}</p>
          <button onClick={() => setStep("form")} className="btn-secondary w-full">Try Again</button>
        </div>
      )}
    </Modal>
  );
}
