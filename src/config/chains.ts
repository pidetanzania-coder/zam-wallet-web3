import { mainnet, polygon, arbitrum, optimism, base, bsc, celoMainnet } from "@account-kit/infra";
import type { Chain } from "viem";

export interface ChainMeta {
  chain: Chain;
  logo: string;
  alchemyNetwork?: string;
}

export const SUPPORTED_CHAINS: Record<number, ChainMeta> = {
  1: {
    chain: mainnet,
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    alchemyNetwork: "eth-mainnet",
  },
  137: {
    chain: polygon,
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
    alchemyNetwork: "polygon-mainnet",
  },
  42161: {
    chain: arbitrum,
    logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg",
    alchemyNetwork: "arb-mainnet",
  },
  10: {
    chain: optimism,
    logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg",
    alchemyNetwork: "opt-mainnet",
  },
  8453: {
    chain: base,
    logo: "https://avatars.githubusercontent.com/u/108554348?s=200&v=4",
    alchemyNetwork: "base-mainnet",
  },
  56: {
    chain: bsc,
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.svg",
    alchemyNetwork: "bnb-mainnet",
  },
  42220: {
    chain: celoMainnet,
    logo: "https://cryptologos.cc/logos/celo-celo-logo.svg",
    alchemyNetwork: "celo-mainnet",
  },
};

export const DEFAULT_CHAIN = mainnet;

export function getChainMeta(chainId: number): ChainMeta {
  return SUPPORTED_CHAINS[chainId] || SUPPORTED_CHAINS[1];
}

export function getAllChainMetas(): ChainMeta[] {
  return Object.values(SUPPORTED_CHAINS);
}
