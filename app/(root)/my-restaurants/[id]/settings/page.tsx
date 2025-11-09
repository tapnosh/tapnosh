import { authFetch } from "@/lib/auth/client";
import { Restaurant } from "@/types/restaurant/Restaurant";

import { RestaurantFormDelete } from "./delete-form";

export default async function Settings({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await authFetch<Restaurant>(`restaurants/${id}`);

  return (
    <>
      <section className="section items-center">
        <h1>Settings</h1>
        <h6>{restaurant.name}</h6>
      </section>

      <section className="section items-center pb-8">
        <RestaurantFormDelete restaurant={restaurant} />
      </section>
    </>
  );
}
