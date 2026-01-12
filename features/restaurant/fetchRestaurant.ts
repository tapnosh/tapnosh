import { Restaurant } from "@/types/restaurant/Restaurant";

export async function fetchRestaurant(
  slug: string,
): Promise<Restaurant | undefined> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return undefined;
  }

  try {
    const response = await fetch(
      new URL(`public_api/restaurants/${slug}`, baseUrl),
      { cache: "no-store" },
    );

    if (!response.ok) {
      return undefined;
    }

    const text = await response.text();
    if (!text) {
      return undefined;
    }

    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
