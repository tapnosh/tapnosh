import { useQuery } from "@tanstack/react-query";
import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import { Restaurant } from "@/types/restaurant/Restaurant";

export function usePublicRestaurantsQuery(): ReturnType<
  typeof useQuery<Restaurant[], TranslatedError>
>;

export function usePublicRestaurantsQuery(
  slug: string,
): ReturnType<typeof useQuery<Restaurant, TranslatedError>>;

export function usePublicRestaurantsQuery(slug?: string) {
  const { fetchClient } = useFetchClient();

  return useQuery<Restaurant[] | Restaurant, TranslatedError>({
    queryKey: ["restaurants", "public", slug],
    queryFn: () =>
      fetchClient<Restaurant[] | Restaurant>(
        slug ? `public_api/restaurants/${slug}` : "public_api/restaurants",
      ),
  });
}
