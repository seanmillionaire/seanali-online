// Manifest now uses the existing Try the Script /join opt-in funnel.
// Verify both public routes keep the original AWeber handoff and pixels.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');
const root = resolve(__dirname, '..');
const variants = ['manifest.html', 'manifestscreen.html'];
for (const page of variants) {
  const html = readFileSync(resolve(root, page), 'utf8');
  test(page + ': has manifestation copy and source opt-in appearance', () => {
    assert(html.includes('7-Minute Manifestation Script Before Bed'));
    assert(html.includes('class="optin-card"'));
    assert(html.includes('class="hero-image"'));
    assert(html.includes('name="name"'));
    assert(html.includes('name="email"'));
    assert(html.includes('SHOW ME THE 7-MINUTE SCRIPT'));
    assert(!html.includes('id="quiz"'));
    assert(!html.includes('manifest-quiz.js'));
    assert(html.includes('https://seanali.online/' + page.replace(/\.html$/, '')));
  });
  test(page + ': preserves Try the Script AWeber funnel destination', () => {
    assert(html.includes('action="https://www.aweber.com/scripts/addlead.pl"'));
    assert(html.includes('name="meta_web_form_id" value="184900578"'));
    assert(html.includes('name="listname" value="awlist6889085"'));
    assert(html.includes('name="redirect" value="https://trythescript.com/watch?source=script-lead"'));
    assert(html.includes('name="meta_message" value="1"'));
    assert(html.includes('name="meta_required" value="name,email"'));
    assert(!html.includes('https://www.manifestationgenie.ai'));
  });
  test(page + ': loads self-hosted Script funnel assets and tracks valid lead', () => {
    for (const [asset, ref] of [
      ['manifest-script-events.js', '/assets/manifest-script-events.js?v=20261010'],
      ['manifest-script-reset.js', '/assets/manifest-script-reset.js?v=20261010'],
      ['manifest-script-reset.css', '/assets/manifest-script-reset.css?v=20261010']
    ]) {
      assert(existsSync(resolve(root, 'assets', asset)));
      assert(html.includes(ref));
    }
    assert(html.includes("fbq('init', '1586097145783190')"));
    assert(html.includes("fbq('init', '878451855254470')"));
    assert(html.includes("fbq('track', 'Lead')"));
    assert(html.includes('Unsubscribe anytime'));
  });
}
