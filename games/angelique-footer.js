(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/' || window.AngeliqueFooterLoaded) return;
  window.AngeliqueFooterLoaded = true;
  const style = document.createElement('style');
  style.textContent = `.angelique-footer-link{display:inline-flex;align-items:center;justify-content:center;margin:12px auto 0;padding:14px 18px;border-radius:999px;background:linear-gradient(180deg,#fff26f,#ffc83d);border:3px solid #1d144b;color:#101436!important;text-decoration:none!important;font:900 18px Arial,sans-serif;box-shadow:0 7px 0 rgba(0,0,0,.25)}@media(max-width:390px){.angelique-footer-link{font-size:16px;padding:12px 15px}}`;
  document.head.appendChild(style);
  const foot = document.querySelector('.foot') || document.body;
  const br = document.createElement('br');
  const link = document.createElement('a');
  link.className = 'angelique-footer-link';
  link.href = '/games/angelique/';
  link.textContent = '🔒 Angelique 💛';
  foot.appendChild(br);
  foot.appendChild(link);
})();
