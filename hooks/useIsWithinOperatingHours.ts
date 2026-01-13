"use client";

import { useEffect, useRef, useState } from "react";

import { isWithinOperatingHours } from "@/utils/operating-hours";

/**
 * Hook that checks if the current time is within operating hours.
 * Only triggers a re-render when the status changes (true <-> false).
 * @param openFrom - Opening time in "HH:MM" format
 * @param openUntil - Closing time in "HH:MM" format
 * @param intervalMs - The interval in milliseconds to check (default: 60000 = 1 minute)
 */
export function useIsWithinOperatingHours(
  openFrom?: string,
  openUntil?: string,
  intervalMs = 60000,
) {
  const getStatus = () => {
    if (!openFrom || !openUntil) return true;
    return isWithinOperatingHours(openFrom, openUntil);
  };

  const [isWithinHours, setIsWithinHours] = useState(getStatus);
  const previousStatus = useRef(isWithinHours);

  useEffect(() => {
    if (!openFrom || !openUntil) return;

    const interval = setInterval(() => {
      const currentStatus = getStatus();
      if (currentStatus !== previousStatus.current) {
        previousStatus.current = currentStatus;
        setIsWithinHours(currentStatus);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [openFrom, openUntil, intervalMs]);

  return isWithinHours;
}
