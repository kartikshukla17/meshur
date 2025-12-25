/**
 * Transformed Data Models
 * UI-ready data structures after transformation
 */

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string; // Formatted price string
  originalPrice?: string;
  imageUrl: string; // Primary image (for cards/listings)
  images?: string[]; // All product images (for detail page)
  imageAlt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  seller: {
    id: string;
    name: string;
    avatar?: string;
  };
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  badge?: {
    text: string;
    variant: "default" | "success" | "warning" | "error" | "info";
  };
  isNew: boolean;
  isFeatured: boolean;
  hasDiscount: boolean;
  discountPercentage?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount: number;
  parentId?: string;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "price" | "rating" | "newest" | "popular";
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
