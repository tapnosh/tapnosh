import { useQuery } from "@tanstack/react-query";

import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import { Restaurant } from "@/types/restaurant/Restaurant";

export function useRestaurantsQuery(): ReturnType<
  typeof useQuery<Restaurant[], TranslatedError>
>;

export function useRestaurantsQuery(
  id?: string,
): ReturnType<typeof useQuery<Restaurant, TranslatedError>>;

export function useRestaurantsQuery(id?: string) {
  const { fetchClient } = useFetchClient();

  return useQuery<Restaurant[] | Restaurant, TranslatedError>({
    queryKey: ["restaurants", id],
    queryFn: () =>
      fetchClient<Restaurant[] | Restaurant>(
        id ? `restaurants/${id}` : "restaurants",
      ),
  });
}
