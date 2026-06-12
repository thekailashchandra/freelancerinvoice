import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { geoConsensus, geoEntity, geoEntityStatement, geoTopics } from "@/data/geo";
import { buildKeywordsString, homeSeo } from "@/data/seo";
import { GooglePrivacyScripts } from "@/components/google-privacy-scripts";
import { DevEarlyGuards } from "@/components/dev-early-guards";
import { readDevBuildId } from "@/lib/dev-build";
import { geistMono, geistSans } from "@/lib/fonts";
import { siteConfig } from "@/data/site";
import "./globals.css";

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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <GooglePrivacyScripts />
        {children}
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}
