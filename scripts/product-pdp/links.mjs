import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = process.argv.find((arg) => arg.startsWith("--manifest="))?.split("=")[1] || "products/manifest-more-money.json";
const product = JSON.parse(fs.readFileSync(path.join(root, manifestPath), "utf8"));
const verifiedCheckout = product.checkout?.status === "VERIFIED" && /^https?:\/\//.test(product.checkout.url || "");
const verifiedDelivery = product.delivery?.status === "VERIFIED" && /^https?:\/\//.test(product.delivery.accessUrl || "");

const bundle = {
  productId: product.productId,
  slug: product.slug,
  title: product.title,
  version: product.version,
  status: product.status,
  releaseMode: product.releaseMode,
  readyToSell: verifiedCheckout && verifiedDelivery && product.status === "LIVE",
  salesPage: product.seo.canonical,
  accessPage: `${product.seo.canonical}access/`,
  checkout: verifiedCheckout ? product.checkout.url : null,
  delivery: verifiedDelivery ? product.delivery.accessUrl : null,
  cover: product.whop?.coverUrl || null,
  pdf: product.pdf?.driveUrl || null,
  whopProduct: product.whop?.publicUrl || null,
  whopDashboard: product.whop?.companyId && product.whop?.productId
    ? `https://whop.com/dashboard/${product.whop.companyId}/products/${product.whop.productId}`
    : null,
  blockers: [
    ...(verifiedCheckout ? [] : ["verified checkout required"]),
    ...(verifiedDelivery ? [] : ["verified gated delivery URL required"]),
    ...(product.status === "LIVE" ? [] : [`status is ${product.status}`])
  ]
};

console.log(JSON.stringify(bundle, null, 2));
