/**
 * Product Service
 * Handles product data fetching and transformation
 * Separates API concerns from components
 * Uses centralized API client for maintainable REST API integration
 */

import type { ApiProduct, ApiResponse } from "@/types/api";
import type {
  Product,
  ProductListParams,
  PaginatedResponse,
} from "@/types/models";
import { mapProducts } from "@/lib/mappers";
import { formatPrice, calculateDiscountedPrice } from "@/lib/formatters";
import { apiGet, CACHE_CONFIG } from "@/lib/api-client";

/**
 * Fetch products from API or mock data
 * Follows REST API structure from https://api.meshur.co/docs
 */
async function fetchProductsFromAPI(
  params: ProductListParams = {}
): Promise<ApiResponse<ApiProduct[]>> {
  // In development, use mock data with pagination
  // In production, this calls the actual REST API
  if (
    process.env.NODE_ENV === "development" ||
    !process.env.NEXT_PUBLIC_API_URL
  ) {
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

  // Production API call using centralized API client
  // Endpoint: GET /api/products
  return apiGet<ApiProduct[]>("/api/products", {
    params: {
      page: params.page,
      limit: params.limit,
      category: params.category,
      search: params.search,
      sortBy: params.sortBy,
      order: params.order,
    },
    cache: CACHE_CONFIG.DYNAMIC, // Revalidate every 60 seconds (ISR)
  });
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
 * Map product for detail page (full description, all images)
 */
function mapProductDetail(apiProduct: ApiProduct): Product {
  const hasDiscount = !!apiProduct.discount;
  const discountPercentage = apiProduct.discount?.percentage;
  const finalPrice = hasDiscount
    ? calculateDiscountedPrice(apiProduct.price, discountPercentage || 0)
    : apiProduct.price;

  // Determine badge
  let badge: Product["badge"];
  if (apiProduct.isNew) {
    badge = { text: "New", variant: "success" };
  } else if (hasDiscount && discountPercentage) {
    badge = { text: `${discountPercentage}% Off`, variant: "error" };
  } else if (apiProduct.isFeatured) {
    badge = { text: "Featured", variant: "info" };
  }

  return {
    id: apiProduct.id,
    title: apiProduct.title,
    description: apiProduct.description, // Full description for detail page
    price: formatPrice(finalPrice, apiProduct.currency),
    originalPrice: hasDiscount
      ? formatPrice(apiProduct.price, apiProduct.currency)
      : undefined,
    imageUrl: apiProduct.images[0] || "/placeholder-product.jpg",
    images: apiProduct.images.length > 0 ? apiProduct.images : undefined, // All images
    imageAlt: `${apiProduct.title} product image`,
    category: {
      id: apiProduct.category.id,
      name: apiProduct.category.name,
      slug: apiProduct.category.slug,
    },
    seller: {
      id: apiProduct.seller.id,
      name: apiProduct.seller.name,
      avatar: apiProduct.seller.avatar || undefined,
    },
    stock: apiProduct.stock,
    rating: apiProduct.rating,
    reviewCount: apiProduct.reviewCount,
    tags: apiProduct.tags,
    badge,
    isNew: apiProduct.isNew || false,
    isFeatured: apiProduct.isFeatured || false,
    hasDiscount,
    discountPercentage,
  };
}

/**
 * Get single product by ID
 * Endpoint: GET /api/products/{id}
 */
export async function getProductById(id: string): Promise<Product> {
  try {
    // In development, use mock data
    if (
      process.env.NODE_ENV === "development" ||
      !process.env.NEXT_PUBLIC_API_URL
    ) {
      const mockData = await import("@/mocks/product-detail.json");
      const apiResponse = mockData.default as ApiResponse<ApiProduct>;
      return mapProductDetail(apiResponse.data);
    }

    // Production API call using centralized API client
    const apiResponse = await apiGet<ApiProduct>(`/api/products/${id}`, {
      cache: CACHE_CONFIG.PRODUCT_DETAIL, // Cache for 5 minutes (ISR)
    });

    return mapProductDetail(apiResponse.data);
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
