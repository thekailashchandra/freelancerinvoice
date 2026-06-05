import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local dev uses `.next-dev` to avoid stale locked `.next` on Windows; Vercel/production uses `.next`
  distDir:
    process.env.NODE_ENV === "production"
      ? ".next"
      : (process.env.NEXT_DIST_DIR ?? ".next-dev"),
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "date-fns"],
  },
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
