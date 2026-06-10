import type { MetadataRoute } from "next";
import { getRouteLastModified, publicRoutes } from "@/data/seo";
import { siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path === "/" ? "" : route.path}`,
    lastModified: getRouteLastModified(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
