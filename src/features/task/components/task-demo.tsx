"use client";

import { useState } from "react";

import { createTask, deleteTask, updateTask } from "../api/task-api";
import type { Task, TaskUpdate } from "../types";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { TaskForm } from "./task-form";
import { TaskList } from "./task-list";

export type TaskActions = {
  createTask: (title: string) => Promise<Task>;
  updateTask: (id: string, completed: boolean) => Promise<TaskUpdate>;
  deleteTask: (id: string) => Promise<void>;
};

export type TaskDemoProps = Readonly<{
  actions?: TaskActions;
  initialTasks?: Task[];
}>;

const defaultActions: TaskActions = { createTask, deleteTask, updateTask };
const emptyTasks: Task[] = [];

export function TaskDemo({ actions = defaultActions, initialTasks = emptyTasks }: TaskDemoProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const pendingDeleteTask = tasks.find((task) => task.id === pendingDeleteId) ?? null;

  async function handleCreate(title: string) {
    const task = await actions.createTask(title);
    setTasks((currentTasks) => [...currentTasks, task]);
  }

  async function handleToggle(task: Task) {
    const updatedTask = await actions.updateTask(task.id, !task.completed);
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === updatedTask.id
          ? { ...currentTask, completed: updatedTask.completed }
          : currentTask,
      ),
    );
  }

  async function handleDelete(id: string) {
    await actions.deleteTask(id);
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    setPendingDeleteId(null);
  }

  return (
    <section
      aria-labelledby="task-demo-title"
      className="w-full max-w-2xl rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8"
    >
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">Task demo</p>
        <h1 id="task-demo-title" className="text-3xl font-semibold tracking-tight">
          Keep your next steps clear.
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add a task, mark it complete, or remove it when you are done.
        </p>
      </div>

      <TaskForm onCreate={handleCreate} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <TaskList tasks={tasks} onToggle={handleToggle} onDeleteRequest={setPendingDeleteId} />
      </div>

      <DeleteTaskDialog
        task={pendingDeleteTask}
        onClose={() => setPendingDeleteId(null)}
        onDelete={handleDelete}
      />
    </section>
  );
}
