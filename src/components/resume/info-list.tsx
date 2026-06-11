import { component$ } from "@qwik.dev/core";

import type { InfoField } from "./resume-data";

type Props = { items: InfoField[] };

export const InfoList = component$<Props>(({ items }) => {
  return (
    <dl class="r-info-list">
      {items.map((it) => (
        <div class="r-info-row" key={it.label}>
          <dt>{it.label}</dt>
          <dd>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
});
