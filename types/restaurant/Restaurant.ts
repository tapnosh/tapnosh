import { RestaurantTheme } from "@/types/theme/Theme";
import { RestaurantCategory } from "@/types/category/Category";
import { PutBlobResult } from "@vercel/blob";
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  theme_id: string;
  createdAt: string;
  updatedAt: string;
  theme: RestaurantTheme;
  address: string | null;
  images: PutBlobResult[];
  categories: RestaurantCategory[];
}
