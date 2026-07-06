(() => {
  if (window.GameWallBenefitsLoaded) return;
  window.GameWallBenefitsLoaded = true;

  const copy = {
    hero: {
      en: ['Pick a quick game', 'Learn while playing', 'Replay to get stronger'],
      es: ['Elige un juego rápido', 'Aprende mientras juegas', 'Repite para mejorar']
    },
    '/games/math-race/': {
      en: ['Practice multiplication', 'Count groups faster', 'Build number confidence'],
      es: ['Practica multiplicación', 'Cuenta grupos más rápido', 'Gana confianza con números']
    },
    '/games/math-dissector/': {
      en: ['Break big problems down', 'Use paper step by step', 'Find the answer with logic'],
      es: ['Divide problemas grandes', 'Usa papel paso a paso', 'Encuentra la respuesta con lógica']
    },
    '/games/piano/': {
      en: ['Train your ear', 'Repeat music patterns', 'Play freestyle chords'],
      es: ['Entrena tu oído', 'Repite patrones musicales', 'Toca acordes libres']
    },
    '/games/elements/': {
      en: ['Learn nature patterns', 'Pick the right element', 'Read tiny science lessons'],
      es: ['Aprende patrones naturales', 'Elige el elemento correcto', 'Lee mini lecciones de ciencia']
    },
    '/games/family-gems/': {
      en: ['Learn country clues', 'Remember family roots', 'Collect country gems'],
      es: ['Aprende pistas de países', 'Recuerda raíces familiares', 'Colecciona gemas de países']
    },
    '/games/tongue-twister/': {
      en: ['Speak out loud', 'Train rhythm and clarity', 'Unlock fun phrases'],
      es: ['Habla en voz alta', 'Entrena ritmo y claridad', 'Desbloquea frases divertidas']
    },
    '/games/food-groups/': {
      en: ['Spot healthy foods', 'Learn body benefits', 'Build simple meal ideas'],
      es: ['Reconoce comida saludable', 'Aprende beneficios del cuerpo', 'Crea ideas de comidas simples']
    },
    '/games/beats/': {
      en: ['Tap sound pads', 'Make your own rhythm', 'Take a creative break'],
      es: ['Toca pads de sonido', 'Crea tu propio ritmo', 'Toma un descanso creativo']
    },
    '/games/family/': {
      en: ['Practice kindness', 'Choose helpful actions', 'Build teamwork habits'],
      es: ['Practica bondad', 'Elige acciones útiles', 'Crea hábitos de equipo']
    },
    '/games/money/': {
      en: ['Learn needs vs wants', 'Practice saving choices', 'Build money wisdom'],
      es: ['Aprende necesidad vs deseo', 'Practica decisiones de ahorro', 'Crea sabiduría de dinero']
    },
    '/games/selva/': {
      en: ['Read jungle facts', 'Choose true or false', 'Learn animal clues'],
      es: ['Lee datos de selva', 'Elige verdadero o falso', 'Aprende pistas de animales']
    }
  };

  const style = document.createElement('style');
  style.textContent = `
    .benefit-list{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:7px;text-align:left}.hero .benefit-list{max-width:520px;margin:16px auto 0}.benefit-list li{display:flex;align-items:flex-start;gap:8px;background:#f1fff3;border:2px solid #24b35a;border-radius:14px;padding:8px 10px;color:#12351d;font-size:17px;line-height:1.12;font-weight:900;box-shadow:0 3px 0 rgba(0,0,0,.12)}.benefit-list li:before{content:'✅';flex:0 0 auto}.hero .benefit-list li{background:#ffffff;color:#101436;border-color:#34d17a;font-size:18px}.desc.is-benefits{margin-top:6px}.desc.is-benefits .benefit-list li{font-size:16px}@media(max-width:430px){.benefit-list li{font-size:15px}.hero .benefit-list li{font-size:16px}.desc.is-benefits .benefit-list li{font-size:15px}}
  `;
  document.head.appendChild(style);

  function lang() {
    return localStorage.getItem('seanGameLang') === 'es' ? 'es' : 'en';
  }

  function keyFor(href) {
    try { return new URL(href, location.origin).pathname.replace(/\/+$/, '/') || '/'; }
    catch(e) { return href; }
  }

  function list(items) {
    return '<ul class="benefit-list">' + items.map(item => '<li>' + item + '</li>').join('') + '</ul>';
  }

  function render() {
    const l = lang();
    const sub = document.querySelector('.hero .sub');
    if (sub) {
      sub.classList.add('is-benefits');
      sub.innerHTML = list(copy.hero[l]);
    }
    document.querySelectorAll('.grid .card[href]').forEach(card => {
      const key = keyFor(card.getAttribute('href'));
      const data = copy[key];
      const desc = card.querySelector('.desc');
      if (!data || !desc) return;
      desc.classList.add('is-benefits');
      desc.innerHTML = list(data[l]);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
  window.addEventListener('seanGameLangChange', render);
  window.addEventListener('pageshow', render);
})();
