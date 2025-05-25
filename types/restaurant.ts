export interface Theme {
  id: string;
  color: string;
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
  images: string[];
  categories: string[];
}
