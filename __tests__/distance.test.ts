import { describe, expect, it } from "vitest";

import { calculateDistance } from "@/features/map/utils/distance";

describe("calculateDistance", () => {
  describe("Known distances", () => {
    it("should return 0 for same coordinates", () => {
      const distance = calculateDistance(52.2297, 21.0122, 52.2297, 21.0122);

      expect(distance).toBe(0);
    });

    it("should calculate distance between Warsaw and Krakow (~250km)", () => {
      // Warsaw: 52.2297, 21.0122
      // Krakow: 50.0647, 19.9450
      const distance = calculateDistance(52.2297, 21.0122, 50.0647, 19.945);

      expect(distance).toBeGreaterThan(250);
      expect(distance).toBeLessThan(260);
    });

    it("should calculate distance between New York and Los Angeles (~3940km)", () => {
      // New York: 40.7128, -74.0060
      // Los Angeles: 34.0522, -118.2437
      const distance = calculateDistance(40.7128, -74.006, 34.0522, -118.2437);

      expect(distance).toBeGreaterThan(3900);
      expect(distance).toBeLessThan(4000);
    });

    it("should calculate distance between London and Paris (~344km)", () => {
      // London: 51.5074, -0.1278
      // Paris: 48.8566, 2.3522
      const distance = calculateDistance(51.5074, -0.1278, 48.8566, 2.3522);

      expect(distance).toBeGreaterThan(340);
      expect(distance).toBeLessThan(350);
    });

    it("should calculate very short distance accurately", () => {
      // Two points ~1km apart in Warsaw
      const distance = calculateDistance(52.2297, 21.0122, 52.2387, 21.0122);

      expect(distance).toBeGreaterThan(0.9);
      expect(distance).toBeLessThan(1.1);
    });
  });

  describe("Edge cases", () => {
    it("should handle crossing the equator", () => {
      // Point in northern hemisphere to southern hemisphere
      const distance = calculateDistance(10, 0, -10, 0);

      expect(distance).toBeGreaterThan(2200);
      expect(distance).toBeLessThan(2300);
    });

    it("should handle crossing the prime meridian", () => {
      // Point west of prime meridian to east
      const distance = calculateDistance(51.5, -1, 51.5, 1);

      expect(distance).toBeGreaterThan(130);
      expect(distance).toBeLessThan(150);
    });

    it("should handle crossing the international date line", () => {
      // Tokyo: 35.6762, 139.6503
      // San Francisco: 37.7749, -122.4194
      const distance = calculateDistance(35.6762, 139.6503, 37.7749, -122.4194);

      expect(distance).toBeGreaterThan(8200);
      expect(distance).toBeLessThan(8400);
    });

    it("should handle negative latitudes", () => {
      // Sydney: -33.8688, 151.2093
      // Melbourne: -37.8136, 144.9631
      const distance = calculateDistance(
        -33.8688,
        151.2093,
        -37.8136,
        144.9631,
      );

      expect(distance).toBeGreaterThan(700);
      expect(distance).toBeLessThan(750);
    });
  });

  describe("Symmetry", () => {
    it("should return same distance regardless of direction", () => {
      const distanceAtoB = calculateDistance(52.2297, 21.0122, 50.0647, 19.945);
      const distanceBtoA = calculateDistance(50.0647, 19.945, 52.2297, 21.0122);

      expect(distanceAtoB).toBeCloseTo(distanceBtoA, 10);
    });
  });

  describe("Return value", () => {
    it("should return distance in kilometers", () => {
      // Known distance: about 111km per degree of latitude at equator
      const distance = calculateDistance(0, 0, 1, 0);

      expect(distance).toBeGreaterThan(110);
      expect(distance).toBeLessThan(112);
    });

    it("should return a positive number", () => {
      const distance = calculateDistance(52.2297, 21.0122, 50.0647, 19.945);

      expect(distance).toBeGreaterThan(0);
    });
  });
});
