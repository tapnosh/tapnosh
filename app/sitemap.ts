import { MetadataRoute } from "next";

import { Restaurant } from "@/types/restaurant/Restaurant";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tapnosh.com";
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

// Generate multiple sitemap segments
export async function generateSitemaps() {
  // Return array of sitemap IDs
  return [{ id: "static" }, { id: "restaurants" }];
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  // Static pages sitemap
  if (id === "static") {
    return [
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
    ];
  }

  // Restaurants sitemap
  if (id === "restaurants") {
    const sitemap: MetadataRoute.Sitemap = [];

    if (apiUrl) {
      try {
        const response = await fetch(
          new URL("public_api/restaurants", apiUrl),
          {
            next: { revalidate: 3600 },
          },
        );

        if (response.ok) {
          const restaurants = await response.json();

          if (Array.isArray(restaurants)) {
            restaurants.forEach((restaurant: Restaurant) => {
              sitemap.push({
                url: `${baseUrl}/restaurants/${restaurant.slug}`,
                lastModified: restaurant.updatedAt
                  ? new Date(restaurant.updatedAt)
                  : new Date(),
                changeFrequency: "weekly",
                priority: 0.8,
              });

              sitemap.push({
                url: `${baseUrl}/restaurants/${restaurant.slug}/menu`,
                lastModified: restaurant.updatedAt
                  ? new Date(restaurant.updatedAt)
                  : new Date(),
                changeFrequency: "weekly",
                priority: 0.7,
              });
            });
          }
        }
      } catch (error) {
        console.error("Error fetching restaurants for sitemap:", error);
      }
    }

    return sitemap;
  }

  return [];
}
