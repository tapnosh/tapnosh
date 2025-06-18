import { z } from "zod";

const fileSizeLimit = 5 * 1024 * 1024; // 5MB

export const ImageUploadSchema = z
  .instanceof(File)
  .refine(
    (file) =>
      [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/svg",
        "image/svg+xml",
      ].includes(file.type),
    { message: "Invalid image file type" },
  )
  .refine((file) => file.size <= fileSizeLimit, {
    message: "File size should not exceed 5MB",
  });

export const RestaurantFormSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  description: z.string().optional(),
  theme_id: z.string().uuid("Theme color is required"),
  //   address: z.string().min(1, "Address is required"),
  images: z.array(ImageUploadSchema).min(1, "At least one image must be added"),
  category_ids: z
    .array(z.string().uuid())
    // .min(1, "At least one category must be selected")
    .optional(),
});

export type RestaurantFormData = z.infer<typeof RestaurantFormSchema>;
