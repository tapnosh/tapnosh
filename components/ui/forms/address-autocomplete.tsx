"use client";

import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/forms/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/overlays/popover";
import {
  PlaceAutocompleteResult,
  useAddressAutocomplete,
} from "@/features/address/hooks/useAddressAutocomplete";
import { useAddressDetails } from "@/features/address/hooks/useAddressDetails";
import type { AddressDetails } from "@/types/address";
import { cn } from "@/utils/cn";

interface AddressAutocompleteProps {
  value?: AddressDetails | null;
  onSelect: (address: AddressDetails) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  debounceMs?: number;
  "aria-invalid"?: boolean;
}

export function AddressAutocomplete({
  value,
  onSelect,
  placeholder = "Search for an address...",
  className,
  disabled = false,
  debounceMs = 300,
  "aria-invalid": ariaInvalid,
}: AddressAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [selectedPlaceId, setSelectedPlaceId] = React.useState<string | null>(
    null,
  );

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Fetch autocomplete predictions
  const {
    data: autocompleteData,
    isLoading: isLoadingPredictions,
    error: autocompleteError,
  } = useAddressAutocomplete(debouncedQuery);

  const predictions: PlaceAutocompleteResult[] =
    autocompleteData?.predictions ?? [];

  // Fetch address details when a place is selected
  const {
    data: addressDetailsData,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useAddressDetails(selectedPlaceId, autocompleteData?.sessionToken);

  // Handle successful address details fetch
  React.useEffect(() => {
    if (addressDetailsData) {
      onSelect(addressDetailsData);
      setOpen(false);
      setSearchQuery("");
      setSelectedPlaceId(null);
    }
  }, [addressDetailsData, onSelect]);

  const handleSelectPrediction = (placeId: string) => {
    setSelectedPlaceId(placeId);
  };

  const loading = isLoadingPredictions || isLoadingDetails;
  const error = autocompleteError?.message || detailsError?.message || null;

  const displayValue = value?.formattedAddress || "Select an address...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          className={cn(
            "hover:border-input aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 w-full justify-between rounded-md",
            className,
          )}
          disabled={disabled}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandList>
            {loading && (
              <div className="text-muted-foreground p-3 text-center text-sm">
                Loading...
              </div>
            )}
            {error && (
              <div className="text-destructive p-3 text-center text-sm">
                {error}
              </div>
            )}
            {!loading && !error && searchQuery.length < 3 && (
              <div className="text-muted-foreground p-3 text-center text-sm">
                Type at least 3 characters to search
              </div>
            )}
            {!loading &&
              !error &&
              searchQuery.length >= 3 &&
              predictions.length === 0 && (
                <CommandEmpty>No addresses found.</CommandEmpty>
              )}
            {!loading && !error && predictions.length > 0 && (
              <CommandGroup>
                {predictions.map((prediction) => (
                  <CommandItem
                    key={prediction.placeId}
                    value={prediction.placeId}
                    onSelect={() => handleSelectPrediction(prediction.placeId)}
                    className="cursor-pointer"
                  >
                    <MapPin className="mr-2 h-4 w-4 opacity-50" />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {prediction?.mainText}
                      </span>
                      {prediction?.secondaryText && (
                        <span className="text-muted-foreground text-xs">
                          {prediction.secondaryText}
                        </span>
                      )}
                    </div>
                    {value?.formattedAddress === prediction.description && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
