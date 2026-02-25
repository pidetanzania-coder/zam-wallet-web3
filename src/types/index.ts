// Extend the Window interface to include OneSignal
declare global {
  interface Window {
    OneSignal?: {
      init: (options: {
        appId: string;
        allowLocalhostAsSecureOrigin?: boolean;
        welcomeNotification?: {
          disable: boolean;
          title?: string;
          message?: string;
        };
      }) => Promise<void>;
      Notifications: {
        permission: "default" | "granted" | "denied";
        requestPermission: () => Promise<"granted" | "denied">;
      };
      User: {
        addAlias: (label: string, id: string) => Promise<void>;
        remove: () => Promise<void>;
      };
      setDefaultNotificationUrl: (url: string) => Promise<void>;
      setDefaultTitle: (title: string) => Promise<void>;
    };
  }
}

export interface TokenBalance {
  contractAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceFormatted: string;
  logo: string | null;
  priceUsd: number | null;
  valueUsd: number | null;
  change24h: number | null;
}

export interface NativeBalance {
  symbol: string;
  name: string;
  balance: string;
  balanceFormatted: string;
  logo: string;
  priceUsd: number | null;
  valueUsd: number | null;
  change24h: number | null;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  asset: string;
  category: string;
  blockNum: string;
  timestamp?: string;
  direction: "in" | "out";
}

export interface StakingPosition {
  id: string;
  token: string;
  amount: number;
  startDate: Date;
  lockPeriod: number; // in days
  apy: number;
  earned: number;
}
