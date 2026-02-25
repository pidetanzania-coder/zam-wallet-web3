"use client";

import { useState } from "react";
import { LocalAccountSigner } from "@aa-sdk/core";
import { privateKeyToAccount, mnemonicToAccount } from "viem/accounts";

interface PrivateKeyLoginProps {
  onSuccess?: () => void;
}

export function PrivateKeyLogin({ onSuccess }: PrivateKeyLoginProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod] = useState<"privateKey" | "mnemonic">("mnemonic");

  const handleLogin = async () => {
    setError("");
    
    if (!input.trim()) {
      setError(loginMethod === "privateKey" ? "Please enter a private key" : "Please enter your seed phrase");
      return;
    }

    setIsLoading(true);

    try {
      let account;
      let address: string;
      let localSigner;
      
      // Handle seed phrase only (removed private key option)
      const words = input.trim().toLowerCase().split(/\s+/);
      
      if (words.length < 12 || words.length > 24) {
        setError("Invalid seed phrase. Must be 12-24 words.");
        setIsLoading(false);
        return;
      }

      const mnemonic = input.trim();
      try {
        account = mnemonicToAccount(mnemonic);
        address = account.address;
        // Use LocalAccountSigner for proper Alchemy integration
        localSigner = new LocalAccountSigner(account);
      } catch (e) {
        setError("Invalid seed phrase. Please check your words.");
        setIsLoading(false);
        return;
      }
      
      const signerAddress = await localSigner.getAddress();
      
      console.log("Local signer created with address:", signerAddress);
      
      // Store for app use - use sessionStorage to survive redirect
      if (typeof window !== "undefined") {
        sessionStorage.setItem("localSignerAddress", signerAddress);
        sessionStorage.setItem("localSignerType", "mnemonic");
        
        // For mnemonic, derive and store the private key directly
        // The account object has the derived private key via .key property
        const privateKey = (account as any).key;
        if (privateKey) {
          sessionStorage.setItem("localSignerCredential", privateKey);
        } else {
          // Fallback: store mnemonic (won't work for transactions but at least shows address)
          sessionStorage.setItem("localSignerCredential", input.trim());
        }
        
        // Store the LocalAccountSigner instance on window for global access
        (window as any).__localSigner = localSigner;
        (window as any).__localAccountAddress = signerAddress;
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect to dashboard
      window.location.href = "/dashboard?signer=local";
      
    } catch (err: any) {
      console.error("Error setting signer:", err);
      setError(err.message || "Failed to set signer. Please check your input.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Seed Phrase (12-24 words)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your seed phrase (word1 word2 ...)"
          rows={3}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm resize-none"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
      >
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </button>
    </div>
  );
}

// Get local signer from window (returns LocalAccountSigner instance)
export function getLocalSigner(): any {
  if (typeof window !== "undefined") {
    return (window as any).__localSigner || null;
  }
  return null;
}

// Get local signer private key - handles both private key and mnemonic
export function getLocalCredential(): string | null {
  if (typeof window === "undefined") return null;
  
  const credential = sessionStorage.getItem("localSignerCredential");
  if (!credential) return null;
  
  const signerType = sessionStorage.getItem("localSignerType");
  console.log("getLocalCredential:", { hasCredential: !!credential, signerType, credentialLength: credential?.length });
  
  try {
    if (signerType === "privateKey") {
      // Already a private key
      return credential.startsWith("0x") ? credential : `0x${credential}`;
    } else if (signerType === "mnemonic") {
      // Derive private key from mnemonic - try both .key and .privateKey properties
      const account = mnemonicToAccount(credential);
      console.log("mnemonicToAccount result:", { address: account.address, hasKey: !!(account as any).key, hasPrivateKey: !!(account as any).privateKey });
      // viem HDAccount has .key property which is the private key
      return (account as any).key || (account as any).privateKey;
    }
  } catch (e) {
    console.error("Error getting credential:", e);
  }
  
  return null;
}

export function getLocalAccountAddress(): string | null {
  if (typeof window !== "undefined") {
    // First check window, then sessionStorage
    const windowAddress = (window as any).__localAccountAddress;
    if (windowAddress) return windowAddress;
    // Check sessionStorage for persisted address
    return sessionStorage.getItem("localSignerAddress");
  }
  return null;
}

// Get local signer private key - handles both private key and mnemonic
export function getLocalPrivateKey(): string | null {
  return getLocalCredential();
}

// Check if user logged in with local signer
export function isLocalSignerLogin(): boolean {
  if (typeof window !== "undefined") {
    // First check window, then sessionStorage
    if ((window as any).__localSigner) return true;
    return sessionStorage.getItem("localSignerAddress") !== null;
  }
  return false;
}
