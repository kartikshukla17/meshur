import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/models";

const mockProduct: Product = {
  id: "prod_001",
  title: "Premium Wireless Headphones",
  description: "High-quality wireless headphones with noise cancellation.",
  price: "$254.99",
  originalPrice: "$299.99",
  imageUrl: "https://via.placeholder.com/400x400",
  imageAlt: "Premium Wireless Headphones",
  category: {
    id: "cat_electronics",
    name: "Electronics",
    slug: "electronics",
  },
  seller: {
    id: "seller_001",
    name: "TechStore Pro",
  },
  stock: 45,
  rating: 4.8,
  reviewCount: 324,
  tags: ["wireless", "audio"],
  badge: { text: "15% Off", variant: "error" },
  isNew: true,
  isFeatured: true,
  hasDiscount: true,
  discountPercentage: 15,
};

const meta = {
  title: "Organisms/ProductCard",
  component: ProductCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    product: mockProduct,
    onAddToCart: fn(),
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    product: mockProduct,
  },
};

export const WithBadge: Story = {
  args: {
    product: {
      ...mockProduct,
      badge: { text: "New", variant: "success" },
    },
  },
};

export const WithFavorite: Story = {
  args: {
    product: mockProduct,
    useStoreFavorites: true,
  },
};

export const Favorited: Story = {
  args: {
    product: mockProduct,
    useStoreFavorites: true,
  },
};

export const InCart: Story = {
  args: {
    product: mockProduct,
    isInCart: true,
  },
};

export const Sale: Story = {
  args: {
    product: {
      ...mockProduct,
      title: "On Sale Product",
      price: "$39.99",
      originalPrice: "$49.99",
      badge: { text: "Sale", variant: "error" },
      hasDiscount: true,
      discountPercentage: 20,
    },
  },
};
