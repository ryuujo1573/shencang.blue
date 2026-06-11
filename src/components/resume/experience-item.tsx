import { component$ } from "@qwik.dev/core";

import type { Experience } from "./resume-data";

export const ExperienceItem = component$<Experience>(
  ({ start, end, title, subtitle, location, bullets }) => {
    return (
      <article class="r-exp">
        <header class="r-exp-meta">
          <p class="r-exp-date">
            {start} — {end}
          </p>
          {location && <p class="r-exp-location">{location}</p>}
        </header>
        <div class="r-exp-body">
          <h4 class="r-exp-title">{title}</h4>
          {subtitle && <p class="r-exp-subtitle">{subtitle}</p>}
          {bullets.length > 0 && (
            <ul class="r-exp-bullets">
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      </article>
    );
  },
);
