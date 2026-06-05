import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/signup"],
        disallow: [
          "/dashboard",
          "/create-invoice",
          "/invoice-history",
          "/settings",
          "/onboarding",
          "/create",
          "/history",
          "/api/",
          "/auth/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/login", "/signup"],
        disallow: ["/dashboard", "/api/", "/auth/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/", "/login", "/signup"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
