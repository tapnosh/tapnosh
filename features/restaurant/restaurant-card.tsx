"use client";

import Color from "color";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { Badge } from "@/components/ui/data-display/badge";
import { Button } from "@/components/ui/forms/button";
import { ShareButton } from "@/components/ui/forms/share-button";
import { PriceRangeIndicator } from "@/features/restaurant/price-range-indicator";
import { Link } from "@/i18n/routing";
import { RestaurantCategory } from "@/types/category/Category";
import { Restaurant } from "@/types/restaurant/Restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

function RestaurantBadges({
  categories,
  translateCategory,
  foregroundColor,
  priceRange,
  backgroundColor,
}: {
  categories?: RestaurantCategory[];
  translateCategory: (id: string) => string;
  foregroundColor: string;
  priceRange: Restaurant["priceRange"];
  backgroundColor: string;
}) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge
        variant="default"
        className="font-bold"
        style={{
          color: backgroundColor,
          backgroundColor: foregroundColor,
        }}
      >
        {priceRange != null ? (
          <PriceRangeIndicator priceRange={priceRange} />
        ) : null}
      </Badge>
      {categories?.map(({ id, name }) => (
        <Badge
          key={id}
          variant="default"
          style={{
            color: foregroundColor,
            backgroundColor: foregroundColor + "20",
          }}
        >
          {translateCategory(name)}
        </Badge>
      ))}
    </div>
  );
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const t = useTranslations("categories");
  const tActions = useTranslations("common.actions");

  const { backgroundColor, foregroundColor } = useMemo(() => {
    const bgColor = new Color(restaurant.theme.color);
    const fgColor = bgColor.isDark() ? "#ffffff" : "#000000";

    return {
      backgroundColor: bgColor.hex(),
      foregroundColor: fgColor,
    };
  }, [restaurant.theme.color]);

  return (
    <div
      className="group relative flex h-full min-h-64 flex-col overflow-hidden rounded-2xl p-6 shadow-md sm:min-h-72"
      style={{
        backgroundColor,
        color: foregroundColor,
      }}
    >
      {restaurant.images?.[0]?.url && (
        <div className="pointer-events-none absolute inset-0 z-1">
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
      )}

      {/* Share button in top right corner */}
      <div className="absolute top-4 right-4 z-40">
        <div
          className="rounded-xl shadow-lg"
          style={{
            backgroundColor: foregroundColor,
            color: backgroundColor,
          }}
        >
          <ShareButton
            url={`/restaurants/${restaurant.slug}`}
            title={restaurant.name}
            size="icon"
            variant="ghost"
          />
        </div>
      </div>

      {restaurant.categories && restaurant.categories.length > 0 && (
        <div className="mb-3">
          <RestaurantBadges
            categories={restaurant.categories}
            translateCategory={t}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
            priceRange={restaurant.priceRange}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col">
        <h3 className="mb-3 text-3xl leading-8 font-bold md:text-4xl">
          {restaurant.name}
        </h3>

        {restaurant.description && (
          <p className="mb-4 text-sm opacity-90">{restaurant.description}</p>
        )}
        <div className="flex-1" />

        <div className="mb-4 flex flex-col gap-2">
          {restaurant?.address?.formattedAddress && (
            <div className="flex items-start gap-2 text-sm opacity-90">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{restaurant.address.formattedAddress}</span>
            </div>
          )}

          {restaurant?.phoneNumber && (
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <a
                href={`tel:${restaurant.phoneNumber}`}
                className="transition-opacity hover:opacity-70"
              >
                {restaurant.phoneNumber}
              </a>
            </div>
          )}
        </div>

        {/* CTA Button at bottom */}
        <Button
          size="lg"
          asChild
          className="w-full shadow-lg"
          style={{
            backgroundColor: foregroundColor,
            color: backgroundColor,
          }}
        >
          <Link href={`/restaurants/${restaurant.slug}`}>
            {tActions("viewMenu")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
