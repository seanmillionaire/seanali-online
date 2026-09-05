# Life Hacks product-page system

`flow.html` is the visual and behavioral control. It remains unchanged. Life Hacks pages are generated from JSON product manifests and reuse `/assets/money-flow-pdp.css`, so future products do not receive hand-authored page HTML.

## Generate

```bash
node scripts/product-pdp/generate.mjs
node scripts/product-pdp/qa.mjs --mode=preview
# Generate, verify, and print the current product link bundle
npm run pdp:release -- --manifest=products/manifest-more-money.json
```

The generator writes the product page, access page, catalog, and release manifest from the same product record. Local product assets live under `assets/lifehacks/<slug>/` and are referenced with stable root-relative paths.

## Release gate

The lifecycle is:

`REQUESTED → BRIEFED → RESEARCHED → ARCHITECTED → DRAFTED → CLAIMS_PASS → CONTENT_PASS → PDF_PASS → PDP_PREVIEW_PASS → COMMERCE_PASS → LIVE_QA_PASS → LIVE`

Preview generation is allowed while commerce is pending. Production promotion is not. A product can only become `LIVE` after the approved PDF is hash/page-verified, the intended Whop company is verified, product/plan/checkout/experience/course/file IDs are re-read, logged-out checkout resolves to the intended $10 one-time offer, `payment.succeeded` fulfillment is verified, and a controlled buyer receives the exact PDF immediately.

Retries use Product ID + slug as the idempotency key. The adapter contract is documented in `scripts/product-pdp/commerce.mjs`; credentials never enter the repository.

Manifest More Money is intentionally `PUBLISH_GATE`: the approved Drive artifact is `manifest-more-money-v1.0.pdf` with 24 pages. No v1.1 label is used until an approved v1.1 artifact exists.

## Future product request

The minimum input is a topic/outcome. The orchestrator creates a permanent Product ID and slug, writes the product manifest, and then runs the same sequence: approved assets and PDF, generated PDP/catalog/access pages, Whop idempotent create-or-update, readback, QA, deployment, and drift monitoring. No future product page gets hand-authored HTML.

`npm run pdp:release -- --manifest=products/<slug>.json` is the single local release command. It always regenerates the page and release manifest, runs the preview or release gate, and prints the sales page, checkout, access, cover, PDF, and Whop links. A missing checkout, delivery URL, buyer QA result, or live status stops promotion.
