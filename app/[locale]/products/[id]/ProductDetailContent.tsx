"use client";

import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BackButton } from "@/components/atoms/BackButton";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import type { Product } from "@/types/models";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { formatString } from "@/lib/i18n";
import { useCartStore, useIsInCart, useFavoritesStore, useIsFavorite } from "@/store";
import { LanguageSwitcher } from "@/components/organisms/LanguageSwitcher";
import { cn } from "@/lib/utils";

interface ProductDetailContentProps {
  product: Product;
  dict: Dictionary;
  locale: Locale;
}

/**
 * ProductDetailContent Component
 * Production-grade product detail page with minimal, clean design
 * Follows Meshur design standards with clear information hierarchy
 */
export const ProductDetailContent = memo(function ProductDetailContent({
  product,
  dict,
  locale,
}: ProductDetailContentProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const isInCart = useIsInCart(product.id);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const isFavorite = useIsFavorite(product.id);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  // Use product images array if available, otherwise use single image
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : (product.imageUrl ? [product.imageUrl] : []);
  const currentImage = productImages[selectedImageIndex] || product.imageUrl;

  const handleAddToCart = () => {
    if (isInCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product.id, 1);
    }
  };

  const handleFavorite = () => {
    toggleFavorite(product.id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Language Switcher - Fixed position top right */}
      <div className="fixed right-4 top-4 z-50 lg:right-8 lg:top-8">
        <LanguageSwitcher currentLocale={locale} />
      </div>
      <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton
            href={`/${locale}/products`}
            label={dict.product?.backToProducts || "Back to Products"}
            variant="secondary"
          />
        </div>

        {/* Main Product Section */}
        <div className="mb-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6]">
              <Image
                src={currentImage}
                alt={product.imageAlt || product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                quality={95}
              />
              {/* Badge */}
              {product.badge && (
                <div className="absolute left-4 top-4 z-10">
                  <Badge variant={product.badge.variant} size="sm">
                    {product.badge.text}
                  </Badge>
                </div>
              )}
              {/* Favorite Button */}
              <button
                onClick={handleFavorite}
                className={cn(
                  "absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200",
                  "hover:bg-white hover:scale-110 hover:shadow-md",
                  "focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:ring-offset-2",
                  "active:scale-95",
                  isFavorite && "bg-white shadow-md"
                )}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={isFavorite}
                type="button"
              >
                <svg
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
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
            </div>

            {/* Thumbnail Images (if multiple images) */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                      selectedImageIndex === index
                        ? "border-[#dc2626] ring-2 ring-[#dc2626] ring-offset-2"
                        : "border-[#e5e7eb] hover:border-[#dc2626]"
                    )}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col">
            {/* Category Breadcrumb */}
            <div className="mb-4">
              <Link
                href={`/${locale}/products?category=${product.category.slug}`}
                className="text-sm font-medium text-[#6b7280] hover:text-[#dc2626] transition-colors"
              >
                {product.category.name}
              </Link>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold leading-tight text-[#171717] lg:text-4xl">
              {product.title}
            </h1>

            {/* Rating & Reviews */}
            {product.rating && (
              <div className="mb-6 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <svg
                    className="h-5 w-5 fill-[#fbbf24] text-[#fbbf24]"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-lg font-semibold text-[#171717]">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                {product.reviewCount > 0 && (
                  <span className="text-sm text-[#6b7280]">
                    ({product.reviewCount} {dict.products?.reviews || "reviews"})
                  </span>
                )}
                <div className="h-4 w-px bg-[#e5e7eb]" />
                <span className="text-sm font-medium text-[#10b981]">
                  {product.stock > 0
                    ? `${dict.product?.inStock || "In Stock"}`
                    : `${dict.product?.outOfStock || "Out of Stock"}`}
                </span>
              </div>
            )}

            {/* Price Section */}
            <div className="mb-6 border-b border-[#e5e7eb] pb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-[#171717]">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl font-medium text-[#9ca3af] line-through">
                      {product.originalPrice}
                    </span>
                    {product.discountPercentage && (
                      <span className="rounded-full bg-[#fee2e2] px-3 py-1 text-sm font-semibold text-[#dc2626]">
                        -{product.discountPercentage}%
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-semibold text-[#171717]">
                {dict.product?.description || "Description"}
              </h2>
              <p className="leading-relaxed text-[#6b7280]">
                {product.description}
              </p>
            </div>

            {/* Seller Information */}
            {product.seller && (
              <div className="mb-8 flex items-center gap-3 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4">
                {product.seller.avatar && (
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={product.seller.avatar}
                      alt={product.seller.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-[#6b7280]">
                    {dict.product?.soldBy || "Sold by"}
                  </p>
                  <p className="font-semibold text-[#171717]">
                    {product.seller.name}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mb-8 space-y-3">
              <Button
                variant={isInCart ? "secondary" : "primary"}
                size="lg"
                onClick={handleAddToCart}
                className="w-full"
                aria-label={
                  isInCart
                    ? `Remove ${product.title} from cart`
                    : `Add ${product.title} to cart`
                }
              >
                {isInCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5"
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
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5"
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
                )}
              </Button>
            </div>

            {/* Product Details */}
            <div className="space-y-4 border-t border-[#e5e7eb] pt-6">
              {/* Stock */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#6b7280]">
                  {dict.products?.stock || "Stock"}
                </span>
                <span className="font-semibold text-[#171717]">
                  {product.stock} {dict.products?.available || "available"}
                </span>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-[#6b7280]">
                    {dict.products?.tags || "Tags"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/${locale}/products?search=${encodeURIComponent(tag)}`}
                        className="rounded-full bg-[#f3f4f6] px-3 py-1.5 text-sm font-medium text-[#171717] transition-colors hover:bg-[#dc2626] hover:text-white"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
