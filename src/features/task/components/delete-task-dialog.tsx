"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button/button";
import { Dialog } from "@/components/ui/dialog/dialog";

import type { Task } from "../types";

type DeleteTaskDialogProps = Readonly<{
  task: Task | null;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}>;

export function DeleteTaskDialog({ task, onClose, onDelete }: DeleteTaskDialogProps) {
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!task) {
      return;
    }

    setDeleteError(null);
    setIsDeleting(true);

    try {
      await onDelete(task.id);
    } catch {
      setDeleteError("Unable to delete task. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog.Root
      open={task !== null}
      onOpenChange={(open) => {
        if (!open) {
          setDeleteError(null);
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup>
            <Dialog.Title>Delete task?</Dialog.Title>
            <Dialog.Description>
              {task
                ? `This will permanently remove “${task.title}”.`
                : "This task will be removed."}
            </Dialog.Description>
            {deleteError ? (
              <p role="alert" className="mt-3 text-sm text-danger">
                {deleteError}
              </p>
            ) : null}
            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close disabled={isDeleting}>Cancel</Dialog.Close>
              <Button
                type="button"
                variant="danger"
                disabled={isDeleting}
                focusableWhenDisabled
                onClick={() => void handleDelete()}
              >
                {isDeleting ? "Deleting…" : "Delete task"}
              </Button>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
