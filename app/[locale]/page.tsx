import { Suspense } from "react";
import { getFeaturedProducts, getNewProducts } from "@/services/productService";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo";
import { HomeHero } from "./HomeHero";
import { HomeProducts } from "./HomeProducts";
import { HomeProductsLoading } from "./HomeProductsLoading";
import { LanguageSwitcher } from "@/components/organisms/LanguageSwitcher";
import { DarkModeToggle } from "@/components/atoms/DarkModeToggle";
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
      {/* Language Switcher and Theme Toggle - Fixed position top right */}
      <div className="fixed right-4 top-4 z-50 flex items-center gap-3 lg:right-8 lg:top-8">
        <DarkModeToggle />
        <LanguageSwitcher currentLocale={locale} />
      </div>
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
