import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["aniwatch", "pino", "thread-stream"],
};

export default nextConfig;
