import {
  createContextId,
  useContext,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { ToDo } from "~/types/types";

interface ToDoStore {
  filter: {
    state: string;
    project: string;
    priority: string;
  };
  todos: ToDo[];
}

const ToDoContext = createContextId<ToDoStore>("todo-context");

export const useProvideGlobalState = () => {
  const store = useStore(
    {
      filter: {
        state: "all",
        project: "all",
        priority: "all",
      },
      todos: [],
    },
    { deep: true }
  );

  useContextProvider(ToDoContext, store);
};

export const useGlobalState = () => {
  return useContext(ToDoContext);
};
