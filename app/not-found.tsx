import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export const metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for could not be found.",
};

/**
 * 404 Error Page
 * Accessible and SEO-friendly error page
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <main className="text-center" role="main">
        <h1 className="mb-4 text-9xl font-bold text-foreground">404</h1>
        <h2 className="mb-4 text-3xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <nav aria-label="404 page navigation">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild variant="primary">
              <Link href="/">Go to Homepage</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">Back to Previous Page</Link>
            </Button>
          </div>
        </nav>
      </main>
    </div>
  );
}
