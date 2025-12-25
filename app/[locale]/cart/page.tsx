import { Suspense } from "react";
import { getProducts } from "@/services/productService";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo";
import { BackButton } from "@/components/atoms/BackButton";
import { CartClient } from "./CartClient";
import { LanguageSwitcher } from "@/components/organisms/LanguageSwitcher";
import { DarkModeToggle } from "@/components/atoms/DarkModeToggle";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

interface CartPageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * Cart Page
 *
 * Rendering Strategy: SSR (Server-Side Rendering)
 * - Reason: Cart content is user-specific and changes frequently
 * - Benefits: Always fresh data, personalized experience
 * - Note: Client component handles filtering based on Zustand store
 */
export async function generateMetadata({
  params,
}: CartPageProps): Promise<ReturnType<typeof generateSEOMetadata>> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return generateSEOMetadata({
    title: dict.cart?.title || "Shopping Cart",
    description: dict.cart?.description || "Your shopping cart",
    keywords: ["cart", "shopping", "checkout"],
    type: "website",
  });
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // Fetch all products (in production, you'd fetch only cart items)
  const { items: allProducts } = await getProducts({ limit: 100 });

  return (
    <>
      <JsonLd
        title={dict.cart?.title || "Shopping Cart"}
        description={dict.cart?.description || "Your shopping cart"}
        type="website"
        url={`/${locale}/cart`}
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
            {dict.cart?.title || "Shopping Cart"}
          </h1>
          <p className="text-[#6b7280]">
            {dict.cart?.description || "Review your items"}
          </p>
        </header>

        <Suspense fallback={<CartLoading />}>
          <CartClient allProducts={allProducts} dict={dict} locale={locale} />
        </Suspense>
      </div>
    </>
  );
}

function CartLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-lg bg-[#f3f4f6]"
          aria-label="Loading cart item"
        />
      ))}
    </div>
  );
}
