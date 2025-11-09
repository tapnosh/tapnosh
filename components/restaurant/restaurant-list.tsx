import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { authFetch } from "@/lib/api/client";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { tryCatch } from "@/lib/tryCatch";

export async function RestaurantList() {
  const [error, restaurants] = await tryCatch(
    authFetch<Restaurant[]>("public_api/restaurants", {
      cache: "no-store",
    }),
  );

  const restaurantList = error ? [] : restaurants;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {restaurantList?.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
