/**
 * Product Service
 * Handles product data fetching and transformation
 * Separates API concerns from components
 */

import type { ApiProduct, ApiResponse, ApiError } from "@/types/api";
import type {
  Product,
  ProductListParams,
  PaginatedResponse,
} from "@/types/models";
import { mapProduct, mapProducts } from "@/lib/mappers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.meshur.co";

/**
 * Fetch products from API or mock data
 * Follows REST API structure from https://api.meshur.co/docs
 */
async function fetchProductsFromAPI(
  params: ProductListParams = {}
): Promise<ApiResponse<ApiProduct[]>> {
  // In development, use mock data with pagination
  // In production, this calls the actual REST API
  if (process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_API_URL) {
    const mockData = await import("@/mocks/products.json");
    const allProducts = mockData.default as ApiResponse<ApiProduct[]>;
    
    // Apply pagination to mock data
    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = allProducts.data.slice(startIndex, endIndex);
    
    // Calculate pagination metadata
    const total = allProducts.data.length;
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: paginatedProducts,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Production API call following REST API structure
  // Endpoint: GET /api/products
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.category) searchParams.set("category", params.category);
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.order) searchParams.set("order", params.order);

  const response = await fetch(
    `${API_BASE_URL}/api/products?${searchParams.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed
        // "Authorization": `Bearer ${token}`,
      },
      // Next.js fetch caching options
      // 'force-cache': Cache indefinitely (SSG)
      // 'no-store': Always fetch fresh (SSR)
      // 'no-cache': Revalidate on each request
      // Default: Cache with revalidation (ISR)
      next: {
        revalidate: 60, // Revalidate every 60 seconds (ISR)
      },
    }
  );

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: "Unknown Error",
      message: response.statusText,
      statusCode: response.status,
    }));
    throw new Error(`Failed to fetch products: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Get paginated list of products
 * Returns transformed data ready for UI components
 */
export async function getProducts(
  params: ProductListParams = {}
): Promise<PaginatedResponse<Product>> {
  try {
    const apiResponse = await fetchProductsFromAPI(params);
    const products = mapProducts(apiResponse.data);

    const pagination = {
      total: apiResponse.meta?.total || products.length,
      page: apiResponse.meta?.page || 1,
      limit: apiResponse.meta?.limit || 20,
      totalPages: apiResponse.meta?.totalPages || 1,
      hasNext:
        (apiResponse.meta?.page || 1) < (apiResponse.meta?.totalPages || 1),
      hasPrev: (apiResponse.meta?.page || 1) > 1,
    };

    return {
      items: products,
      pagination,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Get single product by ID
 * Endpoint: GET /api/products/{id}
 */
export async function getProductById(id: string): Promise<Product> {
  try {
    // In development, use mock data
    if (process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_API_URL) {
      const mockData = await import("@/mocks/product-detail.json");
      const apiResponse = mockData.default as ApiResponse<ApiProduct>;
      return mapProduct(apiResponse.data);
    }

    // Production API call
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed
        // "Authorization": `Bearer ${token}`,
      },
      // Cache product details for 5 minutes (ISR)
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: "Unknown Error",
        message: response.statusText,
        statusCode: response.status,
      }));
      throw new Error(`Failed to fetch product: ${error.message || response.statusText}`);
    }

    const apiResponse: ApiResponse<ApiProduct> = await response.json();
    return mapProduct(apiResponse.data);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(
  limit: number = 6
): Promise<Product[]> {
  const response = await getProducts({ limit, sortBy: "popular" });
  return response.items.filter((product) => product.isFeatured).slice(0, limit);
}

/**
 * Get new products
 */
export async function getNewProducts(limit: number = 6): Promise<Product[]> {
  const response = await getProducts({ limit, sortBy: "newest" });
  return response.items.filter((product) => product.isNew).slice(0, limit);
}
