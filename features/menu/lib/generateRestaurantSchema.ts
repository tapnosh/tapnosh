import {
  DayOfWeek,
  Restaurant as RestaurantSchema,
  WithContext,
} from "schema-dts";

import { Builder } from "@/types/builder/BuilderSchema";
import {
  OperatingHours,
  Restaurant,
  RestaurantPriceRange,
} from "@/types/restaurant/Restaurant";
import { isDayClosed } from "@/utils/operating-hours";

import { generateMenuItemSchema } from "./generateMenuItemSchema";

const PRICE_RANGE_MAP: Record<RestaurantPriceRange, string> = {
  low: "$",
  mid: "$$",
  high: "$$$",
};

const DAY_OF_WEEK_MAP: Record<keyof OperatingHours, DayOfWeek> = {
  monday: "https://schema.org/Monday",
  tuesday: "https://schema.org/Tuesday",
  wednesday: "https://schema.org/Wednesday",
  thursday: "https://schema.org/Thursday",
  friday: "https://schema.org/Friday",
  saturday: "https://schema.org/Saturday",
  sunday: "https://schema.org/Sunday",
};

function generateOpeningHoursSpecification(operatingHours?: OperatingHours) {
  if (!operatingHours) return undefined;

  const specifications = (
    Object.keys(DAY_OF_WEEK_MAP) as (keyof OperatingHours)[]
  )
    .filter((day) => {
      const hours = operatingHours[day];
      return hours && !isDayClosed(hours);
    })
    .map((day) => {
      const hours = operatingHours[day];
      return {
        "@type": "OpeningHoursSpecification" as const,
        dayOfWeek: DAY_OF_WEEK_MAP[day],
        opens: hours.openFrom,
        closes: hours.openUntil,
      };
    });

  return specifications.length > 0 ? specifications : undefined;
}

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
    address: restaurant?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: restaurant.address.formattedAddress,
        }
      : undefined,
    image: restaurant.images?.map((img) => img.url) || [],
    url: `${baseUrl}/restaurants/${slug}`,
    servesCuisine: restaurant.categories?.map((cat) => cat.name) || [],
    priceRange: PRICE_RANGE_MAP[restaurant.priceRange],
    acceptsReservations: restaurant.reservationUrl ? "Yes" : "No",
    telephone: restaurant?.phoneNumber,
    openingHoursSpecification: generateOpeningHoursSpecification(
      restaurant.operatingHours,
    ),
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
