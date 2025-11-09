import { MenuResponse } from "@/types/menu/Menu";
import { tryCatch } from "@/lib/tryCatch";

export async function fetchMenu(
  restaurantId: string,
): Promise<MenuResponse | undefined> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return undefined;
  }

  const [error, response] = await tryCatch(
    fetch(new URL(`public_api/restaurants/${restaurantId}/menu`, baseUrl)),
  );

  if (error || !response || !response.ok) {
    return undefined;
  }

  const [textError, text] = await tryCatch(response.text());
  if (textError || !text) {
    return undefined;
  }

  const [parseError, data] = tryCatch(() => JSON.parse(text));
  if (parseError) {
    return undefined;
  }

  return data;
}
