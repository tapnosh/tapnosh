import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { Restaurant } from "@/types/restaurant";

export async function RestaurantList() {
  const response = await fetch("https://noshtap.onrender.com/restaurants", {
    cache: "no-store",
  });
  const restaurants: Restaurant[] = await response.json();

  console.log(restaurants);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
