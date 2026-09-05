import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const productsDir = path.join(root, "products");
const outputRoot = path.join(root, "lifehacks");
fs.mkdirSync(path.join(root, "releases"), { recursive: true });

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const manifests = fs.readdirSync(productsDir)
  .filter((file) => file.endsWith(".json") && file !== "registry.json")
  .map((file) => readJson(path.join(productsDir, file)));

const checkout = (p) => p.checkout?.status === "VERIFIED" && p.checkout.url
  ? p.checkout.url : "#commerce-pending";
const access = (p) => p.delivery?.status === "VERIFIED" && p.delivery.accessUrl
  ? p.delivery.accessUrl : "#delivery-pending";
const ctaAttrs = (p) => p.checkout?.status === "VERIFIED"
  ? ""
  : ' aria-disabled="true" data-commerce-status="PENDING"';
const cta = (p, label, className = "pdp-cta") => `<a class="${className}" href="${esc(checkout(p))}"${ctaAttrs(p)}><span>${esc(label)}</span><span aria-hidden="true">&rarr;</span></a>`;
const image = (data, className = "") => `<img${className ? ` class="${className}"` : ""} src="${esc(data.src)}" alt="${esc(data.alt)}" loading="lazy">`;

function jsonLd(p) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description,
    image: [`https://seanali.online${p.images.hero.src}`],
    brand: { "@type": "Brand", name: "Sean Ali" },
    sku: p.productId,
    offers: {
      "@type": "Offer", priceCurrency: p.price.currency,
      price: String(p.price.amount), url: p.seo.canonical,
      availability: "https://schema.org/PreOrder"
    },
    version: p.version
  });
}

function faqLd(p) {
  return JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: p.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } }))
  });
}

function pageHtml(p) {
  const buy = checkout(p);
  const pending = p.checkout?.status !== "VERIFIED";
  const selector = p.offers?.length > 1 ? `<div class="purchase-selector"><div class="purchase-selector__label">Customize your order</div><div class="purchase-options" role="group" aria-label="Customize your order">${p.offers.map((o, i) => `<button class="purchase-option${i === 0 ? " is-selected" : ""}" type="button" aria-pressed="${i === 0}" data-product-image="${esc(o.image.src)}" data-product-alt="${esc(o.image.alt)}" data-product-caption="${esc(o.name)}" data-product-price="${esc(o.price.label)}" data-checkout-url="${esc(o.checkoutUrl)}" data-cta-label="${esc(o.ctaLabel)}"><span class="purchase-option__selected" aria-hidden="true">✓</span><div><strong>${esc(o.name)}</strong><span>${esc(o.subline)}</span></div><span class="purchase-price-group"><strong class="purchase-price">${esc(o.price.label)}</strong></span></button>`).join("")}</div></div>` : "";
  const offers = p.offerStack.map((item) => `<li><span class="included-item-copy"><strong>${esc(item.name)}</strong>${esc(item.description)}</span></li>`).join("");
  const related = p.related.map((item) => item.status === "LIVE" && item.image ? `<a class="related-card" href="${esc(item.href)}"><div class="related-image"><span>${esc(p.category)}</span>${image(item.image)}</div><strong>${esc(item.title)}</strong><p>${esc(item.description)}</p><b>Explore ${esc(item.title)} &rarr;</b></a>` : `<div class="related-card related-card--planned"><div class="related-image"><span>Coming next</span><div class="planned-cover">${esc(item.title)}</div></div><strong>${esc(item.title)}</strong><p>${esc(item.description)}</p><b>Planned product</b></div>`).join("");
  const mechanism = p.mechanism ? `<section class="pdp-section theta-visual-section" data-pdp-section="mechanism"><div class="pdp-container"><div class="section-heading"><div class="eyebrow">${esc(p.mechanism.eyebrow)}</div><h2>${esc(p.mechanism.heading)}</h2><p>${esc(p.mechanism.description)}</p></div><div class="theta-visual-grid">${p.mechanism.cards.map((card) => `<figure class="theta-visual-card">${image({src: card.image, alt: card.alt})}<figcaption><strong>${esc(card.title)}</strong><span>${esc(card.text)}</span></figcaption></figure>`).join("")}</div><p class="disclaimer">${esc(p.mechanism.disclaimer)}</p></div></section>` : "";
  const proof = p.proof ? `<section class="pdp-section reviews-section" data-pdp-section="proof"><div class="pdp-container"><div class="section-heading"><div class="eyebrow">Approved proof</div><h2>${esc(p.proof.heading)}</h2><p>${esc(p.proof.description)}</p></div></div></section>` : "";
  const pendingNote = pending ? `<div class="commerce-gate" role="status"><strong>Preview / PUBLISH GATE</strong> Checkout and gated delivery are intentionally disabled until the publisher verifies Whop account identity, IDs, and buyer access.</div>` : "";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.seo.title)}</title><meta name="description" content="${esc(p.seo.description)}"><meta name="author" content="Sean Ali"><meta name="robots" content="${esc(p.seo.robots)}"><link rel="canonical" href="${esc(p.seo.canonical)}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/money-flow-pdp.css"><style>.commerce-gate{max-width:1180px;margin:20px auto;padding:13px 18px;border:1px dashed #c9942e;background:#fff8e5;color:#76551c;font-size:12px;line-height:1.5}.related-card--planned{color:#666}.planned-cover{display:grid;place-items:center;width:100%;height:100%;padding:22px;background:linear-gradient(145deg,#262320,#6a5430);color:#fff;font-size:28px;font-weight:900;text-align:center}.purchase-option[aria-disabled=true],.pdp-cta[aria-disabled=true]{cursor:not-allowed;opacity:.58}</style><script type="application/ld+json">${jsonLd(p)}</script><script type="application/ld+json">${faqLd(p)}</script></head>
<body><div class="pdp-site"><header class="site-header"><div class="site-header__inner"><a class="brand sean-ali-brand" href="https://seanali.online/" aria-label="Sean Ali">SEAN <span>ALI</span></a><div class="header-benefits" aria-label="Product benefits"><span><i aria-hidden="true">✓</i> Instant digital access</span><span><i aria-hidden="true">✓</i> One-time payment</span></div><a class="header-cta" href="${esc(buy)}"${ctaAttrs(p)}>GET ACCESS &rarr;</a></div></header>
<main>${pendingNote}<section class="pdp-hero" data-pdp-section="hero"><div class="pdp-container pdp-hero__grid"><div class="pdp-gallery"><div class="pdp-gallery__main"><span class="product-badge">${esc(p.badge)}</span>${image(p.images.hero, "hero-product-image")}</div><div class="pdp-gallery__caption"><span class="pdp-thumb">${image(p.images.thumbnail, "hero-product-thumb")}</span><span>${esc(p.title)} · ${esc(p.version)} · ${p.pdf.pageCount} pages</span></div></div><div class="pdp-buybox"><div class="hero-badges"><div class="eyebrow">${esc(p.productLine)} · ${esc(p.category)}</div></div><h1>${esc(p.headline)}</h1><p class="pdp-lead">${esc(p.promise)}</p>${selector}${cta(p, `GET ${p.title.toUpperCase()} - ${p.price.label}`, "pdp-cta")}${pending ? `<div class="payment-trust"><span><strong>Preview only</strong> · Checkout is pending publisher verification</span></div>` : ""}<ul class="pdp-benefits">${p.benefits.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><div class="digital-delivery"><span class="delivery-icon">✓</span><div><strong>${esc(p.version)} · ${p.pdf.pageCount}-page PDF</strong><small>Gated delivery after verified checkout</small></div></div></div></div></section>
<section class="proof-bar" data-pdp-section="quick-facts"><div class="pdp-container proof-bar__grid">${p.quickFacts.map((x) => `<div><strong>${esc(x.value)}</strong><span>${esc(x.label)}</span></div>`).join("")}</div></section>
<section class="pdp-section story-section" data-pdp-section="story"><div class="pdp-container story-grid">${image(p.images.founder, "story-photo")}<div class="story-copy"><div class="eyebrow">${esc(p.story.eyebrow)}</div><h2>${esc(p.story.heading)}</h2>${p.story.paragraphs.map((x) => `<p>${esc(x)}</p>`).join("")}<a class="text-link" href="#offer">See what's included <span aria-hidden="true">&rarr;</span></a></div></div></section>
${mechanism}
<section class="pdp-section included-section" id="offer" data-pdp-section="offer"><div class="pdp-container included-grid"><div class="included-copy"><div class="included-image">${image(p.images.inside)}</div><div class="eyebrow">What you're about to get</div><h2>${esc(p.title)} · ${esc(p.version)}</h2><p>${esc(p.pdf.pageCount)} pages. ${p.benefits[0]}. One simple visual tool you can return to.</p><ul class="included-list">${offers}</ul><div class="included-total"><div><span>Product</span><strong>${esc(p.title)}</strong></div><div><span>You Pay Today</span><strong>${esc(p.price.label)}</strong></div><small>One payment · Gated PDF access after verified checkout</small></div>${cta(p, `GET ${p.title.toUpperCase()} - ${p.price.label}`, "pdp-cta pdp-cta--inline")}</div></div></section>
<section class="pdp-section related-section" data-pdp-section="related"><div class="pdp-container"><div class="section-heading section-heading--row"><div><div class="eyebrow">Keep exploring</div><h2>More Life Hacks for Real Life</h2></div><a class="text-link" href="/lifehacks/">Browse Life Hacks <span aria-hidden="true">&rarr;</span></a></div><div class="related-grid">${related}</div></div></section>
${proof}
<section class="pdp-section faq-section" data-pdp-section="faq"><div class="pdp-container faq-container"><div class="section-heading"><div class="eyebrow">Quick questions</div><h2>Questions Before You Start</h2></div><div class="faq-list">${p.faq.map((x) => `<details><summary>${esc(x.question)}</summary><p>${esc(x.answer)}</p></details>`).join("")}</div></div></section>
<section class="final-cta" data-pdp-section="final-close"><div class="pdp-container final-cta__inner"><div><div class="eyebrow">${esc(p.finalClose.eyebrow)}</div><h2>${esc(p.finalClose.heading)}</h2><p>${esc(p.finalClose.description)}</p></div><div class="final-cta__buy">${image(p.images.hero)}<div class="final-price"><span>One-time access</span><br>${esc(p.price.label)}</div>${cta(p, `GET ${p.title.toUpperCase()}`, "pdp-cta")}</div></div></section></main>
<footer class="site-footer"><div class="pdp-container"><strong>Sean Ali Life Hacks</strong><p>Simple visual tools for mind, money, and life.</p><div><a href="https://seanali.online/">Home</a><a href="/lifehacks/">Life Hacks</a><a href="/products/">All Products</a><a href="https://seanali.online/about-sean-ali/">About Sean</a></div><small>${esc(p.legal)} · ${esc(p.version)} · Product ID ${esc(p.productId)}</small></div></footer></div><script>document.addEventListener('click',function(e){var a=e.target.closest('a[aria-disabled="true"]');if(a)e.preventDefault();});</script></body></html>`;
}

function accessHtml(p) {
  const accessUrl = access(p);
  const pending = p.delivery?.status !== "VERIFIED";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your ${esc(p.title)} Access | Sean Ali Life Hacks</title><meta name="robots" content="noindex,nofollow"><link rel="canonical" href="${esc(p.seo.canonical)}access/"><link rel="stylesheet" href="/assets/money-flow-pdp.css"><style>.access-shell{min-height:100vh;display:grid;place-items:center;padding:36px;background:#f4fbf8}.access-card{width:min(760px,100%);padding:42px;background:#fff;border:1px solid #cbe4d8;box-shadow:10px 10px 0 #16a34a}.access-card h1{color:#c9202b;font-size:clamp(34px,6vw,58px);line-height:1.05}.access-card p{color:#5d5754;font-size:16px;line-height:1.6}.access-steps{display:grid;gap:10px;margin:24px 0}.access-step{display:grid;grid-template-columns:34px 1fr;gap:12px;padding:15px;border:1px solid #ddd8d4}.access-step b{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#dcfce7;color:#15803d}.access-pending{padding:14px;border:1px dashed #c9942e;background:#fff8e5;color:#76551c;font-size:12px;line-height:1.5}.access-card .pdp-cta{margin-top:20px}</style></head><body><main class="access-shell"><section class="access-card"><div class="eyebrow">Sean Ali Life Hacks · Access</div><h1>${esc(p.title)}</h1><p>Your product guidance is ready. Use the gated PDF link below after the verified purchase is attached to this product.</p>${pending ? `<div class="access-pending"><strong>Access pending.</strong> The publisher must verify the Whop experience, PDF file, and payment.succeeded fulfillment before this link can open.</div>` : ""}<div class="access-steps"><div class="access-step"><b>1</b><div><strong>Open the product.</strong><br><span>Use your verified gated access link.</span></div></div><div class="access-step"><b>2</b><div><strong>Pick one hack.</strong><br><span>Start with the page that matches your current money goal.</span></div></div><div class="access-step"><b>3</b><div><strong>Try it today.</strong><br><span>Connect the practice to one grounded next action.</span></div></div></div><a class="pdp-cta" href="${esc(accessUrl)}"${pending ? ' aria-disabled="true" data-delivery-status="PENDING"' : ""}><span>OPEN ${esc(p.title.toUpperCase())}</span><span aria-hidden="true">&rarr;</span></a><p class="disclaimer">${esc(p.legal)} · ${esc(p.version)} · Product ID ${esc(p.productId)}</p></section></main><script>document.addEventListener('click',function(e){var a=e.target.closest('a[aria-disabled="true"]');if(a)e.preventDefault();});</script></body></html>`;
}

function catalogHtml(products) {
  const cards = products.map((p) => `<article class="related-card"><a href="/lifehacks/${esc(p.slug)}/" style="text-decoration:none"><div class="related-image"><span>${esc(p.category)}</span>${image(p.images.hero)}</div><strong>${esc(p.title)}</strong><p>${esc(p.description)}</p><b>${esc(p.price.label)} · ${p.pdf.pageCount} pages &rarr;</b></a></article>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sean Ali Life Hacks — Simple Tools for Mind, Money & Life</title><meta name="description" content="Simple visual tools for the parts of life people usually turn into giant books."><meta name="robots" content="noindex,nofollow"><link rel="canonical" href="https://seanali.online/lifehacks/"><link rel="stylesheet" href="/assets/money-flow-pdp.css"></head><body><div class="pdp-site"><header class="site-header"><div class="site-header__inner"><a class="brand sean-ali-brand" href="https://seanali.online/" aria-label="Sean Ali">SEAN <span>ALI</span></a><div class="header-benefits"><span><i aria-hidden="true">✓</i> Visual tools</span><span><i aria-hidden="true">✓</i> Simple steps</span></div><a class="header-cta" href="#products">BROWSE &rarr;</a></div></header><main><section class="pdp-hero" style="padding-bottom:45px"><div class="pdp-container"><div class="section-heading"><div class="eyebrow">Sean Ali Life Hacks</div><h1>Skip the book. Try the hack.</h1><p>Simple visual tools for the parts of life people usually turn into giant books, expensive systems, and overcomplicated routines.</p></div></div></section><section class="pdp-section related-section" id="products"><div class="pdp-container"><div class="related-grid">${cards}</div></div></section></main><footer class="site-footer"><div class="pdp-container"><strong>Sean Ali Life Hacks</strong><p>Simple visual tools for mind, money, and life.</p><small>Educational tools, not guaranteed outcomes.</small></div></footer></div></body></html>`;
}

for (const product of manifests) {
  const dir = path.join(outputRoot, product.slug);
  fs.mkdirSync(path.join(dir, "access"), { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), pageHtml(product));
  fs.writeFileSync(path.join(dir, "access", "index.html"), accessHtml(product));
  fs.writeFileSync(path.join(root, "releases", `${product.slug}.json`), JSON.stringify({ generatedAt: product.qa?.lastRun || null, productId: product.productId, slug: product.slug, version: product.version, status: product.status, page: product.seo.canonical, accessPage: `${product.seo.canonical}access/`, pdf: product.pdf, checkout: product.checkout, delivery: product.delivery, whop: product.whop, qa: product.qa }, null, 2) + "\n");
}
fs.writeFileSync(path.join(outputRoot, "index.html"), catalogHtml(manifests));
console.log(`Generated ${manifests.length} product page(s): ${manifests.map((p) => p.slug).join(", ")}`);
