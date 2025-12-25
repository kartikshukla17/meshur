/**
 * ProductsLoading Component
 * Loading skeleton for products page
 * Optimized with proper sizing
 */
export function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-96 animate-pulse rounded-lg bg-[#f3f4f6]"
          aria-label="Loading product"
        />
      ))}
    </div>
  );
}
