import { MenuResponse } from "@/types/menu/Menu";

export async function fetchMenu(
  restaurantId: string,
): Promise<MenuResponse | undefined> {
  try {
    const response = await fetch(
      new URL(
        `public_api/restaurants/${restaurantId}/menu`,
        process.env.NEXT_PUBLIC_API_BASE_URL,
      ),
    );

    if (!response.ok) {
      console.error(`Failed to fetch menu: HTTP ${response.status}`);
      return undefined;
    }

    const text = await response.text();
    if (!text) {
      console.error("Empty response when fetching menu");
      return undefined;
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to fetch or parse menu data:", error);
    return undefined;
  }
}
