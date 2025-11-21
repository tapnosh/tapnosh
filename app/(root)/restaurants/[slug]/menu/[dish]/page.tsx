import { Metadata } from "next";
import { redirect } from "next/navigation";

import { fetchMenu } from "@/features/menu/fetchMenu";
import { fetchRestaurant } from "@/features/restaurant/fetchRestaurant";
import { findDishById } from "@/utils/dish-id";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; dish: string }>;
}): Promise<Metadata> {
  const { slug, dish: dishId } = await params;

  const restaurant = await fetchRestaurant(slug);

  if (!restaurant?.id) {
    return {
      title: "Restaurant not found",
    };
  }

  const { schema } = (await fetchMenu(restaurant.id)) || {};

  if (dishId && schema) {
    const result = findDishById(schema.menu, dishId);

    if (result) {
      const dish = result.item;
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

  return {
    title: `Menu - ${restaurant.name}`,
    description: `Browse the menu at ${restaurant.name}`,
  };
}

export default async function DishPage({
  params,
}: {
  params: Promise<{ slug: string; dish: string }>;
}) {
  const { slug, dish } = await params;

  // Redirect to the menu page with the dish query parameter
  redirect(`/restaurants/${slug}/menu?dish=${dish}`);
}
