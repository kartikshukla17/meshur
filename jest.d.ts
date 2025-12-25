/**
 * Jest TypeScript declarations
 * Extends Jest matchers with @testing-library/jest-dom
 */

import "@testing-library/jest-dom";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string | string[]): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeEmptyDOMElement(): R;
    }
  }
}

export {};
