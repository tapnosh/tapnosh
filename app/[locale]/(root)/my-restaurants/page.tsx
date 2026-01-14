import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { MyRestaurantsList } from "./my-restaurants-list";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("management.dashboard.myRestaurants");

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "my restaurants",
      "restaurant management",
      "restaurant dashboard",
      "manage listings",
      "restaurant owner",
    ],
    openGraph: {
      title: `${t("title")} | tapnosh`,
      description: t("ogDescription"),
      url: "https://tapnosh.com/my-restaurants",
    },
    twitter: {
      title: `${t("title")} | tapnosh`,
      description: t("ogDescription"),
    },
    alternates: {
      canonical: "https://tapnosh.com/my-restaurants",
    },
  };
}

export default async function MyRestaurants() {
  const t = await getTranslations("management.dashboard.myRestaurants");

  return (
    <>
      <section className="section items-center">
        <h1>{t("title")}</h1>
      </section>
      <section className="section items-center pb-8">
        <MyRestaurantsList />
      </section>
    </>
  );
}
