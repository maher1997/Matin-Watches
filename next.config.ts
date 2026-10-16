import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve product photos as AVIF (smallest) with WebP as the fallback.
  images: { formats: ["image/avif", "image/webp"], qualities: [60, 75] },
};

export default nextConfig;
