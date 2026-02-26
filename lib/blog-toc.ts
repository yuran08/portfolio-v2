import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type BlogTocItem = {
  id: string;
  text: string;
  depth: 2 | 3;
};

function isTocDepth(depth: unknown): depth is BlogTocItem["depth"] {
  return depth === 2 || depth === 3;
}

export function extractTocFromMdx(source: string): BlogTocItem[] {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);
  const slugger = new GithubSlugger();
  const items: BlogTocItem[] = [];

  visit(tree, "heading", (node) => {
    const depth = "depth" in node ? node.depth : undefined;

    if (!isTocDepth(depth)) {
      return;
    }

    const text = toString(node).trim();

    if (!text) {
      return;
    }

    items.push({
      id: slugger.slug(text),
      text,
      depth,
    });
  });

  return items;
}
