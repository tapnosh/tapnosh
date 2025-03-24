"use client";
// import Carousel from "@/components/featured/carousel";
import { AddToTapDrawer } from "@/components/restaurant/menu/add-to-tap-drawer";
import { MenuItemCard } from "@/components/restaurant/menu/menu-item";
import { useState } from "react";
import { Carousel } from "@/components/ui/carousel";
import { EmblaOptionsType } from "embla-carousel";
import { SampleDishes } from "@/mock/menu/dishes";
import { MenuItem } from "@/types/menu";
import Image from "next/image";

export default function Order() {
  const [open, setOpen] = useState(false);
  const [menuItem, setMenuItem] = useState<MenuItem | undefined>();

  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
  const OPTIONS: EmblaOptionsType = {
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
        <div className="flex max-w-48 shrink-0 grow-0 items-center self-start rounded-4xl py-4 sm:max-w-3xs">
          <Image
            src="/images/sante-logo.svg"
            alt="Restaurant logo"
            width={300}
            height={600}
          />
        </div>

        {/* <h1>Restaurant name</h1> */}
        <h5 className="max-w-3xl">
          Talerzyki śródziemnomorskie 🌊 Na talerzu Francja, Hiszpania oraz
          Włochy, w kieliszku cały świat
        </h5>
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

      <section className="section @container mt-8">
        <h3 className="mb-2">Appetizer</h3>

        <article className="grid gap-4 @3xl:grid-cols-2 @6xl:grid-cols-3">
          {SampleDishes.map((dish) => (
            <MenuItemCard
              key={dish.id}
              item={dish}
              onClick={handleClick}
              onAddToCart={() => {}}
              isAvailable
            />
          ))}
        </article>
      </section>

      <AddToTapDrawer setOpen={setOpen} open={open} menuItem={menuItem} />
    </>
  );
}
