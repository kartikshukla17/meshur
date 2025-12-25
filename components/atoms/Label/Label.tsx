"use client";

import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
  error?: boolean;
}

/**
 * Label Atom Component
 * Basic label element for form inputs
 */
export function Label({
  children,
  required = false,
  error = false,
  className,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-foreground",
        error && "text-red-600 dark:text-red-400",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span
          className="ml-1 text-red-600 dark:text-red-400"
          aria-label="required"
        >
          *
        </span>
      )}
    </label>
  );
}
