import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/data-display/badge";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";

interface CategoryItem {
  id: string;
  name: string;
}

export function BadgeFilter({
  label,
  description,
  items,
  selectedItems,
  onToggle,
  mode = "include",
  translateItem,
  showSearch = false,
}: {
  label: string;
  description?: string;
  items: CategoryItem[];
  selectedItems: string[];
  onToggle: (itemId: string) => void;
  mode?: "include" | "exclude";
  translateItem: (id: string) => string;
  showSearch?: boolean;
}) {
  const t = useTranslations("common.forms");
  const [parent] = useAutoAnimate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, searchQuery]);

  if (items.length === 0) return null;

  // Split items into selected and unselected for proper ordering
  const selectedItemsFiltered = items.filter((item) =>
    selectedItems.includes(item.id),
  );
  const unselectedItemsFiltered = filteredItems.filter(
    (item) => !selectedItems.includes(item.id),
  );

  const sortedItems = [...selectedItemsFiltered, ...unselectedItemsFiltered];

  const modeText = mode === "exclude" ? t("exclude") : t("include");

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
            placeholder={t("searchCategories")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <div ref={parent} className="flex flex-wrap gap-2">
        {sortedItems.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("noResultsFound")}</p>
        ) : (
          sortedItems.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <Badge
                key={item.id}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer px-3 py-1.5"
                onClick={() => onToggle(item.id)}
              >
                {translateItem(item.name)}
              </Badge>
            );
          })
        )}
      </div>
    </div>
  );
}
