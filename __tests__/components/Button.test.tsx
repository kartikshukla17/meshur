/**
 * Button Component Tests
 * Tests for the Button atom component
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/atoms/Button";

describe("Button", () => {
  it("renders button with children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("applies primary variant by default", () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-foreground");
  });

  it("applies secondary variant when specified", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border");
  });

  it("applies outline variant when specified", () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-2");
  });

  it("applies ghost variant when specified", () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-black/[.04]");
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-10");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-12");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-14");
  });

  it("shows loading state when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("calls onClick handler when clicked", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders as link when href is provided", () => {
    render(
      <Button href="/products" asChild>
        Link Button
      </Button>
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("forwards other HTML attributes", () => {
    render(
      <Button data-testid="test-button" aria-label="Test">
        Test
      </Button>
    );
    const button = screen.getByTestId("test-button");
    expect(button).toHaveAttribute("aria-label", "Test");
  });
});
