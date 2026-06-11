import { component$ } from "@qwik.dev/core";

type Props = {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  max?: number;
};

export const DotMeter = component$<Props>(({ name, level, max = 5 }) => {
  const dots = Array.from({ length: max }, (_, i) => i < level);
  return (
    <div class="r-gauge">
      <span class="r-gauge-name">{name}</span>
      <span
        class="r-gauge-track"
        role="img"
        aria-label={`${name} 熟练度 ${level} / ${max}`}
      >
        {dots.map((on, i) => (
          <span
            key={i}
            class={["r-gauge-dot", on && "r-gauge-dot--on"]}
            aria-hidden="true"
          />
        ))}
      </span>
    </div>
  );
});
