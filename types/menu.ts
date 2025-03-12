import { z } from "zod";

export const MenuItemSchema = z.object({
  category: z.string(),
  name: z.string(),
  price: z.number().positive(),
  id: z.string(),
  currency: z.string(),
  ingredients: z.array(z.string()),
  tags: z.array(z.string()),
  image: z.string().url(),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;

export const MenuSchema = z.array(MenuItemSchema);

export type Menu = z.infer<typeof MenuSchema>;
