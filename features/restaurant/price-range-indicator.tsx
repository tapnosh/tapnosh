"use client";

import { DollarSign } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/feedback/tooltip";
import { RestaurantPriceRange } from "@/types/restaurant/Restaurant";
import { cn } from "@/utils/cn";

const PRICE_RANGE_CONFIG: Record<
  RestaurantPriceRange,
  { label: string; count: number; description: string }
> = {
  [RestaurantPriceRange.LOW]: {
    label: "$",
    count: 1,
    description: "Budget-friendly",
  },
  [RestaurantPriceRange.MID]: {
    label: "$$",
    count: 2,
    description: "Moderate",
  },
  [RestaurantPriceRange.HIGH]: {
    label: "$$$",
    count: 3,
    description: "Fine dining",
  },
};

export function PriceRangeIndicator({
  priceRange,
}: {
  priceRange: RestaurantPriceRange;
}) {
  const config = PRICE_RANGE_CONFIG[priceRange];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <DollarSign
              key={i}
              className={cn("size-4")}
              style={{
                color: "currentColor",
                opacity: i < config.count ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          <strong>Price Range:</strong> {config.description}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
