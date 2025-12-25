"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import { BackButton } from "@/components/atoms/BackButton";
import type { Product } from "@/types/models";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { formatString } from "@/lib/i18n";

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

interface ProductDetailContentProps {
  product: Product;
  dict: Dictionary;
  locale: Locale; // Reserved for future i18n features
}

/**
 * ProductDetailContent Component
 * Memoized to prevent unnecessary re-renders
 * Lazy loads ProductCard for better code splitting
 */
export const ProductDetailContent = memo(function ProductDetailContent({
  product,
  dict,
  locale,
}: ProductDetailContentProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <BackButton
          href={`/${locale}/products`}
          label={dict.product.backToProducts}
          variant="secondary"
        />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <ProductCard
            product={product}
            useStoreFavorites={true}
            onAddToCart={(productId) => {
              console.log("Add to cart:", productId);
            }}
          />
        </div>
        <div>
          <h1 className="mb-4 text-3xl font-bold text-[#171717]">
            {product.title}
          </h1>
          <div className="mb-4 flex items-center gap-4">
            <span className="text-3xl font-bold text-[#171717]">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-[#9ca3af] line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
          <p className="mb-4 text-[#6b7280]">
            {product.description}
          </p>
          <div className="mb-4">
            <p className="text-sm text-[#6b7280]">
              {formatString(
                `${dict.products.rating}: {rating} ({reviewCount} ${dict.products.reviews})`,
                {
                  rating: product.rating.toString(),
                  reviewCount: product.reviewCount.toString(),
                }
              )}
            </p>
            <p className="text-sm text-[#6b7280]">
              {formatString(
                `${dict.products.stock}: {stock} ${dict.products.available}`,
                {
                  stock: product.stock.toString(),
                }
              )}
            </p>
          </div>
          <div className="mb-4">
            <p className="mb-2 font-semibold text-[#171717]">{dict.products.tags}:</p>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#f3f4f6] px-3 py-1 text-sm text-[#171717]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
