export interface Theme {
  id: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantCategory {
  id: string;
  restaurant_id: string;
  category_id: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

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
  theme: Theme;
  address: string | null;
  images: RestaurantImage[];
  categories: RestaurantCategory[];
}
