"use client";

import { useTranslations } from "next-intl";

import { Label } from "@/components/ui/forms/label";
import { Slider } from "@/components/ui/forms/slider";
import { useCurrency } from "@/hooks/useCurrency";

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  value,
  onChange,
}: PriceRangeFilterProps) {
  const t = useTranslations("common.labels");
  const { formatCurrency } = useCurrency();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{t("priceRange")}</Label>
        <span className="text-muted-foreground text-sm">
          {formatCurrency(value[0])} - {formatCurrency(value[1])}
        </span>
      </div>
      <Slider
        min={minPrice}
        max={maxPrice}
        step={1}
        value={value}
        onValueChange={(newValue) => onChange(newValue as [number, number])}
      />
    </div>
  );
}
