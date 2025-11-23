"use client";

import { Check, ChevronsUpDown, Loader2, Tag, X } from "lucide-react";
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
}

export function CategoryMultiSelect({
  value = [],
  onChange,
  placeholder = "Select categories...",
  className,
  disabled = false,
}: CategoryMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const {
    data: categories = [],
    error: categoriesError,
    isLoading: isLoadingCategories,
  } = useCategoriesQuery();

  const selectedCategories = React.useMemo(
    () => categories.filter((cat) => value.includes(cat.id)),
    [categories, value],
  );

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.description?.toLowerCase().includes(query),
    );
  }, [categories, searchQuery]);

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
      return selectedCategories[0].name;
    }
    return `${selectedCategories.length} categories selected`;
  }, [selectedCategories, placeholder]);

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
                          <div className="flex flex-col">
                            <span className="font-medium">{category.name}</span>
                            {category.description && (
                              <span className="text-muted-foreground text-xs">
                                {category.description}
                              </span>
                            )}
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
              <Tag className="h-3 w-3" />
              <span>{category.name}</span>
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
