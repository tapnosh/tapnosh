// CHANGED: Replaced static metadata with generateMetadata function to support i18n translations
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/data-display/card";

import { RestaurantFormCreate } from "./add-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("restaurants.form.fields.page");

  return {
    title: t("addYourRestaurant"),
    description: t("addDescription"),
    keywords: [
      "add restaurant",
      "list restaurant",
      "restaurant owner",
      "join tapnosh",
      "restaurant registration",
      "business listing",
    ],
    openGraph: {
      title: `${t("addYourRestaurant")} | tapnosh`,
      description: t("addOgDescription"),
      url: "https://tapnosh.com/restaurants/add",
    },
    twitter: {
      title: `${t("addYourRestaurant")} | tapnosh`,
      description: t("addOgDescription"),
    },
    alternates: {
      canonical: "https://tapnosh.com/restaurants/add",
    },
  };
}

export default async function RestaurantCreate() {
  const t = await getTranslations("restaurants.form.fields.page");

  return (
    <>
      <section className="section items-center">
        <h1>{t("addTitle")}</h1>
        <h6>
          {t("subtitle.before")}{" "}
          <span className="font-logo">{t("subtitle.brand")}</span>{" "}
          {t("subtitle.after")}
        </h6>
      </section>
      <section className="section items-center pb-8">
        <Card>
          <CardContent>
            <RestaurantFormCreate />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
