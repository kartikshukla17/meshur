"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import type { Product } from "@/types/models";
import { Button } from "@/components/atoms/Button";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

// Lazy load ProductCard for code splitting
const ProductCard = dynamic(
  () =>
    import("@/components/organisms/ProductCard").then((mod) => mod.ProductCard),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-lg bg-[#f3f4f6]" />
    ),
    ssr: true,
  }
);

interface HomeProductsProps {
  featuredProducts: Product[];
  newProducts: Product[];
  dict: Dictionary;
  locale: Locale;
}

/**
 * HomeProducts Component
 * Memoized to prevent unnecessary re-renders
 * Lazy loads ProductCard for better code splitting
 */
export const HomeProducts = memo(function HomeProducts({
  featuredProducts,
  newProducts,
  dict,
  locale,
}: HomeProductsProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="mb-16" aria-labelledby="featured-heading">
          <div className="mb-8 flex items-center justify-between">
            <h2
              id="featured-heading"
              className="text-3xl font-bold text-[#171717]"
            >
              {dict.home.featuredProducts}
            </h2>
            <Button asChild variant="secondary" href={`/${locale}/products`}>
              {dict.home.viewAll}
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                useStoreCart={true}
                useStoreFavorites={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* New Products Section */}
      {newProducts.length > 0 && (
        <section aria-labelledby="new-heading">
          <div className="mb-8 flex items-center justify-between">
            <h2 id="new-heading" className="text-3xl font-bold text-[#171717]">
              {dict.home.newArrivals}
            </h2>
            <Button
              asChild
              variant="secondary"
              href={`/${locale}/products?sortBy=newest`}
            >
              {dict.home.viewAll}
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                useStoreCart={true}
                useStoreFavorites={true}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
});
