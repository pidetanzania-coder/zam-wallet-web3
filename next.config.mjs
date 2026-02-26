/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use the app URL for assets
  assetPrefix: process.env.NEXT_PUBLIC_APP_URL || "https://zamwallet.io",
  // Cache busting - disable caching for all assets
  headers: async () => [
    {
      source: "/:all*(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        },
      ],
    },
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "https", hostname: "cryptologos.cc" },
      { protocol: "https", hostname: "assets.coingecko.com" },
      { protocol: "https", hostname: "ipfs.io" },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      os: false,
      path: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
    };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
