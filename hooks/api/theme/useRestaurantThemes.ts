import { useQuery } from "@tanstack/react-query";
import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import { RestaurantTheme } from "@/types/theme/Theme";

export function useRestaurantThemesQuery(): ReturnType<
  typeof useQuery<RestaurantTheme[], TranslatedError>
>;

export function useRestaurantThemesQuery() {
  const { fetchClient } = useFetchClient();

  return useQuery<RestaurantTheme[], TranslatedError>({
    queryKey: ["restaurant-themes"],
    queryFn: () => fetchClient<RestaurantTheme[]>("restaurant-theme"),
  });
}
