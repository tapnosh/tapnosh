import { Restaurant } from "@/types/restaurant/Restaurant";
import { PageBuilder } from "./page-builder";
import { authFetch } from "@/lib/api/client";

export default async function MultipleComponents({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const restaurant = await authFetch<Restaurant>(`restaurants/${id}`);

  return <PageBuilder restaurant={restaurant} />;
}
