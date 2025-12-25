"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "asChild"
> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  asChild?: boolean;
  href?: string;
}

/**
 * Button Atom Component
 * Basic interactive element following Atomic Design principles
 * Supports both button and link variants for accessibility
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  disabled,
  asChild = false,
  href,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyles = {
    primary:
      "bg-[#dc2626] text-white hover:bg-[#b91c1c] focus:ring-[#dc2626] shadow-sm hover:shadow-md active:scale-[0.98]",
    secondary:
      "border-2 border-[#e5e7eb] bg-white text-[#171717] hover:border-[#dc2626] hover:text-[#dc2626] focus:ring-[#dc2626] active:scale-[0.98]",
    outline:
      "border-2 border-[#dc2626] bg-transparent text-[#dc2626] hover:bg-[#dc2626] hover:text-white focus:ring-[#dc2626] active:scale-[0.98]",
    ghost:
      "text-[#171717] hover:bg-[#f3f4f6] focus:ring-[#dc2626] active:scale-[0.98]",
  };
  const sizeStyles = {
    sm: "h-10 px-5 text-sm",
    md: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };

  const buttonClasses = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const content = isLoading ? (
    <>
      <svg
        className="mr-2 h-4 w-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span aria-live="polite" aria-busy="true">
        Loading...
      </span>
    </>
  ) : (
    children
  );

  if (asChild && href) {
    return (
      <Link href={href} className={buttonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  );
}
