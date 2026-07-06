(() => {
  if (window.GameMapModeLoaded) return;
  window.GameMapModeLoaded = true;

  const mapKey = 'seanGameMapOrder:v1';
  const progressKey = 'seanGameMapProgress:v1';
  const colors = [
    ['#ff62b7','#ffd7ef','🪞'], ['#ff3b30','#ffe0d8','🏎️'], ['#7d4cff','#ece3ff','🧠'], ['#00d4ff','#dff8ff','🌎'], ['#34d17a','#e2ffe9','🥑'], ['#ffc83d','#fff6c7','💰'], ['#9b7cff','#efe7ff','💎'], ['#0ba85f','#d9fff0','🌿'], ['#ff8a00','#fff0d5','🥁'], ['#101436','#ececff','🎹'], ['#ffcc00','#fff9d4','💛'], ['#00a7ff','#e2f5ff','🌀']
  ];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getSavedOrder(cards) {
    const hrefs = cards.map(c => c.getAttribute('href'));
    try {
      const saved = JSON.parse(localStorage.getItem(mapKey) || '[]');
      if (saved.length === hrefs.length && saved.every(h => hrefs.includes(h))) return saved;
    } catch(e) {}
    const fresh = shuffle(hrefs);
    localStorage.setItem(mapKey, JSON.stringify(fresh));
    return fresh;
  }

  function getProgress() {
    const n = parseInt(localStorage.getItem(progressKey) || '3', 10);
    return Number.isFinite(n) ? Math.max(3, Math.min(99, n)) : 3;
  }

  function addStyle() {
    if (document.getElementById('game-map-mode-style')) return;
    const style = document.createElement('style');
    style.id = 'game-map-mode-style';
    style.textContent = `
      @keyframes mapPulse{0%,100%{transform:scale(1);box-shadow:0 12px 0 rgba(0,0,0,.18),0 0 0 rgba(255,200,61,0)}50%{transform:scale(1.025);box-shadow:0 15px 0 rgba(0,0,0,.2),0 0 30px rgba(255,200,61,.45)}}
      @keyframes mapShimmer{0%{transform:translateX(-130%) skewX(-18deg)}100%{transform:translateX(230%) skewX(-18deg)}}
      @keyframes pathDash{to{stroke-dashoffset:-26}}
      .hero .sub::after{content:' Choose a glowing portal. Finish it to unlock more.';display:block;margin-top:8px;font-size:18px;color:#fff6e6;font-weight:900}.game-map-board{position:relative;margin:12px auto 22px;max-width:1100px;background:radial-gradient(circle at 20% 15%,rgba(255,200,61,.25),transparent 30%),linear-gradient(180deg,rgba(255,255,255,.82),rgba(255,255,255,.52));border:5px solid #101436;border-radius:34px;padding:18px;box-shadow:0 14px 0 rgba(0,0,0,.2);overflow:hidden}.game-map-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;background:#fff;border:4px solid #101436;border-radius:22px;padding:12px;box-shadow:0 7px 0 rgba(0,0,0,.16)}.game-map-title{font-size:24px;font-weight:900;color:#101436}.game-map-reset{border:3px solid #101436;border-radius:999px;background:#ffc83d;color:#101436;padding:9px 12px;font-size:15px;font-weight:900;box-shadow:0 4px 0 rgba(0,0,0,.2)}.game-map-path{position:absolute;left:45px;right:45px;top:110px;bottom:40px;z-index:0;pointer-events:none}.game-map-path path{stroke:#101436;stroke-width:9;stroke-linecap:round;fill:none;opacity:.18}.game-map-path path:nth-child(2){stroke:#ffc83d;stroke-width:4;stroke-dasharray:10 12;opacity:.9;animation:pathDash 1.8s linear infinite}.grid.game-map-grid{position:relative;z-index:1;display:grid!important;grid-template-columns:repeat(3,1fr);gap:24px 18px}.grid.game-map-grid .card{min-height:245px;border-color:var(--map-a,#101436)!important;background:radial-gradient(circle at 84% 12%,var(--map-b,#fff6c7),transparent 28%),linear-gradient(180deg,#fff,var(--map-soft,#fffbe8))!important;position:relative;overflow:hidden;animation:none!important}.grid.game-map-grid .card.map-open{animation:mapPulse 2.6s ease-in-out infinite!important}.grid.game-map-grid .card.map-next{filter:saturate(.82);opacity:.9}.grid.game-map-grid .card.map-locked{filter:grayscale(.75);opacity:.62}.grid.game-map-grid .card.map-locked .play{background:#d8d8d8!important;color:#333!important}.grid.game-map-grid .card.map-locked{pointer-events:none}.grid.game-map-grid .card::before{content:attr(data-map-step);position:absolute;left:12px;top:12px;width:42px;height:42px;border:4px solid #101436;border-radius:50%;background:var(--map-a,#ffc83d);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;z-index:3;box-shadow:0 4px 0 rgba(0,0,0,.22)}.grid.game-map-grid .card::after{content:attr(data-map-status);position:absolute;right:12px;top:12px;background:#fff;border:3px solid #101436;border-radius:999px;padding:6px 9px;font-size:13px;font-weight:900;color:#101436;z-index:3}.grid.game-map-grid .card .emoji{margin-top:26px}.grid.game-map-grid .card .play{position:relative;overflow:hidden;border:3px solid #101436!important;background:linear-gradient(90deg,var(--map-a,#ffd84d),var(--map-b,#ffc83d),var(--map-a,#ffd84d))!important}.grid.game-map-grid .card.map-open .play::before{content:'';position:absolute;top:-45%;bottom:-45%;left:0;width:46%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);animation:mapShimmer 1.6s ease-in-out infinite}.map-lock-note{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);background:#101436;color:#fff;border-radius:999px;padding:8px 12px;font-size:13px;font-weight:900;z-index:5;white-space:nowrap}@media(max-width:820px){.grid.game-map-grid{grid-template-columns:repeat(2,1fr)}.game-map-path{display:none}}@media(max-width:520px){.game-map-board{padding:12px;border-radius:26px}.game-map-head{display:block;text-align:center}.game-map-title{font-size:21px;margin-bottom:8px}.grid.game-map-grid{grid-template-columns:1fr;gap:16px}.grid.game-map-grid .card{min-height:auto}.hero .sub::after{font-size:15px}.map-lock-note{position:static;transform:none;margin-top:8px;text-align:center;display:block}}
    `;
    document.head.appendChild(style);
  }

  function addPath(board) {
    if (board.querySelector('.game-map-path')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','game-map-path');
    svg.setAttribute('viewBox','0 0 1000 650');
    svg.setAttribute('preserveAspectRatio','none');
    svg.innerHTML = '<path d="M80 80 C260 10 300 180 455 145 S690 55 850 130 S760 330 570 300 S310 240 190 360 S330 585 520 520 S760 450 900 570"/><path d="M80 80 C260 10 300 180 455 145 S690 55 850 130 S760 330 570 300 S310 240 190 360 S330 585 520 520 S760 450 900 570"/>';
    board.appendChild(svg);
  }

  function setupMap() {
    addStyle();
    const grid = document.querySelector('.grid');
    if (!grid || grid.classList.contains('game-map-grid')) return;
    const cards = [...grid.querySelectorAll('.card[href]')];
    if (!cards.length) return;
    const order = getSavedOrder(cards);
    const byHref = new Map(cards.map(c => [c.getAttribute('href'), c]));
    order.forEach(h => { const c = byHref.get(h); if (c) grid.appendChild(c); });

    const board = document.createElement('section');
    board.className = 'game-map-board';
    board.innerHTML = '<div class="game-map-head"><div class="game-map-title">🗺️ Ashley’s Portal Map</div><button class="game-map-reset" type="button">🎲 New Map</button></div>';
    grid.parentElement.insertBefore(board, grid);
    board.appendChild(grid);
    grid.classList.add('game-map-grid');
    addPath(board);
    board.querySelector('.game-map-reset').onclick = () => { localStorage.removeItem(mapKey); location.reload(); };

    const openCount = getProgress();
    [...grid.querySelectorAll('.card[href]')].forEach((card, i) => {
      const cfg = colors[i % colors.length];
      card.style.setProperty('--map-a', cfg[0]);
      card.style.setProperty('--map-b', cfg[1]);
      card.style.setProperty('--map-soft', cfg[1]);
      card.dataset.mapStep = String(i + 1);
      if (i < openCount) {
        card.classList.add('map-open');
        card.dataset.mapStatus = i === 0 ? 'START' : 'OPEN';
      } else if (i === openCount) {
        card.classList.add('map-next');
        card.dataset.mapStatus = 'NEXT';
      } else {
        card.classList.add('map-locked');
        card.dataset.mapStatus = 'LOCKED';
        const play = card.querySelector('.play');
        if (play) play.textContent = '🔒 Locked';
        const note = document.createElement('div');
        note.className = 'map-lock-note';
        note.textContent = 'Finish more portals to unlock';
        card.appendChild(note);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupMap);
  else setupMap();
})();
