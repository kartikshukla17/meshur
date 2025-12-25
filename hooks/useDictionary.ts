"use client";

import { use } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * Client-side dictionary hook
 * Use in Client Components
 *
 * @example
 * const dict = useDictionary(dictionaryPromise);
 * const title = dict.home.title;
 */
export function useDictionary(dictionary: Promise<Dictionary>): Dictionary {
  return use(dictionary);
}
