import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { authFetch } from "@/lib/auth/client";
import { Restaurant } from "@/types/restaurant/Restaurant";

import { PageBuilder } from "./page-builder";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("management.pageBuilder.page");

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "menu builder",
      "restaurant menu",
      "menu design",
      "menu management",
      "drag and drop menu",
    ],
  };
}

export default async function MultipleComponents({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await authFetch<Restaurant>(`restaurants/${id}`);

  return <PageBuilder restaurant={restaurant} />;
}
