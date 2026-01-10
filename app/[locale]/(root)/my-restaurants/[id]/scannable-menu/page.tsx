import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ScannableMenuEditor } from "@/features/qr-code/scannable-menu";
import { authFetch } from "@/lib/auth/client";
import { Restaurant } from "@/types/restaurant/Restaurant";

export async function generateMetadata(): Promise<Metadata> {
  const tPage = await getTranslations("management.scannableMenu.page");
  const tSections = await getTranslations("management.scannableMenu.sections");

  return {
    title: tPage("title"),
    description: tSections("description"),
  };
}

export default async function ScannableMenu({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await authFetch<Restaurant>(`restaurants/${id}`);
  const t = await getTranslations("management.scannableMenu.page");

  return (
    <>
      <section className="section items-center">
        <h1>{restaurant.name}</h1>
        <h6>{t("subtitle")}</h6>
      </section>
      <section className="section items-center pb-8">
        <ScannableMenuEditor restaurantId={restaurant.id ?? ""} />
      </section>
    </>
  );
}
