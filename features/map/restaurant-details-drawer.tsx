"use client";

import { Navigation, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/data-display/badge";
import { Button } from "@/components/ui/forms/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/overlays/drawer";
import { navigateToLocation } from "@/features/map/utils/navigation";
import { MenuItemCard } from "@/features/menu/menu-item";
import { useIsMobile } from "@/hooks/use-mobile";
import { RestaurantMapItem } from "@/types/restaurant/RestaurantMap";

interface RestaurantDetailsDialogProps {
  restaurant: RestaurantMapItem | null;
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
    if (!restaurant.address?.latitude || !restaurant.address?.longitude) return;
    navigateToLocation(
      restaurant.address.latitude,
      restaurant.address.longitude,
    );
  };

  return (
    <Drawer
      repositionInputs={false}
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent className="top-auto right-0 bottom-0 left-0 h-[85vh] w-full rounded-t-[10px] md:top-0 md:right-0 md:left-auto md:mt-0 md:h-screen md:w-[500px] md:rounded-none">
        <DrawerHeader>
          <DrawerTitle>{restaurant.name}</DrawerTitle>
          <DrawerDescription>{restaurant.description}</DrawerDescription>
        </DrawerHeader>

        <div className="space-y-6 overflow-y-auto px-4 pb-24">
          <div className="space-y-6">
            {/* Restaurant Image */}
            {restaurantImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={restaurantImage}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Restaurant Details */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {restaurant.categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {t(category.id)}
                  </Badge>
                ))}
              </div>
              {restaurant.address && (
                <p className="text-muted-foreground text-sm">
                  📍 {restaurant.address.formattedAddress}
                </p>
              )}
            </div>

            {/* Menu Items */}
            {menuItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Menu Items</h3>
                <div className="grid gap-4">
                  {restaurant.menu?.menu.map((group) => (
                    <div key={group.name} className="space-y-3">
                      <div className="flex items-baseline justify-between border-b pb-2">
                        <h4 className="text-base font-semibold">
                          {group.name}
                        </h4>
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
        </div>

        <DrawerFooter className="border-t">
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleNavigate}
              disabled={
                !restaurant.address?.latitude || !restaurant.address?.longitude
              }
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
