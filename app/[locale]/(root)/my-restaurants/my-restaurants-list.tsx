"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { RestaurantCard } from "@/features/restaurant/restaurant-card";
import { useRestaurantsQuery } from "@/hooks/api/restaurant/useRestaurants";
import { Restaurant } from "@/types/restaurant/Restaurant";

const sortByUpdatedAtDesc = (a: Restaurant, b: Restaurant) => {
  const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
  const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
  return dateB - dateA;
};

export function MyRestaurantsList() {
  const t = useTranslations("restaurants.lists");
  const { data: restaurants, isLoading, isError } = useRestaurantsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-destructive py-8">{t("errors.loadFailed")}</div>
    );
  }

  const sortedRestaurants = [...(restaurants || [])].sort(sortByUpdatedAtDesc);

  if (sortedRestaurants.length === 0) {
    return (
      <div className="text-muted-foreground py-8">
        {t("empty.noRestaurants")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {sortedRestaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
