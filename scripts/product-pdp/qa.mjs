import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canPromoteLive } from "./state.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const mode = process.argv.includes("--mode=release") ? "release" : "preview";
const manifestPath = process.argv.find((arg) => arg.startsWith("--manifest="))?.split("=")[1] || "products/manifest-more-money.json";
const p = JSON.parse(fs.readFileSync(path.join(root, manifestPath), "utf8"));
const htmlPath = path.join(root, "lifehacks", p.slug, "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const failures = [];
const passes = [];
const pass = (label) => passes.push(label);
const fail = (label) => failures.push(label);
const must = (condition, label) => condition ? pass(label) : fail(label);

function dimensions(file) {
  const data = fs.readFileSync(file);
  if (data.readUInt32BE(0) === 0x89504e47) return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  if (data[0] === 0xff && data[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < data.length) {
      if (data[offset] !== 0xff) { offset += 1; continue; }
      const marker = data[offset + 1];
      const length = data.readUInt16BE(offset + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) return { width: data.readUInt16BE(offset + 7), height: data.readUInt16BE(offset + 5) };
      offset += 2 + length;
    }
  }
  return null;
}

must(p.title && p.slug && p.version && p.productId, "manifest identity");
must(p.price.amount === 10 && p.price.currency === "USD", "default one-time $10 price");
must(Array.isArray(p.benefits) && p.benefits.length > 0, "benefits present");
must(Array.isArray(p.faq) && p.faq.length > 0, "FAQ present");
must((html.match(/<h1\b/gi) || []).length === 1, "exactly one H1");
must(html.includes(p.title) && html.includes(p.version) && html.includes(`${p.pdf.pageCount} pages`), "title/version/page count consistency");
must(html.includes(p.seo.canonical), "canonical URL");
must((html.match(/application\/ld\+json/g) || []).length >= 2, "Product and FAQ schema");
must(p.offerStack.length > 0 && !p.offerStack.some((item) => /TODO|placeholder|lorem/i.test(JSON.stringify(item))), "offer stack is complete");
must(p.whop?.coverFileId && p.whop?.coverUrl, "Whop cover asset is recorded");
must(p.related.every((item) => item.status === "LIVE" ? Boolean(item.href && item.image) : true), "related records are explicit");
must(Array.isArray(p.hacks) && p.hacks.length === 20 && p.hacks.every((hack) => Array.isArray(hack.steps) && hack.steps.length >= 2), "exactly 20 hacks with executable steps");
must(!/(TODO|FIXME|lorem ipsum|fake proof|guarantees you income|will make you money|money will appear)/i.test(html), "no placeholder or unsupported guarantee language");

const controlSections = ["pdp-hero", "proof-bar", "story-section", "use-section", "theta-visual-section", "included-section", "related-section", "reviews-section", "faq-section", "final-cta"];
const pageSections = [...html.matchAll(/<section[^>]+class="([^"]+)"/g)].map((m) => m[1]);
const presentControl = pageSections.map((classes) => controlSections.findIndex((x) => classes.split(/\s+/).includes(x))).filter((index) => index >= 0);
must(presentControl.every((index, i) => i === 0 || index > presentControl[i - 1]), "section order matches /flow control");
must(pageSections.some((x) => x.includes("pdp-hero")) && pageSections.some((x) => x.includes("final-cta")), "control shell anchors present");
must(presentControl.filter((index) => index === 0).length === 1, "hero occurs once");

const srcs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
const imgTags = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
must(imgTags.every((tag) => /\salt="[^"]+"/.test(tag)), "every image has alt text");
for (const src of srcs) {
  if (!src.startsWith("/")) continue;
  const file = path.join(root, src);
  must(fs.existsSync(file), `asset exists: ${src}`);
  if (fs.existsSync(file)) {
    const size = dimensions(file);
    must(Boolean(size && size.width > 0 && size.height > 0), `asset dimensions: ${src}`);
  }
}
must(srcs.length >= 5, "hero, thumbnail, founder, mechanism, and offer images present");

const ctas = [...html.matchAll(/<a[^>]*class="[^"]*(?:pdp-cta|header-cta)[^"]*"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
must(ctas.length >= 3, "hero, offer, and final CTAs present");
if (mode === "release") {
  must(ctas.every((href) => /^https?:\/\//.test(href)), "every CTA has a real checkout URL");
  must(canPromoteLive(p), "LIVE promotion gate");
} else {
  must(ctas.every((href) => href === "#commerce-pending" || /^https?:\/\//.test(href)), "preview CTAs are explicit and never silently fake");
  if (p.checkout?.status !== "VERIFIED") console.log("WARN commerce gate: checkout is not verified; preview only");
}

const internalLinks = [...html.matchAll(/<a[^>]+href="(\/[^"#?]*)/g)].map((m) => m[1]);
for (const href of internalLinks) {
  const normalized = href.endsWith("/") ? `${href}index.html` : href;
  must(fs.existsSync(path.join(root, normalized)), `internal link resolves: ${href}`);
}

console.log(`PDP QA (${mode}) ${p.slug}: ${passes.length} passed, ${failures.length} failed`);
for (const item of passes) console.log(`PASS ${item}`);
for (const item of failures) console.error(`FAIL ${item}`);
if (mode === "release" && failures.length) process.exitCode = 1;
