"use client";

import { useMemo } from "react";
import { type ControllerRenderProps, useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/forms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";
import { useCurrency } from "@/hooks/useCurrency";
import { cn } from "@/utils/cn";

import { useFormField } from "./form";

export default function PriceInput({
  className,
  ...props
}: {
  className?: string;
} & ControllerRenderProps) {
  const { error } = useFormField();
  const { setValue } = useFormContext();

  const { formatCurrency } = useCurrency();

  const currencies = [
    { code: "PLN", symbol: "PLN", name: "Polish Złoty" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  ];

  const selectedCurrency = useMemo(
    () => currencies.find((c) => c.code === props.value.currency),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.value.currency],
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex">
        <Select
          value={props.value.currency}
          onValueChange={(value) => {
            setValue(`${props.name}.currency`, value, {
              shouldValidate: true,
            });
          }}
        >
          <SelectTrigger
            aria-invalid={!!error}
            className="w-20 rounded-r-none border-r-0"
          >
            <SelectValue>{selectedCurrency?.symbol}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {currencies.map((curr) => (
              <SelectItem key={curr.code} value={curr.code}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{curr.symbol}</span>
                  <span className="text-muted-foreground text-sm">
                    {curr.code}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id="price"
          type="number"
          placeholder="6.99"
          inputMode="numeric"
          autoComplete="off"
          className="rounded-l-none"
          step="0.01"
          min="0"
          aria-invalid={!!error}
          defaultValue={props.value.amount}
          onChange={(e) => {
            const value = Number(e.target.value);
            setValue(`${props.name}.amount`, value, {
              shouldValidate: true,
            });
          }}
        />
      </div>
      {!!props.value.amount && (
        <p className="text-muted-foreground text-sm">
          {formatCurrency(props.value.amount, props.value.currency)}
        </p>
      )}

      {error && (
        <>
          {Object.values(
            error as unknown as Record<string, { message: string }>,
          ).map(({ message }, index) => (
            <p
              key={index}
              className={cn("text-destructive text-sm font-medium")}
            >
              {message}
            </p>
          ))}
        </>
      )}
    </div>
  );
}
