"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Modal } from "@/components/ui/Modal";
import { useAccount, useChain } from "@account-kit/react";
import { copyToClipboard } from "@/lib/utils";
import { getChainMeta } from "@/config/chains";
import { Copy, Check, Wallet, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiveModal({ isOpen, onClose }: ReceiveModalProps) {
  const { address } = useAccount({ type: "LightAccount" });
  const { chain } = useChain();
  const [copied, setCopied] = useState(false);
  
  const chainMeta = getChainMeta(chain?.id || 1);

  const handleCopy = async () => {
    if (!address) return;
    await copyToClipboard(address);
    setCopied(true);
    toast.success("Address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!address) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receive Crypto">
      <div className="space-y-6 text-center">
        {/* Network Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
          {chainMeta.logo && (
            <img src={chainMeta.logo} alt={chain?.name} className="w-5 h-5 rounded-full" />
          )}
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {chain?.name || "Ethereum"}
          </span>
        </div>

        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Scan this QR code or copy the address below to receive{" "}
            <span className="text-slate-900 dark:text-white font-medium">{chain?.nativeCurrency?.symbol || "crypto"}</span>
          </p>

          <div className="flex justify-center">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
              <QRCodeSVG
                value={address}
                size={200}
                level="H"
                bgColor="#ffffff"
                fgColor="#0f172a"
                includeMargin={false}
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-3">
          <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Your Wallet Address
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-300 break-all px-2 leading-relaxed">
              {address}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25"
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

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
              Important Notice
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
              Only send <span className="font-semibold">{chain?.name || "this network"}</span> tokens to this address. 
              Sending tokens from other networks may result in permanent loss.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
