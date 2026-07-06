(() => {
  if (window.GameProgressMeterLoaded) return;
  window.GameProgressMeterLoaded = true;

  const path = location.pathname.replace(/\/+$/, '/') || '/';
  if (path === '/games/') return;

  const configs = {
    '/games/mirror/': { total: 8, label: 'Mirror rounds', finish: 'Finish: clear all 8 mirrors 🪞' },
    '/games/math-race/': { total: 12, label: 'Race rounds', finish: 'Finish: complete 12 math rounds 🏁' },
    '/games/math-dissector/': { total: 10, label: 'Brain rounds', finish: 'Finish: solve the full set 🧠' },
    '/games/elements/': { total: 10, label: 'Nature rounds', finish: 'Finish: master the elements 🌎' },
    '/games/family-gems/': { total: 10, label: 'Gem rounds', finish: 'Finish: collect the country gems 💎' },
    '/games/tongue-twister/': { total: 8, label: 'Speaking rounds', finish: 'Finish: say every phrase clearly 🗣️' },
    '/games/food-groups/': { total: 10, label: 'Food rounds', finish: 'Finish: unlock simple food wisdom 🥑' },
    '/games/beats/': { total: 8, label: 'Beat session', finish: 'Finish: make 8 beat moves 🥁' },
    '/games/family/': { total: 10, label: 'Life rounds', finish: 'Finish: choose 10 helpful actions 💛' },
    '/games/money/': { total: 10, label: 'Money rounds', finish: 'Finish: build money wisdom 💰' },
    '/games/piano/': { total: 8, label: 'Pattern session', finish: 'Finish: play 8 music moves 🎹' },
    '/games/selva/': { total: 10, label: 'Jungle rounds', finish: 'Finish: open the jungle chest 🌿' },
    '/games/angelique/reproduccion/': { total: 10, label: 'Rush rounds', finish: 'Finish: complete the A/B rush ⚡' }
  };

  const cfg = configs[path] || { total: 10, label: 'Game rounds', finish: 'Finish: complete the game 🏆' };
  const stateKey = 'gameProgressMoves:' + path;
  let manualMoves = Number(localStorage.getItem(stateKey) || 0);

  const style = document.createElement('style');
  style.textContent = `
    .game-progress-meter{background:#fff;border:4px solid #101436;border-radius:22px;margin:10px 12px;padding:10px;box-shadow:0 7px 0 rgba(0,0,0,.18);font-family:Arial,sans-serif;color:#101436}.game-progress-top{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:16px;font-weight:900}.game-progress-main{display:flex;align-items:center;gap:7px}.game-progress-main span:first-child{font-size:22px}.game-progress-track{height:18px;background:#edf0f5;border:3px solid #101436;border-radius:999px;overflow:hidden;margin:8px 0}.game-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#34d17a,#ffc83d,#ff62b7);transition:width .35s}.game-progress-finish{font-size:14px;font-weight:900;text-align:center;background:#f1fff3;border:2px solid #34d17a;border-radius:14px;padding:7px 8px;line-height:1.1}@media(max-width:430px){.game-progress-top{font-size:14px}.game-progress-finish{font-size:13px}.game-progress-meter{margin:8px 10px;padding:8px}}
  `;
  document.head.appendChild(style);

  const meter = document.createElement('div');
  meter.className = 'game-progress-meter';
  meter.innerHTML = '<div class="game-progress-top"><div class="game-progress-main"><span>🏁</span><span class="game-progress-label"></span></div><div class="game-progress-count"></div></div><div class="game-progress-track"><div class="game-progress-fill"></div></div><div class="game-progress-finish"></div>';

  function numberFrom(el) {
    const n = parseInt((el && el.textContent || '').match(/\d+/)?.[0] || '', 10);
    return Number.isFinite(n) ? n : null;
  }

  function detectRound() {
    const roundEl = document.querySelector('#round,.round,[data-round]');
    let current = numberFrom(roundEl);
    if (!current) current = Math.max(1, manualMoves + 1);
    return Math.max(1, Math.min(cfg.total, current));
  }

  function detectTotal() {
    const roundEl = document.querySelector('#round,.round,[data-round]');
    const text = roundEl ? roundEl.parentElement?.textContent || roundEl.textContent : '';
    const match = String(text).match(/\/\s*(\d+)/);
    const total = match ? parseInt(match[1], 10) : cfg.total;
    return Number.isFinite(total) ? total : cfg.total;
  }

  function render() {
    const total = detectTotal();
    const current = detectRound();
    const done = Math.max(0, Math.min(total, current - 1));
    const percent = Math.max(4, Math.min(100, (done / total) * 100));
    meter.querySelector('.game-progress-label').textContent = cfg.label;
    meter.querySelector('.game-progress-count').textContent = 'Step ' + current + ' of ' + total;
    meter.querySelector('.game-progress-fill').style.width = percent + '%';
    meter.querySelector('.game-progress-finish').textContent = cfg.finish;
  }

  function mount() {
    if (document.querySelector('.game-progress-meter')) return;
    const top = document.querySelector('.top') || document.querySelector('header') || document.querySelector('main') || document.body;
    if (top && top.parentElement) top.insertAdjacentElement('afterend', meter);
    else document.body.prepend(meter);
    render();
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('button,.choice,.answer,.pad,.key')) return;
    manualMoves += 1;
    localStorage.setItem(stateKey, String(Math.min(999, manualMoves)));
    setTimeout(render, 160);
  }, true);

  const observer = new MutationObserver(() => {
    clearTimeout(window.__gameProgressTimer);
    window.__gameProgressTimer = setTimeout(render, 80);
  });

  function run() {
    mount();
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    setInterval(render, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
