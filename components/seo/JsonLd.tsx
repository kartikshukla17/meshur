import type { SEOConfig } from "@/lib/seo";
import { generateJsonLd } from "@/lib/seo";

interface JsonLdProps extends SEOConfig {
  schemaType?: string;
}

/**
 * JSON-LD structured data component for SEO
 * Renders schema.org compliant structured data
 */
export function JsonLd(props: JsonLdProps) {
  const jsonLd = generateJsonLd(props);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
