/**
 * Replaceable commerce adapter contract.
 *
 * The adapter is intentionally read-only until an authenticated Whop publisher
 * supplies account identity and supports idempotent readback. Product ID + slug
 * is the idempotency key; retries update the existing object and never duplicate.
 */
export function commercePreflight(product, env = process.env) {
  const required = ["WHOP_COMPANY_ID", "WHOP_PUBLISHER_READY"];
  const missing = required.filter((key) => !env[key]);
  return {
    ok: missing.length === 0 && product.whop?.verified === true,
    missing,
    idempotencyKey: `${product.productId}:${product.slug}`,
    contract: [
      "verify intended Whop company/account",
      "create or update product idempotently",
      "create one-time plan at the manifest price",
      "upload and hash-check the exact approved PDF",
      "attach the gated PDF experience",
      "re-read product, plan, checkout, experience, course, and file IDs",
      "verify payment.succeeded fulfillment and buyer access"
    ]
  };
}
