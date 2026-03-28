import { describe, expect, it } from "vitest";
import { buildResilienceLookupUrls, crossRefMicroclimateToResilience } from "./resilienceIndex.js";

describe("buildResilienceLookupUrls", () => {
  it("includes EIA state URL for AZ", () => {
    const u = buildResilienceLookupUrls({ state: "AZ", lat: 32.2, lng: -110.9 });
    expect(u.eiaState).toContain("arizona");
    expect(u.mapsPin).toContain("32.2");
  });

  it("falls back maps search to United States when label and coords are missing", () => {
    const u = buildResilienceLookupUrls({});
    expect(u.mapsPin).toContain("query=United%20States");
    expect(u.mapsPin).not.toContain("undefined");
  });

  it("uses label for maps search when coords are not finite", () => {
    const u = buildResilienceLookupUrls({ label: "Phoenix, AZ", lat: NaN, lng: 0 });
    expect(u.mapsPin).toContain(encodeURIComponent("Phoenix, AZ"));
  });
});

describe("crossRefMicroclimateToResilience", () => {
  it("returns pending copy without bundle", () => {
    const c = crossRefMicroclimateToResilience(null);
    expect(c.bullets[0]).toMatch(/atlas pack/i);
  });
});
