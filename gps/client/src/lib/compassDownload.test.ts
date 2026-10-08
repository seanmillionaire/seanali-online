import { afterEach, describe, expect, it, vi } from "vitest";
import { compassImageUrl, downloadCompassImage } from "./compassDownload";

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.useRealTimers(); });

describe("compass download", () => {
  it("downloads the generated image with Sean Ali attribution in the filename", async () => {
    vi.useFakeTimers();
    const link = { href: "", download: "", click: vi.fn(), remove: vi.fn() };
    const append = vi.fn();
    vi.stubGlobal("document", { createElement: vi.fn(() => link), body: { append } });
    vi.stubGlobal("window", { setTimeout });
    const fetchImage = vi.fn().mockResolvedValue(new Response(new Blob(["png"], { type: "image/png" })));
    vi.stubGlobal("fetch", fetchImage);
    const createUrl = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:compass");
    const revokeUrl = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    await downloadCompassImage();
    expect(fetchImage).toHaveBeenCalledWith(compassImageUrl);
    expect(createUrl).toHaveBeenCalledOnce();
    expect(link.href).toBe("blob:compass");
    expect(link.download).toBe("North-Star-Compass-by-Sean-Ali.png");
    expect(append).toHaveBeenCalledWith(link);
    expect(link.click).toHaveBeenCalledOnce();
    expect(link.remove).toHaveBeenCalledOnce();
    vi.runAllTimers();
    expect(revokeUrl).toHaveBeenCalledWith("blob:compass");
  });

  it("does not download a missing asset", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Missing", { status: 404 })));
    await expect(downloadCompassImage()).rejects.toThrow("Compass image unavailable");
  });

  it("does not save a fallback HTML page as a PNG", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html></html>", { headers: { "Content-Type": "text/html" } })));
    await expect(downloadCompassImage()).rejects.toThrow("Invalid compass image");
  });
});
