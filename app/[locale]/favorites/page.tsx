import { Suspense } from "react";
import { getProducts } from "@/services/productService";
import { FavoritesClient } from "./FavoritesClient";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo";
import { BackButton } from "@/components/atoms/BackButton";
import { LanguageSwitcher } from "@/components/organisms/LanguageSwitcher";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

interface FavoritesPageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * Favorites Page
 *
 * Rendering Strategy: SSR (Server-Side Rendering)
 * - Reason: Favorites list is user-specific and changes frequently
 * - Benefits: Always fresh data, personalized experience
 * - Note: Client component handles filtering based on Zustand store
 *
 * Data Fetching: Server-side with client-side filtering
 * - Fetches all products on server (in production, would fetch only favorites)
 * - Client component filters based on normalized favorites state
 * - Uses useMemo for efficient filtering
 */
export async function generateMetadata({
  params,
}: FavoritesPageProps): Promise<ReturnType<typeof generateSEOMetadata>> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return generateSEOMetadata({
    title: dict.favorites.title,
    description: dict.favorites.description,
    keywords: ["favorites", "saved", "products"],
    type: "website",
  });
}

export default async function FavoritesPage({ params }: FavoritesPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // Fetch all products (in production, you'd fetch only favorited ones)
  const { items: allProducts } = await getProducts({ limit: 100 });

  return (
    <>
      <JsonLd
        title={dict.favorites.title}
        description={dict.favorites.description}
        type="website"
        url={`/${locale}/favorites`}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Language Switcher - Fixed position top right */}
        <div className="fixed right-4 top-4 z-50 lg:right-8 lg:top-8">
          <LanguageSwitcher currentLocale={locale} />
        </div>
        <div className="mb-6">
          <BackButton href={`/${locale}`} label={dict.nav.home} variant="secondary" />
        </div>
        <header className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-[#171717]">
            {dict.favorites.title}
          </h1>
          <p className="text-[#6b7280]">
            {dict.favorites.description}
          </p>
        </header>

        <Suspense fallback={<FavoritesLoading />}>
          <FavoritesClient
            allProducts={allProducts}
            dict={dict}
            locale={locale}
          />
        </Suspense>
      </div>
    </>
  );
}

function FavoritesLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-96 animate-pulse rounded-lg bg-[#f3f4f6]"
          aria-label="Loading favorite product"
        />
      ))}
    </div>
  );
}
