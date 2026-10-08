import { beforeEach, describe, expect, it } from "vitest";
import { clearDownloadSession, downloadSessionKey, readDownloadSession, saveDownloadSession, type DownloadDraft } from "./downloadGate";

const token = "4c620104-f166-421e-a12d-91f3211b7361";
const now = 1_700_000_000_000;
const draft: DownloadDraft = {
  userName: "Alex", location: "London", startingPoint: "A fresh start",
  success: "More family time", cleanSuccess: "More family time.", selectedBenefits: ["family"],
  future: "Present with my people", cleanFuture: "", whyNow: "Time matters", cleanWhyNow: "",
  role: "designer", otherRole: "", responsibility: "A clearer website", cleanResponsibility: "",
  weeklyResult: "Three user tests", cleanWeeklyResult: "", commitment: "solid",
  dreamScene: "family", dreamDetail: "A quiet meal together", clarityPrintout: null,
};
const values = new Map<string, string>();
const storage = {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => { values.set(key, value); },
  removeItem: (key: string) => { values.delete(key); },
};

describe("GPS email download gate", () => {
  beforeEach(() => values.clear());
  it("does not unlock from a return URL with no submitted form", () => {
    expect(readDownloadSession(storage, `https://seanali.online/gps?gps_signup=${token}`, now)).toBeNull();
  });
  it("preserves the finished map but stays locked if signup fails or the user goes back", () => {
    saveDownloadSession(storage, draft, token, false, now);
    const result = readDownloadSession(storage, "https://seanali.online/gps", now);
    expect(result?.draft).toEqual(draft);
    expect(result?.unlocked).toBe(false);
    expect(readDownloadSession(storage, "https://seanali.online/gps?gps_signup=wrong", now)?.unlocked).toBe(false);
  });
  it("unlocks only on a matching return and retains access after refreshing", () => {
    saveDownloadSession(storage, draft, token, false, now);
    const returned = readDownloadSession(storage, `https://seanali.online/gps?gps_signup=${token}`, now);
    expect(returned?.returned).toBe(true);
    expect(returned?.unlocked).toBe(true);
    expect(returned?.draft).toEqual(draft);
    saveDownloadSession(storage, returned!.draft, token, true, now);
    expect(readDownloadSession(storage, "https://seanali.online/gps", now)?.unlocked).toBe(true);
  });
  it("rejects expired, corrupt, or incomplete drafts", () => {
    saveDownloadSession(storage, draft, token, false, now);
    expect(readDownloadSession(storage, `https://seanali.online/gps?gps_signup=${token}`, now + 86_400_001)).toBeNull();
    storage.setItem(downloadSessionKey, "{broken");
    expect(readDownloadSession(storage, "https://seanali.online/gps", now)).toBeNull();
    expect(() => saveDownloadSession(storage, { ...draft, role: null } as unknown as DownloadDraft, token, false, now)).toThrow();
  });
  it("does not store an email address and clears access on start over", () => {
    saveDownloadSession(storage, { ...draft, email: "private@example.com" } as DownloadDraft, token, true, now);
    expect(storage.getItem(downloadSessionKey)).not.toContain("private@example.com");
    clearDownloadSession(storage);
    expect(readDownloadSession(storage, "https://seanali.online/gps", now)).toBeNull();
  });
  it("handles blocked storage on read and stops signup if saving fails", () => {
    const blocked = { ...storage, getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("full"); } };
    expect(readDownloadSession(blocked, "https://seanali.online/gps", now)).toBeNull();
    expect(() => saveDownloadSession(blocked, draft, token, false, now)).toThrow("full");
  });
});
