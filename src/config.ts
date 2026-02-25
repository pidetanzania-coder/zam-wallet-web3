import {
  cookieStorage,
  createConfig,
  type AlchemyAccountsUIConfig,
} from "@account-kit/react";
import { alchemy, mainnet, polygon, arbitrum, optimism, base, bsc, celoMainnet } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_API_KEY is not set");
}

const POLICY_ID = process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID;

// Configure React Query with optimized caching
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes (previously data would be garbage collected immediately)
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 30 minutes
      gcTime: 30 * 60 * 1000,
      // Don't refetch on window focus (reduces API calls)
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect (reduces API calls)
      refetchOnReconnect: false,
      // Retry failed requests 2 times max
      retry: 2,
      // Retry after 3 seconds
      retryDelay: 3000,
    },
  },
});

// Custom UI Config for Alchemy Accounts
const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" }],
      [
        { type: "passkey" },
        { type: "social", authProviderId: "google", mode: "popup" },
      ],
    ],
    addPasskeyOnSignup: true,
    header: "Welcome to Zam Wallet",
    hideSignInText: false,
  },
  supportUrl: "https://zamwallet.xyz/support",
};

// Configure Alchemy Account Kit for Zam Wallet
export const config = createConfig(
  {
    transport: alchemy({ apiKey: API_KEY }),
    chain: mainnet,
    chains: [
      { chain: mainnet, policyId: POLICY_ID },
      { chain: polygon, policyId: POLICY_ID },
      { chain: arbitrum, policyId: POLICY_ID },
      { chain: optimism, policyId: POLICY_ID },
      { chain: base, policyId: POLICY_ID },
      { chain: bsc, policyId: POLICY_ID },
      { chain: celoMainnet, policyId: POLICY_ID },
    ],
    ssr: true,
    storage: cookieStorage,
    enablePopupOauth: true,
  },
  uiConfig
);
