import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"],
  },
  // this is to ignore eslint errors during build to avoid breaking the build because of typescript errors. 
  // This is NOT RECOMMENDED for production, but it's fine for hackathons.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
