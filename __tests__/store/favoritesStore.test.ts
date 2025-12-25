/**
 * Favorites Store Tests
 * Tests for the Zustand favorites store business logic
 */

import { renderHook, act } from "@testing-library/react";
import { useFavoritesStore } from "@/store/favoritesStore";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("favoritesStore", () => {
  beforeEach(() => {
    // Clear store before each test
    localStorageMock.clear();
    const { result } = renderHook(() => useFavoritesStore());
    act(() => {
      result.current.clearFavorites();
    });
  });

  it("initializes with empty favorites", () => {
    const { result } = renderHook(() => useFavoritesStore());

    expect(result.current.count).toBe(0);
    expect(result.current.favoriteIds.size).toBe(0);
  });

  it("adds product to favorites", () => {
    const { result } = renderHook(() => useFavoritesStore());

    act(() => {
      result.current.addToFavorites("product-1");
    });

    expect(result.current.isFavorite("product-1")).toBe(true);
    expect(result.current.count).toBe(1);
  });

  it("does not add duplicate favorites", () => {
    const { result } = renderHook(() => useFavoritesStore());

    act(() => {
      result.current.addToFavorites("product-1");
      result.current.addToFavorites("product-1");
    });

    expect(result.current.count).toBe(1);
    expect(result.current.isFavorite("product-1")).toBe(true);
  });

  it("removes product from favorites", () => {
    const { result } = renderHook(() => useFavoritesStore());

    act(() => {
      result.current.addToFavorites("product-1");
      result.current.removeFromFavorites("product-1");
    });

    expect(result.current.isFavorite("product-1")).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it("does not remove non-existent favorite", () => {
    const { result } = renderHook(() => useFavoritesStore());

    act(() => {
      result.current.removeFromFavorites("product-1");
    });

    expect(result.current.count).toBe(0);
  });

  it("toggles favorite status", () => {
    const { result } = renderHook(() => useFavoritesStore());

    act(() => {
      result.current.toggleFavorite("product-1");
    });
    expect(result.current.isFavorite("product-1")).toBe(true);

    act(() => {
      result.current.toggleFavorite("product-1");
    });
    expect(result.current.isFavorite("product-1")).toBe(false);
  });

  it("tracks multiple favorites correctly", () => {
    const { result } = renderHook(() => useFavoritesStore());

    act(() => {
      result.current.addToFavorites("product-1");
      result.current.addToFavorites("product-2");
      result.current.addToFavorites("product-3");
    });

    expect(result.current.count).toBe(3);
    expect(result.current.isFavorite("product-1")).toBe(true);
    expect(result.current.isFavorite("product-2")).toBe(true);
    expect(result.current.isFavorite("product-3")).toBe(true);
  });

  it("clears all favorites", () => {
    const { result } = renderHook(() => useFavoritesStore());

    act(() => {
      result.current.addToFavorites("product-1");
      result.current.addToFavorites("product-2");
      result.current.clearFavorites();
    });

    expect(result.current.count).toBe(0);
    expect(result.current.isFavorite("product-1")).toBe(false);
    expect(result.current.isFavorite("product-2")).toBe(false);
  });

  it("stores favoritedAt timestamp", () => {
    const { result } = renderHook(() => useFavoritesStore());

    act(() => {
      result.current.addToFavorites("product-1");
    });

    const favoritedAt = result.current.favoritedAt["product-1"];
    expect(favoritedAt).toBeDefined();
    if (favoritedAt) {
      expect(new Date(favoritedAt).getTime()).toBeLessThanOrEqual(Date.now());
    }
  });

  it("removes favoritedAt when removing favorite", () => {
    const { result } = renderHook(() => useFavoritesStore());

    act(() => {
      result.current.addToFavorites("product-1");
      result.current.removeFromFavorites("product-1");
    });

    expect(result.current.favoritedAt["product-1"]).toBeUndefined();
  });
});
