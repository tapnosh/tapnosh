import { RestaurantTheme } from "@/types/theme/Theme";
import { RestaurantCategory } from "@/types/category/Category";
import { PutBlobResult } from "@vercel/blob";
import { Builder } from "../builder/BuilderSchema";
export interface Restaurant {
  id?: string;
  slug?: string;
  name: string;
  description: string;
  theme_id: string;
  createdAt: string;
  updatedAt: string;
  theme: RestaurantTheme;
  address: string | null;
  images: PutBlobResult[];
  categories: RestaurantCategory[];
  menu?: Builder;
}
