import { afterEach, describe, expect, it, vi } from "vitest";
import { compassLabels, downloadCompassImage } from "./compassDownload";
afterEach(() => vi.unstubAllGlobals());
describe("personal compass", () => {
  it("uses a first name and a single line of the user's own goal", () => {
    expect(compassLabels("  Alex Smith ", "More family\n time")).toEqual({ name: "Alex", goal: "More family time" });
    expect(compassLabels("李 明", "家人")).toEqual({ name: "李", goal: "家人" });
  });
  it("downloads the personalized preview", async () => {
    const link = { href: "", download: "", click: vi.fn(), remove: vi.fn() };
    vi.stubGlobal("document", { createElement: () => link, body: { append: vi.fn() } });
    await downloadCompassImage("data:image/png;base64,personalized");
    expect(link.href).toBe("data:image/png;base64,personalized");
    expect(link.click).toHaveBeenCalledOnce();
  });
  it("rejects missing personalization instead of downloading a generic image", async () => {
    await expect(downloadCompassImage("")).rejects.toThrow("Personal compass unavailable");
  });
});
