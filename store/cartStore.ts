/**
 * Cart Store
 * Zustand store for managing shopping cart with quantity support
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartStore } from "@/types/store";

/**
 * Cart Store
 * Manages shopping cart items with quantities
 * Normalized: stores only product ID and quantity, not full product data
 */
// Internal state for persistence
interface PersistedCartState {
  items: Array<{ productId: string; quantity: number }>;
  addedAt: Record<string, string>;
  totalItems: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: new Map<string, number>(), // productId -> quantity
      addedAt: {},
      totalItems: 0,

      /**
       * Add product to cart
       * If product already exists, increment quantity
       */
      addToCart: (productId: string, quantity: number = 1) => {
        set((state) => {
          const newItems = new Map(state.items);
          const currentQuantity = newItems.get(productId) || 0;
          const newQuantity = currentQuantity + quantity;

          newItems.set(productId, newQuantity);

          // Calculate total items
          let totalItems = 0;
          newItems.forEach((qty) => {
            totalItems += qty;
          });

          return {
            items: newItems,
            addedAt: {
              ...state.addedAt,
              [productId]: state.addedAt[productId] || new Date().toISOString(),
            },
            totalItems,
          };
        });
      },

      /**
       * Remove product from cart
       */
      removeFromCart: (productId: string) => {
        set((state) => {
          if (!state.items.has(productId)) {
            return state;
          }

          const newItems = new Map(state.items);
          newItems.delete(productId);

          // Calculate total items
          let totalItems = 0;
          newItems.forEach((qty) => {
            totalItems += qty;
          });

          // Remove from addedAt
          const newAddedAt = { ...state.addedAt };
          delete newAddedAt[productId];

          return {
            items: newItems,
            addedAt: newAddedAt,
            totalItems,
          };
        });
      },

      /**
       * Update product quantity in cart
       */
      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            // If quantity is 0 or less, remove from cart
            return state.removeFromCart(productId);
          }

          const newItems = new Map(state.items);
          newItems.set(productId, quantity);

          // Calculate total items
          let totalItems = 0;
          newItems.forEach((qty) => {
            totalItems += qty;
          });

          return {
            items: newItems,
            totalItems,
          };
        });
      },

      /**
       * Get quantity for a specific product
       */
      getQuantity: (productId: string): number => {
        return get().items.get(productId) || 0;
      },

      /**
       * Check if product is in cart
       */
      isInCart: (productId: string): boolean => {
        return get().items.has(productId);
      },

      /**
       * Clear entire cart
       */
      clearCart: () => {
        set({
          items: new Map<string, number>(),
          addedAt: {},
          totalItems: 0,
        });
      },

      /**
       * Get all cart item IDs
       */
      getCartItemIds: (): string[] => {
        return Array.from(get().items.keys());
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      // Convert Map to Array for persistence
      partialize: (state): PersistedCartState => ({
        items: Array.from(state.items.entries()).map(([productId, quantity]) => ({
          productId,
          quantity,
        })),
        addedAt: state.addedAt,
        totalItems: state.totalItems,
      }),
      // Convert Array back to Map on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          const persisted = state as unknown as PersistedCartState;
          const itemsMap = new Map<string, number>();
          if (persisted.items && Array.isArray(persisted.items)) {
            persisted.items.forEach(({ productId, quantity }) => {
              itemsMap.set(productId, quantity);
            });
          }
          state.items = itemsMap;
        }
      },
    }
  )
);

