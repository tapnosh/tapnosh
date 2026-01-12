"use client";

import { addDays, addHours, endOfDay, endOfWeek, format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { BasicNotificationBody } from "@/components/ui/feedback/basic-notification";
import { Button } from "@/components/ui/forms/button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/overlays/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/overlays/popover";
import { useNotification } from "@/context/NotificationBar";
import { useDisableMenuItem } from "@/hooks/api/menu/useDisableMenuItem";
import { MenuItem } from "@/types/menu/Menu";
import { cn } from "@/utils/cn";

type DisableDuration =
  | "1h"
  | "2h"
  | "3h"
  | "end-of-day"
  | "end-of-week"
  | "custom";

type AvailabilityAction = "enable" | "disable";

interface DisableMenuItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem?: MenuItem;
  restaurantId: string;
  onSuccess?: () => void;
}

export function DisableMenuItemModal({
  open,
  onOpenChange,
  menuItem,
  restaurantId,
  onSuccess,
}: DisableMenuItemModalProps) {
  const t = useTranslations("restaurants.details.disableMenuItem");
  const { openNotification } = useNotification();
  const { mutate: disableMenuItem, isPending } = useDisableMenuItem();

  const [selectedAction, setSelectedAction] =
    useState<AvailabilityAction | null>(null);
  const [selectedDuration, setSelectedDuration] =
    useState<DisableDuration | null>(null);
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(
    new Date(),
  );
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(
    addDays(new Date(), 1),
  );
  const [customStartTime, setCustomStartTime] = useState("00:00");
  const [customEndTime, setCustomEndTime] = useState("23:59");

  const presetOptions: { value: DisableDuration; label: string }[] = [
    { value: "1h", label: t("durations.1h") },
    { value: "2h", label: t("durations.2h") },
    { value: "3h", label: t("durations.3h") },
    { value: "end-of-day", label: t("durations.endOfDay") },
    { value: "end-of-week", label: t("durations.endOfWeek") },
    { value: "custom", label: t("durations.custom") },
  ];

  const getDisableUntilDate = (): Date | null => {
    const now = new Date();

    switch (selectedDuration) {
      case "1h":
        return addHours(now, 1);
      case "2h":
        return addHours(now, 2);
      case "3h":
        return addHours(now, 3);
      case "end-of-day":
        return endOfDay(now);
      case "end-of-week":
        return endOfWeek(now, { weekStartsOn: 1 });
      case "custom":
        if (customEndDate) {
          const [hours, minutes] = customEndTime.split(":").map(Number);
          const endDateTime = new Date(customEndDate);
          endDateTime.setHours(hours, minutes, 0, 0);
          return endDateTime;
        }
        return null;
      default:
        return null;
    }
  };

  const handleConfirm = () => {
    if (!menuItem || !selectedAction) return;

    const isEnable = selectedAction === "enable";
    const disableUntil = getDisableUntilDate();

    if (!isEnable && !disableUntil) return;

    const disabledFrom =
      selectedDuration === "custom" && customStartDate
        ? (() => {
            const [hours, minutes] = customStartTime.split(":").map(Number);
            const startDateTime = new Date(customStartDate);
            startDateTime.setHours(hours, minutes, 0, 0);
            return startDateTime;
          })()
        : new Date();

    disableMenuItem(
      {
        menuItemId: menuItem.id,
        restaurantId,
        disabledFrom: isEnable ? null : disabledFrom,
        disabledUntil: isEnable ? null : disableUntil!,
      },
      {
        onSuccess: () => {
          openNotification(
            <BasicNotificationBody
              title={
                isEnable
                  ? t("notifications.enableSuccessTitle")
                  : t("notifications.successTitle")
              }
              description={
                isEnable
                  ? t("notifications.enableSuccessDescription", {
                      itemName: menuItem.name,
                    })
                  : t("notifications.successDescriptionTimed", {
                      itemName: menuItem.name,
                      date: format(disableUntil!, "PPP 'at' p"),
                    })
              }
              variant="success"
            />,
          );
          onOpenChange(false);
          resetState();
          onSuccess?.();
        },
        onError: (error) => {
          openNotification(
            <BasicNotificationBody
              title={t("notifications.errorTitle")}
              description={error.message || "An error occurred"}
              variant="error"
            />,
          );
        },
      },
    );
  };

  const resetState = () => {
    setSelectedAction(null);
    setSelectedDuration(null);
    setCustomStartDate(new Date());
    setCustomEndDate(addDays(new Date(), 1));
    setCustomStartTime("00:00");
    setCustomEndTime("23:59");
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetState();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description", { itemName: menuItem?.name ?? "" })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Enable/Disable Action Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={selectedAction === "enable" ? "default" : "outline"}
              className="justify-start"
              onClick={() => {
                setSelectedAction("enable");
                setSelectedDuration(null);
              }}
            >
              {t("actions.enableItem")}
            </Button>
            <Button
              variant={selectedAction === "disable" ? "default" : "outline"}
              className="justify-start"
              onClick={() => setSelectedAction("disable")}
            >
              {t("actions.disableItem")}
            </Button>
          </div>

          {/* Disable Duration Options */}
          {selectedAction === "disable" && (
            <div className="flex flex-col gap-3">
              <Label>{t("durations.label")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {presetOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      selectedDuration === option.value ? "default" : "outline"
                    }
                    className={cn("justify-start")}
                    onClick={() => setSelectedDuration(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Date Range */}
          {selectedAction === "disable" && selectedDuration === "custom" && (
            <div className="space-y-4 rounded-lg border p-4">
              {/* Start Date/Time */}
              <div className="space-y-2">
                <Label>{t("customRange.startDateTime")}</Label>
                <div className="flex flex-wrap gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "min-w-[180px] flex-1 justify-start text-left font-normal",
                          !customStartDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customStartDate ? (
                          format(customStartDate, "PPP")
                        ) : (
                          <span>{t("customRange.pickDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customStartDate}
                        onSelect={setCustomStartDate}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="relative min-w-[120px] flex-1 sm:flex-none">
                    <Clock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      type="time"
                      value={customStartTime}
                      onChange={(e) => setCustomStartTime(e.target.value)}
                      className="w-full pl-9 sm:w-[120px]"
                    />
                  </div>
                </div>
              </div>

              {/* End Date/Time */}
              <div className="space-y-2">
                <Label>{t("customRange.endDateTime")}</Label>
                <div className="flex flex-wrap gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "min-w-[180px] flex-1 justify-start text-left font-normal",
                          !customEndDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customEndDate ? (
                          format(customEndDate, "PPP")
                        ) : (
                          <span>{t("customRange.pickDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customEndDate}
                        onSelect={setCustomEndDate}
                        disabled={(date) =>
                          date < (customStartDate || new Date())
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="relative min-w-[120px] flex-1 sm:flex-none">
                    <Clock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      type="time"
                      value={customEndTime}
                      onChange={(e) => setCustomEndTime(e.target.value)}
                      className="w-full pl-9 sm:w-[120px]"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              {customStartDate && customEndDate && (
                <div className="bg-muted rounded-md p-3 text-sm">
                  <p className="text-muted-foreground">
                    {t("customRange.preview", {
                      startDate: format(customStartDate, "PPP"),
                      startTime: customStartTime,
                      endDate: format(customEndDate, "PPP"),
                      endTime: customEndTime,
                    })}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
            {t("actions.cancel")}
          </Button>
          <Button
            variant={selectedAction === "enable" ? "default" : "destructive"}
            onClick={handleConfirm}
            disabled={
              !selectedAction ||
              (selectedAction === "disable" && !selectedDuration) ||
              isPending
            }
            isLoading={isPending}
          >
            {t("actions.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
