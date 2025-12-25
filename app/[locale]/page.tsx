import { Suspense } from "react";
import { getFeaturedProducts, getNewProducts } from "@/services/productService";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo";
import { HomeHero } from "./HomeHero";
import { HomeProducts } from "./HomeProducts";
import { HomeProductsLoading } from "./HomeProductsLoading";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * Home Page
 *
 * Rendering Strategy: SSR (Server-Side Rendering)
 * - Reason: Home page content is dynamic (featured products, new arrivals)
 * - Benefits: Always fresh content, personalized experience, SEO-friendly
 *
 * Data Fetching: Server-side with parallel fetching
 * - Fetches featured and new products in parallel
 * - Uses Suspense for progressive loading
 * - Optimized with code splitting for client components
 */
export async function generateMetadata({
  params,
}: HomePageProps): Promise<ReturnType<typeof generateSEOMetadata>> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return generateSEOMetadata({
    title: dict.home.title,
    description: dict.home.subtitle,
    keywords: ["marketplace", "shopping", "products", "deals", "e-commerce"],
    type: "website",
  });
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // Parallel data fetching for better performance
  const [featuredProducts, newProducts] = await Promise.all([
    getFeaturedProducts(6),
    getNewProducts(6),
  ]);

  return (
    <>
      <JsonLd
        title={dict.seo.siteName}
        description={dict.seo.siteDescription}
        type="website"
        url={`/${locale}`}
      />
      <HomeHero dict={dict} locale={locale} />
      <Suspense fallback={<HomeProductsLoading />}>
        <HomeProducts
          featuredProducts={featuredProducts}
          newProducts={newProducts}
          dict={dict}
          locale={locale}
        />
      </Suspense>
    </>
  );
}
