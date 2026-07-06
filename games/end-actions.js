(() => {
  if (location.pathname.replace(/\/+$/, '/') === '/games/' || window.GameEndActionsLoaded) return;
  window.GameEndActionsLoaded = true;

  const path = location.pathname.replace(/\/+$/, '/') || '/';
  const hasLevelTwo = new Set(['/games/mirror/','/games/money/']);
  const labels = {
    en: { play:'🔁 Play Again', next:'🚀 Next Level', menu:'🏠 Main Menu', title:'What next?' },
    es: { play:'🔁 Jugar otra vez', next:'🚀 Siguiente nivel', menu:'🏠 Menú principal', title:'¿Qué sigue?' }
  };

  function isEs(){ return localStorage.getItem('seanGameLang') === 'es'; }
  function t(key){ return labels[isEs() ? 'es' : 'en'][key]; }

  const style = document.createElement('style');
  style.textContent = `
    .game-end-actions{background:#fff;border:5px solid #101436;border-radius:26px;padding:14px;margin:14px auto;max-width:560px;box-shadow:0 9px 0 rgba(0,0,0,.22),0 0 28px rgba(255,200,61,.35);font-family:Arial,sans-serif;color:#101436;text-align:center}.game-end-title{font-size:24px;font-weight:900;margin-bottom:10px;background:#ffc83d;border:3px solid #101436;border-radius:18px;padding:8px}.game-end-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.game-end-btn{border:4px solid #101436;border-radius:18px;padding:14px 8px;font-size:17px;font-weight:900;color:#101436;background:linear-gradient(180deg,#fff26f,#ffc83d);box-shadow:0 6px 0 rgba(0,0,0,.24);cursor:pointer;line-height:1.05}.game-end-btn:active{transform:translateY(5px);box-shadow:0 1px 0 rgba(0,0,0,.24)}.game-end-next{background:linear-gradient(180deg,#d9ffe9,#34d17a)}.game-end-menu{background:linear-gradient(180deg,#e8fbff,#80d8ff)}@media(max-width:460px){.game-end-grid{grid-template-columns:1fr}.game-end-btn{font-size:18px}.game-end-title{font-size:21px}}
  `;
  document.head.appendChild(style);

  function looksDone(){
    const text = document.body.innerText || '';
    return /complete|completed|finished|finish|badge|play again|start over|level 1 done|level 2 complete|Genie Mode|Reality Level|winner|you win|done\.|completo|terminado|ganaste|jugar otra vez/i.test(text);
  }

  function findMount(){
    return document.querySelector('#choices,.choices,.answers') || document.querySelector('#reward,.reward,#feedback,.feedback,.helper,.lesson') || document.querySelector('main') || document.body;
  }

  function startNextLevel(){
    const mirrorBtn = document.querySelector('.mirror-level-two-btn');
    const moneyBtn = document.querySelector('.money-level-two-btn');
    if (mirrorBtn) { mirrorBtn.click(); return; }
    if (moneyBtn) { moneyBtn.click(); return; }
    window.dispatchEvent(new CustomEvent('seanGameNextLevelRequest', { detail:{ path } }));
    const existing = document.querySelector('.choice,.answer,button');
    if (existing && hasLevelTwo.has(path)) existing.click();
  }

  function addActions(){
    if (document.querySelector('.game-end-actions')) return;
    if (!looksDone()) return;
    const mount = findMount();
    if (!mount) return;

    const box = document.createElement('div');
    box.className = 'game-end-actions';
    box.innerHTML = '<div class="game-end-title">' + t('title') + '</div><div class="game-end-grid"><button class="game-end-btn game-end-play" type="button">' + t('play') + '</button><button class="game-end-btn game-end-next" type="button">' + t('next') + '</button><button class="game-end-btn game-end-menu" type="button">' + t('menu') + '</button></div>';

    box.querySelector('.game-end-play').onclick = () => location.reload();
    box.querySelector('.game-end-next').onclick = startNextLevel;
    box.querySelector('.game-end-menu').onclick = () => location.href = '/games/';

    if (mount.matches('#choices,.choices,.answers')) mount.insertAdjacentElement('afterend', box);
    else mount.appendChild(box);
  }

  function refreshLang(){
    const box = document.querySelector('.game-end-actions');
    if (!box) return;
    box.querySelector('.game-end-title').textContent = t('title');
    box.querySelector('.game-end-play').textContent = t('play');
    box.querySelector('.game-end-next').textContent = t('next');
    box.querySelector('.game-end-menu').textContent = t('menu');
  }

  window.addEventListener('seanGameLangChange', () => setTimeout(refreshLang, 80));
  setInterval(addActions, 700);
  new MutationObserver(() => {
    clearTimeout(window.__gameEndActionsTimer);
    window.__gameEndActionsTimer = setTimeout(addActions, 120);
  }).observe(document.body, { childList:true, subtree:true, characterData:true });
})();
