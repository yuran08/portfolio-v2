import { getAllBlogPosts } from "@/lib/blog";
import { buildRssXml } from "@/lib/rss";
import { toAbsoluteUrl } from "@/lib/site";

// Route segment config must use a statically analyzable literal.
export const revalidate = 3600;

export async function GET() {
  const posts = await getAllBlogPosts();
  const rss = buildRssXml({
    posts,
    siteUrl: toAbsoluteUrl("/"),
    rssUrl: toAbsoluteUrl("/rss.xml"),
  });

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
