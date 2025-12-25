/**
 * Test Utilities
 * Reusable utilities for testing React components
 */

import { render, type RenderOptions } from '@testing-library/react'
import { type ReactElement } from 'react'

/**
 * Custom render function that wraps components with providers
 * Extend this as needed for your app's providers (Theme, i18n, etc.)
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    // Add any providers here if needed
    // wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    ...options,
  })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { customRender as render }

