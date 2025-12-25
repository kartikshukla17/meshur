/**
 * Product Service Tests
 * Tests for product service business logic
 */

import { getProducts, getProductById, getFeaturedProducts, getNewProducts } from '@/services/productService'
import type { ApiProduct, ApiResponse } from '@/types/api'

// Mock the mocks directory
jest.mock('@/mocks/products.json', () => ({
  __esModule: true,
  default: {
    data: [
      {
      id: '1',
      title: 'Test Product 1',
      description: 'Test description',
      price: 100,
      currency: 'USD',
      images: ['/test-image.jpg'],
      category: { id: 'cat-1', name: 'Category 1', slug: 'category-1' },
      seller: { id: 'seller-1', name: 'Seller 1', avatar: '/avatar.jpg' },
      stock: 10,
      rating: 4.5,
      reviewCount: 100,
      tags: ['tag1', 'tag2'],
      isNew: false,
      isFeatured: true,
      discount: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
      {
      id: '2',
      title: 'Test Product 2',
      description: 'Test description 2',
      price: 200,
      currency: 'USD',
      images: ['/test-image-2.jpg'],
      category: { id: 'cat-2', name: 'Category 2', slug: 'category-2' },
      seller: { id: 'seller-2', name: 'Seller 2' },
      stock: 5,
      rating: 4.0,
      reviewCount: 50,
      tags: ['tag3'],
      isNew: true,
      isFeatured: false,
      discount: { percentage: 20 },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    ],
    meta: {
      total: 2,
      page: 1,
      limit: 20,
      totalPages: 1,
    },
  } as ApiResponse<ApiProduct[]>,
}))

jest.mock('@/mocks/product-detail.json', () => ({
  __esModule: true,
  default: {
    data: {
      id: '1',
      title: 'Test Product 1',
      description: 'Test description',
      price: 100,
      currency: 'USD',
      images: ['/test-image.jpg'],
      category: { id: 'cat-1', name: 'Category 1', slug: 'category-1' },
      seller: { id: 'seller-1', name: 'Seller 1', avatar: '/avatar.jpg' },
      stock: 10,
      rating: 4.5,
      reviewCount: 100,
      tags: ['tag1', 'tag2'],
      isNew: false,
      isFeatured: true,
      discount: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    meta: {},
  } as ApiResponse<ApiProduct>,
}))

// Mock fetch for production API calls
global.fetch = jest.fn()

describe('productService', () => {
  const originalEnv = process.env.NODE_ENV

  beforeEach(() => {
    jest.clearAllMocks()
    // Set NODE_ENV to development to use mock data
    Object.defineProperty(process, 'env', {
      value: { ...process.env, NODE_ENV: 'development' },
      writable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(process, 'env', {
      value: { ...process.env, NODE_ENV: originalEnv },
      writable: true,
    })
  })

  describe('getProducts', () => {
    it('fetches and transforms products correctly', async () => {
      const result = await getProducts()

      expect(result.items).toHaveLength(2)
      const firstProduct = result.items[0]
      expect(firstProduct).toBeDefined()
      if (firstProduct) {
        expect(firstProduct).toHaveProperty('id')
        expect(firstProduct).toHaveProperty('title')
        expect(firstProduct).toHaveProperty('price')
        expect(firstProduct.price).toMatch(/\$/)
      }
    })

    it('returns pagination metadata', async () => {
      const result = await getProducts()

      expect(result.pagination).toHaveProperty('total')
      expect(result.pagination).toHaveProperty('page')
      expect(result.pagination).toHaveProperty('limit')
      expect(result.pagination).toHaveProperty('totalPages')
      expect(result.pagination).toHaveProperty('hasNext')
      expect(result.pagination).toHaveProperty('hasPrev')
    })

    it('handles products with discounts', async () => {
      const result = await getProducts()

      const discountedProduct = result.items.find((p) => p.hasDiscount)
      expect(discountedProduct).toBeDefined()
      if (discountedProduct) {
        expect(discountedProduct.originalPrice).toBeDefined()
        expect(discountedProduct.discountPercentage).toBe(20)
      }
    })

    it('handles products without discounts', async () => {
      const result = await getProducts()

      const regularProduct = result.items.find((p) => !p.hasDiscount)
      expect(regularProduct).toBeDefined()
      expect(regularProduct?.originalPrice).toBeUndefined()
    })
  })

  describe('getProductById', () => {
    it('fetches and transforms single product', async () => {
      const product = await getProductById('1')

      expect(product).toHaveProperty('id', '1')
      expect(product).toHaveProperty('title')
      expect(product).toHaveProperty('price')
      expect(product).toHaveProperty('imageUrl')
    })

    it('throws error for non-existent product', async () => {
      // Mock fetch to return 404
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      })

      Object.defineProperty(process, 'env', {
        value: { ...process.env, NODE_ENV: 'production' },
        writable: true,
      })
      await expect(getProductById('999')).rejects.toThrow()
    })
  })

  describe('getFeaturedProducts', () => {
    it('returns only featured products', async () => {
      const products = await getFeaturedProducts(10)

      products.forEach((product) => {
        expect(product.isFeatured).toBe(true)
      })
    })

    it('respects limit parameter', async () => {
      const products = await getFeaturedProducts(1)

      expect(products.length).toBeLessThanOrEqual(1)
    })
  })

  describe('getNewProducts', () => {
    it('returns only new products', async () => {
      const products = await getNewProducts(10)

      products.forEach((product) => {
        expect(product.isNew).toBe(true)
      })
    })

    it('respects limit parameter', async () => {
      const products = await getNewProducts(1)

      expect(products.length).toBeLessThanOrEqual(1)
    })
  })
})

