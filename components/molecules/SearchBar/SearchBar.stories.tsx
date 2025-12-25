import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { SearchBar } from "./SearchBar";

const meta = {
  title: "Molecules/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    showButton: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
  args: {
    onSearch: fn(),
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Search products...",
  },
};

export const WithoutButton: Story = {
  args: {
    showButton: false,
    placeholder: "Search...",
  },
};

export const CustomButtonText: Story = {
  args: {
    buttonText: "Find",
    placeholder: "Search...",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Search...",
    disabled: true,
  },
};
