import { component$, useSignal, useVisibleTask$ } from "@qwik.dev/core";
import { routeLoader$ } from "@qwik.dev/router";
import type { ComarkElement, ComarkNode } from "comark";
import { parse } from "comark";

import { ComarkRenderer } from "~/components/resume/comark-renderer";
import resumeContent from "~/components/resume/resume.md?raw";

import "./resume.css";

export const useResumeTree = routeLoader$(async () => {
  const tree = await parse(resumeContent);
  return { nodes: tree.nodes, frontmatter: tree.frontmatter };
});

function findNode(nodes: ComarkNode[], tag: string): ComarkElement | undefined {
  return nodes.find((n) => Array.isArray(n) && n[0] === tag) as
    | ComarkElement
    | undefined;
}

export default component$(() => {
  const tree = useResumeTree();
  const paged = useSignal(true);
  const sourceRef = useSignal<HTMLDivElement>();
  const pagesRef = useSignal<HTMLDivElement>();

  const { nodes, frontmatter } = tree.value;
  const name = String(frontmatter.name ?? "");
  const contactsNode = findNode(nodes, "resume-contacts");
  const layoutNode = findNode(nodes, "resume-layout");

  // biome-ignore lint/correctness/noQwikUseVisibleTask: On-screen measurement
  useVisibleTask$(
    ({ track }) => {
      const isPaged = track(() => paged.value);
      const src = sourceRef.value;
      const dst = pagesRef.value;
      if (!src || !dst) return;

      dst.replaceChildren();

      if (!isPaged) {
        src.classList.add("resume-paper", "is-continuous");
        return;
      }
      src.classList.remove("is-continuous");

      const probe = document.createElement("div");
      probe.style.cssText =
        "position:absolute;left:-99999px;top:0;height:297mm;width:0";
      document.body.appendChild(probe);
      const pageHeight = probe.getBoundingClientRect().height;
      probe.remove();

      const header = src.querySelector(".resume-header");
      const aside = src.querySelector(".resume-side");
      const mainCol = src.querySelector(".resume-main");
      if (!header || !aside || !mainCol) return;
      const sections = Array.from(mainCol.children);

      const page1 = document.createElement("article");
      page1.className = "resume-paper is-paged";
      dst.appendChild(page1);
      page1.appendChild(header.cloneNode(true));
      const layout1 = document.createElement("div");
      layout1.className = "resume-layout";
      const main1 = document.createElement("div");
      main1.className = "resume-main";
      layout1.appendChild(main1);
      layout1.appendChild(aside.cloneNode(true));
      page1.appendChild(layout1);

      let curPaper = page1;
      let curMain = main1;

      // biome-ignore lint/correctness/useQwikValidLexicalScope: <explanation>
      const fits = () => curPaper.scrollHeight <= pageHeight + 0.5;

      // biome-ignore lint/correctness/useQwikValidLexicalScope: <explanation>
      const newPage = () => {
        const np = document.createElement("article");
        np.className = "resume-paper is-paged";
        dst.appendChild(np);
        const nm = document.createElement("div");
        nm.className = "resume-main resume-main--full";
        np.appendChild(nm);
        curPaper = np;
        curMain = nm;
      };

      for (const section of sections) {
        // Try the whole section first.
        const sectionClone = section.cloneNode(true) as HTMLElement;
        curMain.appendChild(sectionClone);
        if (fits()) continue;

        // Overflows — remove and try item-by-item if there's a stack.
        curMain.removeChild(sectionClone);
        const stack = section.querySelector(".resume-stack");
        if (!stack) {
          // No splittable children — move to a new page as-is.
          newPage();
          curMain.appendChild(section.cloneNode(true));
          continue;
        }

        // Helper: clone the section with an empty stack, return {shell, stackEl}.
        // biome-ignore lint/correctness/useQwikValidLexicalScope: <explanation>
        const makeShell = () => {
          const sh = section.cloneNode(true) as HTMLElement;
          const st = sh.querySelector(".resume-stack")!;
          st.replaceChildren();
          return { sh, st };
        };

        let { sh: curShell, st: curStack } = makeShell();
        curMain.appendChild(curShell);
        // If even the empty shell doesn't fit, push it to a new page.
        if (!fits()) {
          curMain.removeChild(curShell);
          newPage();
          ({ sh: curShell, st: curStack } = makeShell());
          curMain.appendChild(curShell);
        }

        for (const item of Array.from(stack.children)) {
          curStack.appendChild(item.cloneNode(true));
          if (fits()) continue;

          // Item overflows — remove it and start a new page with a fresh shell.
          curStack.removeChild(curStack.lastChild!);
          newPage();
          ({ sh: curShell, st: curStack } = makeShell());
          curMain.appendChild(curShell);
          curStack.appendChild(item.cloneNode(true));
        }
      }
    },
    { strategy: "document-ready" },
  );

  return (
    <main
      class="resume-page print-papers"
      data-mode={paged.value ? "paged" : "continuous"}
    >
      <nav class="resume-toolbar" aria-label="工具栏">
        <button
          type="button"
          class={[
            "resume-toggle",
            paged.value ? "i-lucide-files" : "i-lucide-file-text",
          ]}
          aria-pressed={paged.value}
          aria-label={paged.value ? "切换为连续显示" : "切换为按页显示"}
          title={paged.value ? "当前：按页显示" : "当前：连续显示"}
          onClick$={() => {
            paged.value = !paged.value;
          }}
        />
        <span class="resume-toolbar-divider" aria-hidden="true" />
        <button
          type="button"
          class="resume-theme-btn i-carbon-sun"
          aria-label="浅色主题"
          onClick$={() => window.$setTheme("light")}
        />
        <button
          type="button"
          class="resume-theme-btn i-carbon-moon"
          aria-label="深色主题"
          onClick$={() => window.$setTheme("dark")}
        />
      </nav>

      <div class="resume-source resume-paper is-continuous" ref={sourceRef}>
        <header class="resume-header">
          <span class="resume-avatar" role="img" aria-label={`${name} 头像`}>
            {name.charAt(0)}
          </span>
          <div class="resume-header-text">
            <h1>{name}</h1>
            <p class="resume-role">{String(frontmatter.title ?? "")}</p>
            {contactsNode && <ComarkRenderer nodes={[contactsNode]} />}
          </div>
        </header>

        {layoutNode && <ComarkRenderer nodes={[layoutNode]} />}
      </div>

      <div class="resume-pages" ref={pagesRef} aria-hidden="true" />
    </main>
  );
});
