import { z } from "zod";

export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string(),
  price: z.number().positive(),
  currency: z.string(),
  ingredients: z.array(z.string()),
  categories: z.array(z.string()),
  image: z.string().url().optional(),
  confirmed: z.boolean().optional(),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;

export const MenuSchema = z.array(MenuItemSchema);

export type Menu = z.infer<typeof MenuSchema>;
