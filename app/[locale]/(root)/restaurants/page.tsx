// CHANGED: Added generateMetadata and translations for Browse Restaurants page
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { RestaurantList } from "@/features/restaurant/restaurant-list";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("restaurants.browse");

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "browse restaurants",
      "restaurant directory",
      "dining options",
      "restaurant list",
      "food discovery",
      "tapnosh restaurants",
    ],
    openGraph: {
      title: `${t("title")} | tapnosh`,
      description: t("ogDescription"),
      url: "https://tapnosh.com/restaurants",
    },
    twitter: {
      title: `${t("title")} | tapnosh`,
      description: t("ogDescription"),
    },
    alternates: {
      canonical: "https://tapnosh.com/restaurants",
    },
  };
}

export default async function Restaurants() {
  const t = await getTranslations("restaurants.browse");

  return (
    <>
      <section className="section items-center">
        <h1>{t("heading")}</h1>
        <h6>
          {t("subheadingBefore")} <span className="font-logo">tapnosh.</span>{" "}
          {t("subheadingAfter")}
        </h6>
      </section>
      <section className="section items-center pb-8">
        <RestaurantList />
      </section>
    </>
  );
}
