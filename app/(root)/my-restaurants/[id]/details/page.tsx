import { Card, CardContent } from "@/components/ui/data-display/card";
import { RestaurantFormEdit } from "./edit-form";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { authFetch } from "@/lib/auth/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restaurant Details",
  description:
    "Edit your restaurant details, contact information, and basic settings. Keep your restaurant profile up to date for customers.",
  keywords: [
    "restaurant details",
    "edit restaurant",
    "restaurant settings",
    "restaurant information",
    "contact details",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

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
