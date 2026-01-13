"use client";

import { Settings2Icon, X } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("management.pageBuilder.menu.display");
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
  const allergens = useMemo(() => {
    const categoriesMap = new Map<string, { id: string; name: string }>();
    allItems.forEach((item) => {
      item.allergens?.forEach((cat) => {
        if (!categoriesMap.has(cat.id)) {
          categoriesMap.set(cat.id, { id: cat.id, name: cat.name });
        }
      });
    });
    return Array.from(categoriesMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [allItems]);

  // Extract all unique ingredients
  const foodTypes = useMemo(() => {
    const ingredientsMap = new Map<string, { id: string; name: string }>();
    allItems.forEach((item) => {
      item.food_types?.forEach((ing) => {
        if (!ingredientsMap.has(ing.id)) {
          ingredientsMap.set(ing.id, { id: ing.id, name: ing.name });
        }
      });
    });
    return Array.from(ingredientsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
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
        food_types: [],
        allergens: [],
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
    <div className="mt-4 mb-8 flex flex-wrap items-center justify-between gap-3">
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
            {t("all")}
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
          {t("filters")}
        </Button>
        <Button variant="outline" onClick={handleClearAll}>
          <X />
          {t("clearAll")}
        </Button>
      </div>

      <FiltersDrawer
        open={open}
        setOpen={(value) => setOpen(value)}
        minPrice={minPrice}
        maxPrice={maxPrice}
        filters={filters}
        allergens={allergens}
        foodTypes={foodTypes}
        onApply={handleFiltersApply}
      />
    </div>
  );
}
