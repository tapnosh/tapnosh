import { Restaurant as RestaurantType } from "@/types/restaurant/Restaurant";
import { RestaurantPage } from "./restaurant-page";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function generateStaticParams() {
  const restaurants = await fetch(new URL("restaurants", baseUrl), {
    next: { revalidate: 3600 },
  }).then((res) => res.json());

  return restaurants.map((restaurant: RestaurantType) => ({
    id: restaurant.id,
  }));
}

export default async function Restaurant({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let schema;
  try {
    const response = await fetch(new URL(`restaurants/${id}/menu`, baseUrl));
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const text = await response.text();
    schema = text ? JSON.parse(text) : undefined;
  } catch (error) {
    console.error("Failed to fetch or parse menu data:", error);
  }

  if (!schema) {
    return <section className="section">This restaurant has no page.</section>;
  }

  return <RestaurantPage schema={schema} />;
}
