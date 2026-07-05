(() => {
  if (window.SeanGameAppViewLoaded) return;
  window.SeanGameAppViewLoaded = true;
  window.SeanGameAppViewReady = true;

  const style = document.createElement('style');
  style.textContent = `
    html{scroll-behavior:auto!important;scroll-padding-top:0!important}
    body{align-items:center!important;justify-content:flex-start!important;flex-direction:column!important;width:100%!important;overflow-x:hidden!important;padding-top:calc(48px + env(safe-area-inset-top,0px))!important}
    .game,.mpc,.wrap{width:100%!important;flex:0 0 auto!important;scroll-margin-top:8px}
    .game-breadcrumbs{width:100%!important;flex:0 0 auto!important}
  `;
  document.head.appendChild(style);

  function target() {
    return document.querySelector('.game') || document.querySelector('.mpc') || document.querySelector('.wrap') || document.body;
  }

  function goTop() {
    try {
      window.scrollTo(0, 0);
      target().scrollIntoView({ block: 'start', inline: 'nearest' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }

  function later() {
    setTimeout(goTop, 30);
  }

  window.addEventListener('load', later);
  window.addEventListener('pageshow', later);
  window.addEventListener('resize', later);
  window.addEventListener('orientationchange', later);
  later();
})();
