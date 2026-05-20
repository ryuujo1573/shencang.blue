import { component$ } from "@qwik.dev/core";
import { type StaticGenerateHandler, useLocation } from "@qwik.dev/router";

type BlogModule = typeof import("foo.mdx");

const BLOG_PREFIX = "../../../../docs/blogs/";
const BLOG_SUFFIX = ".mdx";

const blogModules = import.meta.glob("../../../../docs/blogs/**/*.mdx", {
  eager: true,
}) as Record<string, BlogModule>;

const blogPaths = Object.keys(blogModules).map((modulePath) =>
  modulePath.slice(BLOG_PREFIX.length, -BLOG_SUFFIX.length),
);

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: blogPaths.concat(["/"]).map((paths) => ({ paths })),
  };
};

export default component$(() => {
  const { params } = useLocation();
  const subpath = params.paths;
  const blog = blogModules[`${BLOG_PREFIX}${subpath}${BLOG_SUFFIX}`];

  if (!subpath) {
    return (
      <main>
        <h2>Blogs</h2>
        <ul>
          {blogPaths.map((blogPath) => {
            const meta = blogModules[
              `${BLOG_PREFIX}${blogPath}${BLOG_SUFFIX}`
            ] as unknown as {
              frontmatter: Record<string, unknown>;
              headings: Array<{ text: string; id: string; level: number }>;
            };

            const title = String(
              meta.frontmatter.title ||
                meta.headings.find((h) => h.level == 1)?.text ||
                blogPath,
            );

            const date = new Date(meta.frontmatter.date as string | number);

            return (
              <li key={blogPath}>
                <a href={`/blogs/${blogPath}`} class="flex gap-1 items-center">
                  <code>{date.toLocaleDateString()}</code>
                  {title}
                  <object class="i-carbon:link" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      </main>
    );
  }

  if (!blog) {
    return <pre>Blog not found: {subpath}</pre>;
  }

  const BlogPost = blog.default;

  return (
    <article>
      <BlogPost />
    </article>
  );
});
