import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Restaurants",
  description:
    "Manage your restaurants on tapnosh. View analytics, update menus, and oversee your restaurant listings all in one place.",
  keywords: [
    "my restaurants",
    "restaurant management",
    "restaurant dashboard",
    "manage listings",
    "restaurant owner",
  ],
  openGraph: {
    title: "My Restaurants | tapnosh",
    description:
      "Manage your restaurants on tapnosh. View analytics, update menus, and oversee your restaurant listings.",
    url: "https://tapnosh.com/my-restaurants",
  },
  twitter: {
    title: "My Restaurants | tapnosh",
    description:
      "Manage your restaurants on tapnosh. View analytics, update menus, and oversee your restaurant listings.",
  },
  alternates: {
    canonical: "https://tapnosh.com/my-restaurants",
  },
};

export default async function MyRestaurants() {
  return <section className="section">This is my restaurants page</section>;
}
