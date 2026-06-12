import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.initials,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#FFE500",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/favicon-48.png", sizes: "48x48", type: "image/png", purpose: "any" },
      { src: "/favicon-96.png", sizes: "96x96", type: "image/png", purpose: "any" },
    ],
  };
}
