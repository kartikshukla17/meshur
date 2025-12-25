"use client";

import { usePathname, useRouter } from "next/navigation";
import { localeNames, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

/**
 * LanguageSwitcher Component
 * Toggle button to switch between English and Turkish
 * Follows Meshur design style with minimal, clean aesthetic
 * Uses URL-based routing for language changes
 */
export function LanguageSwitcher({
  currentLocale,
  className,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    // Get the other locale
    const otherLocale = currentLocale === "en" ? "tr" : "en";
    
    // Replace current locale in pathname with new locale
    const segments = pathname.split("/");
    segments[1] = otherLocale;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  // Show the target language (the one we'll switch to), not the current one
  const targetLocale = currentLocale === "en" ? "tr" : "en";
  const targetLocaleName = targetLocale.toUpperCase();

  return (
    <button
      onClick={toggleLocale}
      className={cn(
        "group relative flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#171717] transition-all duration-200",
        "hover:border-[#dc2626] hover:text-[#dc2626] hover:shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:ring-offset-2",
        "active:scale-[0.98]",
        className
      )}
      aria-label={`Switch to ${localeNames[targetLocale]}`}
      type="button"
    >
      {/* Globe Icon */}
      <svg
        className="h-4 w-4 transition-transform group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      
      {/* Target Language (the one we'll switch to) */}
      <span className="font-semibold">
        {targetLocaleName}
      </span>
      
      {/* Arrow Icon */}
      <svg
        className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}
