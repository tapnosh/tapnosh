import { z } from "zod";

export const RestaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  description: z.string().optional(),
  theme_id: z.string().uuid("Invalid theme ID format"),
  //   address: z.string().min(1, "Address is required"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),
  category_ids: z
    .array(z.string().uuid())
    // .min(1, "At least one category must be selected")
    .optional(),
});

export type RestaurantFormData = z.infer<typeof RestaurantSchema>;
