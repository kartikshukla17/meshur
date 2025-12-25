"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { BackButton } from "@/components/atoms/BackButton";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 500 Error Page
 * Client-side error boundary with accessibility features
 */
export default function Error({ error, reset }: ErrorProps) {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  useEffect(() => {
    // Log error to error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <main className="text-center" role="main">
        <h1 className="mb-4 text-9xl font-bold text-[#171717]">500</h1>
        <h2 className="mb-4 text-3xl font-semibold text-[#171717]">
          Internal Server Error
        </h2>
        <p className="mb-4 text-lg text-[#6b7280]">
          Something went wrong on our end. We&apos;re working to fix it.
        </p>
        {process.env.NODE_ENV === "development" && error.message && (
          <div
            className="mb-8 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-left"
            role="alert"
          >
            <p className="text-sm font-medium text-[#991b1b]">
              Error: {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-[#dc2626]">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
        <nav aria-label="Error page navigation">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button onClick={reset} variant="primary">
              Try Again
            </Button>
            <BackButton href={`/${locale}`} label="Go to Homepage" variant="secondary" />
          </div>
        </nav>
      </main>
    </div>
  );
}
