import { component$ } from "@builder.io/qwik";
import {
  DocumentHead,
  Form,
  routeAction$,
  routeLoader$,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { default as FilteredTodos } from "~/components/filtered-todos";
import FormGroup from "~/components/form-group";
import FormSelect from "~/components/form-select";
import { Logo } from "~/components/icons/Icons";
import { priorities, projects, states } from "~/constants/constants";
import { useGlobalState } from "~/ctx/ctx";
import { supabase } from "~/db/supabase";
import {
  loadAnimation,
  translatedPriority,
  translatedStatus,
} from "~/utils/functions";
import { getTasks } from "~/utils/supabase";

export const useToDosLoader = routeLoader$(async () => {
  const todosFromDB = await getTasks();
  const todos = [...todosFromDB];
  return todos;
});

export const useAddToToDosAction = routeAction$(
  async (values) => {
    const newTodo = {
      title: values.title,
      description: values.description,
      priority: values.priority,
      status: "todo",
      project: values.project,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert(newTodo)
      .select("*");
    if (error) {
      console.error(error.message);
      return data;
    }
    return {
      success: true,
    };
  },
  zod$({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    priority: z.string().trim().min(1),
    project: z.string().trim().min(1),
  })
);

export default component$(() => {
  const ctx = useGlobalState();
  const { filter } = ctx;

  const addAction = useAddToToDosAction();

  return (
    <div class="flex flex-col justify-center min-h-screen py-2 w-full px-[20px] max-w-[1240px] mx-auto">
      <Logo />

      <div class="flex flex-col my-6">
        {/* Filtro por proyectos */}
        <div class="flex items-center gap-2 my-2">
          <h2 class="font-bold">Proyectos:</h2>
          <div class="flex">
            <button
              onClick$={() => {
                filter.project = "all";
              }}
              class={{
                "border-black border mr-4 p-1": true,
                "bg-[var(--color-bg-todo)] shadow-todo":
                  filter.project === "all",
              }}
            >
              <p>Todos los proyectos</p>
            </button>
            {projects[0] ? (
              projects.map((project: string, index: number) => (
                <button
                  key={index}
                  onClick$={() => {
                    filter.project = project;
                  }}
                  class={{
                    "border-black border mr-4 p-1": true,
                    "bg-[var(--color-bg-todo)] shadow-todo":
                      filter.project === project,
                  }}
                >
                  <p>{project}</p>
                </button>
              ))
            ) : (
              <p>No filters</p>
            )}
          </div>
        </div>

        {/* Filtro por estado de las tareas */}
        <div class="flex items-center gap-2 my-2">
          <h2 class="font-bold">Estado:</h2>
          <div class="flex">
            <button
              onClick$={() => {
                filter.state = "all";
              }}
              class={{
                "border-black border mr-4 p-1": true,
                "bg-[var(--color-bg-todo)] shadow-todo": filter.state === "all",
              }}
            >
              <p>Todas las tareas</p>
            </button>
            {states ? (
              states.map((status: string) => (
                <button
                  onClick$={() => {
                    filter.state = status;
                  }}
                  class={{
                    "border-black border mr-4 p-1": true,
                    "bg-[var(--color-bg-todo)] shadow-todo":
                      filter.state === status,
                  }}
                >
                  <p>{translatedStatus(status)}</p>
                </button>
              ))
            ) : (
              <p>No filters</p>
            )}
          </div>
        </div>

        {/* Filtro por prioridad de las tareas */}
        <div class="flex items-center gap-2 my-2">
          <h2 class="font-bold">Prioridad:</h2>
          <div class="flex">
            <button
              onClick$={() => {
                filter.priority = "all";
              }}
              class={{
                "border-black border mr-4 p-1": true,
                "bg-[var(--color-bg-todo)] shadow-todo":
                  filter.priority === "all",
              }}
            >
              <p>Todas las tareas</p>
            </button>
            {priorities ? (
              priorities.map((priority: string) => (
                <button
                  onClick$={() => {
                    filter.priority = priority;
                  }}
                  class={{
                    "border-black border mr-4 p-1": true,
                    "bg-[var(--color-bg-todo)] shadow-todo":
                      filter.priority === priority,
                  }}
                >
                  <p>{translatedPriority(priority)}</p>
                </button>
              ))
            ) : (
              <p>No filters</p>
            )}
          </div>
        </div>
      </div>

      <div class="flex justify-between w-full md:min-h-[650px]">
        <Form
          onSubmitCompleted$={() => loadAnimation()}
          spaReset
          action={addAction}
          class="flex flex-col items-end shadow-todo gap-4 w-full md:max-w-[300px] mr-8 border-black border-2 bg-[var(--color-bg-todo)] py-5 px-6 h-fit"
        >
          <FormGroup
            label="Titulo"
            placeholder="Escribe tu título aqui"
            required
            name="title"
          />
          <FormGroup
            label="Descripción"
            placeholder="Escribe tu descripción aqui"
            required
            name="description"
          />
          <FormSelect label="Proyecto" name="project" options={projects} />
          <FormSelect label="Prioridad" name="priority" options={priorities} />

          <button class="btn btn-submit" type="submit">
            Crear tarea
          </button>
        </Form>
        <FilteredTodos />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik To Do App",
  meta: [
    {
      name: "description",
      content: "Qwik To Do App",
    },
  ],
};
