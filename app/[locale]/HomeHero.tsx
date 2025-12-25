import { Button } from "@/components/atoms/Button";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

interface HomeHeroProps {
  dict: Dictionary;
  locale: Locale;
}

/**
 * HomeHero Component
 * Static hero section for home page
 * Uses next/image for optimized images
 */
export function HomeHero({ dict, locale }: HomeHeroProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans">
      <main
        className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-24 px-8 sm:px-16 sm:items-start"
        role="main"
      >
        <div className="mb-8 sm:mb-0">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded border-2 border-[#dc2626] bg-white">
              <span className="text-xl font-bold text-[#dc2626]">M</span>
            </div>
            <span className="text-2xl font-bold text-[#dc2626]">MEŞHUR</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left">
          <div className="flex flex-col gap-4">
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-[#171717] sm:text-5xl sm:leading-tight">
              {dict.home.title}
            </h1>
            <p className="max-w-xl text-lg leading-7 text-[#6b7280] sm:text-xl">
              {dict.home.subtitle}
            </p>
          </div>
        </div>
        <nav aria-label="Main navigation" className="w-full sm:w-auto">
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <Button asChild variant="primary" href={`/${locale}/products`}>
              {dict.home.browseProducts}
            </Button>
            <Button asChild variant="secondary" href={`/${locale}/favorites`}>
              {dict.home.myFavorites}
            </Button>
          </div>
        </nav>
      </main>
    </div>
  );
}
