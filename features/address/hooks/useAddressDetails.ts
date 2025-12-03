import { useQuery } from "@tanstack/react-query";

import { useFetchClient } from "@/hooks/api/useFetchClient";
import type { AddressDetails } from "@/types/address";
import { TranslatedError } from "@/types/api/Error";

export function useAddressDetails(
  placeId: string | null,
  sessionToken?: string,
  enabled = true,
) {
  const { fetchClient } = useFetchClient();

  return useQuery<{ address: AddressDetails }, TranslatedError>({
    queryKey: ["address-details", placeId, sessionToken],
    queryFn: async () => {
      const params = new URLSearchParams({
        placeId: placeId!,
      });
      if (sessionToken) {
        params.append("sessionToken", sessionToken);
      }
      return fetchClient(`places/details?${params.toString()}`);
    },
    enabled: enabled && !!placeId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
