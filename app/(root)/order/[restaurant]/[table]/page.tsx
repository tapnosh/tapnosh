"use client";
// import Carousel from "@/components/featured/carousel";
import { AddToTapDrawer } from "@/components/restaurant/menu/add-to-tap-drawer";
import { RestaurantMenuItem } from "@/components/restaurant/menu/menu-item";
import { useState } from "react";
import { Carousel } from "@/components/ui/carousel";
import { EmblaOptionsType } from "embla-carousel";
import { SampleDishes } from "@/mock/menu/dishes";
import { MenuItem } from "@/types/menu";

export default function Order() {
  const [open, setOpen] = useState(false);
  const [menuItem, setMenuItem] = useState<MenuItem | undefined>();

  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
  const OPTIONS: EmblaOptionsType = {
    dragFree: true,
    loop: true,
    align: "start",
  };

  const handleClick = (item: MenuItem) => {
    setMenuItem(item);
    setOpen(true);
  };

  return (
    <>
      <section className="section">
        <h1>Restaurant name</h1>
        <h5>Some restaurant description</h5>
      </section>
      <section className="section pb-2 lg:pb-4">
        <h3>Chef Picks</h3>
      </section>
      <Carousel
        slides={SLIDES}
        options={OPTIONS}
        slideHeight="40vh"
        slideSize="40vh"
      />

      <section className="section mt-8">
        <h3 className="mb-2">Appetizer</h3>

        <article className="flex flex-col gap-4">
          {SampleDishes.map((dish) => (
            <RestaurantMenuItem
              key={dish.id}
              item={dish}
              onClick={handleClick}
            />
          ))}
        </article>
      </section>

      <AddToTapDrawer setOpen={setOpen} open={open} menuItem={menuItem} />
    </>
  );
}
