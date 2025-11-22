import { Restaurant as RestaurantSchema, WithContext } from "schema-dts";

import { Builder } from "@/types/builder/BuilderSchema";
import { Restaurant } from "@/types/restaurant/Restaurant";

import { generateMenuItemSchema } from "./generateMenuItemSchema";

export function generateRestaurant(
  restaurant: Restaurant,
  menuSchema: Builder | undefined,
  slug: string,
): WithContext<RestaurantSchema> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const schema: WithContext<RestaurantSchema> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address
      ? {
          "@type": "PostalAddress",
          streetAddress: restaurant.address,
        }
      : undefined,
    image: restaurant.images?.map((img) => img.url) || [],
    url: `${baseUrl}/restaurants/${slug}`,
    servesCuisine: restaurant.categories?.map((cat) => cat.name) || [],
    priceRange: "$$", // TODO - make dynamic if possible
  };

  if (menuSchema?.menu && menuSchema.menu.length > 0) {
    // Flatten all menu items from all groups
    const allMenuItems = menuSchema.menu.flatMap((group) =>
      group.items.map((dish) => generateMenuItemSchema(dish, slug, dish.id)),
    );

    schema.hasMenu = {
      "@type": "Menu",
      name: `${restaurant.name} Menu`,
      inLanguage: "en",
      hasMenuItem: allMenuItems,
    };
  }

  return schema;
}
