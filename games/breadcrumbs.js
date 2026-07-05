(() => {
  if (document.querySelector('[data-game-breadcrumbs]')) return;

  const games = [
    { href: '/games/money/', label: '💰 Money' },
    { href: '/games/food-groups/', label: '🥑 Food' },
    { href: '/games/math-race/', label: '🚗 Math Race' },
    { href: '/games/selva/', label: '🌿 Selva' },
    { href: '/games/beats/', label: '🥁 Beats' }
  ];

  const names = {
    '/games/': 'Games',
    '/games/money/': 'Money',
    '/games/food-groups/': 'Comida Natural',
    '/games/math-race/': 'Carrera de Multiplicación',
    '/games/selva/': 'Selva',
    '/games/beats/': 'Beats'
  };

  const path = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
  const current = names[path] || 'Game';

  const style = document.createElement('style');
  style.textContent = `
    .game-breadcrumbs{max-width:760px;margin:18px auto 8px;padding:14px 12px;text-align:center;font-family:Arial,sans-serif;color:#12351d}
    .game-breadcrumbs .crumbs{display:flex;justify-content:center;align-items:center;gap:7px;flex-wrap:wrap;font-size:15px;font-weight:900;margin-bottom:10px}
    .game-breadcrumbs a{color:#12351d;text-decoration:none;background:#fff;border:2px solid rgba(31,122,57,.45);border-radius:999px;padding:8px 11px;box-shadow:0 4px 0 rgba(0,0,0,.12)}
    .game-breadcrumbs .current{background:#ffd84d;border:2px solid #bd8610;border-radius:999px;padding:8px 11px;box-shadow:0 4px 0 rgba(0,0,0,.12)}
    .game-breadcrumbs .quick{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:8px}
    .game-breadcrumbs .label{font-size:14px;font-weight:900;margin:8px 0;color:#2d5b39}
    @media(max-width:390px){.game-breadcrumbs{padding:10px 8px}.game-breadcrumbs a,.game-breadcrumbs .current{font-size:13px;padding:7px 9px}}
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
  `;

  document.body.appendChild(footer);
})();
