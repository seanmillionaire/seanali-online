(() => {
  if (document.querySelector('[data-game-breadcrumbs]')) return;

  const games = [
    { href: '/games/math-race/', label: '🚗 Math Race' },
    { href: '/games/piano/', label: '🎹 Piano' },
    { href: '/games/elements/', label: '🌎 Elements' },
    { href: '/games/family/', label: '👨‍👩‍👧 Family' },
    { href: '/games/money/', label: '💰 Money' },
    { href: '/games/tongue-twister/', label: '🌀 Tongue Twister' },
    { href: '/games/food-groups/', label: '🥑 Food' },
    { href: '/games/selva/', label: '🌿 Selva' },
    { href: '/games/beats/', label: '🥁 Beats' }
  ];

  const names = {
    '/games/': 'Games',
    '/games/piano/': 'Piano Patterns',
    '/games/elements/': 'The Elements',
    '/games/tongue-twister/': 'Tongue Twister',
    '/games/family/': 'Family',
    '/games/money/': 'Money',
    '/games/food-groups/': 'Comida Natural',
    '/games/math-race/': 'Carrera de Multiplicación',
    '/games/selva/': 'Selva',
    '/games/beats/': 'Beats'
  };

  const path = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
  const current = names[path] || 'Game';
  const year = new Date().getFullYear();

  const style = document.createElement('style');
  style.textContent = `
    .game-breadcrumbs{max-width:760px;margin:18px auto 18px;padding:14px 12px;text-align:center;font-family:Arial,sans-serif;color:#12351d}
    .game-breadcrumbs .crumbs{display:flex;justify-content:center;align-items:center;gap:7px;flex-wrap:wrap;font-size:15px;font-weight:900;margin-bottom:10px}
    .game-breadcrumbs a{color:#12351d;text-decoration:none;background:#fff;border:2px solid rgba(31,122,57,.45);border-radius:999px;padding:8px 11px;box-shadow:0 4px 0 rgba(0,0,0,.12)}
    .game-breadcrumbs .current{background:#ffd84d;border:2px solid #bd8610;border-radius:999px;padding:8px 11px;box-shadow:0 4px 0 rgba(0,0,0,.12)}
    .game-breadcrumbs .quick{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:8px}
    .game-breadcrumbs .label{font-size:14px;font-weight:900;margin:8px 0;color:#2d5b39}
    .game-pro-footer{margin:18px auto 0;padding:16px 14px 18px;background:rgba(255,255,255,.92);border:3px solid rgba(16,20,54,.18);border-radius:24px;box-shadow:0 8px 0 rgba(0,0,0,.10);color:#101436}
    .game-pro-footer .brand{font-size:17px;font-weight:900;margin-bottom:6px}.game-pro-footer .copy{font-size:14px;font-weight:800;line-height:1.35;color:#334}.game-pro-footer .links{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:10px}.game-pro-footer .links a{box-shadow:none;border-color:#d7dff0;background:#f8fbff;font-size:13px;padding:7px 10px}.game-pro-footer .home-text{display:inline-block;margin-top:9px;font-size:13px;font-weight:900;color:#101436;text-decoration:underline;background:transparent;border:0;box-shadow:none;padding:0;border-radius:0}
    @media(max-width:390px){.game-breadcrumbs{padding:10px 8px}.game-breadcrumbs a,.game-breadcrumbs .current{font-size:13px;padding:7px 9px}.game-pro-footer{border-radius:20px;padding:14px 10px}.game-pro-footer .links a{font-size:12px}}
  `;
  document.head.appendChild(style);

  const footer = document.createElement('footer');
  footer.className = 'game-breadcrumbs';
  footer.setAttribute('data-game-breadcrumbs', 'true');
  footer.innerHTML = `
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span>›</span>
      <a href="/games/">Games</a>
      ${path === '/games/' ? '' : '<span>›</span><span class="current">' + current + '</span>'}
    </nav>
    <div class="label">More games</div>
    <nav class="quick" aria-label="More education games">
      ${games.filter(g => g.href !== path).map(g => `<a href="${g.href}">${g.label}</a>`).join('')}
    </nav>
    <section class="game-pro-footer" aria-label="Site footer">
      <div class="brand">Sean Ali Education Games</div>
      <div class="copy">© ${year} Sean Ali. All rights reserved.</div>
      <div class="copy">Educational mini games for kids and families.</div>
      <a class="home-text" href="/">Return to the Sean Ali home page</a>
      <nav class="links" aria-label="Footer links">
        <a href="/">Home</a>
        <a href="/games/">Games</a>
        <a href="https://seanali.online/" rel="home">SeanAli.online</a>
      </nav>
    </section>
  `;

  document.body.appendChild(footer);
})();
