import { describe, expect, it } from "vitest";
import { humanizeZillowProviderMessage, readableApiError, readableError } from "./errorMessage.js";

describe("readableError", () => {
  it("handles Error and nested objects", () => {
    expect(readableError(new Error("boom"), "x")).toBe("boom");
    expect(readableError({ message: "nested" })).toBe("nested");
  });
});

describe("humanizeZillowProviderMessage", () => {
  it("maps auth failures to setup guidance", () => {
    const h = humanizeZillowProviderMessage("Invalid API key");
    expect(h).toContain("ZILLOW_API_KEY");
  });

  it("passes through unrelated text", () => {
    expect(humanizeZillowProviderMessage("Unknown town")).toBe("Unknown town");
  });
});

describe("readableApiError", () => {
  it("reads axios-style response body", () => {
    const e = { response: { data: { error: "rate limit exceeded" } } };
    expect(readableApiError(e)).toContain("Too many requests");
  });
});
