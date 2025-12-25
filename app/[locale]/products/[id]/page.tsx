import { notFound } from "next/navigation";
import { getProductById } from "@/services/productService";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo";
import { ProductDetailContent } from "./ProductDetailContent";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

interface ProductPageProps {
  params: Promise<{ id: string; locale: Locale }>;
}

/**
 * Product Detail Page
 *
 * Rendering Strategy: ISR (Incremental Static Regeneration)
 * - Revalidates every 300 seconds (5 minutes)
 * - Reason: Product details change less frequently than listings
 * - Benefits: Fast page loads, SEO-friendly, reduced API calls
 *
 * Data Fetching: Server-side with static generation
 * - Generates static pages at build time
 * - Revalidates on-demand or after revalidate period
 * - Falls back to 404 for non-existent products
 */
export const revalidate = 300; // Revalidate every 5 minutes

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<ReturnType<typeof generateSEOMetadata>> {
  const { id, locale } = await params;
  const dict = await getDictionary(locale);
  const product = await getProductById(id).catch(() => null);

  if (!product) {
    return generateSEOMetadata({
      title: dict.product.notFound,
      description: dict.product.notFoundDescription,
    });
  }

  return generateSEOMetadata({
    title: product.title,
    description: product.description,
    keywords: product.tags,
    type: "product",
    image: product.imageUrl,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id, locale } = await params;
  const dict = await getDictionary(locale);
  const product = await getProductById(id).catch(() => null);

  if (!product) {
    notFound();
  }

  return (
    <>
      <JsonLd
        title={product.title}
        description={product.description}
        type="product"
        schemaType="Product"
        url={`/${locale}/products/${product.id}`}
        image={product.imageUrl}
      />
      <ProductDetailContent product={product} dict={dict} locale={locale} />
    </>
  );
}
