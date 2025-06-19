import { BlobImageSchema } from "./BlobImage";
import { z } from "zod";
import { MenuItemSchema } from "../menu/Menu";
import { ImageUploadSchema } from "../restaurant/Create";

const BuilderImageSchema = z.object({
  file: ImageUploadSchema,
  url: z.string().url(),
});

const BuilderMenuItemSchema = MenuItemSchema.extend({
  image: z
    .array(z.union([BuilderImageSchema, BlobImageSchema]))
    .max(1, "Only one image is allowed")
    .min(1, "At least one image is required"),
});

const HeaderSchema = z.object({
  type: z.literal("text"),
  description: z.string(),
});

export const BuilderSchema = z.object({
  header: z.array(HeaderSchema),
  menu: z.array(
    z.object({
      type: z.literal("menu-group"),
      name: z.string().min(1, "Menu group name is required"),
      items: z.array(BuilderMenuItemSchema),
    }),
  ),
});

export type Builder = z.infer<typeof BuilderSchema>;
