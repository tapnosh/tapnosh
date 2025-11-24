"use client";

import { AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/data-display/badge";
import { ShareButton } from "@/components/ui/forms/share-button";
import { FiltersBar } from "@/features/filters/filters-bar";
import { FilterState } from "@/features/filters/types";
import { MenuGroup } from "@/features/menu/menu-group";
import { MenuItemCard } from "@/features/menu/menu-item";
import { MenuItemModal } from "@/features/menu/menu-item-modal";
import { Builder } from "@/types/builder/BuilderSchema";
import { MenuItem } from "@/types/menu/Menu";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { findDishById } from "@/utils/dish-id";
import { deleteUrlParam, setUrlParam } from "@/utils/url-state";

function MenuInteractive({
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
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState | undefined>();

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

  // Filter function to check if item matches filters
  const itemMatchesFilters = (item: MenuItem) => {
    if (!filters) return true;

    // Check price range
    const { priceRange, food_types, allergens } = filters;
    const itemPrice = item.price.amount;
    if (itemPrice < priceRange[0] || itemPrice > priceRange[1]) {
      return false;
    }

    // Check food types (if any are selected, item must have at least one matching)
    if (food_types.length > 0) {
      const itemFoodTypes = item.food_type_ids || [];
      const hasMatchingFoodType = food_types.some((foodType) =>
        itemFoodTypes.includes(foodType),
      );
      if (!hasMatchingFoodType) return false;
    }

    // Check allergens (if any are selected, item must NOT contain any of them)
    if (allergens.length > 0) {
      const itemAllergens = item.allergen_ids || [];
      const hasExcludedAllergen = allergens.some((allergen) =>
        itemAllergens.includes(allergen),
      );
      if (hasExcludedAllergen) return false;
    }

    return true;
  };

  if (!schema) {
    return (
      <section className="section">
        <p className="text-muted-foreground">
          No menu available for this restaurant.
        </p>
      </section>
    );
  }

  return (
    <>
      {schema.header && (
        <section className="section">
          {schema.header.map((header, index) => {
            if (header.type === "text") {
              return (
                <p className="max-w-2xl" key={index}>
                  {header.text}
                </p>
              );
            } else if (header.type === "heading") {
              return (
                <h2 className="sm:mb-4" key={index}>
                  {header.heading}
                </h2>
              );
            }
            return null;
          })}
        </section>
      )}

      {/* {featuredItems?.length && (
        <>
          <section className="section pb-2 lg:pb-4">
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
      )} */}

      {schema.menu && (
        <section className="section @container">
          <h2>Menu</h2>
          <FiltersBar
            groups={schema.menu}
            selectedGroup={selectedGroup}
            onGroupChange={setSelectedGroup}
            filters={filters}
            onFiltersChange={setFilters}
          />
          {schema.menu
            .filter((group) =>
              selectedGroup ? group.name === selectedGroup : true,
            )
            .map((group, groupIndex) => {
              const filteredItems = group.items.filter((item) =>
                itemMatchesFilters(item as MenuItem),
              );

              // Only render group if it has items after filtering
              if (filteredItems.length === 0) return null;

              return (
                <MenuGroup data={group} key={groupIndex}>
                  {filteredItems.map(({ version, ...item }) =>
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
              );
            })}
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
        canBeAddedToTab={false}
        restaurantSlug={restaurantSlug}
      />
    </>
  );
}

export function RestaurantHeader({
  restaurant,
  showCta = true,
}: {
  restaurant: Restaurant;
  showCta?: boolean;
}) {
  return (
    <header className="section section-primary relative -mb-8 -translate-y-16 overflow-clip">
      <div className="absolute inset-0 -top-16 z-1">
        <Image
          src={restaurant.images[0]?.url || "/placeholder.svg"}
          alt={`${restaurant.name} restaurant interior`}
          fill
          className="object-cover opacity-15"
          style={{
            filter:
              "grayscale(100%) sepia(100%) hue-rotate(25deg) saturate(200%) brightness(0.9) contrast(1.2)",
            mixBlendMode: "multiply",
          }}
          quality={100}
          loading="eager"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col pt-16">
        <div className="w-full">
          <div className="flex flex-wrap gap-2">
            {restaurant.categories.map((c) => (
              <Badge
                key={c.id}
                variant="secondary"
                className="bg-primary-foreground/15 text-primary-foreground mb-4 font-bold backdrop-blur-sm"
              >
                {c.name}
              </Badge>
            ))}
          </div>

          <h1 className="mb-4 text-5xl font-bold tracking-tight drop-shadow-sm md:text-7xl">
            {restaurant.name}
          </h1>
        </div>

        <p className="text-primary-foreground/90 mb-4 max-w-2xl text-lg drop-shadow-sm">
          {restaurant.description}
        </p>

        {showCta && (
          <div className="flex flex-col justify-start gap-2 sm:flex-row">
            <Link
              href={"#"}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/80 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-8 font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Make Reservation
            </Link>
            <ShareButton
              className="size-10"
              url={`/restaurants/${restaurant.slug}`}
              size="icon"
            />
          </div>
        )}
      </div>
    </header>
  );
}

export function RestaurantPage({
  restaurant,
  schema,
}: {
  restaurant: Restaurant;
  schema?: Builder;
}) {
  return (
    <>
      <RestaurantHeader restaurant={restaurant} />
      <MenuInteractive schema={schema} restaurantSlug={restaurant.slug || ""} />
    </>
  );
}
