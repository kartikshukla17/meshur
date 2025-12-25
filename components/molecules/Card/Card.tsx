"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "outlined" | "elevated";
}

/**
 * Card Molecule Component
 * Container component for grouping related content
 */
export function Card({
  children,
  variant = "default",
  className,
  ...props
}: CardProps) {
  const variantStyles = {
    default:
      "bg-white border border-[#e5e7eb]",
    outlined: "bg-transparent border-2 border-[#d1d5db]",
    elevated:
      "bg-white shadow-sm border border-[#e5e7eb] hover:shadow-md transition-all duration-300",
  };

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
