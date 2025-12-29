import { useMemo } from "react";

import { useRestaurantsQuery } from "@/hooks/api/restaurant/useRestaurants";

interface UseIsRestaurantMaintainerOptions {
  restaurantId: string;
  enabled?: boolean;
}

interface UseIsRestaurantMaintainerResult {
  isMaintainer: boolean;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Hook to check if the current user is a maintainer of a specific restaurant.
 * Uses the user's restaurant list to determine if they have maintenance access.
 *
 * @param options.restaurantId - The restaurant ID to check
 * @param options.enabled - Whether to enable the query (default: true)
 * @returns Object containing isMaintainer status and loading/error states
 */
export function useIsRestaurantMaintainer({
  restaurantId,
  enabled = true,
}: UseIsRestaurantMaintainerOptions): UseIsRestaurantMaintainerResult {
  const {
    data: restaurants,
    isLoading,
    isError,
  } = useRestaurantsQuery({ enabled: enabled && !!restaurantId });

  const isMaintainer = useMemo(() => {
    if (!restaurants || !restaurantId) return false;

    // restaurants is an array of Restaurant objects
    return restaurants.some((restaurant) => restaurant.id === restaurantId);
  }, [restaurants, restaurantId]);

  return {
    isMaintainer,
    isLoading,
    isError,
  };
}
