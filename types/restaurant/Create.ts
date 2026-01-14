import { z } from "zod";

import { BlobImageSchema, UploadImageSchema } from "../image/BlobImage";

const RestaurantCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export const AddressSchema = z
  .object({
    formattedAddress: z.string(),
    streetNumber: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    countryCode: z.string(),
    postalCode: z.string(),
    lat: z.number(),
    lng: z.number(),
  })
  .superRefine((data, ctx) => {
    // Check if address is completely empty (not selected at all)
    if (!data.formattedAddress || data.formattedAddress.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address is required",
        path: [],
      });
      return;
    }

    // Check if any required field is missing (incomplete address)
    const requiredFields = [
      "streetNumber",
      "street",
      "city",
      "state",
      "country",
      "countryCode",
      "postalCode",
    ] as const;

    const missingFields = requiredFields.filter(
      (field) => !data[field] || data[field].trim() === "",
    );

    if (missingFields.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Invalid address selected. Please select a different address with complete details.",
        path: [],
      });
    }
  });

export const RestaurantFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(1, "Restaurant name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(250, "Description must be less than 250 characters"),
  theme_id: z
    .string({ required_error: "Theme color is required" })
    .uuid("Theme ID must be a valid UUID format"),
  address: AddressSchema,
  images: z
    .array(z.union([UploadImageSchema, BlobImageSchema]))
    .min(1, "At least one image must be added")
    .max(5, "You can upload up to 5 images"),
  categories: z
    .array(RestaurantCategorySchema)
    .min(1, "At least one cuisine must be selected")
    .max(5, "You can select up to 5 cuisines"),
  // Contact information
  phoneNumber: z.string().nullish(),
  facebookUrl: z
    .string()
    .url("Please enter a valid URL")
    .nullish()
    .or(z.literal("")),
  instagramUrl: z
    .string()
    .url("Please enter a valid URL")
    .nullish()
    .or(z.literal("")),
  reservationUrl: z
    .string()
    .url("Please enter a valid URL")
    .nullish()
    .or(z.literal("")),
  website: z
    .string()
    .url("Please enter a valid URL")
    .nullish()
    .or(z.literal("")),
  // Price range
  priceRange: z.enum(["low", "mid", "high"], {
    required_error: "Price range is required",
  }),
  // Operating hours per day
  operatingHours: z.object({
    monday: z.object({
      openFrom: z.string().min(1, "Opening time is required"),
      openUntil: z.string().min(1, "Closing time is required"),
    }),
    tuesday: z.object({
      openFrom: z.string().min(1, "Opening time is required"),
      openUntil: z.string().min(1, "Closing time is required"),
    }),
    wednesday: z.object({
      openFrom: z.string().min(1, "Opening time is required"),
      openUntil: z.string().min(1, "Closing time is required"),
    }),
    thursday: z.object({
      openFrom: z.string().min(1, "Opening time is required"),
      openUntil: z.string().min(1, "Closing time is required"),
    }),
    friday: z.object({
      openFrom: z.string().min(1, "Opening time is required"),
      openUntil: z.string().min(1, "Closing time is required"),
    }),
    saturday: z.object({
      openFrom: z.string().min(1, "Opening time is required"),
      openUntil: z.string().min(1, "Closing time is required"),
    }),
    sunday: z.object({
      openFrom: z.string().min(1, "Opening time is required"),
      openUntil: z.string().min(1, "Closing time is required"),
    }),
  }),
});

export type RestaurantFormData = z.infer<typeof RestaurantFormSchema>;
