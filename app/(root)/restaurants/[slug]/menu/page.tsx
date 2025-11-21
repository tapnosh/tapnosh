import { Metadata } from "next";

import { fetchMenu } from "@/features/menu/fetchMenu";
import { fetchRestaurant } from "@/features/restaurant/fetchRestaurant";
import { ThemeSetter } from "@/features/theme/theme-setter";

import { RestaurantHeader } from "../restaurant-page";

import { MenuInteractive } from "./menu-interactive";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const restaurant = await fetchRestaurant(slug);

  if (!restaurant?.id) {
    return {
      title: "Restaurant not found",
    };
  }

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
