"use client";

import { AnimatePresence } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { FiltersBar } from "@/features/filters/filters-bar";
import { Featured } from "@/features/menu/featured";
import { MenuGroup } from "@/features/menu/menu-group";
import { MenuItemCard } from "@/features/menu/menu-item";
import { MenuItemModal } from "@/features/menu/menu-item-modal";
import { deleteUrlParam, setUrlParam } from "@/features/menu/utils/url-state";
import { Builder } from "@/types/builder/BuilderSchema";
import { MenuItem } from "@/types/menu/Menu";
import { findDishById } from "@/utils/dish-id";

export function MenuInteractive({
  schema,
  restaurantSlug,
}: {
  schema?: Builder;
  restaurantSlug: string;
}) {
  const searchParams = useSearchParams();
  const dishId = searchParams.get("dish");

  const [menuItem, setMenuItem] = useState<MenuItem | undefined>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (dishId && schema) {
      const result = findDishById(schema.menu, dishId);
      if (result) {
        setMenuItem(result.item as MenuItem);
        setOpen(true);
      }
    } else {
      setOpen(false);
    }
  }, [dishId, schema]);

  const handleClick = (item: MenuItem) => {
    setMenuItem(item);
    setOpen(true);
    setUrlParam(searchParams, "dish", item.id);
  };

  const handleClose = () => {
    setOpen(false);
    deleteUrlParam(searchParams, "dish");
  };

  const featuredItems = schema?.menu
    .flatMap(({ items }) => items.flatMap((item) => item))
    .slice(0, 10);

  const handleFeaturedClick = (item: MenuItem) => {
    handleClick(item);
  };

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
              onAddToCart={handleFeaturedClick}
            />
          </div>
        </>
      )}

      {schema?.menu && (
        <section className="section @container pt-16">
          <h2>Menu</h2>
          <FiltersBar />
          {schema.menu.map((group, groupIndex) => (
            <MenuGroup data={group} key={groupIndex}>
              {group.items.map(({ version, ...item }) =>
                version === "v1" ? (
                  <AnimatePresence key={item.id}>
                    <MenuItemCard
                      item={{ ...item, version }}
                      key={item.id}
                      onClick={handleClick}
                      isAvailable
                      restaurantSlug={restaurantSlug}
                    />
                  </AnimatePresence>
                ) : null,
              )}
            </MenuGroup>
          ))}
        </section>
      )}

      <MenuItemModal
        menuItem={menuItem}
        open={open}
        setOpen={(isOpen) => {
          if (!isOpen) {
            handleClose();
          }
        }}
        canBeAddedToTab
        restaurantSlug={restaurantSlug}
      />
    </>
  );
}
