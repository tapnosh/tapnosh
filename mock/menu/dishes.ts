import { MenuItem } from "@/types/menu/Menu";

export const SampleDishes: MenuItem[] = [
  {
    version: "v1",
    name: "Fried Pickles",
    description:
      "Crispy breaded dill pickle spears fried to golden perfection. Served with ranch dipping sauce.",
    price: { currency: "USD", amount: 5.99 },
    id: "fried-pickles",
    ingredients: ["pickles", "flour", "egg", "breadcrumbs"],
    categories: ["dairy-free", "hot"],
    image: "https://picsum.photos/600/400",
  },
  {
    version: "v1",
    name: "Onion Rings",
    description:
      "Sweet onion slices coated in a light, crispy batter and fried until golden. Served with a tangy dipping sauce.",
    price: { currency: "USD", amount: 6.99 },
    id: "onion-rings",
    ingredients: ["onion", "flour", "egg", "breadcrumbs"],
    categories: ["vegetarian", "gluten-free"],
  },
  {
    version: "v1",
    name: "Mozzarella Sticks",
    description:
      "Gooey mozzarella wrapped in a crispy breaded coating. Served with marinara sauce for dipping.",
    price: { currency: "USD", amount: 7.99 },
    id: "mozzarella-sticks",
    ingredients: ["mozzarella", "flour", "egg", "breadcrumbs"],
    categories: ["gluten-free", "meat"],
  },
  {
    version: "v1",
    name: "Cheeseburger",
    description:
      "Juicy beef patty topped with melted cheese, fresh lettuce, tomato, and onion on a toasted bun. Served with fries.",
    price: { currency: "USD", amount: 10.99 },
    id: "cheeseburger",
    ingredients: ["beef", "cheese", "lettuce", "tomato", "onion"],
    categories: ["meat"],
    image: "https://picsum.photos/600/400",
  },
  {
    version: "v1",
    name: "Tikka masala",
    description: "Nice",
    price: { currency: "USD", amount: 34.0 },
    id: "tikka-masala",
    ingredients: ["chicken", "tomato", "onion", "garlic", "ginger"],
    categories: ["meat", "hot"],
    image: "https://picsum.photos/600/350",
  },
];
