import { Metadata } from "next";

import { fetchMenu } from "@/features/menu/fetchMenu";
import { fetchRestaurant } from "@/features/restaurant/fetchRestaurant";
import { ThemeSetter } from "@/features/theme/theme-setter";

import { RestaurantHeader } from "../restaurant-page";

import { MenuInteractive } from "./menu-interactive";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ dish?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { dish: dishId } = await searchParams;

  const restaurant = await fetchRestaurant(slug);

  if (!restaurant?.id) {
    return {
      title: "Restaurant not found",
    };
  }

  const { schema } = (await fetchMenu(restaurant.id)) || {};

  // If a dish is specified, generate OG image for that dish
  if (dishId && schema) {
    const dish = schema.menu
      .flatMap((group) => group.items)
      .find((item) => item.id === dishId);

    if (dish) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tapnosh.com";
      const dishImageUrl =
        typeof dish.image === "string"
          ? dish.image
          : Array.isArray(dish.image) && dish.image[0]
            ? dish.image[0].url
            : undefined;

      const ogImageUrl = new URL(`${baseUrl}/api/og/dish`);
      ogImageUrl.searchParams.set("name", dish.name);
      if (dish.ingredients?.length) {
        ogImageUrl.searchParams.set(
          "ingredients",
          dish.ingredients.join(" • "),
        );
      }
      ogImageUrl.searchParams.set("price", dish.price.amount.toString());
      ogImageUrl.searchParams.set("currency", dish.price.currency);
      if (dishImageUrl) {
        ogImageUrl.searchParams.set("image", dishImageUrl);
      }

      return {
        title: `${dish.name} - ${restaurant.name}`,
        description:
          dish.description ||
          `${dish.name} at ${restaurant.name}. ${dish.ingredients?.join(", ") || ""}`,
        openGraph: {
          title: dish.name,
          description: dish.description,
          images: [
            {
              url: ogImageUrl.toString(),
              width: 1200,
              height: 630,
              alt: dish.name,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: dish.name,
          description: dish.description,
          images: [ogImageUrl.toString()],
        },
      };
    }
  }

  // Default metadata for the menu page
  return {
    title: `Menu - ${restaurant.name}`,
    description: `Browse the menu at ${restaurant.name}`,
  };
}

export default async function RestaurantMenu({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const restaurant = await fetchRestaurant(slug);

  if (!restaurant?.id) {
    return <section className="section">Restaurant not found.</section>;
  }

  const { schema } = (await fetchMenu(restaurant.id)) || {};

  return (
    <>
      <RestaurantHeader showCta={false} restaurant={restaurant} />

      <ThemeSetter color={restaurant.theme.color} />
      <MenuInteractive schema={schema} restaurantSlug={slug} />
    </>
  );
}
