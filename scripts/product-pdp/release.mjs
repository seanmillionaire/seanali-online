import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifest = process.argv.find((arg) => arg.startsWith("--manifest="))?.split("=")[1] || "products/manifest-more-money.json";
const mode = process.argv.includes("--mode=release") ? "release" : "preview";
const run = (script, args = []) => {
  const result = spawnSync(process.execPath, [path.join(root, "scripts/product-pdp", script), ...args], { cwd: root, encoding: "utf8" });
  process.stdout.write(result.stdout || "");
  process.stderr.write(result.stderr || "");
  if (result.status !== 0) process.exit(result.status || 1);
};

run("generate.mjs");
run("qa.mjs", [`--mode=${mode}`, `--manifest=${manifest}`]);
run("links.mjs", [`--manifest=${manifest}`]);

const product = JSON.parse(fs.readFileSync(path.join(root, manifest), "utf8"));
if (mode === "release" && product.status !== "LIVE") {
  console.error(`Release stopped: ${product.slug} is ${product.status}. The manifest must be promoted only after live buyer QA.`);
  process.exitCode = 1;
}
