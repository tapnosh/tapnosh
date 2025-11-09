import { Restaurant } from "@/types/restaurant/Restaurant";
import { PageBuilder } from "./page-builder";
import { authFetch } from "@/lib/auth/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu Builder",
  description:
    "Build and customize your restaurant menu with our intuitive drag-and-drop menu builder. Create beautiful, organized menus for your customers.",
  keywords: [
    "menu builder",
    "restaurant menu",
    "menu design",
    "menu management",
    "drag and drop menu",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MultipleComponents({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const restaurant = await authFetch<Restaurant>(`restaurants/${id}`);

  return <PageBuilder restaurant={restaurant} />;
}
