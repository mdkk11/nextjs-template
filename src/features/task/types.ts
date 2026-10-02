export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export type TaskUpdate = {
  id: string;
  completed: boolean;
};
