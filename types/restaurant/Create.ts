import { z } from "zod";

import { BlobImageSchema, UploadImageSchema } from "../image/BlobImage";

export const AddressSchema = z.object({
  formattedAddress: z.string().min(1, "Address is required"),
  streetNumber: z.string().min(1, "Street number is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  stateCode: z.string().min(1, "State code is required"),
  country: z.string().min(1, "Country is required"),
  countryCode: z.string().min(1, "Country code is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  lat: z.number(),
  lng: z.number(),
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
  category_ids: z
    .array(z.string())
    .min(1, "At least one cuisine must be selected")
    .max(5, "You can select up to 5 cuisines"),
  // Contact information
  phoneNumber: z.string().optional(),
  facebookUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  instagramUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  reservationUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  // Price range
  priceRange: z.enum(["low", "mid", "high"], {
    required_error: "Price range is required",
  }),
});

export type RestaurantFormData = z.infer<typeof RestaurantFormSchema>;
