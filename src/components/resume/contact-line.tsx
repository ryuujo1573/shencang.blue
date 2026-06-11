import { component$ } from "@qwik.dev/core";

import type { ContactItem } from "./resume-data";

type Props = { items: ContactItem[] };

export const ContactLine = component$<Props>(({ items }) => {
  return (
    <ul class="r-contact-line">
      {items.map((it) => (
        <li key={it.label} class="r-contact-line-item">
          <span class={["r-contact-icon", it.icon]} aria-hidden="true" />
          {it.href ? (
            <a href={it.href}>{it.value}</a>
          ) : (
            <span>{it.value}</span>
          )}
        </li>
      ))}
    </ul>
  );
});
