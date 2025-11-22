import { useAutoAnimate } from "@formkit/auto-animate/react";

import { Badge } from "@/components/ui/data-display/badge";
import { Label } from "@/components/ui/forms/label";

interface BadgeFilterProps {
  label: string;
  items: string[];
  selectedItems: string[];
  onToggle: (item: string) => void;
}

export function BadgeFilter({
  label,
  items,
  selectedItems,
  onToggle,
}: BadgeFilterProps) {
  const [parent] = useAutoAnimate();

  if (items.length === 0) return null;

  const sortedItems = [...items].sort((a, b) => {
    const aSelected = selectedItems.includes(a);
    const bSelected = selectedItems.includes(b);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">{label}</Label>
      <div ref={parent} className="flex flex-wrap gap-2">
        {sortedItems.map((item) => {
          const isSelected = selectedItems.includes(item);
          return (
            <Badge
              key={item}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer px-3 py-1.5"
              onClick={() => onToggle(item)}
            >
              {item}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
