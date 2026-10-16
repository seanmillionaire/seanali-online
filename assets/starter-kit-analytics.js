/* Starter Kit measurement. Purchases are recorded by the payment provider only. */
(function () {
  'use strict';
  if (window.__hmStarterAnalytics) return;
  window.__hmStarterAnalytics = true;
  var tag = document.querySelector('script[data-hm-funnel]');
  if (!tag) return;
  var variant = tag.getAttribute('data-hm-funnel');
  var measurement = 'G-86GKXSBGL6';
  var checkout = variant === 'ariella'
    ? 'https://whop.com/checkout/ch_NYGfabRkVfukg96/'
    : 'https://whop.com/checkout/ch_n0hcOfs6k7YnrHg/';
  var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'gclid', 'gbraid', 'wbraid'];
  function cleanURL(input, campaign) {
    try {
      var u = new URL(input);
      var clean = new URL(u.origin + u.pathname);
      if (campaign) keys.forEach(function (key) {
        var value = u.searchParams.get(key);
        if (value && value.length <= 150 && !/@|%40/i.test(value)) clean.searchParams.set(key, value);
      });
      return clean.href;
    } catch (_) { return ''; }
  }
  var location = cleanURL(window.location.href, true);
  var attribution = new URL(location).searchParams;
  function decorate(input) {
    var u = new URL(input);
    keys.forEach(function (key) {
      if (attribution.has(key) && !u.searchParams.has(key)) u.searchParams.set(key, attribution.get(key));
    });
    return u.href;
  }
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  var gtag = window.gtag;
  gtag('js', new Date());
  gtag('set', 'linker', { domains: ['whop.com'] });
  gtag('config', measurement, {
    send_page_view: false,
    page_location: location,
    page_referrer: cleanURL(document.referrer, false),
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  function event(name, params) {
    gtag('event', name, Object.assign({
      send_to: measurement,
      funnel_name: 'money_manifestation_starter_kit',
      funnel_variant: variant,
      page_location: location,
      page_referrer: cleanURL(document.referrer, false)
    }, params || {}));
  }
  var loader = document.createElement('script');
  loader.async = true;
  loader.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurement;
  document.head.appendChild(loader);
  event('page_view');
  var item = { item_id: 'prod_o8AGEl8JrI7OK', item_name: 'Money Manifestation Starter Kit', price: 8, quantity: 1, item_variant: variant };
  if (variant !== 'delivery') event('view_item', { currency: 'USD', value: 8, items: [item] });
  else {
    if (window.__hmStarterPortalUnlocked) {
      event('kit_access', { portal_source: 'starter-kit-downloads', product_id: item.item_id, access_method: 'aweber_email_gate' });
      if (window.__hmStarterPortalUnlockJustNow) event('kit_portal_unlocked', { portal_source: 'starter-kit-downloads', product_id: item.item_id, access_method: 'aweber_form_redirect' });
    } else {
      event('kit_portal_view', { portal_source: 'starter-kit-downloads', product_id: item.item_id });
    }
  }

  document.querySelectorAll('a[href^="https://whop.com/checkout/"]').forEach(function (a) {
    a.href = decorate(a.href);
  });
  var lastCheckout = 0;
  document.addEventListener('click', function (e) {
    var target = e.target.closest('a,button');
    if (!target) return;
    var href = target.getAttribute('href') || '';
    if (variant !== 'delivery' && (target.hasAttribute('data-buy') || href.indexOf('https://whop.com/checkout/') === 0)) {
      var section = target.closest('section');
      if (Date.now() - lastCheckout > 1500) {
        lastCheckout = Date.now();
        if (typeof window.fbq === 'function') {
          window.fbq('trackSingle', '1181909070199516', 'AddToCart', {
            content_name: 'Money Manifestation Starter Kit',
            content_ids: [item.item_id],
            content_type: 'product',
            value: 8,
            currency: 'USD',
            num_items: 1
          });
        }
        event('begin_checkout', { currency: 'USD', value: 8, items: [item],
          cta_location: section && section.id ? section.id : (target.closest('.hero-actions') ? 'hero' : 'page'),
          checkout_provider: 'whop', transport_type: 'beacon' });
      }
      if (target.hasAttribute('data-buy')) {
        // Existing button handlers navigate immediately. Preserve their destination and attribution.
        e.preventDefault();
        e.stopImmediatePropagation();
        window.location.assign(decorate(checkout));
      }
    }
    if (variant === 'delivery' && target.hasAttribute('download')) {
      event('kit_download', { asset_path: cleanURL(target.href, false), transport_type: 'beacon' });
    }
  }, true);
  document.querySelectorAll('details').forEach(function (detail, index) {
    var opened = false;
    detail.addEventListener('toggle', function () {
      if (detail.open && !opened) { opened = true; event('faq_open', { question_index: index + 1 }); }
    });
  });
  var seen = {};
  var scheduled = false;
  window.addEventListener('scroll', function () {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      var height = document.documentElement.scrollHeight;
      if (height <= window.innerHeight) return;
      var depth = 100 * (window.scrollY + window.innerHeight) / height;
      [25, 50, 75, 90].forEach(function (percent) {
        if (depth >= percent && !seen[percent]) { seen[percent] = true; event('scroll_depth', { percent_scrolled: percent }); }
      });
    });
  }, { passive: true });
  document.querySelectorAll('audio').forEach(function (audio, index) {
    var started = false;
    audio.addEventListener('play', function () {
      if (!started) { started = true; event('kit_audio_start', { audio_index: index + 1 }); }
    });
    audio.addEventListener('ended', function () { event('kit_audio_complete', { audio_index: index + 1 }); });
  });
})();
