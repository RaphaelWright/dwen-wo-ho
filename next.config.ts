import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ["jotai"],
  },
  transpilePackages: ["jotai", "@emoji-mart/react", "@emoji-mart/data"],
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-35fc99d1cb2b4cc1b75216788a3543fb.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-f9f7d99a5b7c4d858a673d96aea96e13.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://justgo.up.railway.app"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
