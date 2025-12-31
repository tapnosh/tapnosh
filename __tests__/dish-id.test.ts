import { describe, expect, it } from "vitest";

import { MenuItem } from "@/types/menu/Menu";
import { findDishById } from "@/utils/dish-id";

describe("findDishById", () => {
  const createMenuItem = (id: string, name: string): MenuItem => ({
    version: "v1",
    id,
    name,
    description: `Description for ${name}`,
    price: { amount: 10, currency: "USD" },
    allergens: [],
    food_types: [],
    image: "",
  });

  const menu = [
    {
      items: [
        createMenuItem("dish-1", "Pizza"),
        createMenuItem("dish-2", "Pasta"),
        createMenuItem("dish-3", "Salad"),
      ],
    },
    {
      items: [
        createMenuItem("dish-4", "Burger"),
        createMenuItem("dish-5", "Fries"),
      ],
    },
    {
      items: [createMenuItem("dish-6", "Ice Cream")],
    },
  ];

  describe("Finding dishes", () => {
    it("should find dish in first group", () => {
      const result = findDishById(menu, "dish-1");

      expect(result).not.toBeNull();
      expect(result?.item.name).toBe("Pizza");
      expect(result?.groupIndex).toBe(0);
      expect(result?.itemIndex).toBe(0);
    });

    it("should find dish in middle of first group", () => {
      const result = findDishById(menu, "dish-2");

      expect(result).not.toBeNull();
      expect(result?.item.name).toBe("Pasta");
      expect(result?.groupIndex).toBe(0);
      expect(result?.itemIndex).toBe(1);
    });

    it("should find dish at end of first group", () => {
      const result = findDishById(menu, "dish-3");

      expect(result).not.toBeNull();
      expect(result?.item.name).toBe("Salad");
      expect(result?.groupIndex).toBe(0);
      expect(result?.itemIndex).toBe(2);
    });

    it("should find dish in second group", () => {
      const result = findDishById(menu, "dish-4");

      expect(result).not.toBeNull();
      expect(result?.item.name).toBe("Burger");
      expect(result?.groupIndex).toBe(1);
      expect(result?.itemIndex).toBe(0);
    });

    it("should find dish in last group", () => {
      const result = findDishById(menu, "dish-6");

      expect(result).not.toBeNull();
      expect(result?.item.name).toBe("Ice Cream");
      expect(result?.groupIndex).toBe(2);
      expect(result?.itemIndex).toBe(0);
    });
  });

  describe("Not finding dishes", () => {
    it("should return null for non-existent dish", () => {
      const result = findDishById(menu, "dish-999");

      expect(result).toBeNull();
    });

    it("should return null for empty string id", () => {
      const result = findDishById(menu, "");

      expect(result).toBeNull();
    });

    it("should return null for empty menu", () => {
      const result = findDishById([], "dish-1");

      expect(result).toBeNull();
    });

    it("should return null for menu with empty groups", () => {
      const emptyMenu = [{ items: [] }, { items: [] }];
      const result = findDishById(emptyMenu, "dish-1");

      expect(result).toBeNull();
    });
  });

  describe("Return value structure", () => {
    it("should return the full item object", () => {
      const result = findDishById(menu, "dish-2");

      expect(result?.item).toEqual({
        version: "v1",
        id: "dish-2",
        name: "Pasta",
        description: "Description for Pasta",
        price: { amount: 10, currency: "USD" },
        allergens: [],
        food_types: [],
        image: "",
      });
    });

    it("should return correct indices for last item in last group", () => {
      const result = findDishById(menu, "dish-6");

      expect(result?.groupIndex).toBe(2);
      expect(result?.itemIndex).toBe(0);
    });
  });
});
