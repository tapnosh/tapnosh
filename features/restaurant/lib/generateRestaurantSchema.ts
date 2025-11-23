import { Restaurant as RestaurantSchema, WithContext } from "schema-dts";

import { Restaurant } from "@/types/restaurant/Restaurant";

export function generateRestaurantSchema(
  restaurant: Restaurant,
  slug: string,
): WithContext<RestaurantSchema> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address.formattedAddress
      ? {
          "@type": "PostalAddress",
          streetAddress: restaurant.address.formattedAddress,
        }
      : undefined,
    image: restaurant.images?.map((img) => img.url) || [],
    url: `${baseUrl}/restaurants/${slug}`,
    servesCuisine: restaurant.categories?.map((cat) => cat.name) || [],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "10",
      bestRating: "5",
      worstRating: "1",
    },
    priceRange: "$$",
  };
}
