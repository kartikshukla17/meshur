/**
 * i18n Configuration
 * Centralized configuration for internationalization
 */

export const locales = ["en", "tr"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

/**
 * Locale display names
 */
export const localeNames: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
};

/**
 * Locale native names
 */
export const localeNativeNames: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
};

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
