(() => {
  function loadSharedGameScripts() {
    const scripts = [
      { global: 'SeanGameAppViewReady', src: '/games/app-view.js' },
      { global: 'SeanGameBreadcrumbsReady', src: '/games/breadcrumbs.js' },
      { global: 'SeanGameLangReady', src: '/games/lang.js' }
    ];

    scripts.forEach(item => {
      if (window[item.global] || document.querySelector(`script[src="${item.src}"]`)) return;
      const script = document.createElement('script');
      script.src = item.src;
      script.defer = true;
      document.body.appendChild(script);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSharedGameScripts);
  } else {
    loadSharedGameScripts();
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

  function tap() {
    tone(520, 0.04, 'triangle', 0.08, 0);
  }

  function pop() {
    tone(380, 0.05, 'sine', 0.10, 0);
    tone(760, 0.05, 'triangle', 0.07, 0.04);
  }

  function ding() {
    tone(740, 0.08, 'triangle', 0.22, 0);
    tone(980, 0.10, 'triangle', 0.18, 0.07);
    tone(1320, 0.12, 'sine', 0.13, 0.15);
  }

  function correct() {
    ding();
    sparkle(0.16);
  }

  function wrong() {
    tone(180, 0.16, 'sawtooth', 0.12, 0);
    tone(130, 0.18, 'sawtooth', 0.10, 0.10);
  }

  function softWrong() {
    tone(260, 0.09, 'triangle', 0.06, 0);
    tone(190, 0.12, 'triangle', 0.05, 0.08);
  }

  function money() {
    tone(1040, 0.06, 'square', 0.18, 0);
    tone(1320, 0.06, 'square', 0.16, 0.08);
    tone(1560, 0.08, 'triangle', 0.14, 0.16);
    tone(1960, 0.11, 'sine', 0.12, 0.25);
  }

  function coin() {
    tone(1180, 0.05, 'square', 0.13, 0);
    tone(1760, 0.08, 'triangle', 0.09, 0.05);
  }

  function sparkle(delay = 0) {
    tone(1540, 0.05, 'sine', 0.06, delay);
    tone(1980, 0.05, 'sine', 0.05, delay + 0.05);
    tone(2380, 0.06, 'sine', 0.04, delay + 0.10);
  }

  function unlock() {
    tone(392, 0.12, 'triangle', 0.12, 0);
    tone(523, 0.12, 'triangle', 0.10, 0.10);
    tone(659, 0.14, 'triangle', 0.09, 0.20);
    tone(1046, 0.18, 'sine', 0.08, 0.32);
  }

  function levelUp() {
    tone(440, 0.09, 'triangle', 0.13, 0);
    tone(660, 0.09, 'triangle', 0.11, 0.08);
    tone(880, 0.12, 'triangle', 0.10, 0.16);
    tone(1320, 0.18, 'sine', 0.08, 0.28);
  }

  function portal() {
    tone(220, 0.16, 'sine', 0.09, 0);
    tone(440, 0.18, 'triangle', 0.07, 0.10);
    tone(880, 0.20, 'sine', 0.06, 0.22);
    sparkle(0.32);
  }

  function whoosh() {
    tone(260, 0.08, 'sine', 0.05, 0);
    tone(520, 0.10, 'triangle', 0.05, 0.06);
    tone(960, 0.12, 'sine', 0.04, 0.13);
  }

  function water() {
    tone(440, 0.10, 'sine', 0.05, 0);
    tone(620, 0.12, 'sine', 0.04, 0.10);
    tone(510, 0.12, 'sine', 0.035, 0.22);
  }

  function wind() {
    tone(260, 0.20, 'sine', 0.035, 0);
    tone(370, 0.25, 'triangle', 0.025, 0.12);
  }

  function earth() {
    tone(90, 0.18, 'sine', 0.08, 0);
    tone(145, 0.12, 'triangle', 0.04, 0.08);
  }

  function piano(note = 'C') {
    const map = { C:261.63, D:293.66, E:329.63, F:349.23, G:392, A:440, B:493.88, C2:523.25 };
    const f = map[note] || map.C;
    tone(f, 0.28, 'triangle', 0.11, 0);
    tone(f * 2, 0.16, 'sine', 0.04, 0.01);
  }

  function food() {
    pop();
    tone(760, 0.06, 'triangle', 0.06, 0.05);
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

  return { tap, pop, ding, correct, wrong, softWrong, money, coin, sparkle, unlock, levelUp, portal, whoosh, water, wind, earth, piano, food, toggle, setEnabled, isEnabled };
})();
