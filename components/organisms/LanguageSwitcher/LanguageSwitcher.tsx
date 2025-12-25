"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

/**
 * LanguageSwitcher Component
 * Allows users to switch between supported languages
 * Uses URL-based routing for language changes
 */
export function LanguageSwitcher({
  currentLocale,
  className,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    // Replace current locale in pathname with new locale
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="group"
      aria-label="Language switcher"
    >
      {locales.map((locale) => (
        <Button
          key={locale}
          variant={currentLocale === locale ? "primary" : "ghost"}
          size="sm"
          onClick={() => switchLocale(locale)}
          aria-pressed={currentLocale === locale}
          aria-label={`Switch to ${localeNames[locale]}`}
        >
          {locale.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
