import { useQuery } from "@tanstack/react-query";
import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import { MenuResponse } from "@/types/menu/Menu";

export function useMenusQuery({
  restaurantId,
}: {
  restaurantId: string;
}): ReturnType<typeof useQuery<MenuResponse, TranslatedError>>;

export function useMenusQuery({
  restaurantId,
  id,
}: {
  restaurantId: string;
  id?: string;
}): ReturnType<typeof useQuery<MenuResponse, TranslatedError>>;

export function useMenusQuery({
  restaurantId,
  id,
}: {
  restaurantId: string;
  id?: string;
}) {
  const { fetchClient } = useFetchClient();

  return useQuery<MenuResponse, TranslatedError>({
    queryKey: ["restaurants", "menu", restaurantId, id],
    queryFn: () =>
      fetchClient<MenuResponse>(
        id
          ? `public_api/restaurants/${restaurantId}/menu/${id}`
          : `public_api/restaurants/${restaurantId}/menu`,
      ),
  });
}
