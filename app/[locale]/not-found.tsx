import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { BackButton } from "@/components/atoms/BackButton";

interface NotFoundProps {
  params?: Promise<{ locale: Locale }>;
}

/**
 * 404 Not Found Page
 * Custom error page with i18n support
 */
export default async function NotFound({ params }: NotFoundProps) {
  // Handle cases where params might be undefined
  const locale = params ? (await params).locale : "en";
  const dict = await getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-[#171717]">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-[#171717]">
          {dict.errors["404"].title}
        </h2>
        <p className="mb-8 text-[#6b7280]">
          {dict.errors["404"].description}
        </p>
        <BackButton href={`/${locale}`} label={dict.errors["404"].backHome} variant="primary" />
      </div>
    </div>
  );
}

