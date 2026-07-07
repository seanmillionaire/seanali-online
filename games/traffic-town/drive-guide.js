(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/traffic-town/' || window.TrafficTownDriveGuideLoaded) return;
  window.TrafficTownDriveGuideLoaded = true;
  // Traffic Town now has built-in route guidance in index.html.
  // This file stays as a harmless no-op so old cached loaders cannot interfere.
})();
