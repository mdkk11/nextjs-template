import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  render: (args) => (
    <label
      htmlFor="project-name"
      className="grid max-w-sm gap-2 text-sm font-medium text-foreground"
    >
      Project name
      <Input {...args} id="project-name" />
    </label>
  ),
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter a project name",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Read only value",
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    "aria-describedby": "project-name-error",
  },
  render: (args) => (
    <div className="grid max-w-sm gap-2">
      <label
        htmlFor="project-name-invalid"
        className="grid gap-2 text-sm font-medium text-foreground"
      >
        Project name
        <Input {...args} id="project-name-invalid" />
      </label>
      <p id="project-name-error" className="text-sm text-danger">
        Enter a project name.
      </p>
    </div>
  ),
};

export const LongValue: Story = {
  args: {
    value: "A project name with enough text to exercise the input layout",
  },
};
