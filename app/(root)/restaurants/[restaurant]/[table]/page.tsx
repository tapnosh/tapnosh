"use client";

import { unstable_ViewTransition as ViewTransition } from "react";
import { MenuItemCard } from "@/components/menu/menu-item";
import { Featured } from "@/components/menu/featured";
import { SampleDishes } from "@/mock/menu/dishes";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { MenuItem } from "@/types/menu";
import { MenuItemModal } from "@/components/menu/menu-item-modal";
import { useParams } from "next/navigation";

export default function Order() {
  const { restaurant, table } = useParams();
  const [open, setOpen] = useState(false);
  const [menuItem, setMenuItem] = useState<MenuItem | undefined>();

  const handleClick = (item: MenuItem) => {
    setMenuItem(item);
    setOpen(true);
  };
  return (
    <>
      <section className="section section-primary">
        <div className="flex max-w-48 shrink-0 grow-0 items-center self-start rounded-4xl py-4 sm:max-w-3xs">
          <Image
            src="/images/sante-logo.svg"
            alt="Restaurant logo"
            width={300}
            height={600}
          />
        </div>

        <ViewTransition name={`title-${restaurant}`}>
          <h1>
            Restaurant {restaurant} - {table}
          </h1>
        </ViewTransition>
        <ViewTransition name={`description-${restaurant}`}>
          <h5 className="text-primary-foreground">
            Talerzyki śródziemnomorskie 🌊 Na talerzu Francja, Hiszpania oraz
            Włochy, w kieliszku cały świat
          </h5>
        </ViewTransition>
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

      <section className="section @container my-8">
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
