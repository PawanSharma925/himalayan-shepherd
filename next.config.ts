import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    imageSizes: [48, 96, 128, 256, 384],
    qualities: [65, 75, 80],
  },
};

export default nextConfig;
