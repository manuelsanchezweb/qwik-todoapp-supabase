import {
  IconDelete,
  IconDone,
  IconEdit,
  IconInProgress,
  IconToDo,
} from "./Icons";

import { component$ } from "@builder.io/qwik";

export const IconSwitcher = component$(
  ({ icon, classIcon }: { icon: string; classIcon?: string }) => {
    function renderIcon(icon: string) {
      switch (icon) {
        case "todo":
          return <IconToDo classIcon={classIcon} />;
        case "doing":
          return <IconInProgress classIcon={classIcon} />;
        case "done":
          return <IconDone classIcon={classIcon} />;
        case "edit":
          return <IconEdit classIcon={classIcon} />;
        case "delete":
          return <IconDelete classIcon={classIcon} />;

        default:
          return <IconToDo classIcon={classIcon} />;
      }
    }

    return renderIcon(icon);
  }
);
