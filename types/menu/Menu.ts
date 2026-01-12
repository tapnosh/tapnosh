import { z } from "zod";

import { type Builder } from "../builder/BuilderSchema";

export type MenuResponse = {
  id: string;
  name: string;
  restaurant_id: string;
  schema: Builder;
  createdAt: string;
  updatedAt: string;
  is_deleted: boolean;
};

const RestaurantCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export const MenuItemSchema = z.object({
  version: z.literal("v1"),
  id: z.string(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(80, "Name must be less than 100 characters"),
  description: z.string().max(200).optional(),
  price: z.object({
    amount: z
      .number({ required_error: "Amount must be provided" })
      .positive("Amount must be a positive number"),
    currency: z.string(),
  }),
  allergens: z.array(RestaurantCategorySchema).max(10).optional(),
  food_types: z.array(RestaurantCategorySchema).max(10).optional(),
  image: z
    .union([
      z.string().url().optional(),
      z.array(z.object({ url: z.string().url() })).optional(),
    ])
    .optional(),
  confirmed: z.boolean().optional(),
  ingredients: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  isDisabled: z.boolean().optional(),
  disabledFrom: z.string().optional(),
  disabledUntil: z.string().nullable().optional(),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;

export const MenuSchema = z.array(MenuItemSchema);

export type Menu = z.infer<typeof MenuSchema>;
