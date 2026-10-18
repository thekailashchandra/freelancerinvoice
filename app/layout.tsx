import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { geoConsensus, geoEntity, geoEntityStatement } from "@/data/geo";
import { homePageKeywords, homePageTopics } from "@/data/page-keywords";
import { homeSeo } from "@/data/seo";
import { GoogleAnalytics } from "@/components/google-analytics";
import { UmamiAnalytics } from "@/components/umami-analytics";
import { GoogleAnalyticsPageView } from "@/components/google-analytics-page-view";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { LocaleProvider } from "@/components/locale-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { GooglePrivacyScripts } from "@/components/google-privacy-scripts";
import { DevEarlyGuards } from "@/components/dev-early-guards";
import { readDevBuildId } from "@/lib/dev-build";
import { geistMono, geistSans } from "@/lib/fonts";
import { siteConfig, absoluteSiteUrl } from "@/data/site";
import "./globals.css";

const favicon48 = absoluteSiteUrl(siteConfig.icons.favicon48);
const favicon96 = absoluteSiteUrl(siteConfig.icons.favicon96);
const faviconIco = absoluteSiteUrl(siteConfig.icons.faviconIco);
const ogImage = `${siteConfig.url}/opengraph-image`;

const googleSiteVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: homeSeo.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: homeSeo.description,
  keywords: homePageKeywords.join(", "),
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
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
  openGraph: {
    title: homeSeo.ogTitle,
    description: homeSeo.ogDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - free invoice generator for freelancers`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeSeo.ogTitle,
    description: homeSeo.ogDescription,
    images: [ogImage],
  },
  icons: {
    icon: [
      { url: faviconIco, sizes: "any" },
      { url: favicon48, type: "image/png", sizes: "48x48" },
      { url: favicon96, type: "image/png", sizes: "96x96" },
      { url: absoluteSiteUrl(siteConfig.icons.app192), type: "image/png", sizes: "192x192" },
    ],
    shortcut: [{ url: faviconIco }],
    apple: [{ url: `${siteConfig.url}/apple-icon`, type: "image/png", sizes: "180x180" }],
  },
  other: {
    "ai-content-declaration": "human-authored",
    "ai-purpose": geoEntity.elevatorPitch,
    "ai-audience": geoEntity.primaryAudience,
    "abstract": geoEntity.oneLineSummary,
    "topic": homePageTopics.join(", "),
    "gemini-topic": homePageTopics.slice(0, 4).join(", "),
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const devBuildId = readDevBuildId();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Search reads favicon from the home page - ICO + 48×48 PNG */}
        <link rel="icon" href={faviconIco} sizes="any" />
        <link rel="icon" type="image/png" href={favicon48} sizes="48x48" />
        <link rel="icon" type="image/png" href={favicon96} sizes="96x96" />
        <link rel="icon" type="image/png" href={absoluteSiteUrl(siteConfig.icons.app192)} sizes="192x192" />
        <link rel="shortcut icon" href={faviconIco} />
        <link rel="apple-touch-icon" href={`${siteConfig.url}/apple-icon`} sizes="180x180" />
        <link rel="manifest" href={`${siteConfig.url}/manifest.webmanifest`} />
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LocaleProvider>
            <Suspense fallback={null}>
              <GoogleAnalyticsPageView />
            </Suspense>
            <GooglePrivacyScripts />
            <CookieConsentBanner />
            {children}
            <Toaster position="top-center" closeButton />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
