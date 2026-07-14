(() => {
  if (document.querySelector('[data-game-breadcrumbs]')) return;

  const games = [
    { href: '/games/isla-aventura/', label: '🏝️ Isla Aventura' },
    { href: '/games/mirror/', label: '🪞 The Mirror' },
    { href: '/games/math-race/', label: '🚗 Math Race' },
    { href: '/games/elements/', label: '🌎 Nature Elements' },
    { href: '/games/food-groups/', label: '🍓 Food Word Lab' },
    { href: '/games/beats/', label: '🥁 Beat Maker' },
    { href: '/games/family/', label: '👨‍👩‍👧 Family Habits' },
    { href: '/games/money/', label: '💰 Money Tips' },
    { href: '/games/selva/', label: '🌿 Selva Quiz' }
  ];

  const names = {
    '/games/': 'Games',
    '/games/traffic-town/': 'Traffic Town',
    '/games/isla-aventura/': 'Isla Aventura',
    '/games/mirror/': 'The Mirror',
    '/games/math-dissector/': 'Math Dissector',
    '/games/math-race/': 'Math Race',
    '/games/elements/': 'Nature Elements',
    '/games/family-gems/': 'Family Gems',
    '/games/piano/': 'Piano Patterns',
    '/games/tongue-twister/': 'Tongue Twister',
    '/games/food-groups/': 'Food Word Lab',
    '/games/beats/': 'Beat Maker',
    '/games/family/': 'Family Habits',
    '/games/money/': 'Money Tips',
    '/games/selva/': 'Selva Quiz'
  };

  const path = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
  const current = names[path] || 'Game';
  const year = new Date().getFullYear();

  const style = document.createElement('style');
  style.textContent = `
    .game-breadcrumbs{max-width:820px;margin:18px auto 18px;padding:14px 12px;text-align:center;font-family:Arial,sans-serif;color:#12351d}
    .game-breadcrumbs .crumbs{display:flex;justify-content:center;align-items:center;gap:7px;flex-wrap:wrap;font-size:15px;font-weight:900;margin-bottom:10px}
    .game-breadcrumbs a{color:#12351d;text-decoration:none;background:#fff;border:2px solid rgba(31,122,57,.45);border-radius:999px;padding:8px 11px;box-shadow:0 4px 0 rgba(0,0,0,.12)}
    .game-breadcrumbs .current{background:#ffd84d;border:2px solid #bd8610;border-radius:999px;padding:8px 11px;box-shadow:0 4px 0 rgba(0,0,0,.12)}
    .game-breadcrumbs .quick{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:8px}
    .game-breadcrumbs .label{font-size:14px;font-weight:900;margin:8px 0;color:#2d5b39}
    .game-pro-footer{margin:18px auto 0;padding:14px 10px;color:#dfefff;text-align:center;font-size:13px;font-weight:700;line-height:1.45;opacity:.92}
    .game-pro-footer a{color:#fff!important;background:transparent!important;border:0!important;box-shadow:none!important;text-decoration:underline!important;padding:0!important;border-radius:0!important;font-weight:900}
    @media(max-width:390px){.game-breadcrumbs{padding:10px 8px}.game-breadcrumbs a,.game-breadcrumbs .current{font-size:13px;padding:7px 9px}.game-pro-footer{font-size:12px}}
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
      © ${year} Sean Ali. All rights reserved.<br>
      <a href="/">Return to home page</a>
    </section>
  `;

  document.body.appendChild(footer);
})();
