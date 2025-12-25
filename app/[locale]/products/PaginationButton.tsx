"use client";

import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

interface PaginationButtonProps {
  href: string;
  label: string;
  disabled?: boolean;
  active?: boolean;
  variant?: "primary" | "secondary";
}

/**
 * PaginationButton Component
 * Button for pagination controls with proper styling
 */
export function PaginationButton({
  href,
  label,
  disabled = false,
  active = false,
  variant = "secondary",
}: PaginationButtonProps) {
  if (disabled) {
    return (
      <Button
        variant={variant}
        disabled
        className="h-10 min-w-10 px-4"
        aria-label={label}
      >
        {label}
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant={active ? "primary" : variant}
      href={href}
      className={cn(
        "h-10 min-w-10 px-4",
        active && "ring-2 ring-[#dc2626] ring-offset-2"
      )}
      aria-label={label}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Button>
  );
}

