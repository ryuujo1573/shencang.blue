import { Slot, component$ } from "@qwik.dev/core";

type Props = {
  title: string;
  level?: "main" | "side";
};

export const Section = component$<Props>(({ title, level = "main" }) => {
  return (
    <section class="r-section">
      {level === "main" ? (
        <h2 class="r-section-title">{title}</h2>
      ) : (
        <h3 class="r-section-title r-section-title--side">{title}</h3>
      )}
      <div class="r-section-body">
        <Slot />
      </div>
    </section>
  );
});
