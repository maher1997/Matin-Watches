import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product photos as WebP only. AVIF files are a little smaller, but an
  // iPhone takes much longer to unpack each one, and unpacking them as they
  // scrolled into view made scrolling on phones feel laggy.
  images: { formats: ["image/webp"], qualities: [60, 75] },
  // The old combined help page now lives on separate pages.
  async redirects() {
    return [{ source: "/help", destination: "/shipping", permanent: true }];
  },
};

export default nextConfig;
