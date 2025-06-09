import { z } from "zod";

export const RestaurantThemeSchema = z.object({
  id: z.string().uuid(),
  color: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RestaurantTheme = z.infer<typeof RestaurantThemeSchema>;
