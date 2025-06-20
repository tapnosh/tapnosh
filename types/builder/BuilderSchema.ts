import { z } from "zod";
import { MenuItemSchema } from "../menu/Menu";
import { BlobImageSchema, UploadImageSchema } from "../image/BlobImage";

const BuilderMenuItemSchema = MenuItemSchema.extend({
  image: z
    .array(z.union([UploadImageSchema, BlobImageSchema]))
    .max(1, "Only one image is allowed"),
});

const HeaderTextSchema = z.object({
  version: z.literal("v1"),
  type: z.literal("text"),
  text: z.string(),
});

const HeaderHeadingSchema = z.object({
  version: z.literal("v1"),
  type: z.literal("heading"),
  heading: z.string(),
});

export const BuilderSchema = z.object({
  header: z.array(z.union([HeaderTextSchema, HeaderHeadingSchema])),
  menu: z.array(
    z.object({
      version: z.literal("v1"),
      type: z.literal("menu-group"),
      name: z.string().min(1, "Menu group name is required"),
      timeFrom: z.string().min(1, "Time from is required"),
      timeTo: z.string().min(1, "Time to is required"),
      items: z.array(BuilderMenuItemSchema),
    }),
  ),
});

export type BuilderMenuItem = z.infer<typeof BuilderMenuItemSchema>;

export type HeaderText = z.infer<typeof HeaderTextSchema>;
export type HeaderHeading = z.infer<typeof HeaderHeadingSchema>;

export type Builder = z.infer<typeof BuilderSchema>;
