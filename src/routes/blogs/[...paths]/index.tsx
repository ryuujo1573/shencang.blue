import { component$ } from "@qwik.dev/core";
import { type StaticGenerateHandler, useLocation } from "@qwik.dev/router";

type BlogModule = typeof import("foo.mdx");

const BLOG_PREFIX = "../../../../docs/blogs/";
const BLOG_SUFFIX = ".mdx";

const blogModules = Object.fromEntries(
  Object.entries(
    import.meta.glob("../../../../docs/blogs/**/*.mdx", {
      eager: true,
    }) as Record<string, BlogModule>,
  ).map(([modulePath, module]) => [
    modulePath.slice(BLOG_PREFIX.length, -BLOG_SUFFIX.length),
    module,
  ]),
);

const blogMeta = Object.entries(blogModules).map(([blogPath, module]) => {
  const meta = module as unknown as {
    frontmatter: Record<string, unknown>;
    headings: Array<{ text: string; id: string; level: number }>;
  };

  if (!meta) {
    return { title: blogPath, date: "unknown date", path: blogPath };
  }

  const title = String(
    meta?.frontmatter?.title ||
      meta?.headings?.find((h) => h.level === 1)?.text ||
      blogPath,
  );

  const date = new Date(
    meta?.frontmatter?.date as string | number,
  ).toLocaleDateString();

  return { title, date, path: blogPath };
});

export const onStaticGenerate: StaticGenerateHandler = async () => {
  console.log("Generating static paths for blogs... %o", blogMeta);

  return {
    params: blogMeta.map(({ path }) => ({ paths: path })),
  };
};

export default component$(() => {
  const { params } = useLocation();
  const subpath = params.paths;
  const blog = blogModules[subpath];

  if (!subpath) {
    return (
      <main>
        <h2>Blogs</h2>
        <ul>
          {blogMeta.map(({ title, date, path }) => {
            return (
              <li key={path}>
                <a
                  href={`/blogs/${path}`}
                  class="flex gap-1 items-center after:i-carbon:link after:inline-block after:content-['']"
                >
                  <code>{date}</code>
                  {title}
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
