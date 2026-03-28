import { describe, expect, it } from "vitest";
import { buildResilienceLookupUrls, crossRefMicroclimateToResilience } from "./resilienceIndex.js";

describe("buildResilienceLookupUrls", () => {
  it("includes EIA state URL for AZ", () => {
    const u = buildResilienceLookupUrls({ state: "AZ", lat: 32.2, lng: -110.9 });
    expect(u.eiaState).toContain("arizona");
    expect(u.mapsPin).toContain("32.2");
  });
});

describe("crossRefMicroclimateToResilience", () => {
  it("returns pending copy without bundle", () => {
    const c = crossRefMicroclimateToResilience(null);
    expect(c.bullets[0]).toMatch(/atlas pack/i);
  });
});
