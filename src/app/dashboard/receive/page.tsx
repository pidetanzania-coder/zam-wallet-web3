"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAccount, useChain } from "@account-kit/react";
import { copyToClipboard } from "@/lib/utils";
import { getChainMeta } from "@/config/chains";
import { getLocalAccountAddress } from "@/components/auth/PrivateKeyLogin";
import { Copy, Check, AlertTriangle, ArrowLeft, Info } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ReceivePage() {
  const { address: smartAccountAddress } = useAccount({ type: "LightAccount" });
  const { chain } = useChain();
  const [copied, setCopied] = useState(false);
  const [localAddress, setLocalAddress] = useState<string | null>(null);

  // Check for local signer
  useEffect(() => {
    const addr = getLocalAccountAddress();
    setLocalAddress(addr);
  }, []);

  // Use either smart account address or local signer address
  const address = smartAccountAddress || localAddress;

  const chainMeta = getChainMeta(chain?.id || 1);

  const handleCopy = async () => {
    if (!address) return;
    await copyToClipboard(address);
    setCopied(true);
    toast.success("Address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!address) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Receive Crypto</h1>
        </div>
        <div className="card text-center py-12">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Please connect your wallet to receive crypto
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Receive Crypto</h1>
      </div>

      {/* Network Info */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-500" />
          <p className="text-sm text-indigo-600 dark:text-indigo-400">
            You can receive any token on <span className="font-semibold">{chain?.name || "this network"}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {chainMeta.logo && (
            <img src={chainMeta.logo} alt={chain?.name} className="w-6 h-6 rounded-full" />
          )}
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {chain?.name || "Ethereum"}
          </span>
        </div>
      </div>

      {/* QR Code */}
      <div className="card text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Scan this QR code to receive{" "}
          <span className="text-slate-900 dark:text-white font-medium">
            {chain?.nativeCurrency?.symbol || "crypto"}
          </span>{" "}
          and other tokens on {chain?.name || "this network"}
        </p>

        <div className="flex justify-center mb-6">
          <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <QRCodeSVG
              value={address}
              size={220}
              level="H"
              bgColor="#ffffff"
              fgColor="#0f172a"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-3">
          <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">
            Your Wallet Address
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-300 break-all leading-relaxed">
              {address}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:scale-[1.01]"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Address
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            Important Notice
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
            Only send <span className="font-semibold">{chain?.name || "this network"}</span> tokens to this address.
            Sending tokens from other networks may result in permanent loss of funds.
          </p>
        </div>
      </div>
    </div>
  );
}
