import { MenuItem, WithContext } from "schema-dts";

import { MenuItem as MenuItemType } from "@/types/menu/Menu";

export function generateMenuItemSchema(
  dish: MenuItemType,
  slug: string,
  dishId: string,
): WithContext<MenuItem> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const dishUrl = `${baseUrl}/restaurants/${slug}/${dishId}`;

  // Get image URL - handle both string and array formats
  let imageUrl: string | undefined;
  if (typeof dish.image === "string") {
    imageUrl = dish.image;
  } else if (Array.isArray(dish.image) && dish.image.length > 0) {
    imageUrl = dish.image[0].url;
  }

  const jsonLd: WithContext<MenuItem> = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: imageUrl,
    offers: {
      "@type": "Offer",
      price: dish.price.amount.toString(),
      priceCurrency: dish.price.currency,
      availability: "https://schema.org/InStock", // TODO - make dynamic if possible
      url: dishUrl,
    },
  };

  return jsonLd;
}
