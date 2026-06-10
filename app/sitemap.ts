import type { MetadataRoute } from "next";
import { getRouteLastModified, publicRoutes } from "@/data/seo";
import { siteConfig } from "@/data/site";
import { METADATA_ROUTE_ISR_SECONDS } from "@/lib/cache-config";

export const revalidate = METADATA_ROUTE_ISR_SECONDS;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path === "/" ? "" : route.path}`,
    lastModified: getRouteLastModified(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
