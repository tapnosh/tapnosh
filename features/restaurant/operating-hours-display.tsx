"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";

import { OperatingHours } from "@/types/restaurant/Restaurant";
import {
  getTodayOperatingHours,
  isTodayClosed,
  isWithinOperatingHours,
} from "@/utils/operating-hours";

interface OperatingHoursDisplayProps {
  operatingHours?: OperatingHours;
  className?: string;
  iconClassName?: string;
  showIcon?: boolean;
  openClassName?: string;
  closedClassName?: string;
}

export function OperatingHoursDisplay({
  operatingHours,
  className = "flex items-center gap-2 text-sm",
  iconClassName = "h-4 w-4 shrink-0",
  showIcon = true,
  openClassName = "font-medium",
  closedClassName = "font-medium",
}: OperatingHoursDisplayProps) {
  const t = useTranslations("restaurants.details.openingHours");

  const todayHours = getTodayOperatingHours(operatingHours);

  // Check if today is marked as closed
  if (isTodayClosed(operatingHours)) {
    return (
      <div className={className}>
        {showIcon && <Clock className={iconClassName} />}
        <span className={closedClassName}>{t("closed")}</span>
      </div>
    );
  }

  if (!todayHours) return null;

  const isOpen = isWithinOperatingHours(
    todayHours.openFrom,
    todayHours.openUntil,
  );

  return (
    <div className={className}>
      {showIcon && <Clock className={iconClassName} />}
      <span>
        <span className={isOpen ? openClassName : closedClassName}>
          {isOpen ? t("openNow") : t("closedNow")}
        </span>
        {" · "}
        {todayHours.openFrom} - {todayHours.openUntil}
      </span>
    </div>
  );
}
