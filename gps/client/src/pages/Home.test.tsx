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

function finalScreen(unlocked: boolean, answers: Partial<DownloadDraft> = {}) {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
  saveDownloadSession(storage, { ...draft, ...answers }, "4c620104-f166-421e-a12d-91f3211b7361", unlocked);
  vi.stubGlobal("window", {
    location: { href: "https://seanali.online/gps" },
    sessionStorage: storage, localStorage: storage,
    matchMedia: () => ({ matches: false }),
  });
  return renderToStaticMarkup(<Home />);
}

afterEach(() => vi.unstubAllGlobals());

describe("welcome screen", () => {
  it("offers three clear starting actions", () => {
    vi.stubGlobal("window", {
      location: { href: "https://seanali.online/gps" },
      sessionStorage: { getItem: () => null },
      localStorage: { getItem: () => null },
      matchMedia: () => ({ matches: false }),
    });
    const html = renderToStaticMarkup(<Home />);
    const choices = html.split('class="quiz-start"')[1].split("</fieldset>")[0];
    expect(choices.match(/<button /g)).toHaveLength(3);
    for (const action of ["Find my first step", "Find my direction", "Start my fresh chapter"]) {
      expect(choices).toContain(action);
    }
    expect(html).toContain('aria-label="Need a hand?" title="Need a hand?"');
    expect(html).not.toContain("Discover What Your Dream Life Looks Like");
    expect(html).toContain("Use your Dream Life GPS to get clear on what matters most");
    expect(html).toContain('class="simple-brand"');
    expect(html).not.toContain('class="guided-kicker"');
  });
});

describe("final screen", () => {
  it("keeps the sidebar footer to a simple creator credit", () => {
    const sidebar = finalScreen(false).split("</aside>")[0];
    expect(sidebar).toContain(">Created by Sean Ali</p>");
    expect(sidebar).not.toContain("YOUR MAP SO FAR");
    expect(sidebar).not.toContain("Your picture starts here");
    expect(sidebar).not.toContain("I'm here to help you find your next step.");
    expect(sidebar).not.toContain("More family time");
  });

  it("shows the complete summary and downloads without email signup", () => {
    const html = finalScreen(false);
    for (const text of ["Alex, your tools are ready.", "Evenings with family", "Time matters", "Look at them every day.", "Print / save my summary", "Download my North Star", "with or without email signup", "Want emails from Sean? (Optional)"]) expect(html).toContain(text);
    expect(html).toContain('name="listname" value="awlist6946418"');
    expect(html).toContain('aria-label="Your downloads"');
    expect(html).not.toContain("gps-downloads-locked");
    expect(html).not.toContain("Add more detail");
    expect(html).not.toContain("Work with Sean");
    expect(html).not.toContain("Three user tests");
    expect(html).not.toContain("A clearer website");
    expect(html).not.toContain("focus blocks");
    expect(html).not.toContain('aria-hidden="true"><section class="guided-final-plan"');
  });
  it.each([
    { success: "Enjoy my retirement", future: "Read in my garden", whyNow: "This time is mine", personalStep: "Choose a book" },
    { success: "Feel close to my family", future: "Share a quiet meal", whyNow: "Connection matters", personalStep: "Call my sister" },
    { success: "Learn to paint", future: "Make time for a hobby", whyNow: "I enjoy creating", personalStep: "" },
  ])("keeps personal answers without adding a job or a work schedule: $success", answers => {
    const html = finalScreen(false, { ...answers, cleanSuccess: "Run profitable ads", cleanFuture: "Make more sales" });
    for (const value of [answers.success, answers.future, answers.whyNow]) expect(html).toContain(value);
    expect(html).not.toContain("Run profitable ads");
    expect(html).not.toContain("Make more sales");
    expect(html).not.toContain("focused hours");
    if (answers.personalStep) expect(html).toContain(answers.personalStep);
    else expect(html).not.toContain('data-summary="step"');
  });
  it("preserves the summary after returning from optional signup", () => {
    const html = finalScreen(true);
    expect(html).toContain("Your email signup is complete.");
    expect(html).toContain("Print / save my summary");
    expect(html).toContain("Download my North Star");
    expect(html).not.toContain('type="email"');
  });
});
