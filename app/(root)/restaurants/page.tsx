import { RestaurantList } from "@/features/restaurant/restaurant-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Restaurants",
  description:
    "Explore restaurants supporting the tapnosh app. Discover amazing dining experiences, browse menus, and find your next favorite restaurant.",
  keywords: [
    "browse restaurants",
    "restaurant directory",
    "dining options",
    "restaurant list",
    "food discovery",
    "tapnosh restaurants",
  ],
  openGraph: {
    title: "Browse Restaurants | tapnosh",
    description:
      "Explore restaurants supporting the tapnosh app. Discover amazing dining experiences and find your next favorite restaurant.",
    url: "https://tapnosh.com/restaurants",
  },
  twitter: {
    title: "Browse Restaurants | tapnosh",
    description:
      "Explore restaurants supporting the tapnosh app. Discover amazing dining experiences and find your next favorite restaurant.",
  },
  alternates: {
    canonical: "https://tapnosh.com/restaurants",
  },
};

export default async function Restaurants() {
  return (
    <>
      <section className="section items-center">
        <h1>Restaurants</h1>
        <h6>
          Explore restaurants supporting the{" "}
          <span className="font-logo">tapnosh.</span> app
        </h6>
      </section>

      <section className="section items-center pb-8 lg:mt-12">
        <RestaurantList />
      </section>
    </>
  );
}
