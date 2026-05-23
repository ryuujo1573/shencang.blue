import { component$ } from "@qwik.dev/core";

export default component$(() => {
  return (
    <main class="flex flex-col items-center gap-8 m-16">
      <h1>
        <span class="text-4xl font-bold">Zhang's Resume</span>
        <span class="-z-1 absolute left-0 top-0 leading-[10rem] text-[10rem] text-black/10 dark:text-white/10">
          THIS IS ZHANG
        </span>
      </h1>
      <div class="paper-a4 mt-8">
        <p>Lorem Ipsum.</p>
      </div>
    </main>
  );
});
