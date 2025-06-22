import { Restaurant } from "@/types/restaurant/Restaurant";

export async function fetchRestaurant(
  slug: string,
): Promise<Restaurant | undefined> {
  try {
    const response = await fetch(
      new URL(
        `public_api/restaurants/${slug}`,
        process.env.NEXT_PUBLIC_API_BASE_URL,
      ),
    );

    if (!response.ok) {
      console.error(`Failed to fetch restaurant: HTTP ${response.status}`);
      return undefined;
    }

    const text = await response.text();
    if (!text) {
      console.error("Empty response when fetching restaurant");
      return undefined;
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to fetch restaurant:", error);
    return undefined;
  }
}
