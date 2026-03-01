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
    logo: "/Ethereum.png",
    alchemyNetwork: "eth-mainnet",
  },
  137: {
    chain: polygon,
    logo: "/matic.png",
    alchemyNetwork: "polygon-mainnet",
  },
  42161: {
    chain: arbitrum,
    logo: "/arbitrum.png",
    alchemyNetwork: "arb-mainnet",
  },
  10: {
    chain: optimism,
    logo: "/optimism.png",
    alchemyNetwork: "opt-mainnet",
  },
  8453: {
    chain: base,
    logo: "/Base.png",
    alchemyNetwork: "base-mainnet",
  },
  56: {
    chain: bsc,
    logo: "/bsc.png",
    alchemyNetwork: "bnb-mainnet",
  },
  42220: {
    chain: celoMainnet,
    logo: "/cello.png",
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
