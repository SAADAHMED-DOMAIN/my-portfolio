import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  compress: true,
  allowedDevOrigins: ["10.96.22.33"],
};

export default nextConfig;