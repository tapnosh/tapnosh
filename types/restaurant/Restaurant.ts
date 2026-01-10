import { type PutBlobResult } from "@vercel/blob";

import { RestaurantCategory } from "@/types/category/Category";
import { RestaurantTheme } from "@/types/theme/Theme";

import { Builder } from "../builder/BuilderSchema";

export enum RestaurantPriceRange {
  LOW = "low",
  MID = "mid",
  HIGH = "high",
}

export interface OperatingHoursDay {
  openFrom: string;
  openUntil: string;
}

export interface OperatingHours {
  monday: OperatingHoursDay;
  tuesday: OperatingHoursDay;
  wednesday: OperatingHoursDay;
  thursday: OperatingHoursDay;
  friday: OperatingHoursDay;
  saturday: OperatingHoursDay;
  sunday: OperatingHoursDay;
}

export interface Restaurant {
  id: string;
  slug: string;
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
    country: string;
    countryCode: string;
    postalCode: string;
    lat: number;
    lng: number;
  };
  images: PutBlobResult[];
  categories: RestaurantCategory[];
  phoneNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  reservationUrl?: string;
  priceRange: RestaurantPriceRange;
  operatingHours?: OperatingHours;
  menu?: Builder;
}
