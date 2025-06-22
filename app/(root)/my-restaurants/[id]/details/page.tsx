import { Card, CardContent } from "@/components/ui/card";
import { RestaurantFormEdit } from "./edit-form";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { authFetch } from "@/lib/api/client";
import { redirect } from "next/navigation";

export default async function RestaurantEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const restaurant = await authFetch<Restaurant>(`restaurants/${id}`);

  return (
    <>
      <section className="section items-center">
        <h1>{restaurant.name}</h1>
        <h6>Edit {restaurant.name} details.</h6>
      </section>

      <section className="section items-center pb-8">
        <Card>
          <CardContent>
            <RestaurantFormEdit restaurant={restaurant} />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
