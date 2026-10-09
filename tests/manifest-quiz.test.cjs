// Run with Node and jsdom available in the test environment.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { JSDOM } = require('jsdom');
const root = resolve(__dirname, '..');
const html = readFileSync(resolve(root, 'manifest.html'), 'utf8');
const script = readFileSync(resolve(root, 'assets/manifest-quiz.js'), 'utf8');

function setup() {
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://seanali.online/manifest?utm_source=test&email=private' });
  const w = dom.window, d = w.document, events = [];
  let time = 1000;
  Object.defineProperty(w.performance, 'now', { value: () => time });
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.fbq = (...args) => events.push(args);
  w.eval(script);
  return { w, d, events, close: () => w.close(), tick: () => { time += 400; }, answer(index) { time += 400; d.querySelectorAll('.answer')[index].click(); } };
}

test('all 27 paths personalize the result and preserve the AWeber handoff', () => {
  const headlines = ['Make room for more freedom in your life.', 'Your next chapter can have a direction.', 'There is room for a new chapter.'];
  const blockers = ['same doubts', 'advice can feel overwhelming', "don't need a perfect plan"];
  const feelings = ['More room to breathe.', 'The feeling of moving forward', 'More time. More choice.'];
  const prompts = new Set();
  for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (let c = 0; c < 3; c++) {
    const t = setup();
    try {
      assert.equal(t.d.getElementById('finish').hidden, true);
      [a, b, c].forEach(index => t.answer(index));
      assert.equal(t.d.getElementById('entry').hidden, true);
      assert.equal(t.d.getElementById('finish').hidden, false);
      assert.equal(t.d.activeElement.id, 'finish-title');
      assert.equal(t.d.getElementById('finish-title').textContent, headlines[a]);
      assert(t.d.getElementById('reflection-copy').textContent.includes(blockers[b]));
      assert(t.d.getElementById('finish-feeling').textContent.startsWith(feelings[c]));
      prompts.add(t.d.getElementById('conversation-prompt').textContent);
      const form = t.d.getElementById('manifest-optin-form');
      const data = new t.w.FormData(form);
      assert.equal(form.action, 'https://www.aweber.com/scripts/addlead.pl');
      assert.equal(form.method, 'post');
      assert.equal(data.get('listname'), 'awlist6946418');
      assert.equal(data.get('redirect'), 'https://www.manifestationgenie.ai');
      assert.equal(data.get('meta_redirect_onlist'), 'https://www.manifestationgenie.ai');
      assert.equal(data.get('meta_required'), 'name,email');
      assert.deepEqual([...data.keys()].sort(), ['name', 'email', 'listname', 'redirect', 'meta_redirect_onlist', 'meta_tags', 'meta_adtracking', 'meta_required'].sort());
      assert.equal(t.events.filter(e => e[1] === 'ManifestQuizStart').length, 1);
      assert.equal(t.events.filter(e => e[1] === 'ManifestQuizComplete').length, 1);
      assert(!JSON.stringify(t.events).includes('private'));
      t.d.getElementById('restart').click();
      assert.equal(t.d.getElementById('finish').hidden, true);
      assert.equal(t.d.querySelector('[aria-pressed="true"]'), null);
      assert.equal(t.d.activeElement.id, 'question-title');
    } finally { t.close(); }
  }
  assert.equal(prompts.size, 27);
});

test('Back restores the selection, return preserves progress, and rapid clicks cannot skip questions', () => {
  const t = setup();
  try {
    t.answer(1);
    t.d.querySelector('.answer').click();
    assert.equal(t.d.getElementById('step-label').textContent, 'Question 2 of 3');
    t.d.getElementById('return-to-quiz').click();
    assert.equal(t.d.getElementById('step-label').textContent, 'Question 2 of 3');
    t.d.getElementById('back').click();
    assert.equal(t.d.querySelectorAll('.answer')[1].getAttribute('aria-pressed'), 'true');
    assert.equal(t.d.querySelector('.progress-track').getAttribute('aria-valuenow'), '0');
    t.answer(2); t.answer(0); t.answer(1);
    assert.equal(t.d.getElementById('finish-title').textContent, 'There is room for a new chapter.');
    t.d.getElementById('restart').click();
    t.answer(0); t.answer(0); t.answer(0);
    assert.equal(t.events.filter(e => e[1] === 'ManifestQuizComplete').length, 1);
  } finally { t.close(); }
});

test('form rejects invalid data and survives unavailable storage or analytics', () => {
  const t = setup();
  try {
    t.answer(0); t.answer(0); t.answer(0);
    const form = t.d.getElementById('manifest-optin-form');
    const submit = () => form.dispatchEvent(new t.w.Event('submit', { bubbles: true, cancelable: true }));
    assert.equal(submit(), false);
    t.d.getElementById('manifest-name').value = '   ';
    t.d.getElementById('manifest-email').value = 'invalid';
    assert.equal(submit(), false);
    t.d.getElementById('manifest-name').value = 'Test';
    t.d.getElementById('manifest-email').value = 'test@example.com';
    Object.defineProperty(t.w, 'sessionStorage', { get() { throw new Error('disabled'); } });
    t.w.fbq = () => { throw new Error('blocked'); };
    assert.equal(submit(), true);
    assert.equal(t.d.getElementById('manifest-submit').disabled, true);
    assert.equal(submit(), false);
    t.w.dispatchEvent(new t.w.Event('pageshow'));
    assert.equal(t.d.getElementById('manifest-submit').disabled, false);
  } finally { t.close(); }
});

test('existing pixels, consent, fallback and clean canonical are present', () => {
  for (const marker of ['878451855254470', '1586097145783190', "fbq('track','PageView')", 'Unsubscribe anytime', '<noscript>', 'https://seanali.online/manifest']) assert(html.includes(marker));
  assert(!html.includes('10x Faster'));
  assert(!html.includes('3,000+'));
});
