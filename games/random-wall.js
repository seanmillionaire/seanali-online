(() => {
  if (window.GameWallRandomizerLoaded) return;
  window.GameWallRandomizerLoaded = true;

  function restoreTopLine() {
    const kicker = document.querySelector('.kicker');
    if (kicker) kicker.textContent = 'Mini game portals';
  }

  function loadMapMode() {
    if (window.GameMapModeLoaded || document.querySelector('script[src^="/games/map-mode.js"]')) return;
    const script = document.createElement('script');
    script.src = '/games/map-mode.js?v=1';
    script.defer = true;
    document.body.appendChild(script);
  }

  function run() {
    restoreTopLine();
    loadMapMode();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
