/**
 * Centralized API Client
 * Provides a consistent interface for all REST API calls
 * Based on https://api.meshur.co/docs REST API structure
 *
 * This client ensures:
 * - Consistent error handling
 * - Standardized request/response patterns
 * - Easy configuration management
 * - Type-safe API calls
 */

import type { ApiResponse, ApiError } from "@/types/api";

/**
 * API Configuration
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.meshur.co";

/**
 * Default fetch options for Next.js
 */
const DEFAULT_FETCH_OPTIONS: RequestInit = {
  headers: {
    "Content-Type": "application/json",
    // Add authorization header if needed
    // "Authorization": `Bearer ${token}`,
  },
};

/**
 * Cache configuration for different data types
 */
export const CACHE_CONFIG = {
  // Static data that rarely changes
  STATIC: { revalidate: 3600 }, // 1 hour
  // Dynamic data that changes frequently
  DYNAMIC: { revalidate: 60 }, // 1 minute
  // Real-time data
  REALTIME: { revalidate: 0 }, // No cache
  // Product details
  PRODUCT_DETAIL: { revalidate: 300 }, // 5 minutes
} as const;

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    public error: ApiError,
    message?: string
  ) {
    super(message || error.message || "API request failed");
    this.name = "ApiClientError";
  }
}

/**
 * Type-safe fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const fetchOptions: RequestInit = {
    ...DEFAULT_FETCH_OPTIONS,
    ...options,
    headers: {
      ...DEFAULT_FETCH_OPTIONS.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      let error: ApiError;
      try {
        error = (await response.json()) as ApiError;
      } catch {
        // If response is not JSON, create a generic error
        error = {
          error: "Unknown Error",
          message: response.statusText,
          statusCode: response.status,
        };
      }

      throw new ApiClientError(response.status, error);
    }

    return (await response.json()) as ApiResponse<T>;
  } catch (error) {
    // Re-throw ApiClientError as-is
    if (error instanceof ApiClientError) {
      throw error;
    }

    // Wrap other errors
    throw new ApiClientError(
      500,
      {
        error: "Network Error",
        message: error instanceof Error ? error.message : "Unknown error",
        statusCode: 500,
      },
      "Failed to fetch data from API"
    );
  }
}

/**
 * GET request helper
 */
export async function apiGet<T>(
  endpoint: string,
  options: {
    cache?: RequestInit["next"];
    params?: Record<string, string | number | boolean | undefined>;
  } = {}
): Promise<ApiResponse<T>> {
  let url = endpoint;

  // Add query parameters if provided
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return apiFetch<T>(url, {
    method: "GET",
    next: options.cache,
  });
}

/**
 * POST request helper
 */
export async function apiPost<T>(
  endpoint: string,
  data: unknown,
  options: {
    cache?: RequestInit["next"];
  } = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    next: options.cache,
  });
}

/**
 * PUT request helper
 */
export async function apiPut<T>(
  endpoint: string,
  data: unknown,
  options: {
    cache?: RequestInit["next"];
  } = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
    next: options.cache,
  });
}

/**
 * DELETE request helper
 */
export async function apiDelete<T>(
  endpoint: string,
  options: {
    cache?: RequestInit["next"];
  } = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    method: "DELETE",
    next: options.cache,
  });
}

/**
 * Export API base URL for use in other modules if needed
 */
export { API_BASE_URL };

