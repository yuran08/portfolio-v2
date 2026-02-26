import { describe, expect, it } from "vitest";
import { safeEqual } from "@/lib/security";

describe("safeEqual", () => {
  it("returns true for equal strings", () => {
    expect(safeEqual("same-secret-value", "same-secret-value")).toBe(true);
  });

  it("returns false for different strings", () => {
    expect(safeEqual("same-secret-value", "same-secret-valuE")).toBe(false);
    expect(safeEqual("short", "shorter")).toBe(false);
  });

  it("returns false for nullish inputs", () => {
    expect(safeEqual(null, "secret")).toBe(false);
    expect(safeEqual(undefined, "secret")).toBe(false);
    expect(safeEqual("secret", null)).toBe(false);
  });
});
