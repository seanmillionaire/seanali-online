(() => {
  function loadSharedGameScripts() {
    const gamePath = window.location.pathname.replace(/\/+$/, '/');
    const isGamePage = gamePath !== '/games/';
    const scripts = [
      { global: 'SeanGameAppViewReady', src: '/games/app-view.js' },
      { global: 'SeanGameBreadcrumbsReady', src: '/games/breadcrumbs.js' },
      { global: 'SeanGameLangReady', src: '/games/lang.js' },
      { global: 'GameAutoEsLoaded', src: '/games/auto-es.js?v=1' },
      { global: 'BuddyGuideHelpLoaded', src: '/games/buddy-guide-help.js?v=1' }
    ];
    if (isGamePage) {
      scripts.push({ global: 'GameProgressMeterLoaded', src: '/games/game-progress.js?v=2' });
      scripts.push({ global: 'GameFirstScreenGuideLoaded', src: '/games/first-screen-guide.js?v=3' });
      scripts.push({ global: 'GamePolishLoaded', src: '/games/game-polish.js?v=2' });
      scripts.push({ global: 'GameEndActionsLoaded', src: '/games/end-actions.js?v=1' });
      scripts.push({ global: 'GameWrongEffectLoaded', src: '/games/wrong-effect.js?v=1' });
      scripts.push({ global: 'GameMistakeReaderLoaded', src: '/games/mistake-reader.js?v=2' });
    }
    if (gamePath === '/games/mirror/') {
      scripts.push({ global: 'MirrorFairChoicesLoaded', src: '/games/mirror/fair-choices.js?v=1' });
      scripts.push({ global: 'MirrorLevelTwoLoaded', src: '/games/mirror/level-two.js?v=1' });
    }
    if (gamePath === '/games/money/') scripts.push({ global: 'MoneyLevelTwoLoaded', src: '/games/money/level-two.js?v=1' });
    if (gamePath === '/games/math-race/') scripts.push({ global: 'MathRaceNoGreyLinesLoaded', src: '/games/math-race/no-grey-lines.js?v=1' });
    if (gamePath === '/games/math-dissector/') scripts.push({ global: 'MathDissectorEsFixLoaded', src: '/games/math-dissector/es-fix.js?v=2' });
    if (gamePath === '/games/elements/') scripts.push({ global: 'ElementsClueBarLoaded', src: '/games/elements/clue-bar.js?v=1' });
    if (gamePath === '/games/family-gems/') {
      scripts.push({ global: 'FamilyGemsClueRiddlesLoaded', src: '/games/family-gems/clue-riddles.js?v=2' });
      scripts.push({ global: 'CountryGemsNameLoaded', src: '/games/family-gems/country-name.js?v=1' });
    }
    if (gamePath === '/games/piano/') scripts.push({ global: 'PianoFreestyleLoaded', src: '/games/piano/freestyle.js?v=1' });

    scripts.forEach(item => {
      if (window[item.global] || document.querySelector(`script[src^="${item.src.split('?')[0]}"]`)) return;
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

  function unlock() {
    if (!enabled) return;
    try { audio(); } catch (e) {}
  }

  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('click', unlock, { passive: true });

  function tone(freq, dur, type = 'sine', vol = 0.24, delay = 0) {
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

  function tap() { tone(520, 0.04, 'triangle', 0.11, 0); }
  function pop() { tone(380, 0.05, 'sine', 0.14, 0); tone(760, 0.05, 'triangle', 0.10, 0.04); }

  function ding() {
    tone(660, 0.06, 'triangle', 0.22, 0);
    tone(880, 0.08, 'triangle', 0.20, 0.055);
    tone(1320, 0.10, 'sine', 0.16, 0.13);
    tone(1760, 0.08, 'sine', 0.10, 0.22);
  }

  function correct() { ding(); sparkle(0.16); }

  function wrong() {
    tone(160, 0.10, 'square', 0.15, 0);
    tone(105, 0.16, 'sawtooth', 0.11, 0.075);
  }

  function softWrong() {
    tone(260, 0.08, 'triangle', 0.08, 0);
    tone(190, 0.12, 'triangle', 0.06, 0.07);
  }

  function money() {
    tone(392, 0.08, 'triangle', 0.16, 0);
    tone(523, 0.08, 'triangle', 0.15, 0.08);
    tone(659, 0.09, 'triangle', 0.14, 0.16);
    tone(784, 0.12, 'triangle', 0.13, 0.25);
    tone(1046, 0.18, 'sine', 0.11, 0.38);
  }

  function jingle() {
    tone(523, 0.08, 'triangle', 0.16, 0);
    tone(659, 0.08, 'triangle', 0.15, 0.08);
    tone(784, 0.10, 'triangle', 0.14, 0.16);
    tone(1046, 0.16, 'sine', 0.11, 0.28);
    sparkle(0.40);
  }

  function coin() { tone(1180, 0.05, 'square', 0.16, 0); tone(1760, 0.08, 'triangle', 0.12, 0.05); }
  function sparkle(delay = 0) { tone(1540, 0.05, 'sine', 0.07, delay); tone(1980, 0.05, 'sine', 0.06, delay + 0.05); tone(2380, 0.06, 'sine', 0.05, delay + 0.10); }
  function unlockSound() { money(); sparkle(0.42); }
  function levelUp() { tone(440, 0.09, 'triangle', 0.15, 0); tone(660, 0.09, 'triangle', 0.13, 0.08); tone(880, 0.12, 'triangle', 0.12, 0.16); tone(1320, 0.18, 'sine', 0.10, 0.28); }
  function portal() { tone(220, 0.16, 'sine', 0.11, 0); tone(440, 0.18, 'triangle', 0.09, 0.10); tone(880, 0.20, 'sine', 0.07, 0.22); sparkle(0.32); }
  function whoosh() { tone(260, 0.08, 'sine', 0.06, 0); tone(520, 0.10, 'triangle', 0.06, 0.06); tone(960, 0.12, 'sine', 0.05, 0.13); }
  function water() { tone(440, 0.10, 'sine', 0.06, 0); tone(620, 0.12, 'sine', 0.05, 0.10); tone(510, 0.12, 'sine', 0.04, 0.22); }
  function wind() { tone(260, 0.20, 'sine', 0.04, 0); tone(370, 0.25, 'triangle', 0.03, 0.12); }
  function earth() { tone(90, 0.18, 'sine', 0.09, 0); tone(145, 0.12, 'triangle', 0.05, 0.08); }
  function piano(note = 'C') { const map = { C:261.63, D:293.66, E:329.63, F:349.23, G:392, A:440, B:493.88, C2:523.25 }; const f = map[note] || map.C; tone(f, 0.28, 'triangle', 0.12, 0); tone(f * 1.25, 0.24, 'sine', 0.07, 0.01); tone(f * 1.5, 0.25, 'sine', 0.07, 0.02); tone(f * 2, 0.16, 'sine', 0.05, 0.03); }
  function food() { pop(); tone(760, 0.06, 'triangle', 0.07, 0.05); }
  function toggle() { enabled = !enabled; return enabled; }
  function setEnabled(value) { enabled = Boolean(value); return enabled; }
  function isEnabled() { return enabled; }

  return { tap, pop, ding, correct, wrong, softWrong, money, coin, sparkle, unlock: unlockSound, levelUp, portal, whoosh, water, wind, earth, piano, food, jingle, toggle, setEnabled, isEnabled };
})();
