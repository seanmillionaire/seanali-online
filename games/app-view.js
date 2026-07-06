(() => {
  const path = window.location.pathname.replace(/\/+$/, '/') || '/';
  if (window.SeanGameAppViewLoaded) return;
  window.SeanGameAppViewLoaded = true;

  if (path.startsWith('/games/angelique/') && !document.querySelector('script[src^="/games/angelique/private-access.js"]')) {
    const gate = document.createElement('script');
    gate.src = '/games/angelique/private-access.js?v=1';
    document.head.appendChild(gate);
  }

  if (path.startsWith('/games/angelique/') && path !== '/games/angelique/' && !document.querySelector('script[src^="/games/angelique/question-reader.js"]')) {
    const reader = document.createElement('script');
    reader.src = '/games/angelique/question-reader.js?v=1';
    document.head.appendChild(reader);
  }

  if (path !== '/games/' && !document.querySelector('link[href="/games/arcade-skin.css"]')) {
    const skin = document.createElement('link');
    skin.rel = 'stylesheet';
    skin.href = '/games/arcade-skin.css';
    document.head.appendChild(skin);
  }

  const style = document.createElement('style');
  style.textContent = `
    html{scroll-behavior:auto!important;scroll-padding-top:0!important}
    body{overflow-x:hidden!important}
    body:not(.games-wall){align-items:center!important;justify-content:flex-start!important;flex-direction:column!important;width:100%!important;padding-top:calc(48px + env(safe-area-inset-top,0px))!important}
    .game,.mpc,.wrap{width:100%!important;flex:0 0 auto!important;scroll-margin-top:24px}
    .game-breadcrumbs{width:100%!important;flex:0 0 auto!important}
    .game-guide-btn,.game-guide-panel{display:none!important;visibility:hidden!important;pointer-events:none!important}
    .game-nudge,.mind.is-nudge{margin:10px 0 12px!important;padding:12px 14px!important;border-radius:18px!important;border:3px solid #ffc83d!important;background:linear-gradient(180deg,#fffdf4,#fff1bd)!important;color:#101436!important;font-size:18px!important;line-height:1.18!important;font-weight:900!important;box-shadow:0 6px 0 rgba(0,0,0,.16)!important;text-align:left!important;text-shadow:none!important;min-height:auto!important}
    .game-nudge b,.mind.is-nudge b{color:#1d144b!important}
    @media(max-width:390px){.game-nudge,.mind.is-nudge{font-size:16px!important;padding:10px 12px!important}}
  `;
  document.head.appendChild(style);

  function lang() {
    return localStorage.getItem('seanGameLang') === 'es' ? 'es' : 'en';
  }

  function installTongueTwisterNudge() {
    if (path !== '/games/tongue-twister/') return;
    const twister = document.querySelector('#twister');
    const mind = document.querySelector('#mind');
    if (!twister || !mind) return;
    const defaultText = 'Your tongue twister will appear here.';
    const defaultTextEs = 'Tu trabalenguas aparecerá aquí.';
    function nudgeText() { return lang() === 'es' ? '👉 <b>Sigue así:</b> 1) Léelo en voz alta 3 veces. 2) Mira los emojis. 3) Toca otra letra para abrir el siguiente portal.' : '👉 <b>Keep going:</b> 1) Say it out loud 3 times. 2) Look at the emojis. 3) Tap another letter to open the next portal.'; }
    function check() { const value = (twister.textContent || '').trim(); if (!value || value === defaultText || value === defaultTextEs) return; mind.classList.add('is-nudge'); mind.innerHTML = nudgeText(); }
    check();
    new MutationObserver(check).observe(twister, { childList: true, characterData: true, subtree: true });
    document.addEventListener('click', () => setTimeout(check, 50), true);
  }

  function removeOldGuide() {
    document.querySelectorAll('.game-guide-btn,.game-guide-panel').forEach(el => el.remove());
  }

  function area() { return document.querySelector('.stage') || document.querySelector('.scene') || document.querySelector('.road') || document.querySelector('.pads') || document.querySelector('.game') || document.querySelector('.mpc') || document.querySelector('.wrap') || document.body; }
  function centerAction() { try { if (path !== '/games/' && !path.startsWith('/games/angelique/')) area().scrollIntoView({ block: 'center', inline: 'nearest' }); } catch (e) {} }
  function later() { setTimeout(centerAction, 60); setTimeout(removeOldGuide, 80); }

  window.addEventListener('load', later);
  window.addEventListener('pageshow', later);
  window.addEventListener('resize', later);
  window.addEventListener('orientationchange', later);
  document.addEventListener('click', later, true);
  document.addEventListener('pointerup', later, true);
  installTongueTwisterNudge();
  removeOldGuide();
  later();
})();
