"use client";

import Link from "next/link";
import { useCartCount } from "@/store";
import { cn } from "@/lib/utils";

interface CartIconProps {
  href: string;
  className?: string;
}

/**
 * CartIcon Component
 * Displays shopping cart icon with item count badge
 */
export function CartIcon({ href, className }: CartIconProps) {
  const cartCount = useCartCount();

  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:ring-offset-2",
        className
      )}
      aria-label={`Shopping cart with ${cartCount} items`}
    >
      <svg
        className="h-6 w-6 text-[#171717]"
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
      {cartCount > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#dc2626] text-xs font-bold text-white"
          aria-label={`${cartCount} items in cart`}
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
}
