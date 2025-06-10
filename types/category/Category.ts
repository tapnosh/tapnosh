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

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
