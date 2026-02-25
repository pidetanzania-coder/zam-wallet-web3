/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use the app URL for assets
  assetPrefix: process.env.NEXT_PUBLIC_APP_URL || "https://zamwallet.xyz",
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
