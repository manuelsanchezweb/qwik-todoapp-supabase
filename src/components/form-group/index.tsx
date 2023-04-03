import { component$ } from "@builder.io/qwik";

type FormGroupProps = {
  label: string;
  placeholder?: string;
  name: string;
  required?: boolean;
  value?: string;
};

export default component$(
  ({ label, placeholder, name, required, value }: FormGroupProps) => {
    return (
      <div class="flex flex-col gap-3 w-full">
        <label class="font-bold" for={name}>
          {label}
        </label>
        <input
          class="border-2 border-black p-4"
          type="text"
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
        />
      </div>
    );
  }
);
