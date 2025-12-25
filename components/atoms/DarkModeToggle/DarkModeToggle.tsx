"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface DarkModeToggleProps {
  className?: string;
}

/**
 * DarkModeToggle Atom Component
 * Toggle component for switching between light and dark themes
 * Properly handles hydration and follows Meshur design standards
 */
export function DarkModeToggle({ className }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration - only set theme after component mounts
  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const theme = localStorage.getItem("theme");
    const isDarkMode = theme === "dark" || root.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    const newIsDark = !isDark;

    if (newIsDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setIsDark(newIsDark);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#dc2626] bg-white text-[#dc2626] shadow-md opacity-50",
          className
        )}
        aria-label="Theme toggle"
        disabled
        type="button"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#dc2626] bg-white text-[#dc2626] shadow-md transition-all hover:bg-[#dc2626] hover:text-white hover:shadow-lg active:scale-95 dark:border-[#ef4444] dark:bg-[#0a0a0a] dark:text-[#ef4444] dark:hover:bg-[#ef4444] dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:ring-offset-2 dark:focus:ring-[#ef4444]",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      type="button"
    >
      {isDark ? (
        <svg
          className="h-6 w-6 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="h-6 w-6 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
