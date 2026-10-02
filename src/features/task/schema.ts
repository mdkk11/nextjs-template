import { z } from "zod";

export const CreateTaskRequestSchema = z.object({
  title: z.string().trim().min(1).max(100),
});

export const UpdateTaskRequestSchema = z.object({
  completed: z.boolean(),
});

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});

const TaskUpdateSchema = z.object({
  id: z.string(),
  completed: z.boolean(),
});

export const CreateTaskResponseSchema = z.object({
  task: TaskSchema,
});

export const UpdateTaskResponseSchema = z.object({
  task: TaskUpdateSchema,
});
