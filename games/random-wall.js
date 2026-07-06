(() => {
  if (window.GameWallRandomizerLoaded) return;
  window.GameWallRandomizerLoaded = true;

  const cardStyles = {
    '/games/mirror/': ['#ff62b7', '#9b7cff', '🪞'],
    '/games/math-race/': ['#ff3b30', '#ffc83d', '🏎️'],
    '/games/math-dissector/': ['#7d4cff', '#00d4ff', '🧠'],
    '/games/piano/': ['#101436', '#d7b9ff', '🎹'],
    '/games/elements/': ['#00d4ff', '#34d17a', '🌎'],
    '/games/family-gems/': ['#7d4cff', '#ffc83d', '💎'],
    '/games/tongue-twister/': ['#ff62b7', '#00d4ff', '🌀'],
    '/games/food-groups/': ['#34d17a', '#fff26f', '🥑'],
    '/games/beats/': ['#ff3b30', '#7d4cff', '🥁'],
    '/games/family/': ['#ffc83d', '#ff62b7', '💛'],
    '/games/money/': ['#34d17a', '#ffc83d', '💰'],
    '/games/selva/': ['#0ba85f', '#9fffe0', '🌿']
  };

  function addWallStyle() {
    if (document.getElementById('game-wall-cool-style')) return;
    const style = document.createElement('style');
    style.id = 'game-wall-cool-style';
    style.textContent = `
      @keyframes cardFloat{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-6px) rotate(.45deg)}}
      @keyframes buttonShimmer{0%{transform:translateX(-130%) skewX(-18deg)}100%{transform:translateX(230%) skewX(-18deg)}}
      @keyframes glitterPop{0%,100%{opacity:.45;transform:scale(1) rotate(0)}50%{opacity:1;transform:scale(1.22) rotate(12deg)}}
      @keyframes borderGlow{0%,100%{filter:saturate(1);box-shadow:0 12px 0 rgba(0,0,0,.18),0 0 0 rgba(255,255,255,0)}50%{filter:saturate(1.28);box-shadow:0 16px 0 rgba(0,0,0,.2),0 0 28px var(--card-glow)}}
      .grid .card{position:relative;overflow:hidden;border-color:var(--card-a,#1f7a39)!important;background:radial-gradient(circle at 85% 12%,var(--card-b,#ffc83d) 0 10%,transparent 28%),radial-gradient(circle at 10% 10%,rgba(255,255,255,.95),transparent 34%),linear-gradient(160deg,#fffbe8 0%,#fff 58%,var(--card-soft,#e8fbff) 100%)!important;animation:cardFloat 3.9s ease-in-out infinite,borderGlow 3.2s ease-in-out infinite;animation-delay:var(--delay,0s);transition:transform .18s ease,filter .18s ease}
      .grid .card:hover{transform:translateY(-8px) scale(1.025)!important;filter:saturate(1.2) brightness(1.03)}
      .grid .card::before{content:'';position:absolute;inset:0;border-radius:22px;background:linear-gradient(120deg,transparent 0 28%,rgba(255,255,255,.55) 38%,transparent 48%);transform:translateX(-130%);animation:buttonShimmer 4.4s ease-in-out infinite;animation-delay:var(--delay,0s);pointer-events:none;opacity:.7}
      .grid .card::after{content:var(--sparkle,'✨');position:absolute;right:15px;top:12px;font-size:28px;animation:glitterPop 1.8s ease-in-out infinite;animation-delay:var(--delay,0s);text-shadow:0 2px 0 rgba(0,0,0,.12);pointer-events:none}
      .grid .card .emoji{filter:drop-shadow(0 6px 0 rgba(0,0,0,.16));transform-origin:center;animation:glitterPop 2.6s ease-in-out infinite;animation-delay:calc(var(--delay,0s) + .3s)}
      .grid .card .title{color:var(--card-a,#101436)!important;text-shadow:0 1px 0 rgba(255,255,255,.7)}
      .grid .card .play{position:relative;overflow:hidden;background:linear-gradient(90deg,var(--card-a,#ffd84d),var(--card-b,#ffc83d),var(--card-a,#ffd84d))!important;border:3px solid #101436;color:#101436!important;text-shadow:0 1px 0 rgba(255,255,255,.45)}
      .grid .card .play::before{content:'';position:absolute;top:-40%;bottom:-40%;left:0;width:42%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);animation:buttonShimmer 1.8s ease-in-out infinite;pointer-events:none}
      .grid .card .desc{position:relative;z-index:1}
      .grid .card .social-proof{position:relative;z-index:2}
      @media(max-width:430px){.grid .card::after{font-size:23px;right:12px;top:10px}.grid .card{animation-duration:4.6s,3.8s}}
    `;
    document.head.appendChild(style);
  }

  function restoreTopLine() {
    const kicker = document.querySelector('.kicker');
    if (kicker) kicker.textContent = 'Mini game portals';
  }

  function keyFor(href) {
    try { return new URL(href, location.origin).pathname.replace(/\/+$/, '/') || '/'; }
    catch(e) { return href; }
  }

  function colorCards() {
    document.querySelectorAll('.grid .card[href]').forEach((card, i) => {
      const key = keyFor(card.getAttribute('href'));
      const cfg = cardStyles[key] || ['#7d4cff', '#ffc83d', '✨'];
      card.style.setProperty('--card-a', cfg[0]);
      card.style.setProperty('--card-b', cfg[1]);
      card.style.setProperty('--card-soft', cfg[1] + '33');
      card.style.setProperty('--card-glow', cfg[1] + 'aa');
      card.style.setProperty('--sparkle', `'${cfg[2]} ✨'`);
      card.style.setProperty('--delay', (i * 0.13) + 's');
    });
  }

  function shuffle(cards) {
    const arr = [...cards];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function randomizeWall() {
    const grid = document.querySelector('.grid');
    if (!grid) return;
    const cards = [...grid.querySelectorAll('.card[href]')];
    if (cards.length < 2) return;
    shuffle(cards).forEach(card => grid.appendChild(card));
  }

  function run() {
    addWallStyle();
    restoreTopLine();
    randomizeWall();
    colorCards();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
