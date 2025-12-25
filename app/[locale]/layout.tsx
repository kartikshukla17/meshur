import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { locales } from "@/i18n/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

/**
 * Locale-aware root layout
 * Handles i18n metadata and language attribute
 */
export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const localeMap: Record<Locale, string> = {
    en: "en_US",
    tr: "tr_TR",
  };

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://meshur.co"
    ),
    title: {
      default: dict.seo.siteName,
      template: `%s | ${dict.seo.siteName}`,
    },
    description: dict.seo.siteDescription,
    keywords: ["marketplace", "shopping", "e-commerce", "products"],
    authors: [{ name: "Meshur" }],
    creator: "Meshur",
    publisher: "Meshur",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: localeMap[locale],
      url: `/${locale}`,
      siteName: dict.seo.siteName,
      title: dict.seo.siteName,
      description: dict.seo.siteDescription,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: dict.seo.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.seo.siteName,
      description: dict.seo.siteDescription,
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light" />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Light theme is the primary/default theme
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div id="skip-to-content" className="sr-only">
          <a
            href="#main-content"
            className="absolute left-4 top-4 z-50 -translate-y-full rounded-md bg-foreground px-4 py-2 text-background transition-transform focus:translate-y-0"
          >
            Skip to main content
          </a>
        </div>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
