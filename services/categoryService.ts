/**
 * Category Service
 * Handles category data fetching and transformation
 * Uses centralized API client for maintainable REST API integration
 */

import type { ApiCategory, ApiResponse } from "@/types/api";
import type { Category } from "@/types/models";
import { mapCategories } from "@/lib/mappers";
import { apiGet, CACHE_CONFIG } from "@/lib/api-client";

/**
 * Fetch categories from API or mock data
 * Endpoint: GET /api/categories
 */
async function fetchCategoriesFromAPI(): Promise<ApiResponse<ApiCategory[]>> {
  // In development, use mock data
  if (process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_API_URL) {
    const mockData = await import("@/mocks/categories.json");
    return mockData.default as ApiResponse<ApiCategory[]>;
  }

  // Production API call using centralized API client
  return apiGet<ApiCategory[]>("/api/categories", {
    cache: CACHE_CONFIG.STATIC, // Cache for 1 hour (ISR)
  });
}

/**
 * Get all categories
 * Returns transformed data ready for UI components
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const apiResponse = await fetchCategoriesFromAPI();
    return mapCategories(apiResponse.data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const categories = await getCategories();
    return categories.find((cat) => cat.slug === slug) || null;
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    throw error;
  }
}
