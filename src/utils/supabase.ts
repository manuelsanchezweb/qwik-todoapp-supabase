import { $ } from "@builder.io/qwik";
import { supabase } from "~/db/supabase";
import { ToDo } from "~/types/types";

/**
 * Get Tasks
 */

export const getTasks = $(async (): Promise<ToDo[]> => {
  const { data: tasks } = await supabase.from("tasks").select("*");
  // console.log("Estas son todas las tareas al principio:", tasks);

  return tasks ? (tasks as ToDo[]) : [];
});

/**
 * Insert Task
 */
export const insertTask = $(async (todo: ToDo) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      status: "todo",
      project: todo.project,
    })
    .select("*");
  if (error) {
    console.error(error.message);
    return todo;
  }

  return data ? data[0] : todo;
});

/**
 * Delete Task
 */
export const deleteTask = $(async (todo: ToDo) => {
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", todo.id);
  // console.log("Deleting", todo);
  // console.log("New list of todos", data);

  if (error) {
    console.error(error.message);
    return;
  }
  return;
});
