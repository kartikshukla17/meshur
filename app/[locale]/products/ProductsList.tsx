"use client";

import { memo } from "react";
import { ProductCard } from "@/components/organisms/ProductCard";
import type { Product } from "@/types/models";
import type { Locale } from "@/i18n/config";

interface ProductsListProps {
  products: Product[];
  locale: Locale;
}

/**
 * ProductsList Component
 * Memoized to prevent unnecessary re-renders
 * Only re-renders when products array changes
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
