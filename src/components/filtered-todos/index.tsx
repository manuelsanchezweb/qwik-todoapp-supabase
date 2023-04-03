import {
  $,
  component$,
  useComputed$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Form, routeAction$ } from "@builder.io/qwik-city";
import { priorities, projects, states } from "~/constants/constants";
import { useGlobalState } from "~/ctx/ctx";
import { supabase } from "~/db/supabase";
import { useToDosLoader } from "~/routes";
import { ToDo } from "~/types/types";
import {
  filterToDosByProject,
  getClassByPriority,
  loadAnimation,
} from "~/utils/functions";
import { deleteTask } from "~/utils/supabase";
import FormGroup from "../form-group";
import FormSelect from "../form-select";
import { IconSwitcher } from "../icons/IconSwitcher";

export const useEditToDoAction = routeAction$(async (values) => {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      title: values.title,
      description: values.description,
      priority: values.priority,
      status: values.status,
      project: values.project,
    })
    .eq("id", values.id)
    .select("*");
  if (error) {
    console.error(error.message);
    return data;
  }
  return {
    success: true,
  };
});

export default component$(() => {
  const { filter } = useGlobalState();
  const todos = useToDosLoader();
  const todosSignal = useSignal(todos.value);

  const isEditing = useSignal(false);
  const toDoIDToEdit = useSignal(0);
  const editAction = useEditToDoAction();
  console.log(todos.value);

  useVisibleTask$(({ track }) => {
    track(filter);
    track(todos);

    loadAnimation();
  });

  const filtered = useComputed$(() => {
    // como useTask$ pero con tracking listo y te permite return
    let filteredToDos =
      filter.project === "all"
        ? todosSignal.value
        : filterToDosByProject(todosSignal.value, filter.project);

    filteredToDos =
      filter.state === "all"
        ? filteredToDos
        : filteredToDos.filter((todo) => todo.status === filter.state);

    filteredToDos =
      filter.priority === "all"
        ? filteredToDos
        : filteredToDos.filter((todo) => todo.priority === filter.priority);

    return filteredToDos;
  });

  const handleEditTodo = $((todo: ToDo) => {
    toDoIDToEdit.value = todo.id;
    isEditing.value = true;
  });

  const handleDeleteTodo = $(async (todo: ToDo) => {
    await deleteTask(todo);
    todos.value.filter((t) => t.id !== todo.id);
  });

  return (
    <ul class="flex flex-col flex-wrap max-h-[650px] md:mr-auto gap-4">
      {filtered.value[0] ? (
        filtered.value.slice(0, 15).map((todo) => (
          <li
            class="border-black border-2 bg-[var(--color-bg-todo)] p-[10px] shadow-todo relative w-[250px] max-w-[250px]"
            key={todo.id}
          >
            <div
              class={`absolute right-2 -top-2 border-2 border-black ${getClassByPriority(
                todo.priority
              )} flex items-center justify-center w-[40px] h-[40px] rounded-b-3xl`}
            >
              <IconSwitcher icon={todo.status} />
            </div>
            <div class="flex flex-col gap-2 mb-4">
              <p class="font-bold max-w-[75%]">{todo.title}</p>
              {todo.description ?? (
                <p class="max-w-[75%]">{todo.description}</p>
              )}
            </div>
            <div class="flex justify-end">
              <button onClick$={() => handleEditTodo(todo)}>
                <IconSwitcher icon="edit" />
              </button>
              <button onClick$={() => handleDeleteTodo(todo)}>
                <IconSwitcher icon="delete" />
              </button>
            </div>
            {isEditing.value && toDoIDToEdit.value === todo.id && (
              <div class="modal z-10">
                <div class="relative pt-20 px-12 pb-12 bg-white w-full max-w-[600px] pointer-events-auto">
                  <button
                    class="btn btn-contrast absolute top-5 right-5"
                    onClick$={() => (toDoIDToEdit.value = 0)}
                    aria-label="Close Modal Edit"
                  >
                    X
                  </button>
                  <h2 class="font-bold mb-8 text-2xl">Editar tarea</h2>
                  <Form
                    onSubmitCompleted$={() => {
                      isEditing.value = false;
                      toDoIDToEdit.value = 0;
                    }}
                    // spaReset
                    action={editAction}
                    class="flex flex-col items-end shadow-todo gap-4 w-full md:max-w-[600px] mr-8 border-black border-2 bg-[var(--color-bg-todo)] py-5 px-6 h-fit"
                  >
                    <FormGroup
                      label="Titulo"
                      placeholder="Escribe tu título aqui"
                      required
                      name="title"
                      value={todo.title}
                    />
                    <FormGroup
                      label="Descripción"
                      placeholder="Escribe tu descripción aqui"
                      required
                      name="description"
                      value={todo.description}
                    />
                    <FormSelect
                      label="Proyecto"
                      name="project"
                      options={projects}
                      value={todo.project}
                    />
                    <FormSelect
                      label="Estado de la tarea"
                      name="status"
                      options={states}
                      value={todo.status || "todo"}
                    />
                    <FormSelect
                      label="Prioridad"
                      name="priority"
                      options={priorities}
                      value={todo.priority}
                    />

                    <div class="flex gap-2">
                      <button
                        class="btn"
                        type="button"
                        onClick$={() => (toDoIDToEdit.value = 0)}
                      >
                        Cancelar
                      </button>
                      <button class="btn btn-submit" type="submit">
                        Editar tarea
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            )}
          </li>
        ))
      ) : (
        <p>No hay tareas que se ajusten a tus criterios de búsqueda.</p>
      )}
    </ul>
  );
});
