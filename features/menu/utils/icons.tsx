import {
  Apple,
  Beef,
  Circle,
  CookingPot,
  Droplets,
  Fish,
  Flame,
  Leaf,
  Milk,
  Nut,
  Salad,
  Sparkles,
  Wheat,
  WheatOff,
  Wine,
} from "lucide-react";

// Allergen icon mappings based on allergen IDs from translations/categories/en.json
export const allergenIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "allergen.gluten": Wheat,
  "allergen.crustaceans": Fish,
  "allergen.eggs": Apple,
  "allergen.fish": Fish,
  "allergen.peanuts": Nut,
  "allergen.soybeans": Leaf,
  "allergen.milk": Milk,
  "allergen.nuts": Nut,
  "allergen.celery": Salad,
  "allergen.mustard": Circle,
  "allergen.sesame": Circle,
  "allergen.sulphites": Circle,
  "allergen.lupin": Circle,
  "allergen.molluscs": Fish,
  "allergen.alcohol": Wine,
  "allergen.caffeine": Droplets,
  "allergen.additives": Circle,
};

// Food type icon mappings based on food_type IDs from translations/categories/en.json
export const foodTypeIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "food_type.vegan": Leaf,
  "food_type.vegetarian": Leaf,
  "food_type.gluten_free": WheatOff,
  "food_type.lactose_free": Milk,
  "food_type.sugar_free": Circle,
  "food_type.keto": Beef,
  "food_type.low_carb": Salad,
  "food_type.high_protein": Beef,
  "food_type.halal": Sparkles,
  "food_type.kosher": Sparkles,
  "food_type.spicy": Flame,
  "food_type.mild": Circle,
  "food_type.hot": Flame,
  "food_type.raw": Droplets,
  "food_type.organic": Leaf,
  "food_type.local": Circle,
  "food_type.home_made": CookingPot,
};

// Helper function to get allergen icon component
export const getAllergenIcon = (allergenId: string) => {
  return allergenIcons[allergenId] || WheatOff;
};

// Helper function to get food type icon component
export const getFoodTypeIcon = (foodTypeId: string) => {
  return foodTypeIcons[foodTypeId] || CookingPot;
};
