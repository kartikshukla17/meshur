import type { NextConfig } from "next";

/**
 * Next.js Configuration
 * Optimized for production with performance and SEO in mind
 */
const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.meshur.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "meshur.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 100],
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Experimental features (if needed)
  // experimental: {
  //   optimizePackageImports: ['@/components'],
  // },
};

export default nextConfig;
