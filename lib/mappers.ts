/**
 * Data mapping utilities
 * Transform API responses to UI-ready models
 */

import type { ApiProduct, ApiCategory } from "@/types/api";
import type { Product, Category } from "@/types/models";
import {
  formatPrice,
  calculateDiscountedPrice,
  truncateText,
} from "./formatters";

/**
 * Map API product to UI product model
 */
export function mapProduct(apiProduct: ApiProduct): Product {
  const hasDiscount = !!apiProduct.discount;
  const discountPercentage = apiProduct.discount?.percentage;
  const finalPrice = hasDiscount
    ? calculateDiscountedPrice(apiProduct.price, discountPercentage || 0)
    : apiProduct.price;

  // Determine badge
  let badge: Product["badge"];
  if (apiProduct.isNew) {
    badge = { text: "New", variant: "success" };
  } else if (hasDiscount && discountPercentage) {
    badge = { text: `${discountPercentage}% Off`, variant: "error" };
  } else if (apiProduct.isFeatured) {
    badge = { text: "Featured", variant: "info" };
  }

  return {
    id: apiProduct.id,
    title: apiProduct.title,
    description: truncateText(apiProduct.description, 150),
    price: formatPrice(finalPrice, apiProduct.currency),
    originalPrice: hasDiscount
      ? formatPrice(apiProduct.price, apiProduct.currency)
      : undefined,
    imageUrl: apiProduct.images[0] || "/placeholder-product.jpg",
    imageAlt: `${apiProduct.title} product image`,
    category: {
      id: apiProduct.category.id,
      name: apiProduct.category.name,
      slug: apiProduct.category.slug,
    },
    seller: {
      id: apiProduct.seller.id,
      name: apiProduct.seller.name,
      avatar: apiProduct.seller.avatar || undefined,
    },
    stock: apiProduct.stock,
    rating: apiProduct.rating,
    reviewCount: apiProduct.reviewCount,
    tags: apiProduct.tags,
    badge,
    isNew: apiProduct.isNew || false,
    isFeatured: apiProduct.isFeatured || false,
    hasDiscount,
    discountPercentage,
  };
}

/**
 * Map API category to UI category model
 */
export function mapCategory(apiCategory: ApiCategory): Category {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    slug: apiCategory.slug,
    description: apiCategory.description,
    imageUrl: apiCategory.image || undefined,
    productCount: apiCategory.productCount || 0,
    parentId: apiCategory.parentId || undefined,
  };
}

/**
 * Map array of API products to UI products
 */
export function mapProducts(apiProducts: ApiProduct[]): Product[] {
  return apiProducts.map(mapProduct);
}

/**
 * Map array of API categories to UI categories
 */
export function mapCategories(apiCategories: ApiCategory[]): Category[] {
  return apiCategories.map(mapCategory);
}
