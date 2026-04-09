import { component$ } from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";

type BlogModule = typeof import("foo.mdx");

const blogModules = import.meta.glob("../../../../docs/blogs/*.mdx", {
	eager: true,
}) as Record<string, BlogModule>;

export default component$(() => {
	const { params } = useLocation();
	const blog = blogModules[`../../../../docs/blogs/${params.paths}.mdx`];

	if (!blog) {
		return <pre>Blog not found: {params.paths}</pre>;
	}

	const BlogPost = blog.default;

	return (
		<article>
			<BlogPost />
		</article>
	);
});
