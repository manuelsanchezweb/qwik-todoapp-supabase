import { component$, Slot } from "@builder.io/qwik";

export const Container = component$(({ className }: { className?: string }) => {
  return (
    <div
      class={`flex w-full max-w-[1400px] px-5 md:px-20 md:mx-auto ${className}`}
    >
      <Slot />
    </div>
  );
});
