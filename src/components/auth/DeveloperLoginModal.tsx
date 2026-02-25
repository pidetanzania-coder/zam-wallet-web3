"use client";

import { useState, useEffect } from "react";
import { X, Key, AlertTriangle } from "lucide-react";
import { PrivateKeyLogin } from "./PrivateKeyLogin";

interface DeveloperLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperLoginModal({ isOpen, onClose }: DeveloperLoginModalProps) {
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-white">Import Wallet</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Warning */}
          {showWarning && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-400">Security Notice</p>
                  <p className="text-xs text-amber-300/80 mt-1">
                    Never share your seed phrase with anyone. Anyone with your seed phrase can access your funds.
                  </p>
                  <button
                    onClick={() => setShowWarning(false)}
                    className="text-xs text-amber-400 underline mt-2 hover:text-amber-300"
                  >
                    I understand, continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Seed Phrase Login */}
          <PrivateKeyLogin onSuccess={onClose} />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-slate-800/50 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            Your private key stays in your browser and is never sent to any server.
          </p>
        </div>
      </div>
    </div>
  );
}
