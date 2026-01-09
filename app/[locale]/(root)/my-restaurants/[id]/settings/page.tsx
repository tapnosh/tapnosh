import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { authFetch } from "@/lib/auth/client";
import { Restaurant } from "@/types/restaurant/Restaurant";

import { RestaurantFormDelete } from "./delete-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("management.settings.page");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Settings({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await authFetch<Restaurant>(`restaurants/${id}`);
  const t = await getTranslations("management.settings.page");

  return (
    <>
      <section className="section items-center">
        <h1>{t("title")}</h1>
        <h6>{restaurant.name}</h6>
      </section>
      <section className="section items-center pb-8">
        <RestaurantFormDelete restaurant={restaurant} />
      </section>
    </>
  );
}
