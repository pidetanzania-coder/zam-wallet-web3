"use client";

import { useState, useEffect } from "react";
import { useAccount, useUser, useLogout, useChain, useAddPasskey, useListAuthMethods, useRemovePasskey, useExportAccount } from "@account-kit/react";
import { useTheme } from "@/context/ThemeProvider";
import { shortenAddress, copyToClipboard } from "@/lib/utils";
import {
  User,
  Shield,
  Copy,
  ExternalLink,
  LogOut,
  Info,
  Sun,
  Moon,
  Fingerprint,
  Plus,
  Trash2,
  Key,
  Wallet,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { address } = useAccount({ type: "LightAccount" });
  const user = useUser();
  const { logout } = useLogout();
  const { chain } = useChain();
  const { theme, setTheme } = useTheme();

  // Check if user is local signer
  const [isLocalSigner, setIsLocalSigner] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowSigner = (window as any).__localSigner;
      const sessionSigner = sessionStorage.getItem("localSignerAddress");
      setIsLocalSigner(!!windowSigner || !!sessionSigner);
    }
  }, []);

  const { addPasskey, isAddingPasskey } = useAddPasskey({
    onSuccess: () => toast.success("Passkey added successfully!"),
    onError: (err) => toast.error(err.message || "Failed to add passkey"),
  });

  const { removePasskey, isRemovingPasskey } = useRemovePasskey({
    onSuccess: () => toast.success("Passkey removed successfully!"),
    onError: (err) => toast.error(err.message || "Failed to remove passkey"),
  });

  const { 
    exportAccount, 
    isExported,
    isExporting, 
    error: exportError,
    ExportAccountComponent,
  } = useExportAccount({
    params: {
      iframeContainerId: "export-iframe-container",
    },
  });

  const { data: authMethods } = useListAuthMethods();
  const passkeys = authMethods?.passkeys || [];

  const explorerUrl = chain?.blockExplorers?.default?.url || "https://etherscan.io";

  const handleCopyAddress = async () => {
    if (!address) return;
    await copyToClipboard(address);
    toast.success("Address copied!");
  };

  // Show export modal
  const [showExportModal, setShowExportModal] = useState(false);

  // Handle export - shows modal with status
  const handleExport = () => {
    setShowExportModal(true);
    setTimeout(() => {
      exportAccount();
    }, 100);
  };

  const handleCloseExport = () => {
    setShowExportModal(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>

      {/* Profile */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile</h2>
        </div>
        <div className="space-y-3">
          {user?.email && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">Email</span>
              <span className="text-sm text-slate-900 dark:text-white">{user.email}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Wallet Type</span>
            <span className="text-sm text-slate-900 dark:text-white">
              {isLocalSigner ? "Local Signer" : "Smart Wallet (ERC-4337)"}
            </span>
          </div>
        </div>
      </div>

      {/* Wallet */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Wallet</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Address</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-900 dark:text-white font-mono">
                {shortenAddress(address || "", 6)}
              </span>
              <button onClick={handleCopyAddress} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10">
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Network</span>
            <span className="text-sm text-slate-900 dark:text-white">{chain?.name}</span>
          </div>
          {!isLocalSigner && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">Gas Sponsorship</span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400">Active</span>
            </div>
          )}
          <a
            href={`${explorerUrl}/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            View on Explorer
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Export Account - Only for Smart Wallet */}
      {!isLocalSigner && (
        <div className="card space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Export Account</h2>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Export your account to access your private key or seed phrase. This is useful for importing your wallet into other applications.
          </p>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Keep your private key or seed phrase secure. Anyone with this information can access your funds.
              </p>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
          >
            <Wallet className="w-4 h-4" />
            {isExporting ? "Exporting..." : "Export Private Key"}
          </button>

          {/* Export Modal - Clean UI with iframe for export */}
          {showExportModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-[#0a0a14] rounded-2xl p-6 max-w-lg w-full space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Export Account</h3>
                
                {exportError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{exportError.message}</p>
                  </div>
                )}

                {/* Iframe container for Turnkey export - required for export to work */}
                <div 
                  id="export-iframe-container" 
                  className="min-h-[120px] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900"
                />
                
                <button
                  onClick={handleCloseExport}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Passkey Management - Only for Smart Wallet (not Local Signer) */}
      {!isLocalSigner && (
        <div className="card space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Fingerprint className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Passkeys</h2>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Passkeys let you sign in securely using your device's biometrics (fingerprint, Face ID) or PIN — no password needed.
          </p>

          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                Adding a passkey allows you to sign in without your email on this device. You can add multiple passkeys for different devices.
              </p>
            </div>
          </div>

          {/* Registered Passkeys */}
          {passkeys.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Registered Passkeys ({passkeys.length})</p>
              {passkeys.map((passkey: any, index: number) => (
                <div key={passkey.credentialId || index} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[var(--surface-elevated)] border border-slate-200 dark:border-[var(--surface-border)]">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                    <Fingerprint className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {passkey.name || `Passkey ${index + 1}`}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {passkey.createdAt ? new Date(passkey.createdAt).toLocaleDateString() : "Active"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (passkey.authenticatorId) {
                        removePasskey(passkey.authenticatorId);
                      } else {
                        toast.error("Cannot remove passkey - missing ID");
                      }
                    }}
                    disabled={isRemovingPasskey}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors disabled:opacity-50"
                    title="Remove passkey"
                  >
                    {isRemovingPasskey ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No passkeys registered.</p>
          )}

          <button
            onClick={() => addPasskey()}
            disabled={isAddingPasskey}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {isAddingPasskey ? "Adding Passkey..." : "Add New Passkey"}
          </button>
        </div>
      )}

      {/* Local Signer Info - Only for Local Signer */}
      {isLocalSigner && (
        <div className="card space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Local Wallet</h2>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            You're using a local signer wallet. This wallet is stored locally in your browser and is not backed up by our servers.
          </p>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Passkeys are only available for Smart Wallets. To use passkeys, please connect using email or social login instead of private key/mnemonic.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Appearance */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Sun className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
              theme === "light"
                ? "bg-indigo-50 dark:bg-indigo-500/15 border-indigo-300 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
                : "bg-slate-50 dark:bg-[var(--surface-elevated)] border-slate-200 dark:border-[var(--surface-border)] text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            <Sun className="w-4 h-4" />
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
              theme === "dark"
                ? "bg-indigo-50 dark:bg-indigo-500/15 border-indigo-300 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
                : "bg-slate-50 dark:bg-[var(--surface-elevated)] border-slate-200 dark:border-[var(--surface-border)] text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            <Moon className="w-4 h-4" />
            Dark
          </button>
        </div>
      </div>

      {/* About */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">About</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Version</span>
            <span className="text-sm text-slate-900 dark:text-white">1.0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Website</span>
            <a href="https://web.zamwallet.io" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              web.zamwallet.io
            </a>
          </div>
        </div>
      </div>

      {/* Disconnect */}
      <button
        onClick={() => logout()}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Disconnect Wallet
      </button>
    </div>
  );
}
