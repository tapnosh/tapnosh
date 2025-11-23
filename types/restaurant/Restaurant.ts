import { type PutBlobResult } from "@vercel/blob";

import { RestaurantCategory } from "@/types/category/Category";
import { RestaurantTheme } from "@/types/theme/Theme";

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
  address: {
    formattedAddress: string;
    streetNumber: string;
    street: string;
    city: string;
    state: string;
    stateCode: string;
    country: string;
    countryCode: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  images: PutBlobResult[];
  categories: RestaurantCategory[];
  menu?: Builder;
}
