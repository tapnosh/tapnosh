import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { MenuGroup } from "@/features/menu/menu-group";

describe("MenuGroup", () => {
  const defaultData = {
    name: "Breakfast",
    timeFrom: "08:00",
    timeTo: "11:00",
  };

  describe("Rendering", () => {
    it("should render the group name as a heading", () => {
      render(<MenuGroup data={defaultData} />);

      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
        "Breakfast",
      );
    });

    it("should render serving time information", () => {
      render(<MenuGroup data={defaultData} />);

      expect(
        screen.getByText(/Served from 08:00 to 11:00/),
      ).toBeInTheDocument();
    });

    it("should render children inside article element", () => {
      render(
        <MenuGroup data={defaultData}>
          <div data-testid="child-item">Menu Item</div>
        </MenuGroup>,
      );

      const article = screen.getByRole("article");
      expect(article).toContainElement(screen.getByTestId("child-item"));
    });

    it("should render multiple children", () => {
      render(
        <MenuGroup data={defaultData}>
          <div data-testid="item-1">Item 1</div>
          <div data-testid="item-2">Item 2</div>
          <div data-testid="item-3">Item 3</div>
        </MenuGroup>,
      );

      expect(screen.getByTestId("item-1")).toBeInTheDocument();
      expect(screen.getByTestId("item-2")).toBeInTheDocument();
      expect(screen.getByTestId("item-3")).toBeInTheDocument();
    });
  });

  describe("Default Values", () => {
    it("should show default text when name is empty", () => {
      render(
        <MenuGroup data={{ name: "", timeFrom: "08:00", timeTo: "11:00" }} />,
      );

      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
        "No group name provided",
      );
    });

    it("should handle different time formats", () => {
      render(
        <MenuGroup
          data={{ name: "Lunch", timeFrom: "12:00", timeTo: "15:30" }}
        />,
      );

      expect(
        screen.getByText(/Served from 12:00 to 15:30/),
      ).toBeInTheDocument();
    });
  });

  describe("Different Menu Groups", () => {
    it("should render lunch group correctly", () => {
      render(
        <MenuGroup
          data={{ name: "Lunch Specials", timeFrom: "11:00", timeTo: "14:00" }}
        />,
      );

      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
        "Lunch Specials",
      );
      expect(
        screen.getByText(/Served from 11:00 to 14:00/),
      ).toBeInTheDocument();
    });

    it("should render dinner group correctly", () => {
      render(
        <MenuGroup
          data={{ name: "Dinner", timeFrom: "17:00", timeTo: "22:00" }}
        />,
      );

      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
        "Dinner",
      );
      expect(
        screen.getByText(/Served from 17:00 to 22:00/),
      ).toBeInTheDocument();
    });

    it("should render all-day group correctly", () => {
      render(
        <MenuGroup
          data={{ name: "All Day Menu", timeFrom: "00:00", timeTo: "23:59" }}
        />,
      );

      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
        "All Day Menu",
      );
      expect(
        screen.getByText(/Served from 00:00 to 23:59/),
      ).toBeInTheDocument();
    });
  });
});
