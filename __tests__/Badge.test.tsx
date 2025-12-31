import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "@/components/ui/data-display/badge";

describe("Badge", () => {
  it("should render with default variant", () => {
    render(<Badge>Default Badge</Badge>);

    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-slot", "badge");
  });

  it("should render with secondary variant", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);

    const badge = screen.getByText("Secondary Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-secondary");
  });

  it("should render with destructive variant", () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);

    const badge = screen.getByText("Destructive Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-destructive");
  });

  it("should render with outline variant", () => {
    render(<Badge variant="outline">Outline Badge</Badge>);

    const badge = screen.getByText("Outline Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-foreground");
  });

  it("should render with green variant", () => {
    render(<Badge variant="green">Green Badge</Badge>);

    const badge = screen.getByText("Green Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-800");
  });

  it("should apply custom className", () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);

    const badge = screen.getByText("Custom Badge");
    expect(badge).toHaveClass("custom-class");
  });

  it("should render as child component when asChild is true", () => {
    render(
      <Badge asChild>
        <span data-testid="custom-element">Custom Badge Element</span>
      </Badge>,
    );

    const element = screen.getByTestId("custom-element");
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe("SPAN");
  });

  it("should render with children including icons", () => {
    render(
      <Badge>
        <svg data-testid="icon" />
        <span>Badge with Icon</span>
      </Badge>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("Badge with Icon")).toBeInTheDocument();
  });
});
