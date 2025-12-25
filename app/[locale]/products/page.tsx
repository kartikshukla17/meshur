import { Suspense } from "react";
import { getProducts } from "@/services/productService";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo";
import { BackButton } from "@/components/atoms/BackButton";
import { ProductsList } from "./ProductsList";
import { ProductsLoading } from "./ProductsLoading";
import { PaginationButton } from "./PaginationButton";
import { LanguageSwitcher } from "@/components/organisms/LanguageSwitcher";
import { DarkModeToggle } from "@/components/atoms/DarkModeToggle";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatString } from "@/lib/i18n";

interface ProductsPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string }>;
}

/**
 * Products Page
 *
 * Rendering Strategy: ISR (Incremental Static Regeneration)
 * - Revalidates every 60 seconds
 * - Reason: Product listings change frequently but don't need real-time updates
 * - Benefits: Fast page loads with fresh content, reduced server load
 *
 * Data Fetching: Server-side with caching
 * - Fetches on build time and revalidates periodically
 * - Uses Next.js fetch cache for optimal performance
 */
export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<ReturnType<typeof generateSEOMetadata>> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return generateSEOMetadata({
    title: dict.products.title,
    description: dict.products.description,
    keywords: ["products", "shopping", "marketplace"],
    type: "website",
  });
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale } = await params;
  const { page } = await searchParams;
  const dict = await getDictionary(locale);

  // Get current page from URL search params, default to 1
  const currentPage = page ? parseInt(page, 10) : 1;
  const pageNumber = currentPage > 0 ? currentPage : 1;

  // Fetch and transform data in service layer with pagination
  const { items: products, pagination } = await getProducts({
    limit: 20,
    page: pageNumber,
  });

  return (
    <>
      <JsonLd
        title={dict.products.title}
        description={dict.products.description}
        type="website"
        url={`/${locale}/products`}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Language Switcher and Theme Toggle - Fixed position top right */}
        <div className="fixed right-4 top-4 z-50 flex items-center gap-3 lg:right-8 lg:top-8">
          <DarkModeToggle />
          <LanguageSwitcher currentLocale={locale} />
        </div>
        <div className="mb-6">
          <BackButton
            href={`/${locale}`}
            label={dict.nav.home}
            variant="secondary"
          />
        </div>
        <header className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-[#171717]">
            {dict.products.title}
          </h1>
          <p className="text-[#6b7280]">
            {formatString(dict.products.showing, {
              count: products.length.toString(),
              total: pagination.total.toString(),
            })}
          </p>
        </header>

        <Suspense fallback={<ProductsLoading />}>
          <ProductsList products={products} locale={locale} />
        </Suspense>

        {pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-2">
              <PaginationButton
                href={`/${locale}/products${pagination.page > 1 ? `?page=${pagination.page - 1}` : ""}`}
                disabled={!pagination.hasPrev}
                label={dict.common.previous}
              />
              <span className="flex items-center px-4 text-sm text-[#171717]">
                {formatString(
                  `${dict.products.page} {page} ${dict.products.of} {totalPages}`,
                  {
                    page: pagination.page.toString(),
                    totalPages: pagination.totalPages.toString(),
                  }
                )}
              </span>
              <PaginationButton
                href={`/${locale}/products?page=${pagination.page + 1}`}
                disabled={!pagination.hasNext}
                label={dict.common.next}
              />
            </div>
            {pagination.totalPages <= 10 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((pageNum) => (
                  <PaginationButton
                    key={pageNum}
                    href={`/${locale}/products${pageNum > 1 ? `?page=${pageNum}` : ""}`}
                    active={pageNum === pagination.page}
                    label={pageNum.toString()}
                    variant={
                      pageNum === pagination.page ? "primary" : "secondary"
                    }
                  />
                ))}
              </div>
            )}
            {pagination.totalPages > 10 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* First page */}
                <PaginationButton
                  href={`/${locale}/products`}
                  active={pagination.page === 1}
                  label="1"
                  variant={pagination.page === 1 ? "primary" : "secondary"}
                />
                {/* Show ellipsis if current page is far from start */}
                {pagination.page > 3 && (
                  <span className="px-2 text-[#6b7280]">...</span>
                )}
                {/* Pages around current page */}
                {Array.from({ length: 5 }, (_, i) => pagination.page - 2 + i)
                  .filter(
                    (pageNum) => pageNum > 1 && pageNum < pagination.totalPages
                  )
                  .map((pageNum) => (
                    <PaginationButton
                      key={pageNum}
                      href={`/${locale}/products?page=${pageNum}`}
                      active={pageNum === pagination.page}
                      label={pageNum.toString()}
                      variant={
                        pageNum === pagination.page ? "primary" : "secondary"
                      }
                    />
                  ))}
                {/* Show ellipsis if current page is far from end */}
                {pagination.page < pagination.totalPages - 2 && (
                  <span className="px-2 text-[#6b7280]">...</span>
                )}
                {/* Last page */}
                {pagination.totalPages > 1 && (
                  <PaginationButton
                    href={`/${locale}/products?page=${pagination.totalPages}`}
                    active={pagination.page === pagination.totalPages}
                    label={pagination.totalPages.toString()}
                    variant={
                      pagination.page === pagination.totalPages
                        ? "primary"
                        : "secondary"
                    }
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
