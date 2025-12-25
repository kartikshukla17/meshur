"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/organisms/ProductCard";
import { useFavoritesStore } from "@/store";
import type { Product } from "@/types/models";
import { Button } from "@/components/atoms/Button";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { formatString } from "@/lib/i18n";

interface FavoritesClientProps {
  allProducts: Product[];
  dict: Dictionary;
  locale: Locale;
}

/**
 * Client component for favorites page
 * Uses Zustand store to filter and display favorite products
 * Demonstrates normalized state usage
 */
export function FavoritesClient({
  allProducts,
  dict,
  locale,
}: FavoritesClientProps) {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const count = useFavoritesStore((state) => state.count);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);

  // Filter products based on normalized favorites state
  const favoriteProducts = useMemo(() => {
    return allProducts.filter((product) => favoriteIds.has(product.id));
  }, [allProducts, favoriteIds]);

  if (count === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="mb-4 h-16 w-16 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h2 className="mb-2 text-2xl font-semibold text-[#171717]">
          {dict.favorites.empty}
        </h2>
        <p className="mb-6 text-[#6b7280]">{dict.favorites.emptyDescription}</p>
        <Button asChild variant="primary">
          <Link href={`/${locale}/products`}>
            {dict.favorites.browseProducts}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[#6b7280]">
          {formatString(dict.favorites.count, {
            count: count,
          })}
        </p>
        <Button variant="secondary" onClick={clearFavorites} size="sm">
          {dict.favorites.clearAll}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favoriteProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale}
            useStoreCart={true}
            useStoreFavorites={true}
          />
        ))}
      </div>
    </>
  );
}
