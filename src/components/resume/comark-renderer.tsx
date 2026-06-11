import type { JSXOutput } from "@qwik.dev/core";
import { component$ } from "@qwik.dev/core";
import type { ComarkElement, ComarkNode } from "comark";

// ---------------------------------------------------------------------------
// Helper: extract text content recursively from a node.
// ---------------------------------------------------------------------------
function extractText(node: ComarkNode): string {
  if (typeof node === "string") return node;
  if (!Array.isArray(node)) return "";
  return (node.slice(2) as ComarkNode[]).map(extractText).join("");
}

// ---------------------------------------------------------------------------
// Recursive render helpers (inlined, not component$).
// JSX returned here is inlined into whichever component$ calls renderNodes.
// ---------------------------------------------------------------------------
function renderNodes(nodes: ComarkNode[]): JSXOutput[] {
  return nodes.map((node, i) => renderNode(node, i));
}

function renderNode(node: ComarkNode, key?: number): JSXOutput {
  // Text node
  if (typeof node === "string") return node;

  // Not a valid element
  if (!Array.isArray(node)) return null;

  const tag = node[0];
  const attrs = node[1] as Record<string, unknown>;
  const children = node.slice(2) as ComarkNode[];

  // Comment node (tag is null)
  if (tag === null) return null;

  switch (tag) {
    // ------------------------------------------------------------------ //
    // Resume structural components                                         //
    // ------------------------------------------------------------------ //

    case "resume-layout":
      return (
        <div key={key} class="resume-layout">
          {renderNodes(children)}
        </div>
      );

    case "resume-main-col":
      return (
        <div key={key} class="resume-main">
          {renderNodes(children)}
        </div>
      );

    case "resume-side-col":
      return (
        <aside key={key} class="resume-side">
          {renderNodes(children)}
        </aside>
      );

    case "resume-section": {
      const title = String(attrs.title ?? "");
      const isSide = attrs.level === "side";
      return (
        <section key={key} class="r-section">
          {isSide ? (
            <h3 class="r-section-title r-section-title--side">{title}</h3>
          ) : (
            <h2 class="r-section-title">{title}</h2>
          )}
          <div class="r-section-body">{renderNodes(children)}</div>
        </section>
      );
    }

    case "resume-prose":
      return (
        <div key={key} class="resume-prose">
          {renderNodes(children)}
        </div>
      );

    case "resume-stack":
      return (
        <div key={key} class="resume-stack">
          {renderNodes(children)}
        </div>
      );

    // ------------------------------------------------------------------ //
    // Resume leaf components                                               //
    // ------------------------------------------------------------------ //

    case "resume-contacts": {
      const items = (attrs.items ?? []) as Array<{
        icon: string;
        label: string;
        value: string;
        href?: string;
      }>;
      return (
        <ul key={key} class="r-contact-line">
          {items.map((it, i) => (
            <li key={i} class="r-contact-line-item">
              <span class={`r-contact-icon ${it.icon}`} aria-hidden="true" />
              {it.href ? (
                <a href={it.href}>{it.value}</a>
              ) : (
                <span>{it.value}</span>
              )}
            </li>
          ))}
        </ul>
      );
    }

    case "resume-experience": {
      const isProject = !attrs.start && !attrs.end;
      const ulNode = children.find(
        (c) => Array.isArray(c) && (c as ComarkElement)[0] === "ul",
      ) as ComarkElement | undefined;
      const bulletItems = ulNode ? (ulNode.slice(2) as ComarkNode[]) : [];
      const bullets =
        bulletItems.length > 0 ? (
          <ul class="r-exp-bullets">
            {bulletItems.map((item, i) => {
              if (!Array.isArray(item)) return null;
              const li = item as ComarkElement;
              return (
                <li key={i}>{renderNodes(li.slice(2) as ComarkNode[])}</li>
              );
            })}
          </ul>
        ) : null;

      if (isProject) {
        return (
          <article key={key} class="r-exp r-exp--project">
            <div class="r-exp-project-header">
              <h4 class="r-exp-title">{String(attrs.title ?? "")}</h4>
              {!!attrs.subtitle && (
                <span class="r-exp-project-tag">{String(attrs.subtitle)}</span>
              )}
            </div>
            <div class="r-exp-body">{bullets}</div>
          </article>
        );
      }

      return (
        <article key={key} class="r-exp">
          <header class="r-exp-meta">
            <p class="r-exp-date">
              {String(attrs.start ?? "")} — {String(attrs.end ?? "")}
            </p>
            {!!attrs.location && (
              <p class="r-exp-location">{String(attrs.location)}</p>
            )}
          </header>
          <div class="r-exp-body">
            <h4 class="r-exp-title">{String(attrs.title ?? "")}</h4>
            {!!attrs.subtitle && (
              <p class="r-exp-subtitle">{String(attrs.subtitle)}</p>
            )}
            {bullets}
          </div>
        </article>
      );
    }

    case "resume-info-list": {
      const items = (attrs.items ?? []) as Array<{
        label: string;
        value: string;
      }>;
      return (
        <dl key={key} class="r-info-list">
          {items.map((it, i) => (
            <div key={i} class="r-info-row">
              <dt>{it.label}</dt>
              <dd>{it.value}</dd>
            </div>
          ))}
        </dl>
      );
    }

    case "resume-gauge-list": {
      const items = (attrs.items ?? []) as Array<{
        name: string;
        level: number;
      }>;
      const max = 5;
      return (
        <div key={key} class="resume-gauge-list">
          {items.map((it, i) => {
            const dots = Array.from({ length: max }, (_, j) => j < it.level);
            return (
              <div key={i} class="r-gauge">
                <span class="r-gauge-name">{it.name}</span>
                <span
                  class="r-gauge-track"
                  role="img"
                  aria-label={`${it.name} 熟练度 ${it.level} / ${max}`}
                >
                  {dots.map((on, j) => (
                    <span
                      key={j}
                      class={["r-gauge-dot", on && "r-gauge-dot--on"]}
                      aria-hidden="true"
                    />
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    case "resume-tags": {
      const items = (attrs.items ?? []) as string[];
      return (
        <ul key={key} class="resume-tags">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    // ------------------------------------------------------------------ //
    // Standard HTML / Markdown elements                                   //
    // ------------------------------------------------------------------ //

    case "p":
      return <p key={key}>{renderNodes(children)}</p>;
    case "strong":
      return <strong key={key}>{renderNodes(children)}</strong>;
    case "em":
      return <em key={key}>{renderNodes(children)}</em>;
    case "a":
      return (
        <a key={key} href={String(attrs.href ?? "")}>
          {renderNodes(children)}
        </a>
      );
    case "ul":
      return <ul key={key}>{renderNodes(children)}</ul>;
    case "ol":
      return <ol key={key}>{renderNodes(children)}</ol>;
    case "li":
      return <li key={key}>{renderNodes(children)}</li>;
    case "code":
      return <code key={key}>{renderNodes(children)}</code>;
    case "pre":
      return <pre key={key}>{renderNodes(children)}</pre>;
    case "h1":
      return <h1 key={key}>{renderNodes(children)}</h1>;
    case "h2":
      return <h2 key={key}>{renderNodes(children)}</h2>;
    case "h3":
      return <h3 key={key}>{renderNodes(children)}</h3>;
    case "h4":
      return <h4 key={key}>{renderNodes(children)}</h4>;
    case "h5":
      return <h5 key={key}>{renderNodes(children)}</h5>;
    case "h6":
      return <h6 key={key}>{renderNodes(children)}</h6>;
    case "hr":
      return <hr key={key} />;
    case "br":
      return <br key={key} />;
    case "blockquote":
      return <blockquote key={key}>{renderNodes(children)}</blockquote>;
    case "table":
      return <table key={key}>{renderNodes(children)}</table>;
    case "thead":
      return <thead key={key}>{renderNodes(children)}</thead>;
    case "tbody":
      return <tbody key={key}>{renderNodes(children)}</tbody>;
    case "tr":
      return <tr key={key}>{renderNodes(children)}</tr>;
    case "th":
      return <th key={key}>{renderNodes(children)}</th>;
    case "td":
      return <td key={key}>{renderNodes(children)}</td>;
    case "span":
      return (
        <span key={key} class={String(attrs.class ?? "")}>
          {renderNodes(children)}
        </span>
      );
    case "img":
      return (
        <img
          key={key}
          width={attrs.width as number | undefined}
          height={attrs.height as number | undefined}
          src={String(attrs.src ?? "")}
          alt={String(attrs.alt ?? "")}
        />
      );

    default:
      return <>{renderNodes(children)}</>;
  }
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export type { ComarkNode };

export const ComarkRenderer = component$<{ nodes: ComarkNode[] }>(
  ({ nodes }) => {
    return <>{renderNodes(nodes)}</>;
  },
);

export { extractText };
