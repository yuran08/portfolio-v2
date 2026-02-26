import { describe, expect, it } from "vitest";
import { parseEnv } from "@/lib/env";

function makeEnv(overrides: Partial<NodeJS.ProcessEnv> = {}): NodeJS.ProcessEnv {
  return {
    NODE_ENV: "test",
    ...overrides,
  };
}

describe("parseEnv", () => {
  it("accepts missing optional values", () => {
    expect(parseEnv(makeEnv())).toEqual({});
  });

  it("accepts valid URL and secrets", () => {
    expect(
      parseEnv(
        makeEnv({
          NEXT_PUBLIC_SITE_URL: "https://example.com",
          BLOG_DRAFT_SECRET: "0123456789abcdef",
          BLOG_REVALIDATE_SECRET: "fedcba9876543210",
        }),
      ),
    ).toEqual({
      NEXT_PUBLIC_SITE_URL: "https://example.com",
      BLOG_DRAFT_SECRET: "0123456789abcdef",
      BLOG_REVALIDATE_SECRET: "fedcba9876543210",
    });
  });

  it("throws on invalid URL", () => {
    expect(() =>
      parseEnv(
        makeEnv({
          NEXT_PUBLIC_SITE_URL: "invalid-url",
        }),
      ),
    ).toThrowError("NEXT_PUBLIC_SITE_URL");
  });

  it("throws on short secrets", () => {
    expect(() =>
      parseEnv(
        makeEnv({
          BLOG_DRAFT_SECRET: "short",
        }),
      ),
    ).toThrowError("BLOG_DRAFT_SECRET");
  });
});
