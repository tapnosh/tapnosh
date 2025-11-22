import { Menu, WithContext } from "schema-dts";

import { Menu as MenuType } from "@/types/menu/Menu";
import { Restaurant } from "@/types/restaurant/Restaurant";

import { generateMenuItemSchema } from "./generateMenuItemSchema";

export function generateMenuSchema(
  menu: MenuType,
  restaurant: Restaurant,
  slug: string,
): WithContext<Menu> {
  const menuItems = menu.map((dish) =>
    generateMenuItemSchema(dish, slug, dish.id),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${restaurant.name} Menu`,
    description: `Complete menu for ${restaurant.name}`,
    inLanguage: "en",
    hasMenuItem: menuItems,
  };
}
