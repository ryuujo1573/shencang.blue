import { component$, Slot } from "@qwik.dev/core";

import 'remark-github-blockquote-alert/alert.css'
import 'katex/dist/katex.css';

export default component$(() => {
  return (
    <div class="prose m-16">
      <Slot />
    </div>
  );
});