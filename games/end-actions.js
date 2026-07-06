(() => {
  if (location.pathname.replace(/\/+$/, '/') === '/games/' || window.GameEndActionsLoaded) return;
  window.GameEndActionsLoaded = true;

  const path = location.pathname.replace(/\/+$/, '/') || '/';
  const hasLevelTwo = new Set(['/games/mirror/','/games/money/']);
  const progressKey = 'seanGameMapProgress:v1';
  const completedKey = 'seanGameMapCompleted:v1';
  const labels = {
    en: { play:'🔁 Play Again', next:'🚀 Next Level', menu:'🏠 Main Menu', title:'What next?', unlocked:'🗺️ New map portal unlocked!' },
    es: { play:'🔁 Jugar otra vez', next:'🚀 Siguiente nivel', menu:'🏠 Menú principal', title:'¿Qué sigue?', unlocked:'🗺️ ¡Nuevo portal desbloqueado!' }
  };

  function isEs(){ return localStorage.getItem('seanGameLang') === 'es'; }
  function t(key){ return labels[isEs() ? 'es' : 'en'][key]; }

  const style = document.createElement('style');
  style.textContent = `
    .game-end-actions{background:#fff;border:5px solid #101436;border-radius:26px;padding:14px;margin:14px auto;max-width:560px;box-shadow:0 9px 0 rgba(0,0,0,.22),0 0 28px rgba(255,200,61,.35);font-family:Arial,sans-serif;color:#101436;text-align:center}.game-end-title{font-size:24px;font-weight:900;margin-bottom:10px;background:#ffc83d;border:3px solid #101436;border-radius:18px;padding:8px}.game-map-unlocked{font-size:16px;font-weight:900;margin:-2px 0 10px;background:#f1fff3;border:3px solid #34d17a;border-radius:16px;padding:8px}.game-end-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.game-end-btn{border:4px solid #101436;border-radius:18px;padding:14px 8px;font-size:17px;font-weight:900;color:#101436;background:linear-gradient(180deg,#fff26f,#ffc83d);box-shadow:0 6px 0 rgba(0,0,0,.24);cursor:pointer;line-height:1.05}.game-end-btn:active{transform:translateY(5px);box-shadow:0 1px 0 rgba(0,0,0,.24)}.game-end-next{background:linear-gradient(180deg,#d9ffe9,#34d17a)}.game-end-menu{background:linear-gradient(180deg,#e8fbff,#80d8ff)}@media(max-width:460px){.game-end-grid{grid-template-columns:1fr}.game-end-btn{font-size:18px}.game-end-title{font-size:21px}}
  `;
  document.head.appendChild(style);

  function roundDoneByMeter(){
    const count = document.querySelector('.game-progress-count')?.textContent || '';
    const m = count.match(/(?:Step|Paso)\s+(\d+)\s+(?:of|de)\s+(\d+)/i);
    if (!m) return false;
    const current = parseInt(m[1],10);
    const total = parseInt(m[2],10);
    return Number.isFinite(current) && Number.isFinite(total) && current >= total;
  }

  function explicitEndVisible(){
    const reward = document.querySelector('#reward.show,.reward.show,.game-end,.end-screen,.win-screen,.complete-screen');
    if (reward && /complete|badge|winner|you win|level 1 done|level 2 complete|completo|ganaste|terminado/i.test(reward.textContent || '')) return true;
    const choices = document.querySelector('#choices,.choices,.answers');
    if (choices && /start level 2|play again|start over|main menu|jugar otra vez|siguiente nivel/i.test(choices.textContent || '')) return true;
    const feedback = document.querySelector('#feedback,.feedback,.helper,.lesson');
    if (feedback && /level 1 done|level 2 complete|complete!|completed|you finished|completo|terminado/i.test(feedback.textContent || '')) return true;
    return false;
  }

  function looksDone(){
    return explicitEndVisible() || roundDoneByMeter();
  }

  function unlockMapPortal(){
    let completed = [];
    try { completed = JSON.parse(localStorage.getItem(completedKey) || '[]'); } catch(e) {}
    if (completed.includes(path)) return false;
    completed.push(path);
    localStorage.setItem(completedKey, JSON.stringify(completed));
    const current = parseInt(localStorage.getItem(progressKey) || '3', 10) || 3;
    localStorage.setItem(progressKey, String(Math.min(99, current + 1)));
    return true;
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
    const unlocked = unlockMapPortal();

    const box = document.createElement('div');
    box.className = 'game-end-actions';
    box.innerHTML = '<div class="game-end-title">' + t('title') + '</div>' + (unlocked ? '<div class="game-map-unlocked">' + t('unlocked') + '</div>' : '') + '<div class="game-end-grid"><button class="game-end-btn game-end-play" type="button">' + t('play') + '</button><button class="game-end-btn game-end-next" type="button">' + t('next') + '</button><button class="game-end-btn game-end-menu" type="button">' + t('menu') + '</button></div>';

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
    const unlocked = box.querySelector('.game-map-unlocked');
    if (unlocked) unlocked.textContent = t('unlocked');
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
