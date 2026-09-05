import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const registry = JSON.parse(fs.readFileSync(path.join(root, "products/registry.json"), "utf8"));
const results = [];
for (const relative of registry.products) {
  const p = JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
  if (p.status !== "LIVE") continue;
  const url = `${p.seo.canonical}?drift_check=${Date.now()}`;
  try {
    const response = await fetch(url, { redirect: "follow" });
    const body = await response.text();
    const ok = response.ok && body.includes(p.title) && body.includes(p.version) && body.includes(p.seo.canonical);
    results.push({ productId: p.productId, url, status: response.status, ok, issue: ok ? null : "public page/version/canonical drift" });
  } catch (error) {
    results.push({ productId: p.productId, url, ok: false, issue: error.message });
  }
}
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
fs.writeFileSync(path.join(root, "releases", "drift-issues.json"), JSON.stringify({ checkedAt: new Date().toISOString(), issues: results.filter((item) => !item.ok).map((item) => ({ ...item, status: "NEEDS_REVIEW" })) }, null, 2) + "\n");
if (results.some((item) => !item.ok)) process.exitCode = 1;
