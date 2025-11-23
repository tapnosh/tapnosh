"use client";

import {
  Apple,
  Check,
  ChevronRight,
  ChevronsUpDown,
  CookingPot,
  Droplets,
  Fish,
  Flame,
  Leaf,
  Loader2,
  Milk,
  Nut,
  Sparkles,
  Tag,
  Wheat,
  WheatOff,
  Wine,
  X,
} from "lucide-react";
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
import { Button } from "@/components/ui/forms/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/overlays/popover";
import { useCategoriesQuery } from "@/hooks/api/categories/useCategories";
import { cn } from "@/utils/cn";

interface CategoryMultiSelectProps {
  value?: string[];
  onChange: (categoryIds: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  type?: "cuisine" | "allergens" | "food_type";
}

export function CategoryMultiSelect({
  value = [],
  onChange,
  placeholder = "Select categories...",
  className,
  disabled = false,
  type,
}: CategoryMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const t = useTranslations("categories");

  // Icon mapping based on category type and ID
  const getCategoryIcon = (categoryId: string, categoryType?: string) => {
    const iconClass = "h-3.5 w-3.5";

    if (categoryType === "allergens") {
      const allergenIcons: Record<string, React.ReactNode> = {
        gluten: <Wheat className={iconClass} />,
        crustaceans: <Fish className={iconClass} />,
        eggs: <Apple className={iconClass} />,
        fish: <Fish className={iconClass} />,
        peanuts: <Nut className={iconClass} />,
        soybeans: <Leaf className={iconClass} />,
        milk: <Milk className={iconClass} />,
        nuts: <Nut className={iconClass} />,
        alcohol: <Wine className={iconClass} />,
      };
      return allergenIcons[categoryId] || <WheatOff className={iconClass} />;
    }

    if (categoryType === "food_type") {
      const foodTypeIcons: Record<string, React.ReactNode> = {
        vegan: <Leaf className={iconClass} />,
        vegetarian: <Leaf className={iconClass} />,
        gluten_free: <Wheat className={`${iconClass} line-through`} />,
        lactose_free: <Milk className={`${iconClass} line-through`} />,
        spicy: <Flame className={iconClass} />,
        hot: <Flame className={iconClass} />,
        halal: <Sparkles className={iconClass} />,
        kosher: <Sparkles className={iconClass} />,
        organic: <Leaf className={iconClass} />,
        raw: <Droplets className={iconClass} />,
      };
      return foodTypeIcons[categoryId] || <CookingPot className={iconClass} />;
    }

    if (categoryType === "cuisine") {
      const cuisineIcons: Record<string, React.ReactNode> = {
        seafood: <Fish className={iconClass} />,
        bbq: <Flame className={iconClass} />,
        vegan: <Leaf className={iconClass} />,
        vegetarian: <Leaf className={iconClass} />,
      };
      return cuisineIcons[categoryId] || <ChevronRight className={iconClass} />;
    }

    return <Tag className={iconClass} />;
  };

  const {
    data: categories = [],
    error: categoriesError,
    isLoading: isLoadingCategories,
  } = useCategoriesQuery(type ? { type } : undefined);

  const selectedCategories = React.useMemo(
    () => categories.filter((cat) => value.includes(cat.id)),
    [categories, value],
  );

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter((cat) => t(cat.id).toLowerCase().includes(query));
  }, [categories, searchQuery, t]);

  const handleToggleCategory = (categoryId: string) => {
    const newValue = value.includes(categoryId)
      ? value.filter((id) => id !== categoryId)
      : [...value, categoryId];
    onChange(newValue);
  };

  const handleRemoveCategory = (
    categoryId: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(value.filter((id) => id !== categoryId));
  };

  const displayValue = React.useMemo(() => {
    if (selectedCategories.length === 0) {
      return placeholder;
    }
    if (selectedCategories.length === 1) {
      return t(selectedCategories[0].id);
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
            className={cn(
              "hover:border-input w-full justify-between rounded-md",
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
                      const isSelected = value.includes(category.id);
                      return (
                        <CommandItem
                          key={category.id}
                          value={category.id}
                          onSelect={() => handleToggleCategory(category.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(category.id, type)}
                            <span className="font-medium">
                              {t(category.id)}
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
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <div
              key={category.id}
              className="bg-secondary text-secondary-foreground flex items-center gap-1 rounded-md px-2 py-1 text-sm"
            >
              {getCategoryIcon(category.id, type)}
              <span>{t(category.id)}</span>
              <button
                type="button"
                onClick={(e) => handleRemoveCategory(category.id, e)}
                className="hover:bg-secondary-foreground/20 ml-1 rounded-sm transition-colors"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
