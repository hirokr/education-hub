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
    ignoreBuildErrors: false, // Keep as-is for catching errors early
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Ignore restricted directories to prevent EPERM errors
    config.watchOptions = {
      ignored: ["**/Cookies/**", "**/Application Data/**"],
    };

    // Add a fallback for the `client` property in FlightClientEntryPlugin
    config.plugins.forEach((plugin) => {
      if (plugin.constructor.name === "FlightClientEntryPlugin") {
        const originalCreateActionAssets = plugin.createActionAssets;
        plugin.createActionAssets = function (...args) {
          if (!this.client) {
            this.client = {}; // Provide a fallback to avoid undefined errors
          }
          return originalCreateActionAssets?.apply(this, args);
        };
      }
    });

    return config;
  },
};

export default nextConfig;
