/**
 * Category Service
 * Handles category data fetching and transformation
 */

import type { ApiCategory, ApiResponse, ApiError } from "@/types/api";
import type { Category } from "@/types/models";
import { mapCategories } from "@/lib/mappers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.meshur.co";

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

  // Production API call following REST API structure
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    headers: {
      "Content-Type": "application/json",
      // Add authorization header if needed
      // "Authorization": `Bearer ${token}`,
    },
    // Cache categories for 1 hour (ISR)
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: "Unknown Error",
      message: response.statusText,
      statusCode: response.status,
    }));
    throw new Error(`Failed to fetch categories: ${error.message || response.statusText}`);
  }

  return response.json();
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
