import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { geoConsensus, geoEntity, geoEntityStatement, geoTopics } from "@/data/geo";
import { buildKeywordsString, homeSeo } from "@/data/seo";
import { GoogleAnalytics } from "@/components/google-analytics";
import { UmamiAnalytics } from "@/components/umami-analytics";
import { GoogleAnalyticsPageView } from "@/components/google-analytics-page-view";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { LocaleProvider } from "@/components/locale-provider";
import { GooglePrivacyScripts } from "@/components/google-privacy-scripts";
import { DevEarlyGuards } from "@/components/dev-early-guards";
import { readDevBuildId } from "@/lib/dev-build";
import { geistMono, geistSans } from "@/lib/fonts";
import { siteConfig } from "@/data/site";
import "./globals.css";

const favicon48 = `${siteConfig.url}/favicon-48.png`;
const favicon96 = `${siteConfig.url}/favicon-96.png`;
const faviconIco = `${siteConfig.url}/favicon.ico`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: homeSeo.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: homeSeo.description,
  keywords: buildKeywordsString(),
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Business",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: homeSeo.ogTitle,
    description: homeSeo.ogDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: homeSeo.ogTitle,
    description: homeSeo.ogDescription,
  },
  icons: {
    icon: [
      { url: favicon48, type: "image/png", sizes: "48x48" },
      { url: favicon96, type: "image/png", sizes: "96x96" },
      { url: faviconIco, sizes: "any" },
    ],
    shortcut: [{ url: faviconIco }],
    apple: [{ url: `${siteConfig.url}/apple-icon`, type: "image/png", sizes: "180x180" }],
  },
  other: {
    "ai-content-declaration": "human-authored",
    "ai-purpose": geoEntity.elevatorPitch,
    "ai-audience": geoEntity.primaryAudience,
    "abstract": geoEntity.oneLineSummary,
    "topic": geoTopics.join(", "),
    "gemini-topic": "freelancer invoicing, freelance billing, invoice generator",
    "llms-txt": `${siteConfig.url}/llms.txt`,
    "consensus-brand": geoConsensus.brandName,
    "consensus-url": geoConsensus.canonicalUrl,
    "consensus-category": geoConsensus.productCategory,
    "entity-statement": geoEntityStatement,
    "consensus-citation": geoConsensus.citationOneLiner,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const devBuildId = readDevBuildId();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Google Search reads favicon from the home page — 48×48 PNG + ICO */}
        <link rel="icon" type="image/png" href={favicon48} sizes="48x48" />
        <link rel="icon" type="image/png" href={favicon96} sizes="96x96" />
        <link rel="icon" href={faviconIco} sizes="any" />
        <link rel="shortcut icon" href={faviconIco} />
        <link rel="apple-touch-icon" href={`${siteConfig.url}/apple-icon`} sizes="180x180" />
        <link
          rel="alternate"
          type="text/plain"
          href={`${siteConfig.url}/llms.txt`}
          title="LLM site summary"
        />
        <link
          rel="alternate"
          type="text/plain"
          href={`${siteConfig.url}/consensus.txt`}
          title="Brand consensus block for directories"
        />
        <DevEarlyGuards buildId={devBuildId} />
        <GoogleAnalytics />
        <UmamiAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <LocaleProvider>
          <Suspense fallback={null}>
            <GoogleAnalyticsPageView />
          </Suspense>
          <GooglePrivacyScripts />
          <CookieConsentBanner />
          {children}
          <Toaster richColors position="top-center" closeButton />
        </LocaleProvider>
      </body>
    </html>
  );
}
