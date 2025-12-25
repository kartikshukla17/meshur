import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta = {
  title: "Molecules/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outlined", "elevated"],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Card content goes here",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    children: "Outlined card content",
  },
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
    children: "Elevated card with shadow",
  },
};

export const WithContent: Story = {
  args: {
    children: "Card content",
  },
  render: () => (
    <Card className="w-80">
      <h3 className="mb-2 text-lg font-semibold">Card Title</h3>
      <p className="mb-4 text-zinc-600 dark:text-zinc-400">
        This is a card with some content. It can contain any type of content
        including text, images, and other components.
      </p>
      <button className="rounded bg-foreground px-4 py-2 text-background">
        Action
      </button>
    </Card>
  ),
};
