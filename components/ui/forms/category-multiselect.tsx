"use client";

import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/data-display/badge";
import { Button } from "@/components/ui/forms/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/overlays/popover";
import { getAllergenIcon, getFoodTypeIcon } from "@/features/menu/utils/icons";
import { useCategoriesQuery } from "@/hooks/api/categories/useCategories";
import { RestaurantCategory } from "@/types/category/Category";
import { cn } from "@/utils/cn";

interface CategoryMultiSelectProps {
  value?: RestaurantCategory[];
  onChange: (categories: RestaurantCategory[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  type?: "cuisine" | "allergens" | "food_type";
  "aria-invalid"?: boolean;
}

export function CategoryMultiSelect({
  value = [],
  onChange,
  placeholder = "Select categories...",
  className,
  disabled = false,
  type,
  "aria-invalid": ariaInvalid,
}: CategoryMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const t = useTranslations("categories");

  const getCategoryIcon = (categoryName: string, categoryType?: string) => {
    if (categoryType === "allergens") {
      return getAllergenIcon(categoryName);
    }
    if (categoryType === "food_type") {
      return getFoodTypeIcon(categoryName);
    }

    return undefined;
  };

  const {
    data: categories = [],
    error: categoriesError,
    isLoading: isLoadingCategories,
  } = useCategoriesQuery(type ? { type } : undefined);

  const selectedCategories = React.useMemo(
    () => categories.filter((cat) => value.some((v) => v.id === cat.id)),
    [categories, value],
  );

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter((cat) =>
      t(cat.name).toLowerCase().includes(query),
    );
  }, [categories, searchQuery, t]);

  const handleToggleCategory = (category: RestaurantCategory) => {
    const isSelected = value.some((v) => v.id === category.id);
    const newValue = isSelected
      ? value.filter((v) => v.id !== category.id)
      : [...value, category];
    onChange(newValue);
  };

  const handleRemoveCategory = (
    categoryId: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(value.filter((v) => v.id !== categoryId));
  };

  const displayValue = React.useMemo(() => {
    if (selectedCategories.length === 0) {
      return placeholder;
    }
    if (selectedCategories.length < 5) {
      return selectedCategories.map((cat) => t(cat.name)).join(", ");
    }
    return `${selectedCategories.length} categories selected`;
  }, [selectedCategories, placeholder, t]);

  return (
    <div className="space-y-2">
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
            disabled={disabled || isLoadingCategories}
          >
            <span className="truncate">{displayValue}</span>
            {isLoadingCategories ? (
              <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search categories..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9"
            />
            <CommandList>
              {isLoadingCategories && (
                <div className="text-muted-foreground flex items-center justify-center gap-2 p-3 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading categories...
                </div>
              )}
              {categoriesError && (
                <div className="text-destructive p-3 text-center text-sm">
                  Failed to load categories
                </div>
              )}
              {!isLoadingCategories &&
                !categoriesError &&
                filteredCategories.length === 0 && (
                  <CommandEmpty>No categories found.</CommandEmpty>
                )}
              {!isLoadingCategories &&
                !categoriesError &&
                filteredCategories.length > 0 && (
                  <CommandGroup>
                    {filteredCategories.map((category) => {
                      const isSelected = value.some(
                        (v) => v.id === category.id,
                      );
                      const Icon = getCategoryIcon(category.name, type);
                      return (
                        <CommandItem
                          key={category.id}
                          value={category.id}
                          onSelect={() => handleToggleCategory(category)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4" />}
                            <span className="font-medium">
                              {t(category.name)}
                            </span>
                          </div>
                          {isSelected && <Check className="ml-auto h-4 w-4" />}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected categories badges */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedCategories.map((category) => {
            const Icon = getCategoryIcon(category.name, type);
            return (
              <Badge
                key={category.id}
                variant="secondary"
                className="flex items-center gap-0.5"
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{t(category.name)}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveCategory(category.id, e)}
                  className="hover:bg-secondary-foreground/10 ml-1 rounded-sm transition-colors"
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
