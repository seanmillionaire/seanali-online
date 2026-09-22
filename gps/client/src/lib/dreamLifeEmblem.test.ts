import { describe, expect, it } from "vitest";
import { buildDreamLifeEmblemSpec, type DreamLifeEmblemInput } from "./dreamLifeEmblem";
const base: DreamLifeEmblemInput = { success: "", future: "", whyNow: "", selectedBenefits: [], dreamScene: "celebration", dreamDetail: "" };
describe("Dream Life Emblem", () => {
  it("represents a family's freedom without including the work vehicle", () => {
    const input = { ...base, success: "Freedom to choose my time", future: "Freedom with my family", selectedBenefits: ["Give my family more"], dreamDetail: "The waves at the beach" };
    const spec = buildDreamLifeEmblemSpec(input);
    expect(spec.primaryTheme).toBe("freedom");
    expect(spec.secondaryThemes).toContain("family");
    expect(spec.scene).toBe("ocean");
    expect(spec.anchor).toBe("Freedom For Family");
    expect(buildDreamLifeEmblemSpec({ ...input, role: "health coach", responsibility: "money", nearTermResult: "travel", commitment: "strong" } as DreamLifeEmblemInput)).toEqual(spec);
  });
  it("uses benefit labels rather than misleading historical IDs", () => {
    expect(buildDreamLifeEmblemSpec({ ...base, selectedBenefits: ["See more of the world"] }).primaryTheme).toBe("travel");
    expect(buildDreamLifeEmblemSpec({ ...base, selectedBenefits: ["More respect"] }).primaryTheme).toBe("purpose");
  });
  it("does not match fragments inside unrelated words", () => {
    const result = buildDreamLifeEmblemSpec({ ...base, success: "I want a carefree outfit and a peaceful life" });
    expect(result.primaryTheme).toBe("peace");
    expect(result.secondaryThemes).toEqual([]);
  });
  it("handles sparse answers without inventing supporting themes", () => {
    expect(buildDreamLifeEmblemSpec(base).secondaryThemes).toEqual([]);
    expect(buildDreamLifeEmblemSpec({ ...base, dreamScene: "family" }).scene).toBe("home");
    expect(buildDreamLifeEmblemSpec({ ...base, dreamScene: "calm" }).primaryTheme).toBe("peace");
  });
  it("is stable, bounded, and updates with dream details", () => {
    const input = { ...base, success: "Freedom family health money peace growth purpose travel" };
    const a = buildDreamLifeEmblemSpec(input);
    expect(a).toEqual(buildDreamLifeEmblemSpec(input));
    expect(new Set([a.primaryTheme, ...a.secondaryThemes]).size).toBe(3);
    expect(a.anchor.split(" ").length).toBeLessThanOrEqual(4);
    expect(buildDreamLifeEmblemSpec({ ...input, dreamDetail: "Looking at the mountain" }).scene).toBe("nature");
  });
});
