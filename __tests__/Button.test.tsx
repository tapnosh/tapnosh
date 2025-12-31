import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/forms/button";

describe("Button", () => {
  it("should render with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("should render with default variant styling", () => {
    render(<Button variant="default">Default Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary");
  });

  it("should render with destructive variant", () => {
    render(<Button variant="destructive">Delete</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");
  });

  it("should render with outline variant", () => {
    render(<Button variant="outline">Outline</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("bg-background");
  });

  it("should render with secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-secondary");
  });

  it("should render with ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-foreground/5");
  });

  it("should render with link variant", () => {
    render(<Button variant="link">Link</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-primary");
    expect(button).toHaveClass("underline-offset-4");
  });

  it("should render with different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-8");

    rerender(<Button size="default">Default</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-9");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-10");

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole("button")).toHaveClass("size-9");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should be disabled when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should show loading spinner when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);

    const button = screen.getByRole("button");
    // The loader icon should have animate-spin class
    const spinner = button.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should call onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should apply custom className", () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("should render as child component when asChild is true", () => {
    render(
      <Button asChild>
        <span data-testid="custom-element">Custom Button Element</span>
      </Button>,
    );

    const element = screen.getByTestId("custom-element");
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe("SPAN");
  });

  it("should render with children including icons", () => {
    render(
      <Button>
        <svg data-testid="icon" />
        <span>Button with Icon</span>
      </Button>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("Button with Icon")).toBeInTheDocument();
  });
});
