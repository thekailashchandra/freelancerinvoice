import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { buildKeywordsString, homeSeo } from "@/data/seo";
import { GooglePrivacyScripts } from "@/components/google-privacy-scripts";
import { siteConfig } from "@/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    images: [
      {
        url: siteConfig.logos.light,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — invoice generator for freelancers`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeSeo.ogTitle,
    description: homeSeo.ogDescription,
    images: [siteConfig.logos.light],
  },
  icons: {
    icon: [
      { url: "/brand/logo-dark.png", media: "(prefers-color-scheme: dark)" },
      { url: "/brand/logo-light.png", media: "(prefers-color-scheme: light)" },
    ],
    apple: "/brand/logo-light.png",
  },
  other: {
    "ai-content-declaration": "human-authored",
    "gemini-topic": "freelancer invoicing, freelance billing, invoice generator",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GooglePrivacyScripts />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              className: "glass rounded-xl",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
