"use client";

import { Clock, MapPin, Phone } from "lucide-react";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";

import { Badge } from "@/components/ui/data-display/badge";
import { ShareButton } from "@/components/ui/forms/share-button";
import { SocialMediaLink } from "@/components/ui/navigation/social-media-link";
import { FiltersBar } from "@/features/filters/filters-bar";
import { FilterState } from "@/features/filters/types";
import { MenuGroup } from "@/features/menu/menu-group";
import { MenuItemCard } from "@/features/menu/menu-item";
import { MenuItemModal } from "@/features/menu/menu-item-modal";
import { PriceRangeIndicator } from "@/features/restaurant/price-range-indicator";
import { useIsRestaurantMaintainer } from "@/hooks/api/restaurant/useIsRestaurantMaintainer";
import { Link } from "@/i18n/routing";
import { Builder } from "@/types/builder/BuilderSchema";
import { MenuItem } from "@/types/menu/Menu";
import { OperatingHours, Restaurant } from "@/types/restaurant/Restaurant";
import { findDishById } from "@/utils/dish-id";
import {
  getTodayOperatingHours,
  isDayClosed,
  isTodayClosed,
  isWithinOperatingHours,
} from "@/utils/operating-hours";
import { deleteUrlParam, setUrlParam } from "@/utils/url-state";

import { revalidateRestaurantPage } from "./actions";

function MenuInteractive({
  schema,
  restaurantSlug,
  restaurantId,
  refetch,
}: {
  schema?: Builder;
  restaurantSlug: string;
  restaurantId: string;
  refetch: () => void;
}) {
  const t = useTranslations("management.pageBuilder");
  const { isMaintainer } = useIsRestaurantMaintainer({ restaurantId });

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
      const itemFoodTypes = item.food_types || [];
      const hasMatchingFoodType = food_types.some((foodType) =>
        itemFoodTypes.map(({ id }) => id).includes(foodType),
      );
      if (!hasMatchingFoodType) return false;
    }

    // Check allergens (if any are selected, item must NOT contain any of them)
    if (allergens.length > 0) {
      const itemAllergens = item.allergens || [];
      const hasExcludedAllergen = allergens.some((allergen) =>
        itemAllergens.map(({ id }) => id).includes(allergen),
      );
      if (hasExcludedAllergen) return false;
    }

    return true;
  };

  if (!schema) {
    return (
      <section className="section">
        <p className="text-muted-foreground">{t("menu.preview.noMenu")}</p>
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
          <h2>{t("menu.title")}</h2>
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

              const isAvailable = isWithinOperatingHours(
                group.timeFrom,
                group.timeTo,
              );

              return (
                <MenuGroup data={group} key={groupIndex}>
                  {filteredItems.map(({ version, ...item }) =>
                    version === "v1" ? (
                      <AnimatePresence key={item.id}>
                        <MenuItemCard
                          item={{ ...item, version }}
                          key={item.id}
                          onClick={handleClick}
                          isAvailable={isAvailable}
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
        restaurantId={restaurantId}
        showDisableOption={isMaintainer}
        onDisableSuccess={() => refetch()}
      />
    </>
  );
}

export function RestaurantHeader({ restaurant }: { restaurant: Restaurant }) {
  const t = useTranslations("categories");
  const tActions = useTranslations("common.actions");
  const tRestaurant = useTranslations("restaurants.details");

  // Check if today is closed
  const todayClosed = isTodayClosed(restaurant.operatingHours);
  // Check if restaurant is currently open
  const todayHours = getTodayOperatingHours(restaurant.operatingHours);
  const isOpen =
    todayHours && !todayClosed
      ? isWithinOperatingHours(todayHours.openFrom, todayHours.openUntil)
      : false;

  return (
    <header className="section section-primary -mb-8 -translate-y-16 overflow-clip">
      <ShareButton
        className="fixed top-4 right-4 z-100 rounded-md"
        url={`/restaurants/${restaurant.slug}`}
        label={tActions("share")}
        size="default"
        variant="secondary"
      />

      <div className="absolute inset-0 -top-16 z-1">
        <Image
          src={restaurant.images[0]?.url || "/placeholder.svg"}
          alt={`${restaurant.name} restaurant interior`}
          fill
          className="object-cover opacity-10"
          style={{
            filter:
              "grayscale(100%) sepia(100%) hue-rotate(25deg) brightness(0.9) contrast(1.2)",
            mixBlendMode: "multiply",
          }}
          quality={100}
          loading="eager"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col pt-16">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {restaurant.operatingHours && (
            <Badge
              variant={isOpen ? "green" : "destructive"}
              className="font-bold"
            >
              {todayClosed
                ? tRestaurant("openingHours.closed")
                : isOpen
                  ? tRestaurant("openingHours.openNow")
                  : tRestaurant("openingHours.closedNow")}
            </Badge>
          )}
          <Badge variant="secondary">
            <PriceRangeIndicator priceRange={restaurant.priceRange} />
          </Badge>
          {restaurant.categories.map((c) => (
            <Badge
              key={c.id}
              variant="secondary"
              className="bg-primary-foreground/15 text-primary-foreground font-bold backdrop-blur-sm"
            >
              {t(c.name)}
            </Badge>
          ))}
        </div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight drop-shadow-sm md:text-7xl">
          {restaurant.name}
        </h1>

        <p className="text-primary-foreground/90 mb-6 max-w-3xl drop-shadow-sm sm:text-lg">
          {restaurant.description}
        </p>

        {/* Address and Contact Info */}
        {(restaurant.address || restaurant.phoneNumber) && (
          <div className="text-primary-foreground/90 flex flex-col gap-4 drop-shadow-sm">
            {restaurant.address && (
              <div className="flex items-start gap-2">
                <MapPin className="mt-1 size-4.5 shrink-0" />
                <span className="text-base">
                  {restaurant.address.formattedAddress}
                </span>
              </div>
            )}
            {restaurant.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="size-4.5 shrink-0" />
                <a
                  href={`tel:${restaurant.phoneNumber}`}
                  className="hover:text-primary-foreground text-base transition-colors"
                >
                  {restaurant.phoneNumber}
                </a>
              </div>
            )}
          </div>
        )}

        {restaurant.reservationUrl ||
        restaurant.facebookUrl ||
        restaurant.instagramUrl ? (
          <div className="mt-6 flex flex-row justify-start gap-2">
            {restaurant.reservationUrl && (
              <Link
                href={restaurant.reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/80 inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg px-8 font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg sm:flex-none"
              >
                {tRestaurant("makeReservation")}
              </Link>
            )}

            {restaurant.facebookUrl && (
              <SocialMediaLink
                platform="facebook"
                url={restaurant.facebookUrl}
              />
            )}
            {restaurant.instagramUrl && (
              <SocialMediaLink
                platform="instagram"
                url={restaurant.instagramUrl}
              />
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}

const DAY_KEYS: (keyof OperatingHours)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// Maps JavaScript's getDay() (0=Sunday, 1=Monday, ...) to our DAY_KEYS array
const JS_DAY_TO_KEY: (keyof OperatingHours)[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function RestaurantFooter({ restaurant }: { restaurant: Restaurant }) {
  const t = useTranslations("restaurants.details.openingHours");
  const tDays = useTranslations("common.days");

  if (!restaurant.operatingHours) return null;

  const todayKey = JS_DAY_TO_KEY[new Date().getDay()];

  return (
    <footer className="section mt-auto">
      <div className="mx-auto">
        <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <Clock className="size-5" />
          {t("title")}
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-7">
          {DAY_KEYS.map((day) => {
            const hours = restaurant.operatingHours?.[day];
            const isToday = day === todayKey;
            const isClosed = isDayClosed(hours);

            return (
              <div
                key={day}
                className={`rounded-lg p-3 ${
                  isToday ? "bg-primary/10 ring-primary ring-2" : "bg-muted/50"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    isToday ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {tDays(day)}
                </p>
                {hours && !isClosed ? (
                  <p className="mt-1 text-sm font-semibold">
                    {hours.openFrom} - {hours.openUntil}
                  </p>
                ) : (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {t("closed")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

export function RestaurantPage({
  restaurant,
  schema,
}: {
  restaurant: Restaurant;
  schema?: Builder;
}) {
  const handleRefresh = async () => {
    await revalidateRestaurantPage(restaurant.slug || "");
  };
  const t = useTranslations("restaurants.details");

  return (
    <>
      <RestaurantHeader restaurant={restaurant} />
      <Suspense
        fallback={
          <div className="flex justify-center p-8">{t("loadingMenu")}</div>
        }
      >
        <MenuInteractive
          schema={schema}
          restaurantSlug={restaurant.slug || ""}
          restaurantId={restaurant.id}
          refetch={handleRefresh}
        />
      </Suspense>
      <RestaurantFooter restaurant={restaurant} />
    </>
  );
}
