import { faqItems, homeSeo } from "@/data/seo";
import { siteConfig } from "@/data/site";

type StructuredDataProps = {
  /** Include FAQ schema — use on pages that render the FAQ section. */
  includeFaq?: boolean;
};

export function StructuredData({ includeFaq = false }: StructuredDataProps) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logos.light}`,
    description: siteConfig.description,
    sameAs: [],
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: homeSeo.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/signup`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteConfig.url,
    description: homeSeo.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free freelancer invoice generator with PDF export and cloud storage",
    },
    featureList: [
      "Professional freelancer invoice creation",
      "Live invoice preview",
      "PDF export",
      "Cloud invoice history",
      "Payment status tracking",
      "Custom logo and branding",
      "Multi-currency support",
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Freelancers, independent contractors, and agencies",
    },
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: homeSeo.title,
    description: homeSeo.description,
    url: siteConfig.url,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: {
      "@type": "Thing",
      name: "Freelancer invoicing and billing",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.logos.light}`,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".seo-hero-summary", ".faq-answer"],
    },
  };

  const faqPage = includeFaq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  const graph = [
    { ...webSite, "@id": `${siteConfig.url}/#website` },
    organization,
    softwareApp,
    webPage,
    ...(faqPage ? [faqPage] : []),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
