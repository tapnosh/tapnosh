import { useQuery } from "@tanstack/react-query";

import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import { Restaurant } from "@/types/restaurant/Restaurant";

type UseRestaurantsQueryParams = {
  id?: string;
  enabled?: boolean;
};

export function useRestaurantsQuery(params?: {
  enabled?: boolean;
}): ReturnType<typeof useQuery<Restaurant[], TranslatedError>>;

export function useRestaurantsQuery(params: {
  id: string;
  enabled?: boolean;
}): ReturnType<typeof useQuery<Restaurant, TranslatedError>>;

export function useRestaurantsQuery(params?: UseRestaurantsQueryParams) {
  const { fetchClient } = useFetchClient();
  const { id, enabled = true } = params ?? {};

  return useQuery<Restaurant[] | Restaurant, TranslatedError>({
    queryKey: ["restaurants", id],
    queryFn: () =>
      fetchClient<Restaurant[] | Restaurant>(
        id ? `restaurants/${id}` : "restaurants",
      ),
    enabled,
  });
}
