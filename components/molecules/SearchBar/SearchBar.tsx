"use client";

import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";

export interface SearchBarProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  onSearch?: (value: string) => void;
  showButton?: boolean;
  buttonText?: string;
}

/**
 * SearchBar Molecule Component
 * Combines Input and Button atoms to create a search interface
 */
export function SearchBar({
  onSearch,
  showButton = true,
  buttonText = "Search",
  className,
  ...props
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") as string;
    onSearch?.(searchValue);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      role="search"
      aria-label="Site search"
    >
      <div className="flex gap-2">
        <Input
          name="search"
          type="search"
          placeholder="Search..."
          aria-label="Search"
          leftIcon={
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
          className="flex-1"
          {...props}
        />
        {showButton && (
          <Button type="submit" variant="primary" aria-label="Submit search">
            {buttonText}
          </Button>
        )}
      </div>
    </form>
  );
}
