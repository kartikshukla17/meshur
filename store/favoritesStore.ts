/**
 * Favorites Store
 * Zustand store for managing favorites with normalized state
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FavoritesStore } from "@/types/store";
import type { Product } from "@/types/models";

/**
 * Favorites Store
 * Normalized, scalable, and testable state management
 */
// Internal state for persistence (uses array)
interface PersistedFavoritesState {
  favoriteIds: string[];
  favoritedAt: Record<string, string>;
  count: number;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: new Set<string>(),
      favoritedAt: {},
      count: 0,

      /**
       * Add product to favorites
       * Normalized: stores only ID, not full product data
       */
      addToFavorites: (productId: string) => {
        set((state) => {
          // Check if already favorited
          if (state.favoriteIds.has(productId)) {
            return state;
          }

          // Create new Set to maintain immutability
          const newFavoriteIds = new Set(state.favoriteIds);
          newFavoriteIds.add(productId);

          return {
            favoriteIds: newFavoriteIds,
            favoritedAt: {
              ...state.favoritedAt,
              [productId]: new Date().toISOString(),
            },
            count: newFavoriteIds.size,
          };
        });
      },

      /**
       * Remove product from favorites
       */
      removeFromFavorites: (productId: string) => {
        set((state) => {
          if (!state.favoriteIds.has(productId)) {
            return state;
          }

          // Create new Set to maintain immutability
          const newFavoriteIds = new Set(state.favoriteIds);
          newFavoriteIds.delete(productId);

          // Remove from favoritedAt
          const newFavoritedAt = { ...state.favoritedAt };
          delete newFavoritedAt[productId];

          return {
            favoriteIds: newFavoriteIds,
            favoritedAt: newFavoritedAt,
            count: newFavoriteIds.size,
          };
        });
      },

      /**
       * Toggle favorite status
       */
      toggleFavorite: (productId: string) => {
        const state = get();
        if (state.favoriteIds.has(productId)) {
          state.removeFromFavorites(productId);
        } else {
          state.addToFavorites(productId);
        }
      },

      /**
       * Check if product is favorited
       * O(1) lookup using Set
       */
      isFavorite: (productId: string) => {
        return get().favoriteIds.has(productId);
      },

      /**
       * Clear all favorites
       */
      clearFavorites: () => {
        set({
          favoriteIds: new Set<string>(),
          favoritedAt: {},
          count: 0,
        });
      },

      /**
       * Get favorite products
       * Requires product entities to be passed or fetched
       * This keeps the store normalized - products stored separately
       */
      getFavoriteProducts: () => {
        // This would typically fetch products from a products store
        // or receive them as a parameter
        // For now, return empty array - products should be fetched separately
        return [] as Product[];
      },
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => localStorage),
      // Convert Set to Array for persistence
      partialize: (state): PersistedFavoritesState => ({
        favoriteIds: Array.from(state.favoriteIds),
        favoritedAt: state.favoritedAt,
        count: state.count,
      }),
      // Convert Array back to Set on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert array back to Set
          const persisted = state as unknown as PersistedFavoritesState;
          state.favoriteIds = new Set(persisted.favoriteIds || []);
        }
      },
    }
  )
);
