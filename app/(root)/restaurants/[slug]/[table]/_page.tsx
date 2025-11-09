"use client";

import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { unstable_ViewTransition as ViewTransition , useState } from "react";

import { FiltersBar } from "@/features/filters/filters-bar";
import { Featured } from "@/features/menu/featured";
import { MenuItemCard } from "@/features/menu/menu-item";
import { MenuItemModal } from "@/features/menu/menu-item-modal";
import { SampleDishes } from "@/mock/menu/dishes";
import { MenuItem } from "@/types/menu/Menu";

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
        <h3 className="mb-4">Menu</h3>
        <FiltersBar />

        <h4>Appetizer</h4>
        <p className="text-muted-foreground mb-4">
          Served from 11:00 AM to 3:00 PM
        </p>

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
