import { describe, expect, it } from "vitest";
import { shouldAutoDemoFromError } from "./demoFallback.js";

describe("shouldAutoDemoFromError", () => {
  it("returns true for NO_BACKEND", () => {
    const e = new Error("x");
    e.code = "NO_BACKEND";
    expect(shouldAutoDemoFromError(e)).toBe(true);
  });

  it("returns true for NO_KEY in body", () => {
    const e = new Error("Missing key");
    e.status = 503;
    e.response = { status: 503, data: { code: "NO_KEY", error: "Missing" } };
    expect(shouldAutoDemoFromError(e)).toBe(true);
  });

  it("returns false for unrelated errors", () => {
    expect(shouldAutoDemoFromError(new Error("random"))).toBe(false);
  });
});
