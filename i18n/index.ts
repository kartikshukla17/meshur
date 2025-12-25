/**
 * i18n exports
 * Centralized exports for internationalization
 */

export {
  locales,
  defaultLocale,
  localeNames,
  localeNativeNames,
  isValidLocale,
} from "./config";
export type { Locale } from "./config";
export { getDictionary } from "./get-dictionary";
export type { Dictionary } from "./get-dictionary";
