/* Carry campaign labels to Genie. This does not count visits, leads, or sales. */
(() => {
  'use strict';
  const incoming = new URLSearchParams(window.location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  // Campaign labels only: never copy a full query string, referrer, or form value.
  const label = /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]{0,119}$/;
  const source = incoming.get('utm_source');
  if (!source || !label.test(source)) return;

  document.querySelectorAll('a[data-genie-cta]').forEach((link) => {
    const destination = new URL(link.href);
    if (destination.origin !== 'https://www.manifestationgenie.ai') return;
    keys.forEach((key) => {
      destination.searchParams.delete(key);
      const value = incoming.get(key);
      if (value && label.test(value)) destination.searchParams.set(key, value);
    });
    // Keep article and CTA position separate from the original channel's creative.
    destination.searchParams.set('sa_article', 'manifestation-app-positive-thinking');
    destination.searchParams.set('sa_cta', link.dataset.genieCta);
    link.href = destination.href;
  });
})();
