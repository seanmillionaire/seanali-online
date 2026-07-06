(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/family-gems/' || window.FamilyGemsAnswerSafetyLoaded) return;
  window.FamilyGemsAnswerSafetyLoaded = true;

  const countries = {
    'panama': 'Panama',
    'panamá': 'Panama',
    'canada': 'Canada',
    'canadá': 'Canada',
    'trinidad & tobago': 'Trinidad & Tobago',
    'trinidad y tobago': 'Trinidad & Tobago',
    'trinidad and tobago': 'Trinidad & Tobago'
  };

  const es = {
    'Which place feels like a bridge between big waters?': '¿Qué lugar se siente como un puente entre grandes aguas?',
    'Which place feels cold, wide, quiet, and strong?': '¿Qué lugar se siente frío, grande, tranquilo y fuerte?',
    'Which place feels like rhythm, color, and celebration?': '¿Qué lugar se siente como ritmo, color y celebración?',
    'Which place feels warm, green, rainy, and close to the ocean?': '¿Qué lugar se siente cálido, verde, lluvioso y cerca del océano?',
    'Which place feels like one red leaf and cold air?': '¿Qué lugar se siente como una hoja roja y aire frío?',
    'Which place feels like metal turning into happy music?': '¿Qué lugar se siente como metal convertido en música feliz?',
    'Which place feels like slow animals, loud birds, and deep green trees?': '¿Qué lugar se siente como animales lentos, pájaros fuertes y árboles verdes?',
    'Which place feels like ice, skates, speed, and winter strength?': '¿Qué lugar se siente como hielo, patines, velocidad y fuerza de invierno?',
    'Which place feels like spice, warm bread, and street food?': '¿Qué lugar se siente como especias, pan caliente y comida de calle?',
    'Which place feels like a small doorway between many worlds?': '¿Qué lugar se siente como una pequeña puerta entre muchos mundos?',
    'Which place feels huge with lakes, mountains, and trees?': '¿Qué lugar se siente enorme con lagos, montañas y árboles?',
    'Which place feels like costumes, drums, color, and a big party?': '¿Qué lugar se siente como disfraces, tambores, color y fiesta grande?',
    'Gem clue: Doorway feeling. Water. Movement. Shortcut.': 'Pista de gema: Puerta. Agua. Movimiento. Atajo.',
    'Gem clue: Cold air. Big space. Quiet beginning.': 'Pista de gema: Aire frío. Gran espacio. Comienzo tranquilo.',
    'Gem clue: Music feeling. Bright color. Dancing streets.': 'Pista de gema: Música. Color brillante. Calles bailando.',
    'Gem clue: Warm rain. Green hills. Ocean air.': 'Pista de gema: Lluvia cálida. Colinas verdes. Aire de mar.',
    'Gem clue: One leaf. Simple symbol. Northern feeling.': 'Pista de gema: Una hoja. Símbolo simple. Sensación del norte.',
    'Gem clue: Metal sound. Happy rhythm. Island party.': 'Pista de gema: Sonido de metal. Ritmo feliz. Fiesta de isla.',
    'Gem clue: Slow animal. Loud birds. Deep green.': 'Pista de gema: Animal lento. Pájaros fuertes. Verde profundo.',
    'Gem clue: Ice. Skates. Cold game. Strong legs.': 'Pista de gema: Hielo. Patines. Juego frío. Piernas fuertes.',
    'Gem clue: Spice. Warm bread. Street snack.': 'Pista de gema: Especias. Pan caliente. Merienda de calle.',
    'Gem clue: Small bridge. Many worlds meet.': 'Pista de gema: Puente pequeño. Muchos mundos se encuentran.',
    'Gem clue: Big quiet land. Lakes. Mountains. Trees.': 'Pista de gema: Tierra grande y tranquila. Lagos. Montañas. Árboles.',
    'Gem clue: Costumes. Drums. Color. Celebration.': 'Pista de gema: Disfraces. Tambores. Color. Celebración.',
    'Try again: Look at the picture feeling.': 'Intenta otra vez: mira la sensación de la imagen.',
    'Family Roots Complete': 'Raíces Familiares Completas',
    'You earned the Family Roots Badge!': '¡Ganaste la insignia de Raíces Familiares!',
    'Gem unlocked!': '¡Gema desbloqueada!'
  };

  function isEs() {
    return localStorage.getItem('seanGameLang') === 'es';
  }

  function clean(text) {
    return String(text || '').replace(/[🇵🇦🇨🇦🇹🇹]/g, '').replace(/^[A-D]\s*/, '').replace(/\s+/g, ' ').trim();
  }

  function canonical(text) {
    const key = clean(text).toLowerCase();
    return countries[key] || null;
  }

  function displayName(value) {
    if (!isEs()) return value;
    if (value === 'Panama') return 'Panamá';
    if (value === 'Canada') return 'Canadá';
    return 'Trinidad y Tobago';
  }

  function flag(value) {
    if (value === 'Panama') return '🇵🇦 ';
    if (value === 'Canada') return '🇨🇦 ';
    return '🇹🇹 ';
  }

  function labelButtons() {
    document.querySelectorAll('#answers .answer').forEach(btn => {
      const value = btn.dataset.country || canonical(btn.textContent);
      if (!value) return;
      btn.dataset.country = value;
      btn.textContent = flag(value) + displayName(value);
    });
  }

  function translateNodeText(el) {
    if (!el || !isEs()) return;
    const text = clean(el.textContent);
    if (es[text]) el.textContent = es[text];
  }

  function translateScreen() {
    if (!isEs()) return;
    translateNodeText(document.querySelector('#question'));
    const gem = document.querySelector('#gem');
    if (gem) {
      const text = clean(gem.textContent);
      if (es[text]) gem.textContent = es[text];
      else gem.innerHTML = gem.innerHTML.replace('Gem clue:', 'Pista de gema:').replace('Gem unlocked:', 'Gema desbloqueada:').replace('Try again:', 'Intenta otra vez:').replace('Badge:', 'Insignia:');
    }
    const country = document.querySelector('#country');
    if (country) country.textContent = country.textContent.replace('Family Map', 'Mapa Familiar');
    const manual = document.querySelector('#manualBtn');
    if (manual) manual.textContent = '📘 Cómo';
    const voice = document.querySelector('#voiceBtn');
    if (voice) voice.textContent = voice.textContent.includes('🔇') ? '🔇 Voz' : '🔊 Voz';
    const restart = document.querySelector('#restartBtn');
    if (restart) restart.textContent = '🔁 Nuevo';
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('#answers .answer');
    if (!btn) return;
    const value = btn.dataset.country || canonical(btn.textContent);
    if (!value) return;
    btn.dataset.country = value;
    // The original game checks textContent. Put the canonical English value back
    // for the click handler, then restore the display after the handler finishes.
    btn.textContent = flag(value) + value;
    setTimeout(() => { labelButtons(); translateScreen(); }, 30);
  }, true);

  function run() {
    labelButtons();
    translateScreen();
  }

  window.addEventListener('seanGameLangChange', () => setTimeout(run, 80));
  setInterval(run, 250);
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true, characterData: true });
  run();
})();
