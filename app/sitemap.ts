import type { MetadataRoute } from "next";

/**
 * Dynamic sitemap generation
 * Updates automatically based on your routes
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meshur.co";
  const currentDate = new Date().toISOString();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    // Add more static routes here as needed
    // {
    //   url: `${baseUrl}/products`,
    //   lastModified: currentDate,
    //   changeFrequency: "daily",
    //   priority: 0.8,
    // },
  ];

  // Dynamic routes can be added here
  // Example: Fetch products from API and generate routes
  // const products = await fetchProducts();
  // const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
  //   url: `${baseUrl}/products/${product.id}`,
  //   lastModified: product.updatedAt,
  //   changeFrequency: "weekly",
  //   priority: 0.6,
  // }));

  return [...staticRoutes];
}
