import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { authFetch } from "@/lib/api/client";
import { Restaurant } from "@/types/restaurant/Restaurant";

export async function RestaurantList() {
  let restaurants: Restaurant[] = [];

  try {
    restaurants = await authFetch<Restaurant[]>("restaurants", {
      cache: "no-store",
    });
  } catch {}

  console.log(restaurants);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {restaurants?.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
