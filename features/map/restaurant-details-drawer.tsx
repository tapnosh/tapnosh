"use client";

import { MapPin, Navigation, Phone, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/data-display/badge";
import { Button } from "@/components/ui/forms/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/overlays/drawer";
import { navigateToLocation } from "@/features/map/utils/navigation";
import { MenuItemCard } from "@/features/menu/menu-item";
import { useIsMobile } from "@/hooks/use-mobile";
import { Restaurant } from "@/types/restaurant/Restaurant";

interface RestaurantDetailsDialogProps {
  restaurant: Restaurant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RestaurantDetailsDialog({
  restaurant,
  open,
  onOpenChange,
}: RestaurantDetailsDialogProps) {
  const isMobile = useIsMobile();
  const t = useTranslations("categories");

  if (!restaurant) return null;

  const restaurantImage = restaurant.images?.[0]?.url;
  const menuItems = restaurant.menu?.menu.flatMap((group) => group.items) || [];

  const handleNavigate = () => {
    if (!restaurant.address?.lat || !restaurant.address?.lng) return;
    navigateToLocation(restaurant.address.lat, restaurant.address.lng);
  };

  return (
    <Drawer
      repositionInputs={false}
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent className="top-auto right-0 bottom-0 left-0 h-[85vh] w-full rounded-t-[10px] md:top-0 md:right-0 md:left-auto md:mt-0 md:h-screen md:w-[500px] md:rounded-none">
        {/* Header with background image */}
        <div
          className="relative overflow-clip rounded-b-lg pt-4"
          style={{ backgroundColor: restaurant.theme.color }}
        >
          {restaurant.images[0].url && (
            <div className="absolute inset-0 -top-16 z-1">
              <Image
                src={restaurantImage}
                alt={`${restaurant.name} restaurant image`}
                fill
                className="object-cover opacity-10"
                style={{
                  filter:
                    "grayscale(100%) sepia(100%) hue-rotate(25deg) saturate(200%) brightness(0.9) contrast(1.2)",
                  mixBlendMode: "multiply",
                }}
                quality={70}
                priority
              />
            </div>
          )}

          <div className="relative z-10 px-4 pt-8 pb-6">
            {/* Categories */}
            <div className="mb-4 flex flex-wrap gap-2">
              {restaurant.categories.map((category) => (
                <Badge
                  key={category.id}
                  variant="secondary"
                  className="bg-primary-foreground/15 text-primary-foreground font-bold backdrop-blur-sm"
                >
                  {t(category.name)}
                </Badge>
              ))}
            </div>

            {/* Restaurant Name */}
            <h1 className="text-primary-foreground mb-3 text-3xl font-bold tracking-tight drop-shadow-sm">
              {restaurant.name}
            </h1>

            {/* Description */}
            <p className="text-primary-foreground/90 mb-4 text-base drop-shadow-sm">
              {restaurant.description}
            </p>

            {/* Address and Contact Info */}
            {(restaurant.address || restaurant.phoneNumber) && (
              <div className="text-primary-foreground/90 flex flex-col gap-3 text-sm drop-shadow-sm">
                {restaurant.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0" />
                    <span>{restaurant.address.formattedAddress}</span>
                  </div>
                )}
                {restaurant.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0" />
                    <a
                      href={`tel:${restaurant.phoneNumber}`}
                      className="hover:text-primary-foreground transition-colors"
                    >
                      {restaurant.phoneNumber}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto px-4 pt-6 pb-24">
          {/* Menu Items */}
          {menuItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Menu Items</h3>
              <div className="grid gap-4">
                {restaurant.menu?.menu.map((group) => (
                  <div key={group.name} className="space-y-3">
                    <div className="flex items-baseline justify-between border-b pb-2">
                      <h4 className="text-base font-semibold">{group.name}</h4>
                      {group.timeFrom && group.timeTo && (
                        <span className="text-muted-foreground text-xs">
                          {group.timeFrom} - {group.timeTo}
                        </span>
                      )}
                    </div>
                    <div className="space-y-4">
                      {group.items.map((item) => (
                        <MenuItemCard
                          key={item.id}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          item={item as unknown as any}
                          isAvailable
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {menuItems.length === 0 && (
            <div className="text-muted-foreground py-8 text-center">
              No menu items available
            </div>
          )}
        </div>

        <DrawerFooter className="border-t">
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleNavigate}
              disabled={!restaurant.address?.lat || !restaurant.address?.lng}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Navigate To
            </Button>
            <Button className="flex-1" asChild>
              <Link href={`/restaurants/${restaurant.slug}`}>
                <Utensils className="mr-2 h-4 w-4" />
                Open Restaurant
              </Link>
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
