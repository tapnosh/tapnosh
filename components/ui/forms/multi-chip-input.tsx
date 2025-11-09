"use client";

import type React from "react";
import { Badge } from "@/components/ui/data-display/badge";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export default function MultiChipInput({
  fields,
  append,
  remove,
  ...props
}: {
  fields: string[];
  append: (value: string) => void;
  remove: (value: string) => void;
} & React.ComponentProps<"input">) {
  const handleAppend = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.FocusEvent<HTMLInputElement>,
  ) => {
    const {
      currentTarget: { value },
    } = e;

    if (value.trim() === "" || fields.includes(value.trim())) {
      return;
    }

    append(value);
    e.currentTarget.value = "";
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleAppend(e);
    }
    if (e.key === "Backspace" && e.currentTarget.value === "") {
      const lastField = fields[fields.length - 1];
      if (lastField) {
        remove(lastField);
      }
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="relative">
        <div
          className={cn(
            "border-input bg-background ring-offset-background w-full rounded-md border py-1 text-sm transition-[color,box-shadow]",
            "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            fields.length ? "px-1" : "px-2",
          )}
        >
          <div className="flex flex-wrap items-center gap-1">
            {fields.map((field, index) => (
              <Badge
                key={index}
                className="flex items-center gap-1 px-2 py-0.5 pr-0.5 text-xs first:ml-1"
              >
                {field}
                <button
                  type="button"
                  onClick={() => remove(field)}
                  className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
            <input
              {...props}
              placeholder={
                fields.length === 0
                  ? "Type to add, submit with enter"
                  : "Add more..."
              }
              onKeyDown={handleKeyPress}
              onBlur={handleAppend}
              className="flex min-w-12 flex-1 py-0.5 pl-1 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
