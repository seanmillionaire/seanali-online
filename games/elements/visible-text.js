(() => {
  if (!location.pathname.includes('/games/elements/')) return;
  var s = document.createElement('style');
  s.textContent = '#lesson,.lesson,#helper,.helper{color:white!important;background:#101436!important}#lesson *,.lesson *,#helper *,.helper *{color:white!important}';
  document.head.appendChild(s);
})();
