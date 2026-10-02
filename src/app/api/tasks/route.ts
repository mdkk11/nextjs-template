import { NextResponse } from "next/server";

import { CreateTaskRequestSchema } from "@/features/task/schema";
import type { Task } from "@/features/task/types";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = CreateTaskRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid task title" }, { status: 400 });
    }

    const task: Task = {
      id: crypto.randomUUID(),
      title: result.data.title,
      completed: false,
    };

    return NextResponse.json({ task }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
