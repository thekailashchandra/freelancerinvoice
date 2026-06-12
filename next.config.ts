import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local dev uses `.next-dev` to avoid stale locked `.next` on Windows; Vercel/production uses `.next`
  distDir:
    process.env.NODE_ENV === "production"
      ? ".next"
      : (process.env.NEXT_DIST_DIR ?? ".next-dev"),
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  // Ensure jspdf/html2canvas are compiled for the browser bundle
  transpilePackages: ["jspdf", "html2canvas"],
  webpack: (config, { dev, isServer }) => {
    // Avoid corrupted persistent webpack cache on Windows dev (undefined module .call errors).
    if (dev) {
      config.cache = { type: "memory" };
    }

    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        html2canvas: false,
        jspdf: false,
      };
    }
    return config;
  },
  async headers() {
    const staticCacheControl =
      process.env.NODE_ENV === "production"
        ? "public, max-age=31536000, immutable"
        : "no-store, no-cache, must-revalidate";

    return [
      {
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/icon.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon-48.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon-96.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: staticCacheControl,
          },
        ],
      },
      {
        source: "/dev-build.json",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: staticCacheControl,
          },
        ],
      },
      {
        source: "/llms.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/llms-full.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/consensus.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
