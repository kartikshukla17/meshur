/**
 * ProductCard Component Tests
 * Tests for the ProductCard organism component
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from '@/components/organisms/ProductCard'
import type { Product } from '@/types/models'

// Mock the store utilities
jest.mock('@/store', () => ({
  useFavoritesStore: jest.fn(),
  useIsFavorite: jest.fn(),
}))

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  description: 'Test product description',
  price: '$99.99',
  imageUrl: '/test-image.jpg',
  imageAlt: 'Test product image',
  category: {
    id: 'cat-1',
    name: 'Category 1',
    slug: 'category-1',
  },
  seller: {
    id: 'seller-1',
    name: 'Seller 1',
  },
  stock: 10,
  rating: 4.5,
  reviewCount: 100,
  tags: ['tag1', 'tag2'],
  isNew: false,
  isFeatured: false,
  hasDiscount: false,
}

describe('ProductCard', () => {
  const mockToggleFavorite = jest.fn()
  let mockIsFavoriteValue = false

  beforeEach(() => {
    jest.clearAllMocks()
    mockIsFavoriteValue = false
    const { useFavoritesStore, useIsFavorite } = require('@/store')
    // Mock useFavoritesStore to work as a Zustand selector
    useFavoritesStore.mockImplementation((selector?: (state: { toggleFavorite: jest.Mock }) => unknown) => {
      if (selector) {
        // When used as a selector function
        const mockState = {
          toggleFavorite: mockToggleFavorite,
        }
        return selector(mockState)
      }
      // When used directly
      return {
        toggleFavorite: mockToggleFavorite,
      }
    })
    useIsFavorite.mockImplementation(() => mockIsFavoriteValue)
  })

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test product description')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByAltText('Test product image')).toBeInTheDocument()
  })

  it('renders product with badge when provided', () => {
    const productWithBadge: Product = {
      ...mockProduct,
      badge: { text: 'New', variant: 'success' },
    }

    render(<ProductCard product={productWithBadge} />)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders original price when discount is available', () => {
    const discountedProduct: Product = {
      ...mockProduct,
      originalPrice: '$149.99',
      hasDiscount: true,
      discountPercentage: 33,
    }

    render(<ProductCard product={discountedProduct} />)
    expect(screen.getByText('$149.99')).toBeInTheDocument()
  })

  it('calls onAddToCart when add to cart button is clicked', async () => {
    const handleAddToCart = jest.fn()
    const user = userEvent.setup()

    render(<ProductCard product={mockProduct} onAddToCart={handleAddToCart} />)

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    await user.click(addToCartButton)

    expect(handleAddToCart).toHaveBeenCalledWith('1')
  })

  it('shows "In Cart" when isInCart is true', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} isInCart />)

    expect(screen.getByRole('button', { name: /in cart/i })).toBeInTheDocument()
  })

  it('toggles favorite when favorite button is clicked', async () => {
    const user = userEvent.setup()
    // Ensure product is not favorited initially
    mockIsFavoriteValue = false

    render(<ProductCard product={mockProduct} />)

    const favoriteButton = screen.getByRole('button', {
      name: /add to favorites/i,
    })
    await user.click(favoriteButton)

    expect(mockToggleFavorite).toHaveBeenCalledWith('1')
  })

  it('shows filled heart icon when product is favorited', () => {
    mockIsFavoriteValue = true
    const { useIsFavorite } = require('@/store')
    useIsFavorite.mockReturnValue(true)

    render(<ProductCard product={mockProduct} />)

    const favoriteButton = screen.getByRole('button', {
      name: /remove from favorites/i,
    })
    expect(favoriteButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('does not render favorite button when useStoreFavorites is false', () => {
    render(<ProductCard product={mockProduct} useStoreFavorites={false} />)

    expect(
      screen.queryByRole('button', { name: /favorites/i })
    ).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ProductCard product={mockProduct} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders product without description when not provided', () => {
    const productWithoutDescription: Product = {
      ...mockProduct,
      description: '',
    }

    render(<ProductCard product={productWithoutDescription} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })
})

