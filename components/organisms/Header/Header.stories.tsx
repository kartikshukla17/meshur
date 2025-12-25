import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Header } from "./Header";
import { Button } from "@/components/atoms/Button";

const meta = {
  title: "Organisms/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    showSearch: {
      control: "boolean",
    },
  },
  args: {
    onSearch: fn(),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logo: <div className="text-xl font-bold">Logo</div>,
    navigation: (
      <>
        <a href="#" className="text-sm font-medium hover:text-foreground">
          Home
        </a>
        <a href="#" className="text-sm font-medium hover:text-foreground">
          Products
        </a>
        <a href="#" className="text-sm font-medium hover:text-foreground">
          About
        </a>
      </>
    ),
    userActions: (
      <>
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
        <Button variant="primary" size="sm">
          Sign Up
        </Button>
      </>
    ),
  },
};

export const WithSearch: Story = {
  args: {
    logo: <div className="text-xl font-bold">Logo</div>,
    showSearch: true,
    navigation: (
      <>
        <a href="#" className="text-sm font-medium hover:text-foreground">
          Home
        </a>
        <a href="#" className="text-sm font-medium hover:text-foreground">
          Products
        </a>
      </>
    ),
    userActions: (
      <Button variant="primary" size="sm">
        Sign In
      </Button>
    ),
  },
};

export const Minimal: Story = {
  args: {
    logo: <div className="text-xl font-bold">Logo</div>,
    userActions: (
      <Button variant="ghost" size="sm">
        Menu
      </Button>
    ),
  },
};
