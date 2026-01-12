import { useSession } from "@clerk/nextjs";
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
  isSignedIn: boolean;
}

/**
 * Hook to check if the current user is a maintainer of a specific restaurant.
 * Uses the user's restaurant list to determine if they have maintenance access.
 * Only checks if the user is logged in.
 *
 * @param options.restaurantId - The restaurant ID to check
 * @param options.enabled - Whether to enable the query (default: true)
 * @returns Object containing isMaintainer status, loading/error states, and isSignedIn
 */
export function useIsRestaurantMaintainer({
  restaurantId,
  enabled = true,
}: UseIsRestaurantMaintainerOptions): UseIsRestaurantMaintainerResult {
  const { isSignedIn, isLoaded: isSessionLoaded } = useSession();

  const {
    data: restaurants,
    isLoading: isRestaurantsLoading,
    isError,
  } = useRestaurantsQuery({
    enabled: enabled && !!restaurantId && isSessionLoaded && !!isSignedIn,
  });

  const isMaintainer = useMemo(() => {
    if (!isSignedIn || !restaurants || !restaurantId) return false;

    // restaurants is an array of Restaurant objects
    return restaurants.some((restaurant) => restaurant.id === restaurantId);
  }, [isSignedIn, restaurants, restaurantId]);

  return {
    isMaintainer,
    isLoading: !isSessionLoaded || isRestaurantsLoading,
    isError,
    isSignedIn: !!isSignedIn,
  };
}
