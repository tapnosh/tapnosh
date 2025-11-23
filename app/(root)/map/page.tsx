"use client";

import { Crosshair, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/forms/button";
import { RestaurantMap } from "@/features/map/google-map";
import { useGeolocation } from "@/features/map/hooks/useGeolocation";
import { MapFiltersDrawer } from "@/features/map/map-filters-drawer";
import { RestaurantDetailsDialog } from "@/features/map/restaurant-details-drawer";
import { MapFilterState } from "@/features/map/types";
import { calculateDistance } from "@/features/map/utils/distance";
import { RestaurantMapItem } from "@/types/restaurant/RestaurantMap";

// Mock data - replace with actual API call
const mockRestaurants: RestaurantMapItem[] = [
  {
    id: "8c96ae0d-28ed-453f-9f8b-4eea2208235b",
    name: "Sante!",
    description: "Restauracja śródziemnomorska 🌊",
    slug: "sante",
    theme: {
      id: "9bd1b345-2882-40ea-ac86-0f02a09e995b",
      color: "#291aff",
    },
    images: [
      {
        url: "https://wbslsaap89e4sdcz.public.blob.vercel-storage.com/542812182_17983765919893708_3166450575168985522_n.-xGdt1u5c1IsoYIZeHkvOBFimg62hX1.jpg",
        downloadUrl:
          "https://wbslsaap89e4sdcz.public.blob.vercel-storage.com/542812182_17983765919893708_3166450575168985522_n.-xGdt1u5c1IsoYIZeHkvOBFimg62hX1.jpg?download=1",
        pathname:
          "542812182_17983765919893708_3166450575168985522_n.-xGdt1u5c1IsoYIZeHkvOBFimg62hX1.jpg",
        contentType: "image/jpeg",
        contentDisposition:
          'inline; filename="542812182_17983765919893708_3166450575168985522_n.-xGdt1u5c1IsoYIZeHkvOBFimg62hX1.jpg"',
      },
    ],
    categories: [
      {
        id: "5abeaf2e-04a2-4c98-a52b-7149bc5143f0",
        name: "Test",
        description: "Test",
        createdAt: "2025-11-23T00:00:00.000Z",
        updatedAt: "2025-11-23T00:00:00.000Z",
      },
    ],
    address: {
      formattedAddress: "Warsaw, Poland",
      streetNumber: "1",
      street: "Test Street",
      city: "Warsaw",
      state: "Mazowieckie",
      stateCode: "MZ",
      country: "Poland",
      countryCode: "PL",
      postalCode: "00-001",
      latitude: 52.2297,
      longitude: 21.0122,
    },
    menu: {
      menu: [
        {
          name: "Dania główne",
          type: "menu-group",
          items: [
            {
              id: "item-1763749953491",
              name: "Makaron z krewetkami w sosie winnym",
              image: [
                {
                  url: "https://wbslsaap89e4sdcz.public.blob.vercel-storage.com/542812182_17983765919893708_3166450575168985522_n.-us5Ng54QZSX3ElmmGeIiivHLhmUB6G.jpg",
                  pathname:
                    "542812182_17983765919893708_3166450575168985522_n.-us5Ng54QZSX3ElmmGeIiivHLhmUB6G.jpg",
                  contentType: "image/jpeg",
                  downloadUrl:
                    "https://wbslsaap89e4sdcz.public.blob.vercel-storage.com/542812182_17983765919893708_3166450575168985522_n.-us5Ng54QZSX3ElmmGeIiivHLhmUB6G.jpg?download=1",
                  contentDisposition:
                    'inline; filename="542812182_17983765919893708_3166450575168985522_n.-us5Ng54QZSX3ElmmGeIiivHLhmUB6G.jpg"',
                },
              ],
              price: {
                amount: 45,
                currency: "PLN",
              },
              version: "v1",
              categories: ["włoska"],
              description: "Makaronik kreweteczki co chcieć więcej",
              ingredients: ["penne", "białe wino", "pietruszka", "krewetki"],
            },
            {
              id: "item-1763803725352",
              name: "Brioche z krewetkami",
              image: [
                {
                  url: "https://wbslsaap89e4sdcz.public.blob.vercel-storage.com/Brioche_6-SQ-ZmynwIbse29D6ZnDQLTG8SZIhpGBDT.webp",
                  pathname: "Brioche_6-SQ-ZmynwIbse29D6ZnDQLTG8SZIhpGBDT.webp",
                  contentType: "image/webp",
                  downloadUrl:
                    "https://wbslsaap89e4sdcz.public.blob.vercel-storage.com/Brioche_6-SQ-ZmynwIbse29D6ZnDQLTG8SZIhpGBDT.webp?download=1",
                  contentDisposition:
                    'inline; filename="Brioche_6-SQ-ZmynwIbse29D6ZnDQLTG8SZIhpGBDT.webp"',
                },
              ],
              price: {
                amount: 30,
                currency: "PLN",
              },
              version: "v1",
              categories: ["kontynentalna"],
              description:
                "Pyszna maślana bułka nadziewana krewetkami i konfiturą z cebuli",
              ingredients: ["bułka", "krewetki", "cebula"],
            },
          ],
          timeTo: "12:00",
          version: "v1",
          timeFrom: "07:00",
        },
      ],
      header: [
        {
          type: "heading",
          heading: "Cudowne doznania",
          version: "v1",
        },
        {
          text: "Pyszne żarełko",
          type: "text",
          version: "v1",
        },
      ],
    },
  },
  {
    id: "8a321c89-a29c-40bd-8aed-39998af43a4f",
    name: "Kantyna am am",
    description: "Pyszne jedzonko o kazdej porze dnia",
    slug: "kantyna-dam-dam",
    theme: {
      id: "0f1faec9-8b97-48d8-9d11-c597c0161404",
      color: "#f976aa",
    },
    images: [
      {
        url: "https://wbslsaap89e4sdcz.public.blob.vercel-storage.com/Brioche_6-SQ-YdCTc9VFhqvUjDAAamO2o5v4E3yRui.webp",
        downloadUrl:
          "https://wbslsaap89e4sdcz.public.blob.vercel-storage.com/Brioche_6-SQ-YdCTc9VFhqvUjDAAamO2o5v4E3yRui.webp?download=1",
        pathname: "Brioche_6-SQ-YdCTc9VFhqvUjDAAamO2o5v4E3yRui.webp",
        contentType: "image/webp",
        contentDisposition:
          'inline; filename="Brioche_6-SQ-YdCTc9VFhqvUjDAAamO2o5v4E3yRui.webp"',
      },
    ],
    categories: [
      {
        id: "5abeaf2e-04a2-4c98-a52b-7149bc5143f0",
        name: "Test",
        description: "Test",
        createdAt: "2025-11-23T00:00:00.000Z",
        updatedAt: "2025-11-23T00:00:00.000Z",
      },
    ],
    address: {
      formattedAddress: "Krakow, Poland",
      streetNumber: "10",
      street: "Main Street",
      city: "Krakow",
      state: "Malopolskie",
      stateCode: "MP",
      country: "Poland",
      countryCode: "PL",
      postalCode: "30-001",
      latitude: 50.0647,
      longitude: 19.945,
    },
    menu: {
      menu: [
        {
          name: "Main dishes",
          type: "menu-group",
          items: [
            {
              id: "item-1763811576607",
              name: "Some fancy pasta",
              image: [
                {
                  url: "https://wbslsaap89e4sdcz.public.blob.vercel-storage.com/544103330_17984981786893708_2343218965447401058_n.-kUnwKWnp7y6f6ybZc8qmCa5RVlarxl.jpg",
                  pathname:
                    "544103330_17984981786893708_2343218965447401058_n.-kUnwKWnp7y6f6ybZc8qmCa5RVlarxl.jpg",
                  contentType: "image/jpeg",
                  downloadUrl:
                    "https://wbslsaap89e4sdcz.public.blob.vercel-storage.com/544103330_17984981786893708_2343218965447401058_n.-kUnwKWnp7y6f6ybZc8qmCa5RVlarxl.jpg?download=1",
                  contentDisposition:
                    'inline; filename="544103330_17984981786893708_2343218965447401058_n.-kUnwKWnp7y6f6ybZc8qmCa5RVlarxl.jpg"',
                },
              ],
              price: {
                amount: 31.96,
                currency: "PLN",
              },
              version: "v1",
              categories: [],
              description: "pych",
              ingredients: ["makaron", "krewetki"],
            },
          ],
          timeTo: "12:00",
          version: "v1",
          timeFrom: "07:00",
        },
      ],
      header: [],
    },
  },
];

export default function MapPage() {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantMapItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  const [filters, setFilters] = useState<MapFilterState>({
    cuisines: [],
    allergens: [],
    foodTypes: [],
    distance: null,
  });

  const {
    location: userLocation,
    error: locationError,
    loading: isLocating,
    getCurrentPosition,
  } = useGeolocation({
    watch: false, // Don't continuously track - only on demand
    enableHighAccuracy: true,
    maximumAge: 0,
  });

  // Request location on page load
  useEffect(() => {
    getCurrentPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show toast notifications for location errors
  useEffect(() => {
    if (locationError) {
      toast.error(locationError);
      setHasShownSuccessToast(false);
    }
  }, [locationError]);

  // Show success toast when location is found (only once per successful fetch)
  useEffect(() => {
    if (
      userLocation &&
      !isLocating &&
      !locationError &&
      !hasShownSuccessToast
    ) {
      toast.success("Location found!");
      setHasShownSuccessToast(true);
    }
  }, [userLocation, isLocating, locationError, hasShownSuccessToast]);

  const handleMarkerClick = (restaurant: RestaurantMapItem) => {
    setSelectedRestaurant(restaurant);
    setIsDialogOpen(true);
  };

  const handleLocateMe = () => {
    setHasShownSuccessToast(false);
    getCurrentPosition();
  };

  const handleApplyFilters = (newFilters: MapFilterState) => {
    setFilters(newFilters);
  };

  // Filter restaurants based on selected categories and distance
  const filteredRestaurants = useMemo(() => {
    return mockRestaurants.filter((restaurant) => {
      const restaurantCategoryNames = restaurant.categories.map((c) => c.name);

      // Filter by cuisines (include)
      if (filters.cuisines.length > 0) {
        const hasMatchingCuisine = filters.cuisines.some((cuisine) =>
          restaurantCategoryNames.includes(cuisine),
        );
        if (!hasMatchingCuisine) {
          return false;
        }
      }

      // Filter by allergens (exclude)
      if (filters.allergens.length > 0) {
        const hasExcludedAllergen = filters.allergens.some((allergen) =>
          restaurantCategoryNames.includes(allergen),
        );
        if (hasExcludedAllergen) {
          return false;
        }
      }

      // Filter by food types (include)
      if (filters.foodTypes.length > 0) {
        const hasMatchingFoodType = filters.foodTypes.some((foodType) =>
          restaurantCategoryNames.includes(foodType),
        );
        if (!hasMatchingFoodType) {
          return false;
        }
      }

      // Filter by distance
      if (filters.distance !== null && userLocation && restaurant.address) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          restaurant.address.latitude,
          restaurant.address.longitude,
        );
        if (distance > filters.distance) {
          return false;
        }
      }

      return true;
    });
  }, [filters, userLocation]);

  // Get Google Maps API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  if (!apiKey) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-destructive text-center">
          <p className="text-lg font-semibold">Configuration Error</p>
          <p className="text-sm">Google Maps API key is not configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1">
      <RestaurantMap
        restaurants={filteredRestaurants}
        onMarkerClick={handleMarkerClick}
        apiKey={apiKey}
        userLocation={userLocation}
      />
      <div className="absolute top-3.5 right-4 z-10 flex gap-2">
        <Button
          onClick={() => setIsFilterDrawerOpen(true)}
          className="shadow-lg"
          variant="default"
        >
          Filters
          <SlidersHorizontal />
        </Button>
        <Button
          onClick={handleLocateMe}
          disabled={isLocating}
          className="shadow-lg"
          size="icon"
          variant="default"
        >
          <Crosshair className={isLocating ? "animate-spin" : ""} />
        </Button>
      </div>
      <RestaurantDetailsDialog
        restaurant={selectedRestaurant}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <MapFiltersDrawer
        open={isFilterDrawerOpen}
        setOpen={setIsFilterDrawerOpen}
        filters={filters}
        onApply={handleApplyFilters}
        userLocation={userLocation}
      />
    </div>
  );
}
