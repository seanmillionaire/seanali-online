(() => {
  const path = window.location.pathname.replace(/\/+$/, '/') || '/';
  if (path === '/games/') return;
  if (window.SeanGameAppViewLoaded) return;
  window.SeanGameAppViewLoaded = true;
  window.SeanGameAppViewReady = true;

  if (!document.querySelector('link[href="/games/arcade-skin.css"]')) {
    const skin = document.createElement('link');
    skin.rel = 'stylesheet';
    skin.href = '/games/arcade-skin.css';
    document.head.appendChild(skin);
  }

  const style = document.createElement('style');
  style.textContent = `
    html{scroll-behavior:auto!important;scroll-padding-top:0!important}
    body{align-items:center!important;justify-content:flex-start!important;flex-direction:column!important;width:100%!important;overflow-x:hidden!important;padding-top:calc(48px + env(safe-area-inset-top,0px))!important}
    .game,.mpc,.wrap{width:100%!important;flex:0 0 auto!important;scroll-margin-top:24px}
    .game-breadcrumbs{width:100%!important;flex:0 0 auto!important}
    .game-nudge{margin:10px 0 12px;padding:12px 14px;border-radius:18px;border:3px solid #ffc83d;background:linear-gradient(180deg,#fffdf4,#fff1bd);color:#101436;font-size:18px;line-height:1.18;font-weight:900;box-shadow:0 6px 0 rgba(0,0,0,.16);text-align:left;text-shadow:none!important}
    .game-nudge b{color:#1d144b}
    @media(max-width:390px){.game-nudge{font-size:16px;padding:10px 12px}}
  `;
  document.head.appendChild(style);

  function currentLang() {
    return localStorage.getItem('seanGameLang') === 'es' ? 'es' : 'en';
  }

  function addOrUpdateNudge(text) {
    const stage = document.querySelector('.stage') || document.querySelector('.game') || document.body;
    let box = document.querySelector('.game-nudge');
    if (!box) {
      box = document.createElement('div');
      box.className = 'game-nudge';
      const anchor = document.querySelector('#mind') || document.querySelector('.mind') || document.querySelector('.question');
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(box, anchor.nextSibling);
      else stage.appendChild(box);
    }
    box.innerHTML = text;
  }

  function installTongueTwisterNudge() {
    if (path !== '/games/tongue-twister/') return;
    const twister = document.querySelector('#twister');
    if (!twister) return;

    const defaultText = 'Your tongue twister will appear here.';
    const defaultTextEs = 'Tu trabalenguas aparecerá aquí.';

    function check() {
      const value = (twister.textContent || '').trim();
      if (!value || value === defaultText || value === defaultTextEs) return;
      const text = currentLang() === 'es'
        ? '👉 <b>Ahora:</b> léelo en voz alta 3 veces. Mira los emojis. Pregúntate: ¿qué idea nueva me enseña? Luego toca otra letra.'
        : '👉 <b>Now:</b> say it out loud 3 times. Look at the emojis. Ask: what new idea does this show me? Then tap another letter.';
      addOrUpdateNudge(text);
    }

    check();
    new MutationObserver(check).observe(twister, { childList: true, characterData: true, subtree: true });
    window.addEventListener('storage', check);
    document.addEventListener('click', () => setTimeout(check, 50), true);
  }

  function area() {
    return document.querySelector('.stage') || document.querySelector('.scene') || document.querySelector('.road') || document.querySelector('.pads') || document.querySelector('.game') || document.querySelector('.mpc') || document.querySelector('.wrap') || document.body;
  }

  function centerAction() {
    try {
      area().scrollIntoView({ block: 'center', inline: 'nearest' });
    } catch (e) {}
  }

  function later() {
    setTimeout(centerAction, 60);
  }

  window.addEventListener('load', later);
  window.addEventListener('pageshow', later);
  window.addEventListener('resize', later);
  window.addEventListener('orientationchange', later);
  document.addEventListener('click', later, true);
  document.addEventListener('pointerup', later, true);
  installTongueTwisterNudge();
  later();
})();
