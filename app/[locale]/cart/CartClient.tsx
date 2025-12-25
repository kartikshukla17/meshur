"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore, useCartQuantity } from "@/store";
import type { Product } from "@/types/models";
import { Button } from "@/components/atoms/Button";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { formatString } from "@/lib/i18n";

interface CartClientProps {
  allProducts: Product[];
  dict: Dictionary;
  locale: Locale;
}

/**
 * Client component for cart page
 * Uses Zustand store to filter and display cart items
 */
export function CartClient({
  allProducts,
  dict,
  locale,
}: CartClientProps) {
  const cartItemIds = useCartStore((state) => state.getCartItemIds());
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore((state) => state.totalItems);

  // Filter products based on cart state
  const cartProducts = useMemo(() => {
    return allProducts.filter((product) => cartItemIds.includes(product.id));
  }, [allProducts, cartItemIds]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return cartProducts.reduce((sum, product) => {
      const quantity = useCartStore.getState().getQuantity(product.id);
      // Extract numeric price (remove currency symbols)
      const price = parseFloat(
        product.price.replace(/[^0-9.-]+/g, "") || "0"
      );
      return sum + price * quantity;
    }, 0);
  }, [cartProducts]);

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="mb-4 h-16 w-16 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h2 className="mb-2 text-2xl font-semibold text-[#171717]">
          {dict.cart?.empty || "Your cart is empty"}
        </h2>
        <p className="mb-6 text-[#6b7280]">
          {dict.cart?.emptyDescription ||
            "Add some products to your cart to get started"}
        </p>
        <Button asChild variant="primary">
          <Link href={`/${locale}/products`}>
            {dict.cart?.browseProducts || "Browse Products"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[#6b7280]">
          {formatString(dict.cart?.count || "{count} items", {
            count: totalItems,
          })}
        </p>
        <Button variant="secondary" onClick={clearCart} size="sm">
          {dict.cart?.clearAll || "Clear Cart"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartProducts.map((product) => (
            <CartItem
              key={product.id}
              product={product}
              locale={locale}
              onRemove={() => removeFromCart(product.id)}
              onUpdateQuantity={(quantity) =>
                updateQuantity(product.id, quantity)
              }
            />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#171717]">
              {dict.cart?.summary || "Order Summary"}
            </h2>
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-[#6b7280]">
                <span>{dict.cart?.subtotal || "Subtotal"}</span>
                <span className="font-semibold text-[#171717]">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[#6b7280]">
                <span>{dict.cart?.shipping || "Shipping"}</span>
                <span className="font-semibold text-[#171717]">
                  {dict.cart?.calculatedAtCheckout || "Calculated at checkout"}
                </span>
              </div>
            </div>
            <div className="mb-6 border-t border-[#e5e7eb] pt-4">
              <div className="flex justify-between text-lg font-bold text-[#171717]">
                <span>{dict.cart?.total || "Total"}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Button
              asChild
              variant="primary"
              className="w-full"
              href={`/${locale}/checkout`}
            >
              {dict.cart?.checkout || "Proceed to Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

interface CartItemProps {
  product: Product;
  locale: Locale;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

function CartItem({
  product,
  locale,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  const quantity = useCartQuantity(product.id);
  const productUrl = `/${locale}/products/${product.id}`;

  // Extract numeric price
  const price = parseFloat(product.price.replace(/[^0-9.-]+/g, "") || "0");
  const itemTotal = price * quantity;

  return (
    <div className="flex gap-4 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
      <Link href={productUrl} className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-[#f9fafb]">
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          className="object-cover"
          sizes="96px"
        />
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 items-start justify-between">
          <div className="flex-1">
            <Link href={productUrl}>
              <h3 className="mb-1 text-lg font-semibold text-[#171717] hover:text-[#dc2626] transition-colors">
                {product.title}
              </h3>
            </Link>
            <p className="mb-2 text-sm text-[#6b7280] line-clamp-2">
              {product.description}
            </p>
            <p className="text-lg font-bold text-[#171717]">
              {product.price}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="ml-4 rounded-lg p-2 text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-[#dc2626] focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:ring-offset-2"
            aria-label={`Remove ${product.title} from cart`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[#171717] transition-colors hover:bg-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:ring-offset-2"
              aria-label="Decrease quantity"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="min-w-[3rem] text-center font-semibold text-[#171717]">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[#171717] transition-colors hover:bg-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:ring-offset-2"
              aria-label="Increase quantity"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
          <p className="text-lg font-bold text-[#171717]">
            ${itemTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

