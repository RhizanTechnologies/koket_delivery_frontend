import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Set the root for output file tracing to this directory
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "backend.koket-bakery.com",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "backend.koket-bakery.com",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
  // Ensure trailing slashes for static hosting
  trailingSlash: true,
  // Disable server-side features for static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
