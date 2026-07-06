(() => {
  if (window.GameProgressMeterLoaded) return;
  window.GameProgressMeterLoaded = true;

  const path = location.pathname.replace(/\/+$/, '/') || '/';
  if (path === '/games/') return;

  const configs = {
    '/games/mirror/': { total: 8, label: 'Mirror rounds', finish: 'Finish: clear all 8 mirrors 🪞', esLabel: 'Rondas del espejo', esFinish: 'Meta: aclara los 8 espejos 🪞' },
    '/games/math-race/': { total: 12, label: 'Race rounds', finish: 'Finish: complete 12 math rounds 🏁', esLabel: 'Rondas de carrera', esFinish: 'Meta: completa 12 rondas 🏁' },
    '/games/math-dissector/': { total: 10, label: 'Brain rounds', finish: 'Finish: solve the full set 🧠', esLabel: 'Rondas del cerebro', esFinish: 'Meta: resuelve todo 🧠' },
    '/games/elements/': { total: 10, label: 'Nature rounds', finish: 'Finish: master the elements 🌎', esLabel: 'Rondas de naturaleza', esFinish: 'Meta: domina los elementos 🌎' },
    '/games/family-gems/': { total: 12, label: 'Gem rounds', finish: 'Finish: collect the country gems 💎', esLabel: 'Rondas de gemas', esFinish: 'Meta: junta las gemas 💎' },
    '/games/tongue-twister/': { total: 8, label: 'Speaking rounds', finish: 'Finish: say every phrase clearly 🗣️', esLabel: 'Rondas de habla', esFinish: 'Meta: di cada frase claro 🗣️' },
    '/games/food-groups/': { total: 10, label: 'Food rounds', finish: 'Finish: unlock simple food wisdom 🥑', esLabel: 'Rondas de comida', esFinish: 'Meta: aprende comida simple 🥑' },
    '/games/beats/': { total: 8, label: 'Beat session', finish: 'Finish: make 8 beat moves 🥁', esLabel: 'Sesión de ritmo', esFinish: 'Meta: haz 8 ritmos 🥁' },
    '/games/family/': { total: 10, label: 'Life rounds', finish: 'Finish: choose 10 helpful actions 💛', esLabel: 'Rondas de vida', esFinish: 'Meta: elige 10 acciones 💛' },
    '/games/money/': { total: 10, label: 'Money rounds', finish: 'Finish: build money wisdom 💰', esLabel: 'Rondas de dinero', esFinish: 'Meta: aprende dinero 💰' },
    '/games/piano/': { total: 8, label: 'Pattern session', finish: 'Finish: play 8 music moves 🎹', esLabel: 'Sesión de música', esFinish: 'Meta: toca 8 movimientos 🎹' },
    '/games/selva/': { total: 10, label: 'Jungle rounds', finish: 'Finish: open the jungle chest 🌿', esLabel: 'Rondas de selva', esFinish: 'Meta: abre el cofre 🌿' },
    '/games/angelique/reproduccion/': { total: 10, label: 'Rush rounds', finish: 'Finish: complete the A/B rush ⚡', esLabel: 'Rondas rápidas', esFinish: 'Meta: completa el reto ⚡' }
  };

  const cfg = configs[path] || { total: 10, label: 'Game rounds', finish: 'Finish: complete the game 🏆', esLabel: 'Rondas del juego', esFinish: 'Meta: completa el juego 🏆' };
  const stateKey = 'gameProgressMoves:' + path;
  let manualMoves = Number(localStorage.getItem(stateKey) || 0);
  const isEs = () => localStorage.getItem('seanGameLang') === 'es';

  const style = document.createElement('style');
  style.textContent = `
    .game-progress-meter{background:#fff;border:4px solid #101436;border-radius:22px;margin:10px 12px;padding:10px;box-shadow:0 7px 0 rgba(0,0,0,.18);font-family:Arial,sans-serif;color:#101436}.game-progress-top{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:16px;font-weight:900}.game-progress-main{display:flex;align-items:center;gap:7px}.game-progress-main span:first-child{font-size:22px}.game-progress-track{height:18px;background:#edf0f5;border:3px solid #101436;border-radius:999px;overflow:hidden;margin:8px 0}.game-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#34d17a,#ffc83d,#ff62b7);transition:width .35s}.game-progress-finish{font-size:14px;font-weight:900;text-align:center;background:#f1fff3;border:2px solid #34d17a;border-radius:14px;padding:7px 8px;line-height:1.1}.xp,.barBox,.progress,.progressBox,.progress-wrap,.meter,.old-progress{display:none!important}@media(max-width:430px){.game-progress-top{font-size:14px}.game-progress-finish{font-size:13px}.game-progress-meter{margin:8px 10px;padding:8px}}
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
    meter.querySelector('.game-progress-label').textContent = isEs() ? cfg.esLabel : cfg.label;
    meter.querySelector('.game-progress-count').textContent = isEs() ? ('Paso ' + current + ' de ' + total) : ('Step ' + current + ' of ' + total);
    meter.querySelector('.game-progress-fill').style.width = percent + '%';
    meter.querySelector('.game-progress-finish').textContent = isEs() ? cfg.esFinish : cfg.finish;
  }

  function hideOldBars() {
    document.querySelectorAll('.xp,.barBox,.progress,.progressBox,.progress-wrap,.meter,.old-progress').forEach(el => {
      if (!el.closest('.game-progress-meter')) el.style.setProperty('display', 'none', 'important');
    });
  }

  function mount() {
    if (document.querySelector('.game-progress-meter')) return;
    const top = document.querySelector('.top') || document.querySelector('header') || document.querySelector('main') || document.body;
    if (top && top.parentElement) top.insertAdjacentElement('afterend', meter);
    else document.body.prepend(meter);
    hideOldBars();
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
    window.__gameProgressTimer = setTimeout(() => { hideOldBars(); render(); }, 80);
  });

  function run() {
    mount();
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true });
    setInterval(() => { hideOldBars(); render(); }, 1000);
  }

  window.addEventListener('seanGameLangChange', () => setTimeout(render, 80));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
