"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Crosshair, Loader2, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { BasicNotificationBody } from "@/components/ui/feedback/basic-notification";
import { Button } from "@/components/ui/forms/button";
import { useNotification } from "@/context/NotificationBar";
import { RestaurantMap } from "@/features/map/google-map";
import { useGeolocation } from "@/features/map/hooks/useGeolocation";
import { MapFiltersDrawer } from "@/features/map/map-filters-drawer";
import { RestaurantDetailsDialog } from "@/features/map/restaurant-details-drawer";
import { MapFilterState } from "@/features/map/types";
import { usePublicRestaurantsQuery } from "@/hooks/api/restaurant/usePublicRestaurants";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { cn } from "@/utils/cn";

export default function MapPage() {
  const tActions = useTranslations("common.actions");
  const tToast = useTranslations("common.toast");

  const { openNotification } = useNotification();

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<MapFilterState>({
    cuisines: [],
    distance: null,
  });

  const {
    location: userLocation,
    error: locationError,
    loading: isLocating,
    getCurrentPosition,
  } = useGeolocation({
    watch: false, // Don't continuously track - only on demand
    enableHighAccuracy: true,
    maximumAge: 0,
  });

  const {
    data: restaurants,
    isLoading: isLoadingRestaurants,
    error: restaurantsError,
  } = usePublicRestaurantsQuery(
    // Only pass location params when all three are available
    userLocation?.lat !== undefined &&
      userLocation?.lng !== undefined &&
      filters.distance !== null
      ? {
          lat: userLocation.lat,
          lng: userLocation.lng,
          radiusKm: filters.distance,
        }
      : {},
  );

  // Request location on page load
  useEffect(() => {
    getCurrentPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show notifications for location errors
  useEffect(() => {
    if (locationError) {
      openNotification(
        <BasicNotificationBody
          title={tToast("error")}
          description={locationError}
          variant="error"
        />,
      );
    }
    if (restaurantsError) {
      openNotification(
        <BasicNotificationBody
          title={tToast("error")}
          description={tToast("restaurantsLoadError")}
          variant="error"
        />,
      );
    }
  }, [locationError, restaurantsError, openNotification, tToast]);

  const handleMarkerClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDialogOpen(true);
  };

  const handleLocateMe = () => {
    getCurrentPosition();
  };

  // Filter restaurants based on selected categories (distance is handled by backend)
  const filteredRestaurants = useMemo(() => {
    if (!restaurants) return [];
    return restaurants.filter((restaurant) => {
      const restaurantCategoryIds = restaurant.categories.map((c) => c.id);

      // Filter by cuisines (include)
      if (filters.cuisines.length > 0) {
        const hasMatchingCuisine = filters.cuisines.some((cuisineId) =>
          restaurantCategoryIds.includes(cuisineId),
        );
        if (!hasMatchingCuisine) {
          return false;
        }
      }

      return true;
    });
  }, [restaurants, filters.cuisines]);

  return (
    <div className="w-full flex-1">
      <AnimatePresence>
        {isLoadingRestaurants && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Loader2 className="text-primary h-12 w-12 animate-spin" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <RestaurantMap
        restaurants={filteredRestaurants}
        onMarkerClick={handleMarkerClick}
        userLocation={userLocation}
      />
      <div className="absolute top-3.5 right-4 z-10 flex gap-2">
        <Button
          onClick={() => setIsFilterDrawerOpen(true)}
          className="shadow-lg"
          variant="default"
        >
          {tActions("filters")}
          <SlidersHorizontal />
        </Button>
        <Button
          onClick={handleLocateMe}
          disabled={isLocating}
          className={cn("shadow-lg", isLocating && "animate-spin")}
          size="icon"
          variant="default"
        >
          <Crosshair />
        </Button>
      </div>
      <RestaurantDetailsDialog
        restaurant={selectedRestaurant}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        userLocation={userLocation}
      />
      <MapFiltersDrawer
        open={isFilterDrawerOpen}
        setOpen={setIsFilterDrawerOpen}
        filters={filters}
        onApply={setFilters}
        userLocation={userLocation}
      />
    </div>
  );
}
