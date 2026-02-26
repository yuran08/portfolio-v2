import type { Metadata } from "next";
import Link from "next/link";
import {
  LineItemContainer,
  LineItemHeading,
  LineItemOuterContainer,
  LineItemSubheading,
} from "@/components/blog/line-item";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: {
    absolute: "𝓎𝓊 𝓇𝒶𝓃 𝒷𝓁𝑜𝑔",
  },
};

export default async function Page() {
  const blogs = await getAllBlogPosts();
  const hasBlogs = blogs.length > 0;

  return (
    <div className="max-h-[100svh] w-full overflow-y-auto px-4 pb-28 pt-24 font-sans sm:px-6 sm:pb-32 sm:pt-32 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto w-full max-w-3xl">
        {hasBlogs ? (
          <LineItemOuterContainer>
            {blogs.map((blog) => (
              <LineItemContainer key={blog.slug}>
                <LineItemHeading>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="transition-colors hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {blog.title}
                  </Link>
                </LineItemHeading>
                <LineItemSubheading>{blog.excerpt}</LineItemSubheading>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {blog.publishedAt} · {blog.tags.join(" / ")}
                </p>
              </LineItemContainer>
            ))}
          </LineItemOuterContainer>
        ) : (
          <div className="rounded-xl border border-gray-200/80 bg-gray-50/80 px-6 py-8 text-center dark:border-gray-700/80 dark:bg-gray-900/40">
            <p className="text-base font-medium text-gray-700 dark:text-gray-200">
              No blog posts yet.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              New posts will appear here once they are published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
