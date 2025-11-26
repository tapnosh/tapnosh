import { MetadataRoute } from "next";

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

  // Static pages
  sitemapLogger.info("Building static pages sitemap");
  sitemap.push(
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/restaurants`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  );
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
          restaurants.forEach((restaurant: Restaurant) => {
            sitemap.push({
              url: `${baseUrl}/restaurants/${restaurant.slug}`,
              lastModified: restaurant.updatedAt
                ? new Date(restaurant.updatedAt)
                : new Date(),
              changeFrequency: "daily",
              priority: 0.8,
            });
          });
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
