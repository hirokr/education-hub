import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "robohash.org",
      },
    ],
  },
  typescript: {
    // Prevent build from failing on type errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allow successful builds even if ESLint errors exist
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
