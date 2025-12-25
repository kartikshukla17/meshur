import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * i18n utility functions
 * Helper functions for internationalization
 */

/**
 * Format plural strings
 * Simple pluralization support
 */
export function pluralize(
  count: number,
  singular: string,
  plural: string
): string {
  return count === 1 ? singular : plural;
}

/**
 * Format strings with variables and ICU pluralization
 * Replaces {variable} with actual values
 * Supports ICU message format: {count, plural, one {singular} other {plural}}
 */
export function formatString(
  template: string,
  values: Record<string, string | number>
): string {
  let result = template;
  
  // Handle ICU pluralization: {count, plural, one {singular} other {plural}}
  const pluralRegex = /\{(\w+),\s*plural,\s*one\s+\{([^}]+)\}\s+other\s+\{([^}]+)\}\}/g;
  result = result.replace(pluralRegex, (match, varName, singular, plural) => {
    const count = values[varName];
    if (count !== undefined) {
      const numCount = typeof count === "string" ? parseInt(count, 10) : count;
      return numCount === 1 ? singular : plural;
    }
    return match;
  });
  
  // Replace simple variables: {variable}
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  }
  
  return result;
}

/**
 * Get nested dictionary value by path
 * Example: getNestedValue(dict, 'nav.home') => dict.nav.home
 */
export function getNestedValue(
  dict: Dictionary,
  path: string
): string | undefined {
  const keys = path.split(".");
  let value: any = dict;
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  return typeof value === "string" ? value : undefined;
}

/**
 * Server-side dictionary loader
 * Use in Server Components
 */
export async function getServerDictionary(locale: Locale): Promise<Dictionary> {
  return getDictionary(locale);
}
