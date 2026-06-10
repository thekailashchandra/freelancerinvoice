/**
 * Static generation & ISR windows for technical SEO.
 * Marketing surfaces: SSG + ISR. App workspace: force-dynamic (client-heavy).
 *
 * NOTE: Route files must use the literal `export const revalidate = 86400`
 * (Next.js does not accept imported identifiers in segment config).
 */

/** Landing pages, hubs, templates — revalidate daily. */
export const MARKETING_ISR_SECONDS = 86_400;

/** Blog articles and guides — revalidate daily. */
export const CONTENT_ISR_SECONDS = 86_400;

/** Sitemap, robots, llms.txt — revalidate daily. */
export const METADATA_ROUTE_ISR_SECONDS = 86_400;
