import type { Task } from "../types";
import { TaskItem } from "./task-item";

type TaskListProps = Readonly<{
  tasks: Task[];
  onToggle: (task: Task) => Promise<void>;
  onDeleteRequest: (id: string) => void;
}>;

export function TaskList({ tasks, onToggle, onDeleteRequest }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="mt-3 rounded-md border border-dashed border-border p-6 text-center text-muted-foreground">
        No tasks yet. Add one above to get started.
      </p>
    );
  }

  return (
    <ul aria-label="Tasks" className="mt-3 space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDeleteRequest={onDeleteRequest} />
      ))}
    </ul>
  );
}
