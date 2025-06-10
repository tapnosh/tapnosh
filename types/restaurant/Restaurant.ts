import { RestaurantTheme } from "@/types/theme/Theme";
import { RestaurantCategory } from "@/types/category/Category";

export interface RestaurantImage {
  id: string;
  restaurant_id: string;
  image_url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  theme_id: string;
  createdAt: string;
  updatedAt: string;
  theme: RestaurantTheme;
  address: string | null;
  images: RestaurantImage[];
  categories: RestaurantCategory[];
}
