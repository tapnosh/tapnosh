import { type PutBlobResult } from "@vercel/blob";

import { RestaurantCategory } from "@/types/category/Category";

export interface RestaurantMapItem {
  id: string;
  name: string;
  description: string;
  slug: string;
  theme: {
    id: string;
    color: string;
  };
  images: PutBlobResult[];
  categories: RestaurantCategory[];
  address?: {
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
  menu?: {
    menu: MenuGroup[];
    header: MenuHeader[];
  };
}

export interface MenuGroup {
  name: string;
  type: "menu-group";
  items: MenuItemData[];
  timeTo?: string;
  timeFrom?: string;
  version: string;
}

export interface MenuItemData {
  id: string;
  name: string;
  image?: PutBlobResult[];
  price: {
    amount: number;
    currency: string;
  };
  version: string;
  categories?: string[];
  description?: string;
  ingredients?: string[];
}

export interface MenuHeader {
  type: "heading" | "text";
  heading?: string;
  text?: string;
  version: string;
}
