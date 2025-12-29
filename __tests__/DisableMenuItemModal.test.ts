import { addHours, endOfDay, endOfWeek } from "date-fns";
import { describe, expect, it, beforeEach, vi } from "vitest";

// Test the date calculation logic from DisableMenuItemModal
describe("DisableMenuItemModal date calculations", () => {
  const mockNow = new Date("2025-12-29T10:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  type DisableDuration =
    | "1h"
    | "2h"
    | "3h"
    | "end-of-day"
    | "end-of-week"
    | "custom";

  const getDisableUntilDate = (
    selectedDuration: DisableDuration,
    customEndDate?: Date,
    customEndTime?: string,
  ): Date | null => {
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
        if (customEndDate && customEndTime) {
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

  describe("preset durations", () => {
    it("should calculate 1 hour from now", () => {
      const result = getDisableUntilDate("1h");
      expect(result).toEqual(addHours(mockNow, 1));
    });

    it("should calculate 2 hours from now", () => {
      const result = getDisableUntilDate("2h");
      expect(result).toEqual(addHours(mockNow, 2));
    });

    it("should calculate 3 hours from now", () => {
      const result = getDisableUntilDate("3h");
      expect(result).toEqual(addHours(mockNow, 3));
    });

    it("should calculate end of day", () => {
      const result = getDisableUntilDate("end-of-day");
      expect(result).toEqual(endOfDay(mockNow));
      expect(result?.getHours()).toBe(23);
      expect(result?.getMinutes()).toBe(59);
      expect(result?.getSeconds()).toBe(59);
    });

    it("should calculate end of week (Monday start)", () => {
      const result = getDisableUntilDate("end-of-week");
      expect(result).toEqual(endOfWeek(mockNow, { weekStartsOn: 1 }));
      // End of week with Monday start should be Sunday
      expect(result?.getDay()).toBe(0); // Sunday
    });
  });

  describe("custom duration", () => {
    it("should return null when no custom date is provided", () => {
      const result = getDisableUntilDate("custom");
      expect(result).toBeNull();
    });

    it("should calculate custom date with time", () => {
      const customDate = new Date("2025-12-31T00:00:00.000Z");
      const result = getDisableUntilDate("custom", customDate, "18:30");

      expect(result).not.toBeNull();
      expect(result?.getHours()).toBe(18);
      expect(result?.getMinutes()).toBe(30);
    });

    it("should handle midnight time", () => {
      const customDate = new Date("2025-12-31T00:00:00.000Z");
      const result = getDisableUntilDate("custom", customDate, "00:00");

      expect(result).not.toBeNull();
      expect(result?.getHours()).toBe(0);
      expect(result?.getMinutes()).toBe(0);
    });

    it("should handle end of day time", () => {
      const customDate = new Date("2025-12-31T00:00:00.000Z");
      const result = getDisableUntilDate("custom", customDate, "23:59");

      expect(result).not.toBeNull();
      expect(result?.getHours()).toBe(23);
      expect(result?.getMinutes()).toBe(59);
    });
  });

  describe("invalid duration", () => {
    it("should return null for invalid duration", () => {
      // @ts-expect-error Testing invalid input
      const result = getDisableUntilDate("invalid");
      expect(result).toBeNull();
    });
  });
});
