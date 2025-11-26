"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/forms/button";
import { Label } from "@/components/ui/forms/label";
import { Slider } from "@/components/ui/forms/slider";

interface DistanceFilterProps {
  maxDistance: number;
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
}

export function DistanceFilter({
  maxDistance,
  value,
  onChange,
  disabled,
}: DistanceFilterProps) {
  const currentValue = value ?? maxDistance;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Distance from me</Label>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            {value === null ? "Any distance" : `${currentValue.toFixed(1)} km`}
          </span>
          {value !== null && !disabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(null)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <Slider
        min={0.5}
        max={maxDistance}
        step={0.5}
        value={[currentValue]}
        onValueChange={([newValue]) => onChange(newValue)}
        disabled={disabled}
      />
      {disabled && (
        <p className="text-muted-foreground text-xs">
          Enable location to filter by distance
        </p>
      )}
    </div>
  );
}
