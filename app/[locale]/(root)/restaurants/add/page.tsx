import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/data-display/card";

import { RestaurantFormCreate } from "./add-form";

export const metadata: Metadata = {
  title: "Add Your Restaurant",
  description:
    "Join tapnosh by adding your restaurant to our platform. Showcase your venue, manage your menu, and connect with food lovers in your area.",
  keywords: [
    "add restaurant",
    "list restaurant",
    "restaurant owner",
    "join tapnosh",
    "restaurant registration",
    "business listing",
  ],
  openGraph: {
    title: "Add Your Restaurant | tapnosh",
    description:
      "Join tapnosh by adding your restaurant to our platform. Showcase your venue and connect with food lovers.",
    url: "https://tapnosh.com/restaurants/add",
  },
  twitter: {
    title: "Add Your Restaurant | tapnosh",
    description:
      "Join tapnosh by adding your restaurant to our platform. Showcase your venue and connect with food lovers.",
  },
  alternates: {
    canonical: "https://tapnosh.com/restaurants/add",
  },
};

export default function RestaurantCreate() {
  return (
    <>
      <section className="section items-center">
        <h1>Add new Restaurant</h1>
        <h6>
          Add a new restaurant to the{" "}
          <span className="font-logo">tapnosh.</span> app
        </h6>
      </section>

      <section className="section items-center pb-8">
        <Card>
          <CardContent>
            <RestaurantFormCreate />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
