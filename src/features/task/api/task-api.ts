import { CreateTaskResponseSchema, UpdateTaskResponseSchema } from "../schema";
import type { Task, TaskUpdate } from "../types";

export async function createTask(title: string): Promise<Task> {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error("Unable to create task");
  }

  const body: unknown = await response.json();
  return CreateTaskResponseSchema.parse(body).task;
}

export async function updateTask(id: string, completed: boolean): Promise<TaskUpdate> {
  const response = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error("Unable to update task");
  }

  const body: unknown = await response.json();
  return UpdateTaskResponseSchema.parse(body).task;
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to delete task");
  }
}
