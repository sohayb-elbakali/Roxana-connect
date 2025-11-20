import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    // Allow production builds even with TypeScript errors (for migration)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
