import { RestaurantCard } from "@/components/restuaurant/restaurant-card";

const mockRestaurants = [
  {
    id: 1,
    name: "Trattoria Italiana",
    description:
      "Authentic Italian cuisine with homemade pasta and wood-fired pizzas in a cozy atmosphere.",
    address: "ul. Kraszewskiego 8, Jeżyce",
    district: "Jeżyce",
    foodType: "Italian",
    images: [
      "https://picsum.photos/600/350",
      "https://picsum.photos/600/350",
      "https://picsum.photos/600/350",
    ],
    rating: 4.7,
  },
  {
    id: 2,
    name: "Polish Flavors",
    description:
      "Traditional Polish dishes made from family recipes passed down through generations.",
    address: "ul. Półwiejska 42, Centrum",
    district: "Centrum",
    foodType: "Polish",
    images: [
      "https://picsum.photos/600/350",
      "https://picsum.photos/600/350",
      "https://picsum.photos/600/350",
    ],
    rating: 4.5,
  },
  {
    id: 3,
    name: "Asian Fusion",
    description:
      "A blend of various Asian cuisines with a modern twist, offering a unique dining experience.",
    address: "ul. Dębiecka 17, Dębiec",
    district: "Dębiec",
    foodType: "Asian",
    images: [
      "https://picsum.photos/600/350",
      "https://picsum.photos/600/350",
      "https://picsum.photos/600/350",
    ],
    rating: 4.3,
  },
  {
    id: 4,
    name: "Taco Fiesta",
    description:
      "Vibrant Mexican restaurant serving authentic tacos, burritos, and refreshing margaritas.",
    address: "ul. Święty Marcin 24, Centrum",
    district: "Centrum",
    foodType: "Mexican",
    images: [
      "https://picsum.photos/600/350",
      "https://picsum.photos/600/350",
      "https://picsum.photos/600/350",
    ],
    rating: 4.2,
  },
  {
    id: 5,
    name: "Pierogi Paradise",
    description:
      "Specializing in a variety of traditional and innovative pierogi fillings in a casual setting.",
    address: "ul. Robocza 5, Wilda",
    district: "Wilda",
    foodType: "Polish",
    images: [
      "https://picsum.photos/600/350",
      "https://picsum.photos/600/350",
      "https://picsum.photos/600/350",
    ],
    rating: 4.6,
  },
  {
    id: 6,
    name: "Burger Joint",
    description:
      "Gourmet burgers made with locally sourced ingredients and homemade sauces.",
    address: "ul. Głogowska 108, Grunwald",
    district: "Grunwald",
    foodType: "American",
    images: [
      "https://picsum.photos/600/350",
      "https://picsum.photos/600/350",
      "https://picsum.photos/600/350",
    ],
    rating: 4.4,
  },
];

export function RestaurantList() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {mockRestaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
