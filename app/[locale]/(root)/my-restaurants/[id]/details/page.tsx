import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/data-display/card";
import { authFetch } from "@/lib/auth/client";
import { Restaurant } from "@/types/restaurant/Restaurant";

import { RestaurantFormEdit } from "./edit-form";

// CHANGED: Replaced static metadata with generateMetadata function to support i18n translations
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("restaurants.details.page");

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "restaurant details",
      "edit restaurant",
      "restaurant settings",
      "restaurant information",
      "contact details",
    ],
  };
}

export default async function RestaurantEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await authFetch<Restaurant>(`restaurants/${id}`);
  const t = await getTranslations("restaurants.details.page");

  return (
    <>
      <section className="section items-center">
        <h1>{restaurant.name}</h1>
        <h6>{t("subtitle", { restaurantName: restaurant.name })}</h6>
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
