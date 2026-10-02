import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { TaskDemo, type TaskActions } from "./task-demo";

function storyActions(): TaskActions {
  let nextId = 1;

  return {
    createTask: async (title) => ({ id: `story-task-${nextId++}`, title, completed: false }),
    updateTask: async (id, completed) => ({ id, completed }),
    deleteTask: async () => undefined,
  };
}

const meta = {
  title: "Features/Task/TaskDemo",
  component: TaskDemo,
  parameters: { layout: "centered" },
  args: { actions: storyActions() },
} satisfies Meta<typeof TaskDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithTasks: Story = {
  args: {
    initialTasks: [
      { id: "task-1", title: "Read the testing guide", completed: false },
      { id: "task-2", title: "Review the pull request", completed: false },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Mark Read the testing guide as complete" }),
    );
    await expect(
      canvas.getByRole("button", { name: "Mark Read the testing guide as incomplete" }),
    ).toHaveAttribute("aria-pressed", "true");
  },
};

export const CompletedTask: Story = {
  args: {
    initialTasks: [{ id: "task-1", title: "Set up the project", completed: true }],
  },
};

export const SubmitTask: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Task title" });

    await userEvent.type(input, "Write component tests");
    await userEvent.click(canvas.getByRole("button", { name: "Add task" }));

    await expect(canvas.getByRole("listitem")).toHaveTextContent("Write component tests");
  },
};

export const DeleteConfirmation: Story = {
  args: {
    initialTasks: [{ id: "task-1", title: "Remove this task", completed: false }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const task = canvas.getByRole("listitem");

    await userEvent.click(canvas.getByRole("button", { name: "Delete Remove this task" }));
    await expect(body.getByRole("dialog")).toBeVisible();
    await userEvent.click(body.getByRole("button", { name: "Cancel" }));
    await expect(body.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Delete Remove this task" }));
    await userEvent.click(
      within(body.getByRole("dialog")).getByRole("button", { name: "Delete task" }),
    );
    await expect(task).not.toBeInTheDocument();
  },
};

export const DeleteFailure: Story = {
  args: {
    actions: {
      ...storyActions(),
      deleteTask: async () => {
        throw new Error("Delete failed");
      },
    },
    initialTasks: [{ id: "task-1", title: "Keep this task", completed: false }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const task = canvas.getByRole("listitem");

    await userEvent.click(canvas.getByRole("button", { name: "Delete Keep this task" }));
    const dialog = body.getByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Delete task" }));

    await expect(within(dialog).getByRole("alert")).toHaveTextContent(
      "Unable to delete task. Please try again.",
    );
    await expect(dialog).toBeVisible();
    await expect(task).toBeInTheDocument();
    await expect(task).toHaveTextContent("Keep this task");
  },
};
