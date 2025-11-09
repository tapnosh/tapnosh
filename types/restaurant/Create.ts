import { z } from "zod";

import { BlobImageSchema, UploadImageSchema } from "../image/BlobImage";

export const RestaurantFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(1, "Restaurant name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().max(500).optional(),
  theme_id: z
    .string({ required_error: "Theme color is required" })
    .uuid("Theme ID must be a valid UUID format"),
  //   address: z.string().min(1, "Address is required"),
  images: z
    .array(z.union([UploadImageSchema, BlobImageSchema]))
    .min(1, "At least one image must be added")
    .max(5, "You can upload up to 5 images"),
  category_ids: z
    .array(z.string().uuid())
    .max(5, "You can select up to 5 categories")
    // .min(1, "At least one category must be selected")
    .optional(),
});

export type RestaurantFormData = z.infer<typeof RestaurantFormSchema>;
