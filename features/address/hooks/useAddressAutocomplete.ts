import { PlaceAutocompleteResponseData } from "@googlemaps/google-maps-services-js";
import { useQuery } from "@tanstack/react-query";

import { TranslatedError } from "@/types/api/Error";

export function useAddressAutocomplete(searchQuery: string, enabled = true) {
  return useQuery<PlaceAutocompleteResponseData, TranslatedError>({
    queryKey: ["address-autocomplete", searchQuery],
    queryFn: async () => {
      const response = await fetch(
        `/api/address/autocomplete?input=${encodeURIComponent(searchQuery)}`,
      );

      return response.json();
    },
    enabled: enabled && searchQuery.length >= 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
