(() => {
  if (window.SeanGameAppViewLoaded) return;
  window.SeanGameAppViewLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    html{scroll-behavior:auto!important;scroll-padding-top:0!important}
    body{align-items:flex-start!important;justify-content:flex-start!important;padding-top:calc(12px + env(safe-area-inset-top,0px))!important}
    .game,.mpc,.wrap{scroll-margin-top:8px}
  `;
  document.head.appendChild(style);

  function topTarget() {
    return document.querySelector('.game') || document.querySelector('.mpc') || document.querySelector('.wrap') || document.body;
  }

  function keepTop() {
    const target = topTarget();
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      target.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }

  function soon() {
    requestAnimationFrame(() => setTimeout(keepTop, 20));
  }

  ['DOMContentLoaded','load','pageshow','orientationchange','resize'].forEach(evt => {
    window.addEventListener(evt, soon, { passive: true });
  });

  document.addEventListener('pointerup', e => {
    if (e.target.closest('button,.pad,.choice,.small,.control')) soon();
  }, { passive: true });

  document.addEventListener('click', e => {
    if (e.target.closest('button,.pad,.choice,.small,.control')) soon();
  }, { passive: true });

  soon();
})();
