"use client";

import { AnimatePresence } from "motion/react";
import { useState } from "react";

import { FiltersBar } from "@/features/filters/filters-bar";
import { Featured } from "@/features/menu/featured";
import { MenuGroup } from "@/features/menu/menu-group";
import { MenuItemCard } from "@/features/menu/menu-item";
import { MenuItemModal } from "@/features/menu/menu-item-modal";
import { Builder } from "@/types/builder/BuilderSchema";
import { MenuItem } from "@/types/menu/Menu";

export function MenuInteractive({ schema }: { schema?: Builder }) {
  const [open, setOpen] = useState(false);
  const [menuItem, setMenuItem] = useState<MenuItem | undefined>();

  const handleClick = (item: MenuItem) => {
    setMenuItem(item);
    setOpen(true);
  };

  const featuredItems = schema?.menu
    .flatMap(({ items }) => items.flatMap((item) => item))
    .slice(0, 10);

  if (!schema) {
    return (
      <section className="section pt-0">
        <p className="text-muted-foreground">
          No menu available for this restaurant.
        </p>
      </section>
    );
  }

  return (
    <>
      {featuredItems?.length && (
        <>
          <section className="section pt-0 pb-2 lg:pb-4">
            <h2>Chef Picks</h2>
          </section>

          <div className="flex w-full max-w-full flex-1 overflow-hidden">
            <Featured
              items={featuredItems}
              options={{
                loop: true,
                align: "start",
                dragFree: true,
              }}
              slideHeight="40vh"
              slideSize="40vh"
              onAddToCart={handleClick}
            />
          </div>
        </>
      )}

      {schema?.menu && (
        <section className="section @container pt-16">
          <h2>Menu</h2>
          <FiltersBar />
          {schema.menu.map((group, index) => (
            <MenuGroup data={group} key={index}>
              {group.items.map(({ version, ...item }) =>
                version === "v1" ? (
                  <AnimatePresence key={item.id}>
                    <MenuItemCard
                      item={{ ...item, version }}
                      key={item.id}
                      onClick={handleClick}
                      isAvailable
                    />
                  </AnimatePresence>
                ) : null,
              )}
            </MenuGroup>
          ))}
        </section>
      )}

      <MenuItemModal menuItem={menuItem} open={open} setOpen={setOpen} />
    </>
  );
}
