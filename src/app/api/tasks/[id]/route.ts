import { NextResponse } from "next/server";

import { UpdateTaskRequestSchema } from "@/features/task/schema";

export async function PATCH(request: Request, context: RouteContext<"/api/tasks/[id]">) {
  try {
    const body: unknown = await request.json();
    const result = UpdateTaskRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid completion state" }, { status: 400 });
    }

    const { id } = await context.params;
    return NextResponse.json({ task: { id, completed: result.data.completed } });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext<"/api/tasks/[id]">) {
  await context.params;
  return new Response(null, { status: 204 });
}
