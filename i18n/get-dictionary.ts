import type { Locale } from "./config";

/**
 * Get dictionary for a specific locale
 * Loads translation JSON files dynamically
 */
export async function getDictionary(locale: Locale) {
  // Validate locale to prevent importing invalid files
  const validLocales = ["en", "tr"] as const;
  const safeLocale: Locale = validLocales.includes(locale as Locale)
    ? (locale as Locale)
    : "en";

  try {
    const dictionary = await import(`./dictionaries/${safeLocale}.json`);
    return dictionary.default;
  } catch (error) {
    // Fallback to English if dictionary fails to load
    console.error(`Failed to load dictionary for locale: ${locale}`, error);
    const fallback = await import(`./dictionaries/en.json`);
    return fallback.default;
  }
}

/**
 * Type for dictionary structure
 */
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
