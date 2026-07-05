(() => {
  if (window.SeanGameAppViewLoaded) return;
  window.SeanGameAppViewLoaded = true;
  window.SeanGameAppViewReady = true;

  const style = document.createElement('style');
  style.textContent = `
    html{scroll-behavior:auto!important;scroll-padding-top:0!important}
    body{align-items:center!important;justify-content:flex-start!important;flex-direction:column!important;width:100%!important;overflow-x:hidden!important;padding-top:calc(48px + env(safe-area-inset-top,0px))!important}
    .game,.mpc,.wrap{width:100%!important;flex:0 0 auto!important;scroll-margin-top:24px}
    .game-breadcrumbs{width:100%!important;flex:0 0 auto!important}
  `;
  document.head.appendChild(style);

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
  later();
})();
