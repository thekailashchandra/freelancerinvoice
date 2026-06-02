import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid stale locked `.next` on Windows when multiple dev servers were run
  distDir: process.env.NEXT_DIST_DIR ?? ".next-dev",
  reactStrictMode: true,
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
};

export default nextConfig;
