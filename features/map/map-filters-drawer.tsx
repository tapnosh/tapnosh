"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/forms/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/overlays/drawer";
import { BadgeFilter } from "@/features/filters/badge-filter";
import { useCategoriesQuery } from "@/hooks/api/categories/useCategories";
import { useIsMobile } from "@/hooks/use-mobile";

import { DistanceFilter } from "./distance-filter";
import { MapFilterState } from "./types";

interface MapFiltersDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  filters?: MapFilterState;
  onApply: (filters: MapFilterState) => void;
  userLocation: { lat: number; lng: number } | null;
}

// Inline FilterActions component
function FilterActions({
  onApply,
  onReset,
}: {
  onApply: () => void;
  onReset: () => void;
}) {
  return (
    <>
      <div className="flex w-full gap-2">
        <Button onClick={onApply} className="flex-1">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={onReset} className="flex-1">
          Reset
        </Button>
      </div>
      <DrawerClose asChild>
        <Button variant="ghost">Cancel</Button>
      </DrawerClose>
    </>
  );
}

export function MapFiltersDrawer({
  open,
  setOpen,
  filters,
  onApply,
  userLocation,
}: MapFiltersDrawerProps) {
  const isMobile = useIsMobile();
  const t = useTranslations("categories");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(
    filters?.cuisines || [],
  );
  const [distance, setDistance] = useState<number | null>(
    filters?.distance ?? null,
  );

  // Fetch categories by type
  const { data: cuisines = [] } = useCategoriesQuery({ type: "cuisine" });

  const toggleItem = (
    item: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleApply = () => {
    onApply({
      cuisines: selectedCuisines,
      distance,
    });
    setOpen(false);
  };

  const handleReset = () => {
    setSelectedCuisines([]);
    setDistance(null);
  };

  return (
    <Drawer
      repositionInputs={false}
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent className="top-auto right-0 bottom-0 left-0 h-[85vh] w-full rounded-t-[10px] md:top-0 md:right-0 md:left-auto md:mt-0 md:h-screen md:w-[500px] md:rounded-none">
        <DrawerHeader>
          <DrawerTitle>Filter Restaurants</DrawerTitle>
          <DrawerDescription>
            Find restaurants near you by category and distance.
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-6 overflow-y-auto px-4 pb-4">
          <DistanceFilter
            maxDistance={100}
            value={distance}
            onChange={setDistance}
            disabled={!userLocation}
          />

          <BadgeFilter
            label="Cuisines"
            description="Include restaurants with these cuisines"
            items={cuisines}
            selectedItems={selectedCuisines}
            onToggle={(item) => toggleItem(item, setSelectedCuisines)}
            mode="include"
            translateItem={t}
            showSearch
          />
        </div>

        <DrawerFooter>
          <FilterActions onApply={handleApply} onReset={handleReset} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
