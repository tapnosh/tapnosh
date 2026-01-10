import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import { describe, expect, it, vi } from "vitest";

// Import after mocks
import { MenuItemCard } from "@/features/menu/menu-item";
import { MenuItem } from "@/types/menu/Menu";
import messages from "@/translations/en";

// Mock useCurrency hook
vi.mock("@/hooks/useCurrency", () => ({
  useCurrency: () => ({
    formatCurrency: (amount: number, currency: string) =>
      `${currency} ${amount.toFixed(2)}`,
  }),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <div data-testid="menu-item-image" data-src={src} aria-label={alt} />
  ),
}));

// Mock motion/react
vi.mock("motion/react", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    create:
      () =>
      ({
        children,
        ...props
      }: React.PropsWithChildren<Record<string, unknown>>) => (
        <button {...props}>{children}</button>
      ),
  },
}));

// Mock icons
vi.mock("@/features/menu/utils/icons", () => ({
  getAllergenIcon:
    () =>
    ({ className }: { className: string }) => (
      <span className={className} data-testid="allergen-icon" />
    ),
  getFoodTypeIcon:
    () =>
    ({ className }: { className: string }) => (
      <span className={className} data-testid="food-type-icon" />
    ),
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Plus: () => <span data-testid="plus-icon" />,
}));

describe("MenuItemCard", () => {
  const renderWithIntl = (ui: React.ReactElement) => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {ui}
      </NextIntlClientProvider>,
    );
  };

  const mockMenuItem: MenuItem = {
    version: "v1",
    id: "item-1",
    name: "Margherita Pizza",
    description: "Classic Italian pizza with tomato and mozzarella",
    price: { amount: 15.99, currency: "USD" },
    allergens: [],
    food_types: [],
    image: "/pizza.jpg",
  };

  const mockMenuItemWithAllergens: MenuItem = {
    ...mockMenuItem,
    allergens: [
      { id: "gluten", name: "allergen.gluten", description: "Contains gluten" },
      {
        id: "dairy",
        name: "allergen.milk",
        description: "Contains dairy products",
      },
    ],
  };

  const mockMenuItemWithFoodTypes: MenuItem = {
    ...mockMenuItem,
    food_types: [
      {
        id: "vegetarian",
        name: "food_type.vegetarian",
        description: "Vegetarian food type",
      },
      { id: "vegan", name: "food_type.vegan", description: "Vegan food type" },
    ],
  };

  const mockMenuItemWithImageArray: MenuItem = {
    ...mockMenuItem,
    image: [{ url: "/pizza-array.jpg" }],
  };

  describe("Basic Rendering", () => {
    it("should render item name", () => {
      renderWithIntl(<MenuItemCard item={mockMenuItem} isAvailable={true} />);

      expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    });

    it("should render item description", () => {
      renderWithIntl(<MenuItemCard item={mockMenuItem} isAvailable={true} />);

      expect(
        screen.getByText("Classic Italian pizza with tomato and mozzarella"),
      ).toBeInTheDocument();
    });

    it("should render formatted price", () => {
      renderWithIntl(<MenuItemCard item={mockMenuItem} isAvailable={true} />);

      expect(screen.getByText("USD 15.99")).toBeInTheDocument();
    });

    it("should render item image when provided as string", () => {
      renderWithIntl(<MenuItemCard item={mockMenuItem} isAvailable={true} />);

      const image = screen.getByTestId("menu-item-image");
      expect(image).toHaveAttribute("data-src", "/pizza.jpg");
      expect(image).toHaveAttribute("aria-label", "Margherita Pizza");
    });

    it("should render item image when provided as array", () => {
      renderWithIntl(
        <MenuItemCard item={mockMenuItemWithImageArray} isAvailable={true} />,
      );

      const image = screen.getByTestId("menu-item-image");
      expect(image).toHaveAttribute("data-src", "/pizza-array.jpg");
    });

    it("should not render image when not provided", () => {
      const itemWithoutImage = { ...mockMenuItem, image: undefined };
      renderWithIntl(
        <MenuItemCard item={itemWithoutImage as MenuItem} isAvailable={true} />,
      );

      expect(screen.queryByTestId("menu-item-image")).not.toBeInTheDocument();
    });
  });

  describe("Availability", () => {
    it("should show unavailable message when not available", () => {
      renderWithIntl(<MenuItemCard item={mockMenuItem} isAvailable={false} />);

      expect(
        screen.getByText("This dish is not available for serving"),
      ).toBeInTheDocument();
    });

    it("should not show unavailable message when available", () => {
      renderWithIntl(<MenuItemCard item={mockMenuItem} isAvailable={true} />);

      expect(
        screen.queryByText("This dish is not available for serving"),
      ).not.toBeInTheDocument();
    });

    it("should show add to cart button when available and callback provided", () => {
      renderWithIntl(
        <MenuItemCard
          item={mockMenuItem}
          isAvailable={true}
          onAddToCart={vi.fn()}
        />,
      );

      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    });

    it("should not show add to cart button when not available", () => {
      renderWithIntl(
        <MenuItemCard
          item={mockMenuItem}
          isAvailable={false}
          onAddToCart={vi.fn()}
        />,
      );

      expect(screen.queryByTestId("plus-icon")).not.toBeInTheDocument();
    });
  });

  describe("Allergens and Food Types", () => {
    it("should render allergen badges", () => {
      renderWithIntl(
        <MenuItemCard item={mockMenuItemWithAllergens} isAvailable={true} />,
      );

      expect(screen.getByText("Gluten")).toBeInTheDocument();
      expect(screen.getByText("Milk")).toBeInTheDocument();
    });

    it("should render food type badges", () => {
      renderWithIntl(
        <MenuItemCard item={mockMenuItemWithFoodTypes} isAvailable={true} />,
      );

      expect(screen.getByText("Vegetarian")).toBeInTheDocument();
      expect(screen.getByText("Vegan")).toBeInTheDocument();
    });

    it("should not render allergen section when empty", () => {
      renderWithIntl(<MenuItemCard item={mockMenuItem} isAvailable={true} />);

      expect(screen.queryByTestId("allergen-icon")).not.toBeInTheDocument();
    });

    it("should not render food types section when empty", () => {
      renderWithIntl(<MenuItemCard item={mockMenuItem} isAvailable={true} />);

      expect(screen.queryByTestId("food-type-icon")).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onClick when card is clicked", () => {
      const handleClick = vi.fn();
      renderWithIntl(
        <MenuItemCard
          item={mockMenuItem}
          isAvailable={true}
          onClick={handleClick}
        />,
      );

      fireEvent.click(screen.getByText("Margherita Pizza"));

      expect(handleClick).toHaveBeenCalledWith(mockMenuItem);
    });

    it("should call onAddToCart when add button is clicked", () => {
      const handleAddToCart = vi.fn();
      const handleClick = vi.fn();
      renderWithIntl(
        <MenuItemCard
          item={mockMenuItem}
          isAvailable={true}
          onAddToCart={handleAddToCart}
          onClick={handleClick}
        />,
      );

      const addButton = screen.getByTestId("plus-icon").closest("button");
      fireEvent.click(addButton!);

      expect(handleAddToCart).toHaveBeenCalledWith(mockMenuItem);
    });

    it("should stop event propagation when add to cart is clicked", () => {
      const handleAddToCart = vi.fn();
      const handleClick = vi.fn();
      renderWithIntl(
        <MenuItemCard
          item={mockMenuItem}
          isAvailable={true}
          onAddToCart={handleAddToCart}
          onClick={handleClick}
        />,
      );

      const addButton = screen.getByTestId("plus-icon").closest("button");
      fireEvent.click(addButton!);

      // onClick should not be called because propagation is stopped
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Different Price Currencies", () => {
    it("should format EUR currency", () => {
      const eurItem = {
        ...mockMenuItem,
        price: { amount: 12.5, currency: "EUR" },
      };
      renderWithIntl(<MenuItemCard item={eurItem} isAvailable={true} />);

      expect(screen.getByText("EUR 12.50")).toBeInTheDocument();
    });

    it("should format PLN currency", () => {
      const plnItem = {
        ...mockMenuItem,
        price: { amount: 49.99, currency: "PLN" },
      };
      renderWithIntl(<MenuItemCard item={plnItem} isAvailable={true} />);

      expect(screen.getByText("PLN 49.99")).toBeInTheDocument();
    });
  });
});
