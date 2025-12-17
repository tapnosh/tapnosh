import { useQuery } from "@tanstack/react-query";

import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import { Restaurant } from "@/types/restaurant/Restaurant";

interface PublicRestaurantsParams {
  lat?: number;
  lng?: number;
  radiusKm?: number;
}

export function usePublicRestaurantsQuery(
  params?: PublicRestaurantsParams,
): ReturnType<typeof useQuery<Restaurant[], TranslatedError>>;

export function usePublicRestaurantsQuery(
  slug: string,
): ReturnType<typeof useQuery<Restaurant, TranslatedError>>;

export function usePublicRestaurantsQuery(
  slugOrParams?: string | PublicRestaurantsParams,
) {
  const { fetchClient } = useFetchClient();

  const isSlug = typeof slugOrParams === "string";

  const buildUrl = () => {
    if (isSlug) {
      return `public_api/restaurants/${slugOrParams}`;
    }

    const params = new URLSearchParams();
    if (slugOrParams?.lat !== undefined)
      params.append("lat", slugOrParams.lat.toString());
    if (slugOrParams?.lng !== undefined)
      params.append("lng", slugOrParams.lng.toString());
    if (slugOrParams?.radiusKm !== undefined)
      params.append("radiusKm", slugOrParams.radiusKm.toString());

    const queryString = params.toString();
    return `public_api/restaurants${queryString ? `?${queryString}` : ""}`;
  };

  return useQuery<Restaurant[] | Restaurant, TranslatedError>({
    queryKey: ["restaurants", "public", isSlug ? slugOrParams : slugOrParams],
    queryFn: () => fetchClient<Restaurant[] | Restaurant>(buildUrl()),
  });
}
