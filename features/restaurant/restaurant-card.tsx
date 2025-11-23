"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { unstable_ViewTransition as ViewTransition } from "react";

import { Badge } from "@/components/ui/data-display/badge";
import { Button } from "@/components/ui/forms/button";
import { ShareButton } from "@/components/ui/forms/share-button";
import { RestaurantCategory } from "@/types/category/Category";
import { Restaurant } from "@/types/restaurant/Restaurant";

import { RestaurantCarousel } from "./restaurant-carousel";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

function RestaurantBadges({
  categories,
  translateCategory,
}: {
  categories?: RestaurantCategory[];
  translateCategory: (id: string) => string;
}) {
  if (!categories) {
    return <></>;
  }

  return (
    <div className="flex gap-2">
      {categories?.map(({ id }) => (
        <Badge key={id} variant="outline" className="font-medium">
          {translateCategory(id)}
        </Badge>
      ))}
    </div>
  );
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const t = useTranslations("categories");

  // Helper function to translate category by ID
  const translateCategory = (id: string) => {
    return t(id);
  };

  return (
    <div className="group mb-2 border-b pb-4 last:border-0">
      <RestaurantCarousel restaurant={restaurant} />

      <div className="flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <ViewTransition name={`title-${restaurant.id}`}>
            <h3>{restaurant.name}</h3>
          </ViewTransition>
          <RestaurantBadges
            categories={restaurant.categories}
            translateCategory={translateCategory}
          />
        </div>
        <ViewTransition name={`description-${restaurant.id}`}>
          <p className="text-muted-foreground mb-3 italic">
            {restaurant.description}
          </p>
        </ViewTransition>
        {/* <div className="text-muted-foreground mb-4 flex items-center text-sm">
          <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
          <span>{restaurant.address}</span>
        </div> */}

        <div className="flex items-center gap-2">
          <Button size="lg" asChild className="flex-1">
            <Link href={`/restaurants/${restaurant.slug}`}>See the Menu</Link>
          </Button>
          <ShareButton
            url={`/restaurants/${restaurant.slug}`}
            title={restaurant.name}
            size="lg"
          />
        </div>
      </div>
    </div>
  );
}
