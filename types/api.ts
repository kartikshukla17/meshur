/**
 * API Response Types
 * Based on https://api.meshur.co/docs REST API structure
 * Models the actual backend API data structures
 */

export interface ApiProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: ApiCategory;
  seller: ApiSeller;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: {
    percentage: number;
    validUntil?: string;
  };
  createdAt: string;
  updatedAt: string;
  // Additional fields that may come from API
  status?: "active" | "inactive" | "draft";
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  productCount?: number;
  // Additional fields from API
  status?: "active" | "inactive";
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiSeller {
  id: string;
  name: string;
  avatar?: string | null;
  rating?: number;
  totalSales?: number;
  // Additional fields from API
  email?: string;
  phone?: string;
  status?: "active" | "inactive" | "suspended";
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Standard REST API Response Structure
 * Based on Meshur API v1 specification
 */
export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
  message?: string;
  success?: boolean;
}

/**
 * Pagination metadata
 */
export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

/**
 * API Error Response Structure
 */
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
  timestamp?: string;
  path?: string;
}

/**
 * Query Parameters for Product List Endpoint
 * Matches /api/products query parameters
 */
export interface ProductListQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "newest" | "popular" | "price_asc" | "price_desc" | "rating";
  order?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
}
