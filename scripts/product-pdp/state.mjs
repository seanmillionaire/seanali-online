export const STATES = [
  "REQUESTED", "BRIEFED", "RESEARCHED", "ARCHITECTED", "DRAFTED",
  "CLAIMS_PASS", "CONTENT_PASS", "PDF_PASS", "PDP_PREVIEW_PASS",
  "COMMERCE_PASS", "LIVE_QA_PASS", "LIVE"
];

export const TERMINAL_FAILURE = "NEEDS_REVIEW";

export function canTransition(from, to) {
  if (to === TERMINAL_FAILURE) return from !== "LIVE";
  return STATES.indexOf(to) === STATES.indexOf(from) + 1;
}

export function assertTransition(from, to) {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid Life Hacks state transition: ${from} -> ${to}`);
  }
  return to;
}

export function canPromoteLive(product) {
  return product.status === "LIVE_QA_PASS"
    && product.pdf?.verified === true
    && product.checkout?.status === "VERIFIED"
    && product.delivery?.status === "VERIFIED"
    && product.whop?.verified === true
    && product.qa?.purchase === "PASS"
    && Array.isArray(product.qa?.openIssues)
    && product.qa.openIssues.length === 0;
}
