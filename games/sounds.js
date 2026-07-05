(() => {
  function loadBreadcrumbs() {
    if (window.SeanGameBreadcrumbsLoaded) return;
    window.SeanGameBreadcrumbsLoaded = true;
    const script = document.createElement('script');
    script.src = '/games/breadcrumbs.js';
    script.defer = true;
    document.body.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBreadcrumbs);
  } else {
    loadBreadcrumbs();
  }
})();

window.SeanGameSounds = (() => {
  let enabled = true;
  let ctx = null;

  function audio() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type = 'sine', vol = 0.18, delay = 0) {
    if (!enabled) return;
    const a = audio();
    const t = a.currentTime + delay;
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(a.destination);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }

  function ding() {
    tone(740, 0.08, 'triangle', 0.22, 0);
    tone(980, 0.10, 'triangle', 0.18, 0.07);
    tone(1320, 0.12, 'sine', 0.13, 0.15);
  }

  function wrong() {
    tone(180, 0.16, 'sawtooth', 0.12, 0);
    tone(130, 0.18, 'sawtooth', 0.10, 0.10);
  }

  function money() {
    tone(1040, 0.06, 'square', 0.18, 0);
    tone(1320, 0.06, 'square', 0.16, 0.08);
    tone(1560, 0.08, 'triangle', 0.14, 0.16);
    tone(1960, 0.11, 'sine', 0.12, 0.25);
  }

  function toggle() {
    enabled = !enabled;
    return enabled;
  }

  function setEnabled(value) {
    enabled = Boolean(value);
    return enabled;
  }

  function isEnabled() {
    return enabled;
  }

  return { ding, wrong, money, toggle, setEnabled, isEnabled };
})();
