"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Boundary
 * Catches errors in the root layout
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <main className="text-center" role="main">
            <h1 className="mb-4 text-9xl font-bold text-foreground">500</h1>
            <h2 className="mb-4 text-3xl font-semibold text-foreground">
              Application Error
            </h2>
            <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
              A critical error occurred. Please refresh the page or contact
              support.
            </p>
            <nav aria-label="Error page navigation">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button onClick={reset} variant="primary">
                  Try Again
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/">Go to Homepage</Link>
                </Button>
              </div>
            </nav>
          </main>
        </div>
      </body>
    </html>
  );
}
