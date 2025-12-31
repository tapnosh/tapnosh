import { describe, expect, it } from "vitest";

// Test the isWithinServingTime function logic from restaurant-page.tsx
describe("isWithinServingTime", () => {
  // Recreate the function for testing
  function isWithinServingTime(
    timeFrom: string,
    timeTo: string,
    currentTime?: { hours: number; minutes: number },
  ): boolean {
    const now = currentTime || {
      hours: new Date().getHours(),
      minutes: new Date().getMinutes(),
    };
    const currentTimeInMinutes = now.hours * 60 + now.minutes;

    // Parse timeFrom and timeTo (expecting format like "HH:MM")
    const [fromHours, fromMinutes] = timeFrom.split(":").map(Number);
    const [toHours, toMinutes] = timeTo.split(":").map(Number);

    const fromTime = fromHours * 60 + fromMinutes;
    const toTime = toHours * 60 + toMinutes;

    // Handle cases where serving time spans midnight
    if (toTime < fromTime) {
      return currentTimeInMinutes >= fromTime || currentTimeInMinutes <= toTime;
    }

    return currentTimeInMinutes >= fromTime && currentTimeInMinutes <= toTime;
  }

  describe("normal serving hours (same day)", () => {
    it("should return true when current time is within range", () => {
      // Serving from 09:00 to 17:00, current time is 12:00
      expect(
        isWithinServingTime("09:00", "17:00", { hours: 12, minutes: 0 }),
      ).toBe(true);
    });

    it("should return true at the exact start time", () => {
      expect(
        isWithinServingTime("09:00", "17:00", { hours: 9, minutes: 0 }),
      ).toBe(true);
    });

    it("should return true at the exact end time", () => {
      expect(
        isWithinServingTime("09:00", "17:00", { hours: 17, minutes: 0 }),
      ).toBe(true);
    });

    it("should return false before serving hours", () => {
      expect(
        isWithinServingTime("09:00", "17:00", { hours: 8, minutes: 30 }),
      ).toBe(false);
    });

    it("should return false after serving hours", () => {
      expect(
        isWithinServingTime("09:00", "17:00", { hours: 18, minutes: 0 }),
      ).toBe(false);
    });

    it("should handle minutes correctly", () => {
      // 09:30 to 17:30
      expect(
        isWithinServingTime("09:30", "17:30", { hours: 9, minutes: 15 }),
      ).toBe(false);

      expect(
        isWithinServingTime("09:30", "17:30", { hours: 9, minutes: 30 }),
      ).toBe(true);

      expect(
        isWithinServingTime("09:30", "17:30", { hours: 17, minutes: 45 }),
      ).toBe(false);
    });
  });

  describe("overnight serving hours (spans midnight)", () => {
    it("should return true during evening hours", () => {
      // Serving from 22:00 to 04:00 (overnight)
      expect(
        isWithinServingTime("22:00", "04:00", { hours: 23, minutes: 0 }),
      ).toBe(true);
    });

    it("should return true during early morning hours", () => {
      expect(
        isWithinServingTime("22:00", "04:00", { hours: 2, minutes: 0 }),
      ).toBe(true);
    });

    it("should return true at midnight", () => {
      expect(
        isWithinServingTime("22:00", "04:00", { hours: 0, minutes: 0 }),
      ).toBe(true);
    });

    it("should return true at the start time", () => {
      expect(
        isWithinServingTime("22:00", "04:00", { hours: 22, minutes: 0 }),
      ).toBe(true);
    });

    it("should return true at the end time", () => {
      expect(
        isWithinServingTime("22:00", "04:00", { hours: 4, minutes: 0 }),
      ).toBe(true);
    });

    it("should return false during daytime hours", () => {
      expect(
        isWithinServingTime("22:00", "04:00", { hours: 12, minutes: 0 }),
      ).toBe(false);

      expect(
        isWithinServingTime("22:00", "04:00", { hours: 5, minutes: 0 }),
      ).toBe(false);

      expect(
        isWithinServingTime("22:00", "04:00", { hours: 21, minutes: 0 }),
      ).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle 24-hour format correctly", () => {
      expect(
        isWithinServingTime("00:00", "23:59", { hours: 12, minutes: 0 }),
      ).toBe(true);
    });

    it("should handle single-hour serving window", () => {
      expect(
        isWithinServingTime("12:00", "13:00", { hours: 12, minutes: 30 }),
      ).toBe(true);

      expect(
        isWithinServingTime("12:00", "13:00", { hours: 11, minutes: 59 }),
      ).toBe(false);
    });

    it("should handle breakfast hours", () => {
      // Breakfast 07:00 to 10:00
      expect(
        isWithinServingTime("07:00", "10:00", { hours: 8, minutes: 30 }),
      ).toBe(true);

      expect(
        isWithinServingTime("07:00", "10:00", { hours: 10, minutes: 30 }),
      ).toBe(false);
    });

    it("should handle lunch hours", () => {
      // Lunch 11:30 to 14:30
      expect(
        isWithinServingTime("11:30", "14:30", { hours: 13, minutes: 0 }),
      ).toBe(true);
    });

    it("should handle dinner hours", () => {
      // Dinner 18:00 to 22:00
      expect(
        isWithinServingTime("18:00", "22:00", { hours: 20, minutes: 0 }),
      ).toBe(true);
    });
  });
});
