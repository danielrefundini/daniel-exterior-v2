import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  // Safety net for the canonical host. The host (Vercel domain settings) already sends the apex to www
  // with a 308; this keeps that true if the project or domain setup ever changes. See README.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "danielrefundini.com" }],
        destination: "https://www.danielrefundini.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
