import { useQuery } from "@tanstack/react-query";

import type { AddressDetails } from "@/types/address";
import { TranslatedError } from "@/types/api/Error";

export function useAddressDetails(placeId: string | null, enabled = true) {
  return useQuery<{ address: AddressDetails }, TranslatedError>({
    queryKey: ["address-details", placeId],
    queryFn: async () => {
      const response = await fetch(
        `/api/address/details?placeId=${encodeURIComponent(placeId!)}`,
      );

      return response.json();
    },
    enabled: enabled && !!placeId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
