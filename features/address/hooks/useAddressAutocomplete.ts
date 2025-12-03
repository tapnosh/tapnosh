import { useQuery } from "@tanstack/react-query";

import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";

export type PlaceAutocompleteResult = {
  description: string;
  mainText?: string;
  secondaryText?: string;
  placeId: string;
};

export type PlacesAutocompleteResponseData = {
  sessionToken: string;
  predictions: PlaceAutocompleteResult[];
};

export function useAddressAutocomplete(searchQuery: string, enabled = true) {
  const { fetchClient } = useFetchClient();
  return useQuery<PlacesAutocompleteResponseData, TranslatedError>({
    queryKey: ["address-autocomplete", searchQuery],
    queryFn: () => {
      const params = new URLSearchParams({
        input: searchQuery,
      });
      return fetchClient(`places/autocomplete?${params.toString()}`);
    },
    enabled: enabled && searchQuery.length >= 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
