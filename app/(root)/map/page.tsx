"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Crosshair, Loader2, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/forms/button";
import { RestaurantMap } from "@/features/map/google-map";
import { useGeolocation } from "@/features/map/hooks/useGeolocation";
import { MapFiltersDrawer } from "@/features/map/map-filters-drawer";
import { RestaurantDetailsDialog } from "@/features/map/restaurant-details-drawer";
import { MapFilterState } from "@/features/map/types";
import { calculateDistance } from "@/features/map/utils/distance";
import { useRestaurantsQuery } from "@/hooks/api/restaurant/useRestaurants";
import { Restaurant } from "@/types/restaurant/Restaurant";

export default function MapPage() {
  const { data: restaurants, isLoading: isLoadingRestaurants } =
    useRestaurantsQuery();

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  const [filters, setFilters] = useState<MapFilterState>({
    cuisines: [],
    allergens: [],
    foodTypes: [],
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

  // Request location on page load
  useEffect(() => {
    getCurrentPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show toast notifications for location errors
  useEffect(() => {
    if (locationError) {
      toast.error(locationError);
      setHasShownSuccessToast(false);
    }
  }, [locationError]);

  // Show success toast when location is found (only once per successful fetch)
  useEffect(() => {
    if (
      userLocation &&
      !isLocating &&
      !locationError &&
      !hasShownSuccessToast
    ) {
      toast.success("Location found!");
      setHasShownSuccessToast(true);
    }
  }, [userLocation, isLocating, locationError, hasShownSuccessToast]);

  const handleMarkerClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDialogOpen(true);
  };

  const handleLocateMe = () => {
    setHasShownSuccessToast(false);
    getCurrentPosition();
  };

  const handleApplyFilters = (newFilters: MapFilterState) => {
    setFilters(newFilters);
  };

  // Filter restaurants based on selected categories and distance
  const filteredRestaurants = useMemo(() => {
    if (!restaurants) return [];
    return restaurants.filter((restaurant) => {
      const restaurantCategoryNames = restaurant.categories.map((c) => c.name);

      // Filter by cuisines (include)
      if (filters.cuisines.length > 0) {
        const hasMatchingCuisine = filters.cuisines.some((cuisine) =>
          restaurantCategoryNames.includes(cuisine),
        );
        if (!hasMatchingCuisine) {
          return false;
        }
      }

      // Filter by allergens (exclude)
      if (filters.allergens.length > 0) {
        const hasExcludedAllergen = filters.allergens.some((allergen) =>
          restaurantCategoryNames.includes(allergen),
        );
        if (hasExcludedAllergen) {
          return false;
        }
      }

      // Filter by food types (include)
      if (filters.foodTypes.length > 0) {
        const hasMatchingFoodType = filters.foodTypes.some((foodType) =>
          restaurantCategoryNames.includes(foodType),
        );
        if (!hasMatchingFoodType) {
          return false;
        }
      }

      // Filter by distance
      if (filters.distance !== null && userLocation && restaurant.address) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          restaurant.address.lat,
          restaurant.address.lng,
        );
        if (distance > filters.distance) {
          return false;
        }
      }

      return true;
    });
  }, [restaurants, filters, userLocation]);

  // Get Google Maps API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  if (!apiKey) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-destructive text-center">
          <p className="text-lg font-semibold">Configuration Error</p>
          <p className="text-sm">Google Maps API key is not configured</p>
        </div>
      </div>
    );
  }

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
        apiKey={apiKey}
        userLocation={userLocation}
      />
      <div className="absolute top-3.5 right-4 z-10 flex gap-2">
        <Button
          onClick={() => setIsFilterDrawerOpen(true)}
          className="shadow-lg"
          variant="default"
        >
          Filters
          <SlidersHorizontal />
        </Button>
        <Button
          onClick={handleLocateMe}
          disabled={isLocating}
          className="shadow-lg"
          size="icon"
          variant="default"
        >
          <Crosshair className={isLocating ? "animate-spin" : ""} />
        </Button>
      </div>
      <RestaurantDetailsDialog
        restaurant={selectedRestaurant}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <MapFiltersDrawer
        open={isFilterDrawerOpen}
        setOpen={setIsFilterDrawerOpen}
        filters={filters}
        onApply={handleApplyFilters}
        userLocation={userLocation}
      />
    </div>
  );
}
