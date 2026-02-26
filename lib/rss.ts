import type { BlogPostSummary } from "@/lib/blog";

export const RSS_SITE_TITLE = "Yuran Blog";
export const RSS_SITE_DESCRIPTION =
  "Personal blog about Next.js, frontend engineering, and product building.";
export const RSS_LANGUAGE = "en";

type BuildRssXmlOptions = {
  posts: BlogPostSummary[];
  siteUrl: string;
  rssUrl: string;
  siteTitle?: string;
  siteDescription?: string;
  language?: string;
  now?: Date;
};

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildRssXml({
  posts,
  siteUrl,
  rssUrl,
  siteTitle = RSS_SITE_TITLE,
  siteDescription = RSS_SITE_DESCRIPTION,
  language = RSS_LANGUAGE,
  now = new Date(),
}: BuildRssXmlOptions) {
  const lastBuildDate = posts[0]
    ? new Date(posts[0].publishedAt).toUTCString()
    : now.toUTCString();

  const items = posts
    .map((post) => {
      const link = new URL(`/blog/${post.slug}`, siteUrl).toString();
      const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");

      return `<item>
  <title>${escapeXml(post.title)}</title>
  <description>${escapeXml(post.excerpt)}</description>
  <link>${link}</link>
  <guid isPermaLink="true">${link}</guid>
  <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
  ${categories}
</item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(siteTitle)}</title>
  <description>${escapeXml(siteDescription)}</description>
  <link>${siteUrl}</link>
  <atom:link href="${rssUrl}" rel="self" type="application/rss+xml" />
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
  <language>${language}</language>
  ${items}
</channel>
</rss>`;
}
