"use client";

import { useTranslations } from "next-intl";
import {
  type UseFormReturn,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Checkbox } from "@/components/ui/forms/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/forms/form";
import { Input } from "@/components/ui/forms/input";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type Day = (typeof DAYS)[number];

interface OperatingHoursInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  basePath?: string;
  className?: string;
}

export function OperatingHoursInput<T extends FieldValues>({
  form,
  basePath = "operatingHours",
  className,
}: OperatingHoursInputProps<T>) {
  const tFields = useTranslations("restaurants.form.fields.fields");
  const tDays = useTranslations("common.days");

  const getFieldPath = (day: Day, field: "openFrom" | "openUntil"): Path<T> => {
    return `${basePath}.${day}.${field}` as Path<T>;
  };

  const isDayClosed = (day: Day): boolean => {
    const openFrom = form.watch(getFieldPath(day, "openFrom"));
    const openUntil = form.watch(getFieldPath(day, "openUntil"));
    return openFrom === "00:00" && openUntil === "00:00";
  };

  const handleOpenChange = (day: Day, checked: boolean) => {
    if (checked) {
      form.setValue(getFieldPath(day, "openFrom"), "09:00" as T[keyof T]);
      form.setValue(getFieldPath(day, "openUntil"), "22:00" as T[keyof T]);
    } else {
      form.setValue(getFieldPath(day, "openFrom"), "00:00" as T[keyof T]);
      form.setValue(getFieldPath(day, "openUntil"), "00:00" as T[keyof T]);
    }
  };

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left font-medium"></th>
              {DAYS.map((day) => (
                <th key={day} className="p-2 text-center font-medium">
                  {tDays(day)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Open checkbox row */}
            <tr>
              <td className="p-2 font-medium whitespace-nowrap">
                {tFields("openingHours.open")}
              </td>
              {DAYS.map((day) => {
                const isOpen = !isDayClosed(day);
                return (
                  <td key={day} className="p-2 text-center">
                    <Checkbox
                      checked={isOpen}
                      onCheckedChange={(checked) =>
                        handleOpenChange(day, !!checked)
                      }
                    />
                  </td>
                );
              })}
            </tr>

            {/* Open from row */}
            <tr>
              <td className="p-2 font-medium whitespace-nowrap">
                {tFields("openingHours.openFrom")}
              </td>
              {DAYS.map((day) => {
                const isClosed = isDayClosed(day);
                return (
                  <td key={day} className="p-2">
                    <FormField
                      control={form.control}
                      name={getFieldPath(day, "openFrom")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="time"
                              className="min-w-[100px]"
                              disabled={isClosed}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                );
              })}
            </tr>

            {/* Open until row */}
            <tr>
              <td className="p-2 font-medium whitespace-nowrap">
                {tFields("openingHours.openUntil")}
              </td>
              {DAYS.map((day) => {
                const isClosed = isDayClosed(day);
                return (
                  <td key={day} className="p-2">
                    <FormField
                      control={form.control}
                      name={getFieldPath(day, "openUntil")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="time"
                              className="min-w-[100px]"
                              disabled={isClosed}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
