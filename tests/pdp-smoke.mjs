import { chromium } from "playwright";

const base = process.env.PDP_BASE_URL || "http://127.0.0.1:4173";
const target = `${base}/lifehacks/manifest-more-money/`;
const browser = await chromium.launch({ headless: true });
const failures = [];

for (const viewport of [{ name: "desktop", width: 1440, height: 1000 }, { name: "mobile", width: 375, height: 812 }]) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.goto(target, { waitUntil: "networkidle" });
  const result = await page.evaluate(() => ({
    h1: document.querySelectorAll("h1").length,
    images: [...document.images].map((image) => ({ src: image.src, complete: image.complete, naturalWidth: image.naturalWidth, alt: image.alt })),
    ctas: [...document.querySelectorAll(".pdp-cta")].map((cta) => ({ href: cta.href, disabled: cta.getAttribute("aria-disabled") })),
    faqCount: document.querySelectorAll(".faq-list details").length,
    faqBefore: document.querySelector(".faq-list details")?.open,
    width: innerWidth
  }));
  if (result.h1 !== 1) failures.push(`${viewport.name}: expected one H1`);
  if (result.width !== viewport.width) failures.push(`${viewport.name}: viewport did not apply`);
  if (result.images.some((image) => !image.complete || image.naturalWidth === 0 || !image.alt)) failures.push(`${viewport.name}: broken or unlabelled image`);
  if (result.ctas.some((cta) => !cta.href || (!cta.href.includes("#commerce-pending") && !cta.href.startsWith("http")))) failures.push(`${viewport.name}: invalid CTA destination`);
  if (result.faqCount !== 4) failures.push(`${viewport.name}: FAQ count mismatch`);
  await page.locator(".faq-list details").first().locator("summary").click();
  if (!(await page.locator(".faq-list details").first().evaluate((details) => details.open))) failures.push(`${viewport.name}: FAQ did not open`);
  if (consoleErrors.length) failures.push(`${viewport.name}: console errors: ${consoleErrors.join(" | ")}`);
  await page.close();
}
await browser.close();
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log("PDP browser smoke passed: desktop + 375px mobile + images + CTA contract + FAQ interaction");
