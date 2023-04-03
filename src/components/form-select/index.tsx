import { component$ } from "@builder.io/qwik";
import { translatedPriority, translatedStatus } from "~/utils/functions";

type FormSelectProps = {
  label: string;
  name: string;
  options: string[];
  value?: string;
};

export default component$(
  ({ label, name, options, value }: FormSelectProps) => {
    return (
      <div class="flex flex-col gap-3 w-full">
        <label class="font-bold" for={name}>
          {label}
        </label>
        <select class="border-2 border-black p-2" name={name}>
          {options.map((option: string, index: number) => {
            let translatedOption = option;

            if (name === "priority") {
              translatedOption = translatedPriority(option);
            } else if (name === "status") {
              translatedOption = translatedStatus(option);
            }

            return (
              <option key={index} value={option} selected={value === option}>
                {translatedOption}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
);
