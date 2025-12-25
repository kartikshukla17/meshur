import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://meshur.co"
  ),
  title: {
    default: "Meshur Marketplace",
    template: "%s | Meshur Marketplace",
  },
  description:
    "Modern marketplace application for quality products. Shop with confidence and discover amazing deals.",
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
    locale: "en_US",
    url: "/",
    siteName: "Meshur Marketplace",
    title: "Meshur Marketplace",
    description:
      "Modern marketplace application for quality products. Shop with confidence and discover amazing deals.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Meshur Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meshur Marketplace",
    description:
      "Modern marketplace application for quality products. Shop with confidence and discover amazing deals.",
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
  verification: {
    // Add your verification codes here
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

/**
 * Root Layout
 * This layout is only used for non-locale routes (like /api, /_next, etc.)
 * All user-facing routes are handled by app/[locale]/layout.tsx
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
                // Always default to light mode, only use dark if explicitly set
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  // Explicitly ensure light mode
                  document.documentElement.classList.remove('dark');
                  // Set light mode as default if not set
                  if (!theme) {
                    localStorage.setItem('theme', 'light');
                  }
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
