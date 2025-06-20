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
  name: z
    .string()
    .min(1, "Restaurant name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().max(500).optional(),
  theme_id: z.string().uuid("Theme color is required"),
  //   address: z.string().min(1, "Address is required"),
  images: z
    .array(ImageUploadSchema)
    .min(1, "At least one image must be added")
    .max(5, "You can upload up to 5 images"),
  category_ids: z
    .array(z.string().uuid())
    .max(5, "You can select up to 5 categories")
    // .min(1, "At least one category must be selected")
    .optional(),
});

export type RestaurantFormData = z.infer<typeof RestaurantFormSchema>;
