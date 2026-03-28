import { describe, expect, it } from "vitest";
import { locationSearchFallbacks } from "./searchFallbacks.js";

describe("locationSearchFallbacks", () => {
  it("dedupes and includes comma and space variants for City, ST", () => {
    const r = locationSearchFallbacks({ searchQuery: "Santa Fe, NM", label: "Santa Fe, NM" });
    expect(r[0]).toBe("Santa Fe, NM");
    expect(r).toContain("Santa Fe NM");
    expect(r.filter((x) => x === "Santa Fe, NM").length).toBe(1);
  });

  it("returns empty for missing loc", () => {
    expect(locationSearchFallbacks(null)).toEqual([]);
    expect(locationSearchFallbacks(undefined)).toEqual([]);
  });

  it("uses label when different from searchQuery", () => {
    const r = locationSearchFallbacks({ searchQuery: "Phoenix, AZ", label: "Phoenix metro" });
    expect(r).toContain("Phoenix, AZ");
    expect(r).toContain("Phoenix metro");
    expect(r).toContain("Phoenix AZ");
  });
});
