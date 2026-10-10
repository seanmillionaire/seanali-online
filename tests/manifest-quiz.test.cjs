// Manifest uses the Try the Script AWeber form with a compact mobile-first, higher-energy opt-in.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');
const root = resolve(__dirname, '..');
for (const page of ['manifest.html', 'manifestscreen.html']) {
  const html = readFileSync(resolve(root, page), 'utf8');
  test(page + ' uses a compact mobile-first manifestation opt-in', () => {
    assert(html.includes('7-Minute Manifestation Script'));
    assert(html.includes('Start making it happen tonight.'));
    assert(html.includes('class="optin-card"'));
    assert(html.includes('UNLOCK MY 7-MINUTE SCRIPT'));
    assert(html.includes('name="name"'));
    assert(html.includes('name="email"'));
    assert(html.includes('@media(max-width:640px)'));
    assert(html.includes('h1 { font-size:32px'));
    assert(!html.includes('hero-image'));
    assert(!html.includes('trust-badge'));
    assert(html.includes('4.9/5 · 3,800+ Hypnotic Meditations reviews'));
    assert(html.includes('class="form-heading"'));
    assert(html.includes('class="eyebrow"'));
    assert.equal((html.match(/class="eyebrow"/g) || []).length, 1);
    assert(html.includes('🌙 7-MINUTE MANIFESTATION RITUAL'));
    assert(!/\bfree\b/i.test(html));
    assert(!html.includes('class="brand"'));
    assert(!html.includes('class="form-kicker"'));
    assert(html.includes('class="proof-pill"'));
    assert(html.includes('background:radial-gradient('));
    assert(!html.includes('video-caption'));
    assert(html.includes('© 2026 Sean Ali. All rights reserved.'));
    assert(html.includes('https://seanali.online/' + page.replace(/\.html$/, '')));
  });
  test(page + ' keeps Try the Script AWeber wiring', () => {
    assert(html.includes('action="https://www.aweber.com/scripts/addlead.pl"'));
    assert(html.includes('name="meta_web_form_id" value="184900578"'));
    assert(html.includes('name="listname" value="awlist6889085"'));
    assert(html.includes('name="redirect" value="https://seanali.online/manifestwatch?source=script-lead"'));
    assert(html.includes('name="meta_message" value="1"'));
    assert(html.includes('name="meta_required" value="name,email"'));
    assert(!html.includes('https://www.manifestationgenie.ai'));
  });
  test(page + ' keeps tracking and consent intact', () => {
    for (const asset of ['manifest-script-events.js', 'manifest-script-reset.js']) {
      assert(existsSync(resolve(root, 'assets', asset)));
      assert(html.includes('/assets/' + asset));
    }
    assert(html.includes("fbq('init','1586097145783190')"));
    assert(html.includes("fbq('init','878451855254470')"));
    assert(html.includes("fbq('track', 'Lead')"));
    assert(html.includes('Unsubscribe anytime'));
    assert(html.indexOf('class="submit-btn"') < html.indexOf('class="privacy"'));
    assert(html.indexOf('class="submit-btn"') < html.indexOf('<footer>'));
  });
}

const watch = readFileSync(resolve(root, 'manifestwatch.html'), 'utf8');
test('manifest watch matches opt-in presentation and keeps original video/checkout', () => {
  const optin = readFileSync(resolve(root, 'manifest.html'), 'utf8');
  assert(watch.includes('class="eyebrow"'));
  assert.equal((watch.match(/class="eyebrow"/g) || []).length, 1);
  assert(watch.includes('🌙 7-MINUTE MANIFESTATION RITUAL'));
  assert(watch.includes('class="optin-card watch-offer"'));
  assert(watch.includes('background:radial-gradient('));
  assert(watch.includes('background:#fffaf6;'));
  assert(watch.includes('4.9/5 · 3,800+ Hypnotic Meditations reviews'));
  assert(watch.includes('Now Watch How the'));
  assert(watch.includes('7-Minute Manifestation Script'));
  assert(watch.includes('https://seanali.online/manifestwatch'));
  assert(!/\\bfree\\b/i.test(watch));
  assert(!watch.includes('class="brand"'));
  assert(watch.includes('id="vid-6966599cbabb3c836813c52f"'));
  assert(watch.includes('https://scripts.converteai.net/06805447-0fe0-4045-89f5-ea45443a5071/players/6966599cbabb3c836813c52f/v4/player.js'));
  assert(watch.includes('https://pay.hotmart.com/F102533819G?checkoutMode=10'));
  assert(watch.includes('https://trythescript.com/tools/7-night-tracker.html'));
  assert(watch.includes("hot('account','3a3058a6-7369-3d97-a1a0-ba9baed71541')"));
  assert(watch.includes('/assets/manifest-script-events.js'));
  assert(watch.includes('fbq(\'init\',\'1586097145783190\')'));
  assert(watch.includes('fbq(\'init\',\'878451855254470\')'));
  assert(optin.includes('name="redirect" value="https://seanali.online/manifestwatch?source=script-lead"'));
});
