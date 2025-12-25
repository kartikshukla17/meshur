/**
 * Store Utilities
 * Helper functions for working with normalized state
 */

import type { Product } from "@/types/models";
import { useFavoritesStore } from "./favoritesStore";
import { useCartStore } from "./cartStore";

/**
 * Get favorite products from a list of products
 * Combines normalized favorites state with product data
 */
export function getFavoriteProducts(products: Product[]): Product[] {
  const favoriteIds = useFavoritesStore.getState().favoriteIds;
  return products.filter((product) => favoriteIds.has(product.id));
}

/**
 * Hook to check if a product is favorited
 * Convenience hook for components
 */
export function useIsFavorite(productId: string): boolean {
  return useFavoritesStore((state) => state.isFavorite(productId));
}

/**
 * Hook to get favorites count
 */
export function useFavoritesCount(): number {
  return useFavoritesStore((state) => state.count);
}

/**
 * Hook to get all favorite IDs
 */
export function useFavoriteIds(): Set<string> {
  return useFavoritesStore((state) => state.favoriteIds);
}

/**
 * Hook to check if product is in cart
 */
export function useIsInCart(productId: string): boolean {
  return useCartStore((state) => state.isInCart(productId));
}

/**
 * Hook to get cart quantity for a product
 */
export function useCartQuantity(productId: string): number {
  return useCartStore((state) => state.getQuantity(productId));
}

/**
 * Hook to get total cart items count
 */
export function useCartCount(): number {
  return useCartStore((state) => state.totalItems);
}
