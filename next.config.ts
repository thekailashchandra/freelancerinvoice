import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
  },
  // Ensure jspdf/html2canvas are compiled for the browser bundle
  transpilePackages: ["jspdf", "html2canvas"],
};

export default nextConfig;
