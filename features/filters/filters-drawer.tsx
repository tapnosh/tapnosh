"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";

import { Badge } from "@/components/ui/data-display/badge";
import { Button } from "@/components/ui/forms/button";
import { Label } from "@/components/ui/forms/label";
import { Slider } from "@/components/ui/forms/slider";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/overlays/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCurrency } from "@/hooks/useCurrency";

import { FilterState } from "./types";

interface FiltersDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  minPrice: number;
  maxPrice: number;
  allCategories: string[];
  allIngredients: string[];
  filters?: FilterState;
  onApply: (filters: FilterState) => void;
}

export function FiltersDrawer({
  open,
  setOpen,
  minPrice,
  maxPrice,
  allCategories,
  allIngredients,
  filters,
  onApply,
}: FiltersDrawerProps) {
  const { formatCurrency } = useCurrency();
  const isMobile = useIsMobile();
  const [categoriesParent] = useAutoAnimate();
  const [ingredientsParent] = useAutoAnimate();
  const [priceRange, setPriceRange] = useState<[number, number]>(
    filters?.priceRange || [minPrice, maxPrice],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    filters?.categories || [],
  );
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    filters?.ingredients || [],
  );

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient],
    );
  };

  const handleApply = () => {
    onApply({
      priceRange,
      categories: selectedCategories,
      ingredients: selectedIngredients,
    });
  };

  const handleReset = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedCategories([]);
    setSelectedIngredients([]);
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
          <DrawerTitle>Filter Menu Items</DrawerTitle>
          <DrawerDescription>
            Adjust filters to find exactly what you&apos;re looking for.
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-6 px-4 pb-4">
          {/* Price Range Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Price Range</Label>
              <span className="text-muted-foreground text-sm">
                {formatCurrency(priceRange[0])} -{" "}
                {formatCurrency(priceRange[1])}
              </span>
            </div>
            <Slider
              min={minPrice}
              max={maxPrice}
              step={1}
              value={priceRange}
              onValueChange={(value) =>
                setPriceRange(value as [number, number])
              }
            />
          </div>

          {/* Categories Filter */}
          {allCategories.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Categories</Label>
              <div ref={categoriesParent} className="flex flex-wrap gap-2">
                {[...allCategories]
                  .sort((a, b) => {
                    const aSelected = selectedCategories.includes(a);
                    const bSelected = selectedCategories.includes(b);
                    if (aSelected && !bSelected) return -1;
                    if (!aSelected && bSelected) return 1;
                    return 0;
                  })
                  .map((category) => {
                    const isSelected = selectedCategories.includes(category);
                    return (
                      <Badge
                        key={category}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer px-3 py-1.5"
                        onClick={() => handleCategoryToggle(category)}
                      >
                        {category}
                      </Badge>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Ingredients Filter */}
          {allIngredients.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Exclude Ingredients
              </Label>
              <div ref={ingredientsParent} className="flex flex-wrap gap-2">
                {[...allIngredients]
                  .sort((a, b) => {
                    const aSelected = selectedIngredients.includes(a);
                    const bSelected = selectedIngredients.includes(b);
                    if (aSelected && !bSelected) return -1;
                    if (!aSelected && bSelected) return 1;
                    return 0;
                  })
                  .map((ingredient) => {
                    const isSelected = selectedIngredients.includes(ingredient);
                    return (
                      <Badge
                        key={ingredient}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer px-3 py-1.5"
                        onClick={() => handleIngredientToggle(ingredient)}
                      >
                        {ingredient}
                      </Badge>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        <DrawerFooter>
          <div className="flex w-full gap-2">
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset
            </Button>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
