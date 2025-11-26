export interface Category {
  id: string;
  name: string;
}

export interface FilterState {
  priceRange: [number, number];
  food_types: string[];
  allergens: string[];
}
