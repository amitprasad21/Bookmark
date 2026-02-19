import type { NextConfig } from "next";

/**
 * Next.js Configuration
 * 
 * This configuration sets up the Next.js environment for the Smart Bookmark application.
 * Key features:
 * - React strict mode for development
 * - Standalone output for optimized production builds
 * - Environment variable validation
 * - Header configuration for security
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
