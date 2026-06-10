/**
 * Static generation & ISR windows for technical SEO.
 * Marketing surfaces: SSG + ISR. App workspace: force-dynamic (client-heavy).
 */

/** Landing pages, hubs, templates — revalidate daily. */
export const MARKETING_ISR_SECONDS = 86_400;

/** Blog articles and guides — revalidate daily. */
export const CONTENT_ISR_SECONDS = 86_400;

/** Sitemap, robots, llms.txt — revalidate daily. */
export const METADATA_ROUTE_ISR_SECONDS = 86_400;
