import {
  OperatingHours,
  OperatingHoursDay,
} from "@/types/restaurant/Restaurant";

const DAY_KEYS: (keyof OperatingHours)[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/**
 * Check if a day's operating hours indicate it's closed (both times are 00:00)
 */
export function isDayClosed(hours: OperatingHoursDay | undefined): boolean {
  return hours?.openFrom === "00:00" && hours?.openUntil === "00:00";
}

/**
 * Get the operating hours for a specific date
 * @param operatingHours - The operating hours object with hours for each day of the week
 * @param date - The date to get hours for (defaults to current date)
 * @returns The operating hours for that day, or null if not available
 */
export function getOperatingHoursForDate(
  operatingHours?: OperatingHours,
  date: Date = new Date(),
): OperatingHoursDay | null {
  if (!operatingHours) return null;
  const dayOfWeek = date.getDay();
  const dayKey = DAY_KEYS[dayOfWeek];
  return operatingHours[dayKey] ?? null;
}

/**
 * Get today's operating hours
 * @param operatingHours - The operating hours object with hours for each day of the week
 * @returns The operating hours for today, or null if not available
 */
export function getTodayOperatingHours(
  operatingHours?: OperatingHours,
): OperatingHoursDay | null {
  return getOperatingHoursForDate(operatingHours, new Date());
}

/**
 * Check if today is marked as closed
 */
export function isTodayClosed(operatingHours?: OperatingHours): boolean {
  const todayHours = getTodayOperatingHours(operatingHours);
  return isDayClosed(todayHours ?? undefined);
}

/**
 * Check if a given time range is currently active (handles midnight crossing)
 * @param openFrom - Opening time in "HH:MM" format
 * @param openUntil - Closing time in "HH:MM" format
 * @returns true if current time is within the range
 */
export function isWithinOperatingHours(
  openFrom: string,
  openUntil: string,
): boolean {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [fromHours, fromMinutes] = openFrom.split(":").map(Number);
  const [toHours, toMinutes] = openUntil.split(":").map(Number);

  const fromTime = fromHours * 60 + fromMinutes;
  const toTime = toHours * 60 + toMinutes;

  // Handle cases where serving time spans midnight
  if (toTime < fromTime) {
    return currentTime >= fromTime || currentTime <= toTime;
  }

  return currentTime >= fromTime && currentTime <= toTime;
}

/**
 * Check if a menu item is currently disabled based on its disable properties
 * @param item - Object with isDisabled, disabledFrom, and disabledUntil properties
 * @returns true if the item is currently disabled
 */
export function isMenuItemDisabled(item: {
  isDisabled?: boolean;
  disabledFrom?: string;
  disabledUntil?: string | null;
}): boolean {
  if (!item.disabledFrom) return false;

  const now = new Date();

  // If disabledFrom is set, check if we're past the start time
  if (item.disabledFrom) {
    const from = new Date(item.disabledFrom);
    if (now < from) return false; // Not yet disabled
  }

  // If disabledUntil is null/undefined, it's disabled indefinitely
  if (!item.disabledUntil) return true;

  // Check if we're still within the disabled period
  const until = new Date(item.disabledUntil);
  return now <= until;
}
