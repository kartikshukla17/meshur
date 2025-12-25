"use client";

import { useRouter } from "next/navigation";
import { Button } from "../Button";
import { cn } from "@/lib/utils";

export interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

/**
 * BackButton Atom Component
 * Navigates back in browser history or to a specific route
 * Follows Meshur design standards
 */
export function BackButton({
  href,
  label = "Back",
  className,
  variant = "secondary",
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  if (href) {
    return (
      <Button
        asChild
        variant={variant}
        href={href}
        className={cn("inline-flex items-center gap-2", className)}
        aria-label={label}
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {label}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={cn("inline-flex items-center gap-2", className)}
      aria-label={label}
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
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      {label}
    </Button>
  );
}
