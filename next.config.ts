import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.5.0.173", "10.5.0.173:3000"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Portrait/screenshots are local; live data comes from JSON APIs only.
  poweredByHeader: false,
};

export default nextConfig;
