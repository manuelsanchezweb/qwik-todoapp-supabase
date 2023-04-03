import { todos } from "~/data/todos";
import { getUniqueValues } from "~/utils/functions";

export const projects = ["Hogar", "Trabajo", "Viaje a Chile"];
export const states = ["todo", "doing", "done"];
export const priorities = getUniqueValues(todos, "priority");
