import { animate, stagger } from "motion";
import { Property, ToDo } from "~/types/types";

export const getUniqueProjects = (todos: ToDo[]) => {
  const projects = todos.map((todo) => todo.project);
  return [...new Set(projects)];
};

export const getUniqueStates = (todos: ToDo[]) => {
  const states = todos.map((todo) => todo.status);
  return [...new Set(states)];
};

export const getUniquePriorities = (todos: ToDo[]) => {
  const priorities = todos.map((todo) => todo.priority);
  return [...new Set(priorities)];
};

// Lo podemos resumir en una sola función
export const getUniqueValues = (todos: ToDo[], property: Property) => {
  const values = todos.map((todo) => todo[property]);
  return [...new Set(values)];
};

export const filterToDosByProject = (todos: ToDo[], project: string) => {
  return todos.filter((todo) => todo.project === project);
};

export const getClassByPriority = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-[var(--color-red)]";
    case "medium":
      return "bg-[var(--color-yellow)]";
    case "low":
      return "bg-[var(--color-green)]";
    default:
      return "bg-[var(--color-red)]";
  }
};

export const translatedStatus = (status: string) => {
  switch (status) {
    case "todo":
      return "Por hacer";
    case "doing":
      return "En proceso";
    case "done":
      return "Hecho";
    default:
      return status;
  }
};

export const translatedPriority = (priority: string) => {
  switch (priority) {
    case "high":
      return "Alta";
    case "medium":
      return "Media";
    case "low":
      return "Baja";
    default:
      return priority;
  }
};

export const loadAnimation = () => {
  const allTodos = document.querySelectorAll("li");
  if (!allTodos[0]) return;

  animate(
    allTodos,
    // { opacity: [0, 1], y: [20, 0] },
    { opacity: [0, 1] },
    { delay: stagger(0.2), easing: "ease-in-out" }
  );
};
