import type { Metadata } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "@account-kit/core";
import { config } from "@/config";
import { Providers } from "./providers";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ui/ServiceWorkerRegistration";

export const metadata: Metadata = {
  metadataBase: new URL("https://zamwallet.io"),
  title: {
    default: "Zam Wallet - Secure Web3 Wallet",
    template: "%s | Zam Wallet",
  },
  description:
    "Store, send, and manage your crypto assets securely with Zam Wallet. Non-custodial smart wallet with multi-chain support, instant swaps, and staking.",
  keywords: [
    "web3 wallet",
    "crypto wallet",
    "ethereum wallet",
    "polygon wallet",
    "smart wallet",
    "nft wallet",
    "defi",
    "staking",
    "zamd",
    " zam wallet",
  ],
  authors: [{ name: "Zam Wallet Team" }],
  creator: "Zam Wallet",
  publisher: "Zam Wallet",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zamwallet.io",
    siteName: "Zam Wallet",
    title: "Zam Wallet - Secure Web3 Wallet",
    description:
      "Store, send, and manage your crypto securely with Zam Wallet. Non-custodial smart wallet with multi-chain support.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zam Wallet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zam Wallet - Secure Web3 Wallet",
    description:
      "Store, send, and manage your crypto securely with Zam Wallet. Non-custodial smart wallet with multi-chain support.",
    creator: "@zamwallet",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(
    config,
    headers().get("cookie") ?? undefined
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        {/* Chatwoot Widget */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(d,t) {
                var BASE_URL="https://app.chatwoot.com";
                var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
                g.src=BASE_URL+"/packs/js/sdk.js";
                g.defer=true;
                g.async=true;
                s.parentNode.insertBefore(g,s);
                g.onload=function(){
                  window.chatwootSettings={
                    "position":"bottom-right",
                    "type":"standard",
                    "launcherTitle":"Chat with us",
                    "websiteToken":"154183",
                    "locale":"en",
                    "mainColor":"#007bff"
                  };
                  window.chatwootSDK.run({
                    websiteToken: '154183',
                    baseUrl: BASE_URL
                  });
                }
              })(document,"script");
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] antialiased">
        <ServiceWorkerRegistration />
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
