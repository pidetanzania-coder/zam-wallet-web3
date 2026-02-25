"use client";

import { useAccount, useSignerStatus, useSmartAccountClient } from "@account-kit/react";
import { getLocalAccountAddress, getLocalSigner, isLocalSignerLogin, getLocalPrivateKey } from "@/components/auth/PrivateKeyLogin";
import { useMemo, useEffect, useState } from "react";
import { http, Chain } from "viem";

export type SignerType = "smart" | "local";

interface SignerInfo {
  type: SignerType;
  address: string | undefined;
  isConnected: boolean;
  client: any;
  walletClient: any; // For local signer direct transactions
  localSigner: any; // The LocalAccountSigner instance
}

/**
 * Custom hook to get the current signer info, supporting both
 * Alchemy smart accounts and local signers (private key/seed phrase)
 */
export function useSigner() {
  const { isConnected: isSmartConnected } = useSignerStatus();
  const { address: smartAddress } = useAccount({ type: "LightAccount" });
  const { client } = useSmartAccountClient({ type: "LightAccount" });
  
  const [mounted, setMounted] = useState(false);
  const [localSignerInfo, setLocalSignerInfo] = useState<{address: string | null, signer: any}>({ address: null, signer: null });
  
  useEffect(() => {
    setMounted(true);
    
    // Get local signer info after mount
    const localAddr = getLocalAccountAddress();
    const localSigner = getLocalSigner();
    setLocalSignerInfo({ address: localAddr, signer: localSigner });
  }, []);
  
  const isLocalConnected = isLocalSignerLogin();
  
  const signerInfo = useMemo<SignerInfo>(() => {
    // Priority: smart account > local signer
    if (isSmartConnected && smartAddress) {
      return {
        type: "smart",
        address: smartAddress,
        isConnected: true,
        client,
        walletClient: null,
        localSigner: null,
      };
    }
    
    // Check local signer - either from window or sessionStorage
    if (mounted && (isLocalConnected || localSignerInfo.address)) {
      return {
        type: "local",
        address: localSignerInfo.address || undefined,
        isConnected: true,
        client: null,
        walletClient: null,
        localSigner: localSignerInfo.signer,
      };
    }
    
    return {
      type: "smart",
      address: smartAddress,
      isConnected: false,
      client: null,
      walletClient: null,
      localSigner: null,
    };
  }, [smartAddress, isSmartConnected, localSignerInfo, mounted, isLocalConnected, client]);
  
  return signerInfo;
}

/**
 * Check if the current signer is a local signer (seed phrase/private key)
 */
export function useIsLocalSigner(): boolean {
  const { type } = useSigner();
  return type === "local";
}

/**
 * Get wallet client for local signer transactions
 * This creates a viem wallet client from the stored private key
 */
export function useLocalWalletClient(chain: Chain | undefined) {
  const { type, address } = useSigner();
  const [walletClient, setWalletClient] = useState<any>(null);
  
  useEffect(() => {
    if (type === "local" && chain && address) {
      const privateKey = getLocalPrivateKey();
      if (privateKey) {
        const { privateKeyToAccount, createWalletClient } = require("viem/accounts");
        const { createWalletClient: create, http: httpTransport } = require("viem");
        const account = privateKeyToAccount(privateKey);
        const client = createWalletClient({
          account,
          chain,
          transport: http(),
        });
        setWalletClient(client);
      }
    }
  }, [type, chain, address]);
  
  return walletClient;
}
