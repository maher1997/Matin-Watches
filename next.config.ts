import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve product photos as AVIF (smallest) with WebP as the fallback.
  images: { formats: ["image/avif", "image/webp"], qualities: [60, 75] },
  // The old combined help page now lives on separate pages.
  async redirects() {
    return [{ source: "/help", destination: "/shipping", permanent: true }];
  },
};

export default nextConfig;
