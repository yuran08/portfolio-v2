import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { SKIP, visit } from "unist-util-visit";

export type BlogReadingMetrics = {
  wordCount: number;
  readingMinutes: number;
};

const CHARS_PER_MINUTE = 300;

function normalizeWhitespace(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function countNonWhitespaceChars(text: string) {
  return text.replace(/\s+/g, "").length;
}

export function extractReadingMetricsFromMdx(source: string): BlogReadingMetrics {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);
  const segments: string[] = [];

  visit(tree, (node) => {
    if (node.type === "code") {
      return SKIP;
    }

    if (node.type === "text" || node.type === "inlineCode") {
      if ("value" in node && typeof node.value === "string") {
        segments.push(node.value);
      }
    }
  });

  const normalized = normalizeWhitespace(segments.join(" "));
  const wordCount = countNonWhitespaceChars(normalized);
  const readingMinutes = Math.max(1, Math.ceil(wordCount / CHARS_PER_MINUTE));

  return {
    wordCount,
    readingMinutes,
  };
}
