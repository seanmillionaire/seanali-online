(() => {
  if (!location.pathname.startsWith('/games/angelique/') || window.AngeliqueNavLoaded) return;
  window.AngeliqueNavLoaded = true;
  const style = document.createElement('style');
  style.textContent = `.angelique-main-nav{position:fixed;left:10px;top:10px;z-index:9999;background:linear-gradient(180deg,#fff26f,#ffc83d);border:3px solid #1d144b;border-radius:999px;color:#101436!important;text-decoration:none!important;font:900 14px Arial,sans-serif;padding:9px 11px;box-shadow:0 5px 0 rgba(0,0,0,.25)}@media(max-width:390px){.angelique-main-nav{font-size:12px;padding:8px 9px;top:8px;left:8px}}`;
  document.head.appendChild(style);
  const link = document.createElement('a');
  link.className = 'angelique-main-nav';
  link.href = '/games/';
  link.textContent = '← Main Games';
  document.body.appendChild(link);
})();
