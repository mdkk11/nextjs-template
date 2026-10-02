"use client";

import { useState, type FormEvent } from "react";

import { PlusIcon } from "@/components/icons/plus-icon";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";

import { CreateTaskRequestSchema } from "../schema";

type TaskFormProps = Readonly<{
  onCreate: (title: string) => Promise<void>;
}>;

export function TaskForm({ onCreate }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = CreateTaskRequestSchema.safeParse({ title });

    if (!result.success) {
      setTitleError("Task title must be between 1 and 100 characters.");
      return;
    }

    setTitleError(null);
    setCreateError(null);
    setIsSubmitting(true);

    try {
      await onCreate(result.data.title);
      setTitle("");
    } catch {
      setCreateError("Unable to add task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form
        aria-label="Add task"
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={handleSubmit}
      >
        <div className="flex-1">
          <label htmlFor="task-title" className="mb-2 block text-sm font-medium">
            Task title
          </label>
          <Input
            id="task-title"
            aria-describedby={titleError ? "task-title-error" : undefined}
            aria-invalid={titleError ? true : undefined}
            name="title"
            placeholder="Read the testing guide"
            value={title}
            onValueChange={(value) => {
              setTitle(value);
              setTitleError(null);
            }}
          />
        </div>
        <Button type="submit" disabled={isSubmitting} focusableWhenDisabled>
          <PlusIcon aria-hidden="true" size={16} />
          {isSubmitting ? "Adding…" : "Add task"}
        </Button>
      </form>

      {titleError ? (
        <p id="task-title-error" role="alert" className="mt-3 text-sm text-danger">
          {titleError}
        </p>
      ) : null}

      {createError ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {createError}
        </p>
      ) : null}
    </>
  );
}
