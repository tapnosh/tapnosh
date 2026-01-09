"use client";

import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/feedback/tooltip";
import { RestaurantPriceRange } from "@/types/restaurant/Restaurant";
import { cn } from "@/utils/cn";

const PRICE_RANGE_CONFIG: Record<
  RestaurantPriceRange,
  { label: string; count: number; translationKey: string }
> = {
  [RestaurantPriceRange.LOW]: {
    label: "$",
    count: 1,
    translationKey: "budgetFriendly",
  },
  [RestaurantPriceRange.MID]: {
    label: "$$",
    count: 2,
    translationKey: "moderate",
  },
  [RestaurantPriceRange.HIGH]: {
    label: "$$$",
    count: 3,
    translationKey: "fineDining",
  },
};

export function PriceRangeIndicator({
  priceRange,
}: {
  priceRange: RestaurantPriceRange;
}) {
  const t = useTranslations("common.priceRange");
  const tLabels = useTranslations("common.labels");

  const config = PRICE_RANGE_CONFIG[priceRange];

  if (!config) {
    return null; // Zabezpieczenie przed undefined
  }

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
          <strong>{tLabels("priceRange")}:</strong> {t(config.translationKey)}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
