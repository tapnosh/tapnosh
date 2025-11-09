import { fetchRestaurant } from "@/features/restaurant/fetchRestaurant";
import { RestaurantHeader } from "../restaurant-page";
import { MenuInteractive } from "./menu-interactive";
import { fetchMenu } from "@/features/menu/fetchMenu";
import { ThemeSetter } from "@/features/theme/theme-setter";

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
      <MenuInteractive schema={schema} />
    </>
  );
}
