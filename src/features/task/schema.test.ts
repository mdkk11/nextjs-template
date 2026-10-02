import { describe, expect, it } from "vitest";

import {
  CreateTaskRequestSchema,
  CreateTaskResponseSchema,
  UpdateTaskRequestSchema,
  UpdateTaskResponseSchema,
} from "./schema";

describe("task schemas", () => {
  it("trims a valid title", () => {
    expect(CreateTaskRequestSchema.parse({ title: "  Write tests  " })).toEqual({
      title: "Write tests",
    });
  });

  it("rejects empty and overlong titles", () => {
    expect(CreateTaskRequestSchema.safeParse({ title: "   " }).success).toBe(false);
    expect(CreateTaskRequestSchema.safeParse({ title: "a".repeat(101) }).success).toBe(false);
  });

  it("accepts only boolean completion state", () => {
    expect(UpdateTaskRequestSchema.safeParse({ completed: true }).success).toBe(true);
    expect(UpdateTaskRequestSchema.safeParse({ completed: "true" }).success).toBe(false);
  });

  it("validates task responses", () => {
    expect(
      CreateTaskResponseSchema.safeParse({
        task: { id: "task-1", title: "Write tests", completed: false },
      }).success,
    ).toBe(true);
    expect(
      CreateTaskResponseSchema.safeParse({ task: { id: "task-1", completed: false } }).success,
    ).toBe(false);
    expect(
      UpdateTaskResponseSchema.safeParse({ task: { id: "task-1", completed: "true" } }).success,
    ).toBe(false);
  });
});
