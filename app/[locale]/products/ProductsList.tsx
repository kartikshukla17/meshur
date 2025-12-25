"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import type { Product } from "@/types/models";
import type { Locale } from "@/i18n/config";

// Lazy load ProductCard for code splitting
// This reduces the initial bundle size for the products listing page
const ProductCard = dynamic(
  () =>
    import("@/components/organisms/ProductCard").then((mod) => mod.ProductCard),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-lg bg-[#f3f4f6]" />
    ),
    ssr: true, // Still render on server for SEO
  }
);

interface ProductsListProps {
  products: Product[];
  locale: Locale;
}

/**
 * ProductsList Component
 *
 * Performance Optimizations:
 * - Memoized to prevent unnecessary re-renders
 * - Only re-renders when products array changes
 * - Uses dynamic import for ProductCard (code splitting)
 * - Lazy loads ProductCard component to reduce initial bundle size
 */
export const ProductsList = memo(function ProductsList({
  products,
  locale,
}: ProductsListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          useStoreCart={true}
          useStoreFavorites={true}
        />
      ))}
    </div>
  );
});
