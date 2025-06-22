import { Restaurant as RestaurantType } from "@/types/restaurant/Restaurant";
import { RestaurantPage } from "./restaurant-page";
import { ThemeSetter } from "@/components/theme/theme-setter";
import { fetchMenu } from "@/lib/api/menu/fetchMenu";
import { fetchRestaurant } from "@/lib/api/restaurant/fetchRestaurant";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function generateStaticParams() {
  const restaurants = await fetch(new URL("public_api/restaurants", baseUrl), {
    next: { revalidate: 3600 },
  }).then((res) => res.json());

  return restaurants.map((restaurant: RestaurantType) => ({
    slug: restaurant.slug,
  }));
}

export default async function Restaurant({
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
      <RestaurantPage restaurant={restaurant} schema={schema} />
      <ThemeSetter color={restaurant.theme.color} />
    </>
  );
}
