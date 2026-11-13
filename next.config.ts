import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // 75 for thumbnails, 90 for the full-screen photo viewer.
  images: { qualities: [75, 90] },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
