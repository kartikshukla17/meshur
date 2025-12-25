/**
 * Store State Types
 * Normalized state structure for global state management
 */

import type { Product } from "./models";

/**
 * Normalized product entities
 * Keyed by product ID for O(1) lookups
 */
export interface ProductEntities {
  [productId: string]: Product;
}

/**
 * Favorites state structure
 * Normalized and scalable
 */
export interface FavoritesState {
  // Set of favorite product IDs for O(1) lookup
  favoriteIds: Set<string>;
  // Timestamp when each product was favorited
  favoritedAt: Record<string, string>;
  // Total count for quick access
  count: number;
}

/**
 * Root application state
 * Normalized structure for scalability
 */
export interface AppState {
  // Normalized product entities
  products: ProductEntities;
  // Favorites state
  favorites: FavoritesState;
  // UI state
  ui: {
    isLoading: boolean;
    error: string | null;
  };
}

/**
 * Store actions interface
 * Separates actions from state for better organization
 */
export interface FavoritesActions {
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
  getFavoriteProducts: () => Product[];
}

/**
 * Combined store type
 * Combines state and actions
 */
export type FavoritesStore = FavoritesState & FavoritesActions;

/**
 * Cart state structure
 * Manages shopping cart items with quantities
 */
export interface CartState {
  // Map of product ID to quantity
  items: Map<string, number>;
  // Timestamp when each product was added
  addedAt: Record<string, string>;
  // Total items count (sum of all quantities)
  totalItems: number;
}

/**
 * Cart actions interface
 */
export interface CartActions {
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  clearCart: () => void;
  getCartItemIds: () => string[];
}

/**
 * Combined cart store type
 */
export type CartStore = CartState & CartActions;
