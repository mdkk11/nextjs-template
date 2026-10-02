"use client";

import { useState } from "react";

import { CheckIcon } from "@/components/icons/check-icon";
import { TrashIcon } from "@/components/icons/trash-icon";
import { Button } from "@/components/ui/button/button";

import type { Task } from "../types";

type TaskItemProps = Readonly<{
  task: Task;
  onToggle: (task: Task) => Promise<void>;
  onDeleteRequest: (id: string) => void;
}>;

export function TaskItem({ task, onToggle, onDeleteRequest }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  async function handleToggle() {
    setUpdateError(null);
    setIsUpdating(true);

    try {
      await onToggle(task);
    } catch {
      setUpdateError("Unable to update task. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <li data-completed={task.completed} className="rounded-md border border-border p-3">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          aria-label={
            task.completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`
          }
          aria-pressed={task.completed}
          disabled={isUpdating}
          focusableWhenDisabled
          onClick={() => void handleToggle()}
        >
          <CheckIcon aria-hidden="true" size={16} />
          <span>{task.completed ? "Completed" : "Complete"}</span>
        </Button>
        <span
          className={`min-w-0 flex-1 break-words ${task.completed ? "text-muted line-through" : ""}`}
        >
          {task.title}
        </span>
        <Button
          type="button"
          variant="ghost"
          aria-label={`Delete ${task.title}`}
          onClick={() => onDeleteRequest(task.id)}
        >
          <TrashIcon aria-hidden="true" size={16} />
        </Button>
      </div>
      {updateError ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {updateError}
        </p>
      ) : null}
    </li>
  );
}
