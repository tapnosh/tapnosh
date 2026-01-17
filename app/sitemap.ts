import { MetadataRoute } from "next";

import { locales } from "@/i18n/routing";
import { sitemapLogger } from "@/lib/logger/app";
import { Restaurant } from "@/types/restaurant/Restaurant";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  sitemapLogger.info("Generating sitemap");

  if (!baseUrl) {
    sitemapLogger.error(
      "NEXT_PUBLIC_BASE_URL is not defined in environment variables",
    );
    return [];
  }

  const sitemap: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  sitemapLogger.info("Building static pages sitemap");

  for (const locale of locales) {
    sitemap.push(
      {
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/${locale}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${locale}/map`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${locale}/restaurants`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      // Note: /docs is excluded from sitemap as it's disallowed in robots.txt
    );
  }

  sitemapLogger.info({ count: sitemap.length }, "Generated static pages");

  // Restaurants
  if (apiUrl) {
    sitemapLogger.info({ apiUrl }, "Fetching restaurants from API");
    try {
      const response = await fetch(new URL("public_api/restaurants", apiUrl), {
        next: { revalidate: 3600 },
      });

      sitemapLogger.info(
        { status: response.status, statusText: response.statusText },
        "API response received",
      );

      if (response.ok) {
        const restaurants = await response.json();
        sitemapLogger.info(
          { count: Array.isArray(restaurants) ? restaurants.length : 0 },
          "Received restaurants",
        );

        if (Array.isArray(restaurants)) {
          for (const locale of locales) {
            restaurants.forEach((restaurant: Restaurant) => {
              sitemap.push({
                url: `${baseUrl}/${locale}/restaurants/${restaurant.slug}`,
                lastModified: restaurant.updatedAt
                  ? new Date(restaurant.updatedAt)
                  : new Date(),
                changeFrequency: "daily",
                priority: 0.8,
              });
            });
          }
          sitemapLogger.info(
            { count: sitemap.length },
            "Generated restaurant URLs",
          );
        }
      } else {
        sitemapLogger.warn(
          { status: response.status, statusText: response.statusText },
          "Failed to fetch restaurants",
        );
      }
    } catch (error) {
      sitemapLogger.error({ error }, "Error fetching restaurants for sitemap");
    }
  } else {
    sitemapLogger.warn("API URL not configured, skipping restaurant sitemap");
  }

  sitemapLogger.info({ count: sitemap.length }, "Returning sitemap entries");
  return sitemap;
}
