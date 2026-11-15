import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2560, 3840],
    imageSizes: [48, 96, 128, 256, 384],
    qualities: [75, 80, 90, 92],
  },
};

export default nextConfig;
