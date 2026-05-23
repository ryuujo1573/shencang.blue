/**
 * This is the base config for vite.
 * When building, the adapter config is used which loads this file and extends it.
 */
import { qwikVite } from "@qwik.dev/core/optimizer";
import { qwikRouter } from "@qwik.dev/router/vite";
import { i18nPlugin } from "compiled-i18n/vite";
import rehypeKatex from "rehype-katex";
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkMath from "remark-math";
import {
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind4,
} from "unocss";
import unocss from "unocss/vite";
import { defineConfig, type UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import pkg from "./package.json";

type PkgDep = Record<string, string>;
const { dependencies = {}, devDependencies = {} } = pkg as {
  dependencies?: PkgDep;
  devDependencies?: PkgDep;
};
errorOnDuplicatesPkgDeps(devDependencies, dependencies);

export default defineConfig(({ command, mode }): UserConfig => {
  return {
    plugins: [
      unocss({
        presets: [
          presetWind4(),
          presetTypography(),
          presetAttributify(),
          presetIcons({
            warn: true,
          }),
        ],
        rules: [
          [
            /^paper-(a3|a4|a5|letter|legal)$/,
            ([, name]) => {
              const sizes: Record<string, [string, string]> = {
                a3: ["297mm", "420mm"],
                a4: ["210mm", "297mm"],
                a5: ["148mm", "210mm"],
                letter: ["8.5in", "11in"],
                legal: ["8.5in", "14in"],
              };
              const [width, height] = sizes[name];
              return {
                width,
                height,
                overflow: "hidden",
                position: "relative",
                "box-shadow": "0 0 0.5mm rgba(0, 0, 0, 0.5)",
                background: "var(--paper-bg, white)",
                // CSS Named Pages: ties this element to the matching @page rule
                page: `paper-${name}`,
                // Force a page break after each paper in print
                "break-after": "page",
                "page-break-after": "always",
              };
            },
          ],
        ],
        // `print-papers` is the wrapper whose siblings are hidden during printing
        shortcuts: [["print-papers", "block"]],
        preflights: [
          {
            getCSS: () => `
/* Named @page rules — set exact size & zero margins so the paper fills the print page */
@page paper-a3     { size: 297mm 420mm; margin: 0; }
@page paper-a4     { size: 210mm 297mm; margin: 0; }
@page paper-a5     { size: 148mm 210mm; margin: 0; }
@page paper-letter { size: 8.5in  11in; margin: 0; }
@page paper-legal  { size: 8.5in  14in; margin: 0; }

@media print {
  html, body {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  /* Hide everything on the page except the .print-papers container */
  body > *:not(.print-papers) {
    display: none !important;
  }
  .print-papers {
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  /* Strip screen-only decoration from paper elements */
  .print-papers [class*="paper-"] {
    box-shadow: none !important;
    margin: 0 !important;
  }
}`,
          },
        ],
      }),
      qwikRouter({
        mdx: {
          recmaPlugins: [[recmaInjectVariables, { uv_sum: 1024 }]],
          remarkPlugins: [remarkAlert, remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      }),
      qwikVite(),
      tsconfigPaths({ root: "." }),
      i18nPlugin({ locales: ["en"] }),
    ],
    // This tells Vite which dependencies to pre-build in dev mode.
    optimizeDeps: {
      // Put problematic deps that break bundling here, mostly those with binaries.
      // For example ['better-sqlite3'] if you use that in server functions.
      exclude: [],
    },
    /**
     * This is an advanced setting. It improves the bundling of your server code. To use it, make sure you understand when your consumed packages are dependencies or dev dependencies. (otherwise things will break in production)
     */
    // ssr:
    //   command === "build" && mode === "production"
    //     ? {
    //         // All dev dependencies should be bundled in the server build
    //         noExternal: Object.keys(devDependencies),
    //         // Anything marked as a dependency will not be bundled
    //         // These should only be production binary deps (including deps of deps), CLI deps, and their module graph
    //         // If a dep-of-dep needs to be external, add it here
    //         // For example, if something uses `bcrypt` but you don't have it as a dep, you can write
    //         // external: [...Object.keys(dependencies), 'bcrypt']
    //         external: Object.keys(dependencies),
    //       }
    //     : undefined,
    server: {
      headers: {
        // Don't cache the server response in dev mode
        "Cache-Control": "public, max-age=0",
      },
    },
    preview: {
      headers: {
        // Do cache the server response in preview (non-adapter production build)
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});

type MdxLiteral = string | number | boolean | null;
type EstreeNode = {
  type: string;
  [key: string]: unknown;
};

function recmaInjectVariables(variables: Record<string, MdxLiteral>) {
  return (tree: { body: EstreeNode[] }) => {
    tree.body.unshift({
      type: "VariableDeclaration",
      kind: "const",
      declarations: Object.entries(variables).map(([name, value]) => ({
        type: "VariableDeclarator",
        id: { type: "Identifier", name },
        init: {
          type: "Literal",
          value,
          raw: value === null ? "null" : JSON.stringify(value),
        },
      })),
    });
  };
}

// *** utils ***
/**
 * Function to identify duplicate dependencies and throw an error
 * @param {Object} devDependencies - List of development dependencies
 * @param {Object} dependencies - List of production dependencies
 */
function errorOnDuplicatesPkgDeps(
  devDependencies: PkgDep,
  dependencies: PkgDep,
) {
  let msg = "";
  // Create an array 'duplicateDeps' by filtering devDependencies.
  // If a dependency also exists in dependencies, it is considered a duplicate.
  const duplicateDeps = Object.keys(devDependencies).filter(
    (dep) => dependencies[dep],
  );
  // include any known qwik packages
  const qwikPkg = Object.keys(dependencies).filter((value) =>
    /qwik/i.test(value),
  );
  // any errors for missing "qwik-router-config"
  // [PLUGIN_ERROR]: Invalid module "@qwik-router-config" is not a valid package
  msg = `Move qwik packages ${qwikPkg.join(", ")} to devDependencies`;
  if (qwikPkg.length > 0) {
    throw new Error(msg);
  }
  // Format the error message with the duplicates list.
  // The `join` function is used to represent the elements of the 'duplicateDeps' array as a comma-separated string.
  msg = `
    Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both "devDependencies" and "dependencies".
    Please move the duplicated dependencies to "devDependencies" only and remove it from "dependencies"
  `;
  // Throw an error with the constructed message.
  if (duplicateDeps.length > 0) {
    throw new Error(msg);
  }
}
