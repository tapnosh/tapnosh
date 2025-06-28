import { useQuery } from "@tanstack/react-query";
import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";

export function useRedirectUrlQuery(
  id: string,
): ReturnType<typeof useQuery<{ url: string }, TranslatedError>>;

export function useRedirectUrlQuery(id: string) {
  const { fetchClient } = useFetchClient();

  return useQuery<{ url: string }, TranslatedError>({
    queryKey: ["qr-redirect-url"],
    queryFn: () =>
      fetchClient<{ url: string }>(`restaurants/${id}/generate_qr`),
  });
}
