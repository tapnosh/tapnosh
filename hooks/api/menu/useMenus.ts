import { useQuery } from "@tanstack/react-query";
import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import { Builder } from "@/types/builder/BuilderSchema";

export function useMenusQuery({
  restaurantId,
}: {
  restaurantId: string;
}): ReturnType<typeof useQuery<Builder, TranslatedError>>;

export function useMenusQuery({
  restaurantId,
  id,
}: {
  restaurantId: string;
  id?: string;
}): ReturnType<typeof useQuery<Builder, TranslatedError>>;

export function useMenusQuery({
  restaurantId,
  id,
}: {
  restaurantId: string;
  id?: string;
}) {
  const { fetchClient } = useFetchClient();

  return useQuery<Builder | Builder, TranslatedError>({
    queryKey: ["restaurants", id],
    queryFn: () =>
      fetchClient<Builder | Builder>(
        id
          ? `/restaurants/${restaurantId}/menu/${id}`
          : `/restaurants/${restaurantId}/menu`,
      ),
  });
}
