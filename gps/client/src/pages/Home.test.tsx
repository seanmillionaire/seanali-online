import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { saveDownloadSession, type DownloadDraft } from "../lib/downloadGate";
import Home from "./Home";

vi.mock("@/lib/trpc", () => ({ trpc: {
  cleanAnswer: { useMutation: () => ({ isPending: false }) },
  createClarityPrintout: { useMutation: () => ({ isPending: false }) },
} }));

const draft: DownloadDraft = {
  userName: "Alex", location: "London", startingPoint: "A fresh start",
  success: "More family time", cleanSuccess: "", selectedBenefits: ["family"],
  future: "Evenings with family", cleanFuture: "", whyNow: "Time matters", cleanWhyNow: "",
  role: "designer", otherRole: "", responsibility: "A clearer website", cleanResponsibility: "",
  weeklyResult: "Three user tests", cleanWeeklyResult: "", commitment: "solid",
  dreamScene: "family", dreamDetail: "", clarityPrintout: null,
};

function finalScreen(unlocked: boolean) {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
  saveDownloadSession(storage, draft, "4c620104-f166-421e-a12d-91f3211b7361", unlocked);
  vi.stubGlobal("window", {
    location: { href: "https://seanali.online/gps" },
    sessionStorage: storage, localStorage: storage,
    matchMedia: () => ({ matches: false }),
  });
  return renderToStaticMarkup(<Home />);
}

afterEach(() => vi.unstubAllGlobals());

describe("final screen", () => {
  it("shows the compass, attribution and clear plan while gating downloads", () => {
    const html = finalScreen(false);
    expect(html).toContain("Alex, this is your North Star.");
    expect(html).toContain('src="/assets/north-star-compass-sean-ali.png"');
    expect(html).toContain("Created by Sean Ali");
    expect(html).toContain("Your goal this week");
    expect(html).toContain("Three user tests");
    expect(html).toContain("Start here");
    expect(html).toContain("Evenings with family");
    expect(html).toContain("Time matters");
    expect(html).toContain("Take this feeling with you.");
    expect(html.indexOf("Evenings with family")).toBeLessThan(html.indexOf('id="gps-download-gate"'));
    expect(html).toContain("Unlock my downloads");
    expect(html).toContain('name="listname" value="awlist6946418"');
    expect(html).not.toContain('aria-label="Your downloads"');
    expect(html).not.toContain("Save SVG");
    expect(html).not.toContain("Dream Life Emblem");
    expect(html).toContain('id="final-section-plan" class="guided-final-section-body" aria-hidden="true"');
  });

  it("offers just PDF and compass image downloads after a restored signup", () => {
    const html = finalScreen(true);
    expect(html).toContain("Your downloads are ready.");
    expect(html).toContain("Save my plan as PDF");
    expect(html).toContain("Save compass image");
    expect(html).not.toContain("gps-downloads-locked");
    expect(html).not.toContain("Unlock my downloads");
  });
});
