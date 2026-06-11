import { component$ } from "@qwik.dev/core";
import {
  DocumentHeadTags,
  RouterOutlet,
  ServiceWorkerRegister,
  useLocation,
  useQwikRouter,
} from "@qwik.dev/router";

import rawIIFE from "./theme.js?raw";

import "./global.css";
import "virtual:uno.css";

export default component$(() => {
  useQwikRouter();
  const { url } = useLocation();

  return (
    <>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        <DocumentHeadTags />

        <link rel="canonical" href={url.href} />
        <script dangerouslySetInnerHTML={rawIIFE}></script>
        <ServiceWorkerRegister />
      </head>
      <body>
        <RouterOutlet />
      </body>
    </>
  );
});
