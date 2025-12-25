"use client";

import { memo, useCallback } from "react";
import type { HTMLAttributes } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/models";
import {
  useFavoritesStore,
  useIsFavorite,
  useCartStore,
  useIsInCart,
} from "@/store";

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  product: Product;
  onAddToCart?: (productId: string) => void;
  isInCart?: boolean; // Deprecated: use useStoreCart instead
  // Optional: allow external cart control, otherwise uses store
  useStoreCart?: boolean;
  // Optional: allow external favorite control, otherwise uses store
  useStoreFavorites?: boolean;
  locale?: string;
}

/**
 * ProductCard Organism Component
 *
 * Design Philosophy:
 * - Minimal yet effective: Focus on essential information
 * - User empathy: Clear hierarchy, intuitive interactions, visual feedback
 * - Aesthetic: Clean spacing, refined typography, subtle animations
 *
 * Performance Optimizations:
 * - Memoized to prevent unnecessary re-renders
 * - Uses useCallback for event handlers
 * - Optimized Image component with proper sizing
 * - Lazy loading for images below the fold
 */
function ProductCardComponent({
  product,
  onAddToCart,
  isInCart = false,
  useStoreCart = true,
  useStoreFavorites = true,
  locale = "en",
  className,
  ...props
}: ProductCardProps) {
  const storeIsFavorite = useIsFavorite(product.id);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const storeIsInCart = useIsInCart(product.id);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const isFavorite = useStoreFavorites ? storeIsFavorite : false;
  const inCart = useStoreCart ? storeIsInCart : isInCart;

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (useStoreCart) {
        // Use store to add to cart
        addToCart(product.id, 1);
      } else {
        // Use callback if provided
        onAddToCart?.(product.id);
      }
    },
    [useStoreCart, addToCart, onAddToCart, product.id]
  );

  const handleRemoveFromCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (useStoreCart) {
        // Use store to remove from cart
        removeFromCart(product.id);
      }
    },
    [useStoreCart, removeFromCart, product.id]
  );

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (useStoreFavorites) {
        toggleFavorite(product.id);
      }
    },
    [useStoreFavorites, toggleFavorite, product.id]
  );

  const productUrl = `/${locale}/products/${product.id}`;

  return (
    <Card
      variant="elevated"
      className={cn(
        "group relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl",
        className
      )}
      {...props}
    >
      {/* Image Container with Overlay */}
      <Link
        href={productUrl}
        className="relative block aspect-square w-full overflow-hidden bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6]"
      >
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          quality={90}
        />
        {/* Subtle overlay on hover for better focus */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/5" />

        {/* Badge - Top Left */}
        {product.badge && (
          <div className="absolute left-3 top-3 z-10">
            <Badge variant={product.badge.variant} size="sm">
              {product.badge.text}
            </Badge>
          </div>
        )}

        {/* Favorite Button - Top Right */}
        {useStoreFavorites && (
          <button
            onClick={handleFavorite}
            className={cn(
              "absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200",
              "hover:bg-white hover:scale-110 hover:shadow-md",
              "focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:ring-offset-2",
              "active:scale-95",
              isFavorite && "bg-white shadow-md"
            )}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            aria-pressed={isFavorite}
            type="button"
          >
            <svg
              className={cn(
                "h-4 w-4 transition-all duration-200",
                isFavorite
                  ? "fill-[#dc2626] text-[#dc2626] scale-110"
                  : "fill-transparent text-[#6b7280] stroke-2"
              )}
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={isFavorite ? 0 : 2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}

        {/* Rating Display - Bottom Left (if available) */}
        {product.rating && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 shadow-sm">
            <svg
              className="h-3.5 w-3.5 fill-[#fbbf24] text-[#fbbf24]"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-semibold text-[#171717]">
              {product.rating.toFixed(1)}
            </span>
            {product.reviewCount && (
              <span className="text-xs text-[#6b7280]">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <Link href={productUrl}>
          <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-[#171717] transition-colors hover:text-[#dc2626]">
            {product.title}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="mb-4 mt-auto flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#171717]">
            {product.price}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-sm font-medium text-[#9ca3af] line-through">
                {product.originalPrice}
              </span>
              {product.discountPercentage && (
                <span className="ml-auto rounded-full bg-[#fee2e2] px-2 py-0.5 text-xs font-semibold text-[#dc2626]">
                  -{product.discountPercentage}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Action Button */}
        {(onAddToCart || useStoreCart) && (
          <>
            {inCart ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRemoveFromCart}
                className="w-full"
                aria-label={`Remove ${product.title} from cart`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Remove from Cart
                </span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddToCart}
                className="w-full"
                aria-label={`Add ${product.title} to cart`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </span>
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

// Memoize component to prevent unnecessary re-renders
// Only re-renders when product, cart state, or favorites state changes
export const ProductCard = memo(
  ProductCardComponent,
  (prevProps, nextProps) => {
    // Custom comparison function for better memoization
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.product.imageUrl === nextProps.product.imageUrl &&
      prevProps.isInCart === nextProps.isInCart &&
      prevProps.useStoreCart === nextProps.useStoreCart &&
      prevProps.useStoreFavorites === nextProps.useStoreFavorites
    );
  }
);
