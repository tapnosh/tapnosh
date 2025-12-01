"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/overlays/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

import { BadgeFilter } from "./badge-filter";
import { FilterActions } from "./filter-actions";
import { PriceRangeFilter } from "./price-range-filter";
import { FilterState } from "./types";

interface CategoryItem {
  id: string;
  name: string;
}

interface FiltersDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  minPrice: number;
  maxPrice: number;
  filters?: FilterState;
  allergens: CategoryItem[];
  foodTypes: CategoryItem[];
  onApply: (filters: FilterState) => void;
}

export function FiltersDrawer({
  open,
  setOpen,
  minPrice,
  maxPrice,
  filters,
  allergens,
  foodTypes,
  onApply,
}: FiltersDrawerProps) {
  const isMobile = useIsMobile();
  const t = useTranslations("categories");

  const [priceRange, setPriceRange] = useState<[number, number]>(
    filters?.priceRange || [minPrice, maxPrice],
  );
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<string[]>(
    filters?.food_types || [],
  );
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(
    filters?.allergens || [],
  );

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
      priceRange,
      food_types: selectedFoodTypes,
      allergens: selectedAllergens,
    });
  };

  const handleReset = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedFoodTypes([]);
    setSelectedAllergens([]);
  };

  return (
    <Drawer
      repositionInputs={false}
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent className="top-auto right-0 bottom-0 left-0 h-[85vh] w-full rounded-t-3xl md:top-0 md:right-0 md:left-auto md:mt-0 md:h-screen md:w-[500px] md:rounded-none">
        <DrawerHeader>
          <DrawerTitle>Filter Menu Items</DrawerTitle>
          <DrawerDescription>
            Adjust filters to find exactly what you&apos;re looking for.
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-6 px-4 pb-4">
          <PriceRangeFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            value={priceRange}
            onChange={setPriceRange}
          />

          <BadgeFilter
            label="Food Types"
            mode="include"
            items={foodTypes}
            selectedItems={selectedFoodTypes}
            onToggle={(item) => toggleItem(item, setSelectedFoodTypes)}
            translateItem={t}
          />

          <BadgeFilter
            label="Exclude Allergens"
            mode="exclude"
            items={allergens}
            selectedItems={selectedAllergens}
            onToggle={(item) => toggleItem(item, setSelectedAllergens)}
            translateItem={t}
          />
        </div>

        <DrawerFooter>
          <FilterActions onApply={handleApply} onReset={handleReset} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
