"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/data-display/badge";
import { Button } from "@/components/ui/forms/button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/overlays/drawer";
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

// Inline BadgeFilter component
function BadgeFilter({
  label,
  description,
  items,
  selectedItems,
  onToggle,
  mode = "include",
  translateItem,
  showSearch = true,
}: {
  label: string;
  description?: string;
  items: { id: string; name: string }[];
  selectedItems: string[];
  onToggle: (item: string) => void;
  mode?: "include" | "exclude";
  translateItem: (id: string) => string;
  showSearch?: boolean;
}) {
  const [parent] = useAutoAnimate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) =>
      translateItem(item.id).toLowerCase().includes(query),
    );
  }, [items, searchQuery, translateItem]);

  if (items.length === 0) return null;

  // Split items into selected and unselected for proper ordering
  const selectedItemsFiltered = items.filter((item) =>
    selectedItems.includes(item.name),
  );
  const unselectedItemsFiltered = filteredItems.filter(
    (item) => !selectedItems.includes(item.name),
  );

  const sortedItems = [...selectedItemsFiltered, ...unselectedItemsFiltered];

  const modeText = mode === "exclude" ? "Exclude" : "Include";

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-base font-semibold">
          {label}{" "}
          <span className="text-muted-foreground text-sm font-normal">
            ({modeText})
          </span>
        </Label>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>
      {/* Search Bar */}
      {showSearch && (
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}
      <div ref={parent} className="flex flex-wrap gap-2">
        {sortedItems.length === 0 ? (
          <p className="text-muted-foreground text-sm">No results found</p>
        ) : (
          sortedItems.map((item) => {
            const isSelected = selectedItems.includes(item.name);
            return (
              <Badge
                key={item.id}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer px-3 py-1.5"
                onClick={() => onToggle(item.name)}
              >
                {translateItem(item.id)}
              </Badge>
            );
          })
        )}
      </div>
    </div>
  );
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

  // Helper function to translate category by ID
  const translateCategory = (id: string) => {
    return t(id);
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine],
    );
  };

  const handleApply = () => {
    onApply({
      cuisines: selectedCuisines,
      allergens: [],
      foodTypes: [],
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
            onToggle={toggleCuisine}
            mode="include"
            translateItem={translateCategory}
          />
        </div>

        <DrawerFooter>
          <FilterActions onApply={handleApply} onReset={handleReset} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
