import { z } from "zod";

export const MenuItemSchema = z.object({
  version: z.literal("v1"),
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.object({
    amount: z
      .number({ required_error: "Amount must be provided" })
      .positive("Amount must be a positive number"),
    currency: z.string(),
  }),
  ingredients: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  image: z
    .union([
      z.string().url().optional(),
      z.array(z.object({ url: z.string().url() })),
    ])
    .optional(),
  confirmed: z.boolean().optional(),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;

export const MenuSchema = z.array(MenuItemSchema);

export type Menu = z.infer<typeof MenuSchema>;
