import { describe, expect, it } from "vitest";
import { buildRssXml, escapeXml } from "@/lib/rss";

describe("escapeXml", () => {
  it("escapes xml reserved characters", () => {
    expect(escapeXml(`Tom & "Jerry" <tag> 'ok'`)).toBe(
      "Tom &amp; &quot;Jerry&quot; &lt;tag&gt; &apos;ok&apos;",
    );
  });
});

describe("buildRssXml", () => {
  it("builds deterministic rss output", () => {
    const xml = buildRssXml({
      siteUrl: "http://localhost:3000/",
      rssUrl: "http://localhost:3000/rss.xml",
      now: new Date("2026-02-16T00:00:00.000Z"),
      posts: [
        {
          slug: "hello-world",
          title: "Hello & World",
          excerpt: "A <great> post",
          publishedAt: "2026-02-15",
          tags: ["nextjs", "rss"],
        },
      ],
    });

    expect(xml).toContain("<title>Hello &amp; World</title>");
    expect(xml).toContain("<description>A &lt;great&gt; post</description>");
    expect(xml).toContain("<category>nextjs</category><category>rss</category>");
    expect(xml).toContain(
      "<guid isPermaLink=\"true\">http://localhost:3000/blog/hello-world</guid>",
    );
    expect(xml).toContain("<lastBuildDate>Sun, 15 Feb 2026 00:00:00 GMT</lastBuildDate>");
  });
});
