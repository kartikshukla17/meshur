/**
 * HomeProductsLoading Component
 * Loading skeleton for home page products
 */
export function HomeProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-16">
        <div className="mb-8 h-10 w-48 animate-pulse rounded bg-[#f3f4f6]" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-96 animate-pulse rounded-lg bg-[#f3f4f6]"
              aria-label="Loading product"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
