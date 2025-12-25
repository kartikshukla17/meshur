/**
 * Theme utilities for dark mode support
 */

export function initTheme() {
  if (typeof window === "undefined") return;

  const theme = localStorage.getItem("theme");
  const root = document.documentElement;

  // Light theme is the primary/default theme
  // Always default to light mode, only use dark if explicitly set
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    // Explicitly ensure light mode
    root.classList.remove("dark");
    // Set light mode as default if not set
    if (!theme) {
      localStorage.setItem("theme", "light");
    }
  }
}

export function setTheme(theme: "light" | "dark") {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  localStorage.setItem("theme", theme);

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  const root = document.documentElement;
  if (root.classList.contains("dark")) {
    return "dark";
  }
  return "light";
}
