"use client";

import { useState, useEffect } from "react";

/**
 * Example custom hook demonstrating proper structure
 */
export function useExample() {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    // Example effect
    return () => {
      // Cleanup
    };
  }, []);

  return {
    value,
    setValue,
  };
}
