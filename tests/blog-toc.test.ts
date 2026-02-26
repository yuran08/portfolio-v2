import { describe, expect, it } from "vitest";
import { extractTocFromMdx } from "@/lib/blog-toc";

describe("extractTocFromMdx", () => {
  it("仅提取 h2 和 h3", () => {
    const source = `
# Title
## Section A
### Section B
#### Section C
`;

    expect(extractTocFromMdx(source)).toEqual([
      { id: "section-a", text: "Section A", depth: 2 },
      { id: "section-b", text: "Section B", depth: 3 },
    ]);
  });

  it("重复标题会自动生成去重 slug", () => {
    const source = `
## Repeated
## Repeated
### Repeated
`;

    expect(extractTocFromMdx(source)).toEqual([
      { id: "repeated", text: "Repeated", depth: 2 },
      { id: "repeated-1", text: "Repeated", depth: 2 },
      { id: "repeated-2", text: "Repeated", depth: 3 },
    ]);
  });

  it("标题中的 inline code 与强调文本可正确提取", () => {
    const source = `
## API \`start()\` *Guide*
`;

    expect(extractTocFromMdx(source)).toEqual([
      { id: "api-start-guide", text: "API start() Guide", depth: 2 },
    ]);
  });

  it("代码块内的井号不会被识别为标题", () => {
    const source = `
\`\`\`md
## Not a real heading
\`\`\`

## Real heading
`;

    expect(extractTocFromMdx(source)).toEqual([
      { id: "real-heading", text: "Real heading", depth: 2 },
    ]);
  });
});
