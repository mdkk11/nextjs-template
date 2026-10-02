import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../button/button";
import { Dialog } from "./dialog";

function DialogExample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="secondary" />}>Open dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup>
            <Dialog.Title>Delete project?</Dialog.Title>
            <Dialog.Description>This action cannot be undone.</Dialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close>Close</Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const meta = {
  title: "UI/Dialog",
  component: Dialog.Root,
  render: () => <DialogExample />,
} satisfies Meta<typeof Dialog.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const OpenAndClose: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open dialog" });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");

    const dialog = await within(document.body).findByRole("dialog", { name: "Delete project?" });
    await expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};
