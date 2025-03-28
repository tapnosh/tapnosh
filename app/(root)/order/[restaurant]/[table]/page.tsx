"use client";
import { MenuItemCard } from "@/components/menu/menu-item";
import { Featured } from "@/components/menu/featured";
import { SampleDishes } from "@/mock/menu/dishes";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { MenuItem } from "@/types/menu";
import { MenuItemModal } from "@/components/menu/menu-item-modal";

export default function Order() {
  const [open, setOpen] = useState(false);
  const [menuItem, setMenuItem] = useState<MenuItem | undefined>();

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
      <Featured
        items={SampleDishes.slice(0, 3)}
        options={{
          loop: true,
          align: "start",
          dragFree: true,
        }}
        slideHeight="40vh"
        slideSize="40vh"
        onAddToCart={handleClick}
      />

      <section className="section @container mt-8">
        <h3 className="mb-4">Appetizer</h3>

        <article className="grid gap-4 @3xl:grid-cols-2 @3xl:gap-8">
          <AnimatePresence>
            {SampleDishes.map((dish) => (
              <MenuItemCard
                key={dish.id}
                item={dish}
                onClick={handleClick}
                onAddToCart={handleClick}
                isAvailable
              />
            ))}
          </AnimatePresence>
        </article>
      </section>

      <MenuItemModal menuItem={menuItem} open={open} setOpen={setOpen} />
    </>
  );
}
