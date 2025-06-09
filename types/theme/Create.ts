import { z } from "zod";

export const RestaurantThemeFormSchema = z.object({
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, {
    message:
      "Invalid color format. Must be a 7-character hex code (e.g., #RRGGBB).",
  }),
});

export type RestaurantThemeFormData = z.infer<typeof RestaurantThemeFormSchema>;
