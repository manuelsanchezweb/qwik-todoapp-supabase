export type ToDo = {
  id: number;
  project: string;
  title: string;
  priority: string;
  status: string;
  description?: string;
};

export type Property = "project" | "status" | "priority";
