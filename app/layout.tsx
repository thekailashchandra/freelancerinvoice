import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { geoConsensus, geoEntity, geoEntityStatement, geoTopics } from "@/data/geo";
import { buildKeywordsString, homeSeo } from "@/data/seo";
import { GooglePrivacyScripts } from "@/components/google-privacy-scripts";
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
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <GooglePrivacyScripts />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
