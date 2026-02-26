import { describe, expect, it } from "vitest";
import { extractReadingMetricsFromMdx } from "@/lib/blog-reading";

describe("extractReadingMetricsFromMdx", () => {
  it("正文标题、段落、列表会计入字数", () => {
    const source = `
# A
## B
ccc ddd
- ee
- ff
`;

    expect(extractReadingMetricsFromMdx(source)).toEqual({
      wordCount: 12,
      readingMinutes: 1,
    });
  });

  it("围栏代码块内容不计入字数", () => {
    const source = `
## t
ab
\`\`\`ts
1234567890
\`\`\`
cd
`;

    expect(extractReadingMetricsFromMdx(source)).toEqual({
      wordCount: 5,
      readingMinutes: 1,
    });
  });

  it("inline code 内容计入字数", () => {
    const source = "X `foo` Y";

    expect(extractReadingMetricsFromMdx(source)).toEqual({
      wordCount: 5,
      readingMinutes: 1,
    });
  });

  it("阅读时间按 ceil 规则进位", () => {
    const source = "a".repeat(301);

    expect(extractReadingMetricsFromMdx(source)).toEqual({
      wordCount: 301,
      readingMinutes: 2,
    });
  });

  it("空或极短内容至少返回 1 分钟", () => {
    const source = `
\`\`\`ts
const onlyCode = true
\`\`\`
`;

    expect(extractReadingMetricsFromMdx(source)).toEqual({
      wordCount: 0,
      readingMinutes: 1,
    });
  });

  it("中英混合文本按去空白字符统计", () => {
    const source = "你好 world 123";

    expect(extractReadingMetricsFromMdx(source)).toEqual({
      wordCount: 10,
      readingMinutes: 1,
    });
  });
});
