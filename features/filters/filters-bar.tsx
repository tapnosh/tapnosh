"use client";

import { Settings2Icon, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/forms/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/layout/tabs";
import { MenuItem } from "@/types/menu/Menu";

import { FiltersDrawer } from "./filters-drawer";
import { FilterState } from "./types";

// Re-export for convenience
export type { FilterState };

interface MenuGroup {
  name: string;
  items: MenuItem[];
}

interface FiltersBarProps {
  groups?: MenuGroup[];
  selectedGroup?: string | null;
  onGroupChange?: (groupName: string | null) => void;
  filters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
}

export function FiltersBar({
  groups = [],
  selectedGroup = null,
  onGroupChange,
  filters,
  onFiltersChange,
}: FiltersBarProps) {
  const [open, setOpen] = useState(false);

  // Extract all items from groups
  const allItems = useMemo(() => {
    return groups.flatMap((group) => group.items);
  }, [groups]);

  // Calculate min and max prices
  const { minPrice, maxPrice } = useMemo(() => {
    if (allItems.length === 0) return { minPrice: 0, maxPrice: 100 };
    const prices = allItems.map((item) => item.price.amount);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [allItems]);

  // Extract all unique categories
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    allItems.forEach((item) => {
      item.categories?.forEach((cat) => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, [allItems]);

  // Extract all unique ingredients
  const allIngredients = useMemo(() => {
    const ingredients = new Set<string>();
    allItems.forEach((item) => {
      item.ingredients?.forEach((ing) => ingredients.add(ing));
    });
    return Array.from(ingredients).sort();
  }, [allItems]);

  const handleGroupChange = (value: string) => {
    if (onGroupChange) {
      onGroupChange(value === "all" ? null : value);
    }
  };

  const handleClearAll = () => {
    if (onGroupChange) {
      onGroupChange(null);
    }
    if (onFiltersChange) {
      onFiltersChange({
        priceRange: [minPrice, maxPrice],
        categories: [],
        ingredients: [],
      });
    }
  };

  const handleFiltersApply = (newFilters: FilterState) => {
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
    setOpen(false);
  };

  return (
    <div className="mt-4 mb-12 flex flex-wrap items-center justify-between gap-3">
      <Tabs
        className="overflow-auto"
        value={selectedGroup || "all"}
        onValueChange={handleGroupChange}
      >
        <TabsList>
          <TabsTrigger
            value="all"
            className="data-[state=active]:!bg-primary data-[state=active]:text-primary-foreground px-4"
          >
            All
          </TabsTrigger>
          {groups.map((group, index) => (
            <TabsTrigger
              key={index}
              value={group.name}
              className="data-[state=active]:!bg-primary data-[state=active]:text-primary-foreground px-4"
            >
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex gap-2">
        <Button onClick={() => setOpen(true)}>
          <Settings2Icon />
          Filters
        </Button>
        <Button variant="outline" onClick={handleClearAll}>
          <X />
          Clear all
        </Button>
      </div>

      <FiltersDrawer
        open={open}
        setOpen={(value) => setOpen(value)}
        minPrice={minPrice}
        maxPrice={maxPrice}
        allCategories={allCategories}
        allIngredients={allIngredients}
        filters={filters}
        onApply={handleFiltersApply}
      />
    </div>
  );
}
