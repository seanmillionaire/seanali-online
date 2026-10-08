import { z } from "zod";

export const downloadSessionKey = "dream-life-gps-download-session-v1";
export const signupReturnParam = "gps_signup";
const text = z.string().max(20000);
const draftSchema = z.object({
  userName: text, location: text, startingPoint: text,
  success: text, cleanSuccess: text,
  selectedBenefits: z.array(z.enum(["family", "health", "calm", "time", "freedom", "work", "giving", "growth"])).max(8),
  future: text, cleanFuture: text, whyNow: text, cleanWhyNow: text,
  role: z.enum(["mediaBuyer", "creativeStrategist", "copywriter", "designer", "productBuilder", "operations", "teamLead", "other"]),
  otherRole: text, responsibility: text, cleanResponsibility: text,
  weeklyResult: text, cleanWeeklyResult: text,
  commitment: z.enum(["small", "solid", "full"]),
  dreamScene: z.enum(["celebration", "calm", "family", "freedom"]), dreamDetail: text,
  clarityPrintout: z.object({ title: text, opening: text, scene: text, anchor: text, source: z.enum(["ai", "my-words"]) }).nullable(),
});
const sessionSchema = z.object({
  version: z.literal(1), token: z.string().uuid(), expiresAt: z.number(),
  unlocked: z.boolean(), draft: draftSchema,
});
export type DownloadDraft = z.infer<typeof draftSchema>;
type SessionStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function saveDownloadSession(storage: SessionStorage, draft: DownloadDraft, token: string, unlocked = false, now = Date.now()) {
  const session = sessionSchema.parse({ version: 1, token, expiresAt: now + 24 * 60 * 60 * 1000, unlocked, draft });
  storage.setItem(downloadSessionKey, JSON.stringify(session));
}

// A URL alone never unlocks downloads: it must match a signup started in this tab.
export function readDownloadSession(storage: SessionStorage, href: string, now = Date.now()) {
  try {
    const parsed = sessionSchema.safeParse(JSON.parse(storage.getItem(downloadSessionKey) || "null"));
    if (!parsed.success || parsed.data.expiresAt <= now) return null;
    const returned = new URL(href).searchParams.get(signupReturnParam) === parsed.data.token;
    return { ...parsed.data, returned, unlocked: parsed.data.unlocked || returned };
  } catch { return null; }
}

export function clearDownloadSession(storage: SessionStorage) {
  storage.removeItem(downloadSessionKey);
}
