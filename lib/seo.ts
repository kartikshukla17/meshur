import type { Metadata } from "next";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  siteName?: string;
  locale?: string;
  alternateLocales?: string[];
}

const defaultConfig: Partial<SEOConfig> = {
  siteName: "Meshur Marketplace",
  author: "Meshur",
  locale: "en_US",
  type: "website",
  image: "/og-image.jpg",
};

/**
 * Generate comprehensive metadata for Next.js pages
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    author = defaultConfig.author,
    image = defaultConfig.image,
    url,
    type = defaultConfig.type,
    publishedTime,
    modifiedTime,
    siteName = defaultConfig.siteName,
    locale = defaultConfig.locale,
  } = config;

  const fullTitle = `${title} | ${siteName}`;
  const imageUrl = image?.startsWith("http")
    ? image
    : `${process.env.NEXT_PUBLIC_SITE_URL || "https://meshur.co"}${image}`;
  const pageUrl =
    url || process.env.NEXT_PUBLIC_SITE_URL || "https://meshur.co";

  return {
    title: {
      default: fullTitle,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : undefined,
    creator: author,
    publisher: siteName,
    metadataBase: new URL(pageUrl),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type: type === "product" ? "website" : type, // OpenGraph doesn't support "product"
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: author ? `@${author}` : undefined,
    },
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
  };
}

/**
 * Generate JSON-LD structured data
 */
export function generateJsonLd(config: SEOConfig & { schemaType?: string }) {
  const {
    title,
    description,
    url,
    image,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    schemaType,
  } = config;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meshur.co";
  const imageUrl = image?.startsWith("http") ? image : `${baseUrl}${image}`;
  const pageUrl = url || baseUrl;

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": schemaType || (type === "product" ? "Product" : "WebPage"),
    name: title,
    description,
    url: pageUrl,
    ...(image && { image: imageUrl }),
    ...(author && { author: { "@type": "Person", name: author } }),
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
  };

  if (type === "product") {
    return {
      ...baseSchema,
      "@type": "Product",
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
      },
    };
  }

  if (type === "article") {
    return {
      ...baseSchema,
      "@type": "Article",
      headline: title,
      ...(publishedTime && { datePublished: publishedTime }),
      ...(modifiedTime && { dateModified: modifiedTime }),
    };
  }

  return {
    ...baseSchema,
    "@type": "WebPage",
    mainEntity: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  };
}
