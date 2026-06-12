import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid picking up ~/package-lock.json as the monorepo root
    root: process.cwd(),
  },
};

export default nextConfig;
