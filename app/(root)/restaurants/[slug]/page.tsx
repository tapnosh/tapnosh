"use client";
import Carousel from "@/components/featured/carousel";
import { AddToTapDrawer } from "@/components/restaurant/menu/add-to-tap-drawer";
import { RestaurantMenuItem } from "@/components/restaurant/menu/menu-item";
import { useState } from "react";

export default function Restaurant() {
  const [open, setOpen] = useState(false);

  const carouselItems = [
    {
      id: 1,
      image: "https://picsum.photos/601/1201",
      title: "Explore Amazing Destinations",
    },
    {
      id: 2,
      image: "https://picsum.photos/604/1203",
      title: "Discover New Adventures",
    },
    {
      id: 3,
      image: "https://picsum.photos/606/1203",
      title: "Experience Luxury Travel",
    },
    {
      id: 4,
      image: "https://picsum.photos/607/1202",
      title: "Unforgettable Journeys",
    },
    {
      id: 5,
      image: "https://picsum.photos/602/1208",
      title: "Create Lasting Memories",
    },
  ];

  const ingredients = ["chicken", "tomato", "onion", "garlic", "ginger"];

  return (
    <>
      <section className="section">
        <h1>Restaurant name</h1>
        <h5>Some restaurant description</h5>
      </section>
      <section className="section pb-2 lg:pb-4">
        <h3>Chef Picks</h3>
      </section>
      <Carousel items={carouselItems} />

      <section className="section mt-8">
        <h3 className="mb-2">Menu</h3>

        <article className="flex flex-col gap-4">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <RestaurantMenuItem
                key={index}
                ingredients={ingredients}
                setOpen={setOpen}
              />
            ))}
        </article>
      </section>

      <AddToTapDrawer setOpen={setOpen} open={open} />
    </>
  );
}
