"use server";

import { revalidatePath } from "next/cache";

export async function revalidateRestaurantPage(slug: string) {
  revalidatePath(`/restaurants/${slug}`);
}
