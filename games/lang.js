(() => {
  if (window.SeanGameLangLoaded) return;
  window.SeanGameLangLoaded = true;
  window.SeanGameLangReady = true;

  const KEY = 'seanGameLang';

  // Canonical direction is always Spanish -> English.
  // The renderer first normalizes any current English text back to Spanish,
  // then outputs the selected language. This makes ES <-> EN reversible.
  const esToEn = {
    // Games wall
    'Juegos móviles educativos': 'Mobile learning games',
    'Sean Ali Juegos Educativos Gratis': 'Sean Ali Free Education Games',
    'Para niños: dinero, matemáticas, español, comida, música, memoria y diversión — toca y juega.': 'For kids: money, math, Spanish, food, music, memory and fun — tap and play.',
    'Aprende principios de dinero y desbloquea afirmaciones positivas.': 'Learn money principles and unlock positive affirmations.',
    'Comida Natural': 'Natural Food',
    'Aprende qué tienen los alimentos naturales y desbloquea ideas de comidas simples.': 'Learn what natural foods have and unlock simple meal ideas.',
    'Carrera de Multiplicación': 'Multiplication Race',
    'Maneja al resultado correcto de multiplicación.': 'Drive to the correct multiplication answer.',
    'Selva': 'Jungle',
    'Quiz divertido de verdadero o falso de la selva.': 'Funny true or false jungle quiz in Spanish.',
    'Mini beat pad con tambores, voces y efectos.': 'Mini MPC beat pad with drums, voice cuts and FX.',
    'Jugar Money →': 'Play Money →',
    'Jugar Comida →': 'Play Food Game →',
    'Jugar Carrera →': 'Play Math Race →',
    'Jugar Selva →': 'Play Selva →',
    'Jugar Beats →': 'Play Beats →',
    'Hecho para atención, sentidos y aprendizaje:': 'Built for attention, senses and learning:',
    'botones grandes, premios rápidos, lenguaje simple, práctica escolar y juegos divertidos.': 'big buttons, quick rewards, simple Spanish, school practice and playful loops.',
    'Inicio': 'Home',
    'Juegos': 'Games',
    'Más juegos': 'More games',

    // Money
    'Principios de dinero + afirmaciones': 'Money principles + affirmations',
    'Lee la idea de dinero.': 'Read the money idea.',
    'Toca la mejor respuesta.': 'Tap the best answer.',
    'Gana monedas y llena tu bóveda.': 'Earn coins and fill your vault.',
    'Desbloquea afirmaciones positivas.': 'Unlock positive affirmations.',
    'Al final gana tu badge de Money Wisdom.': 'At the end, win your Money Wisdom badge.',
    'Cómo jugar': 'How to Play',
    'Cómo': 'How',
    '¡Vamos!': 'Let’s go!',
    'Pregunta': 'Question',
    'Principio': 'Principle',
    'Valor': 'Value',
    'Ahorro': 'Saving',
    'Metas': 'Goals',
    'Dar': 'Giving',
    'Pensamiento': 'Thinking',
    'Construir': 'Build',
    'Actitud': 'Attitude',
    'Sueño': 'Dream',
    '¿Qué es una semilla de dinero?': 'What is a money seed?',
    'Guardar un poco': 'Save a little',
    'Gastar todo rápido': 'Spend it all fast',
    'Perderlo a propósito': 'Lose it on purpose',
    '¿Cómo se gana buen dinero?': 'How do you earn good money?',
    'Creando valor': 'Creating value',
    'Quejándose mucho': 'Complaining a lot',
    'No aprendiendo nada': 'Learning nothing',
    'Si recibes dinero, una buena idea es...': 'When you receive money, a good idea is...',
    'Ahorrar una parte': 'Save a part',
    'Gastar todo hoy': 'Spend it all today',
    'Tirarlo': 'Throw it away',
    '¿Para qué sirve una meta de dinero?': 'What is a money goal for?',
    'Para saber qué construir': 'To know what to build',
    'Para confundirse': 'To get confused',
    'Para rendirse': 'To give up',
    'Dar con amor significa...': 'Giving with love means...',
    'Compartir algo bueno': 'Sharing something good',
    'Quedarte vacío': 'Becoming empty',
    'Ser obligado': 'Being forced',
    'Un pensamiento fuerte sobre dinero es...': 'A strong money thought is...',
    'Puedo aprender': 'I can learn',
    'Nunca puedo': 'I never can',
    'No intento': 'I do not try',
    'Antes de comprar, puedes...': 'Before buying, you can...',
    'Pensar si lo necesitas': 'Think if you need it',
    'Comprar sin mirar': 'Buy without looking',
    'Cerrar los ojos': 'Close your eyes',
    'El dinero crece mejor cuando...': 'Money grows better when...',
    'Construyes habilidades': 'You build skills',
    'Solo esperas': 'You only wait',
    'Te rindes rápido': 'You give up fast',
    'Una buena actitud con dinero es...': 'A good money attitude is...',
    'Gratitud y aprendizaje': 'Gratitude and learning',
    'Miedo y enojo': 'Fear and anger',
    'Culpar siempre': 'Always blaming',
    'El dinero puede ayudarte a...': 'Money can help you...',
    'Crear una vida mejor': 'Create a better life',
    'Ser mala persona': 'Be a bad person',
    'Nunca ayudar': 'Never help',
    'Buen intento.': 'Good try.',
    'Afirmaciones desbloqueadas:': 'Unlocked affirmations:',
    'Próximo premio: 9 monedas para Master Money Wisdom.': 'Next prize: 9 coins for Master Money Wisdom.',

    // Food
    'Aprende qué tiene cada alimento': 'Learn what each food has',
    'Mira el alimento natural.': 'Look at the natural food.',
    'Toca qué tiene más.': 'Tap what it has most.',
    'Gana estrellas.': 'Earn stars.',
    'Al final desbloqueas comidas simples.': 'At the end, unlock simple meals.',
    'Proteína': 'Protein',
    'Vitamina C': 'Vitamin C',
    'Grasa saludable': 'Healthy fat',
    'Carbohidrato': 'Carbohydrate',
    'Vitamina A': 'Vitamin A',
    'Calcio': 'Calcium',
    'Fibra': 'Fiber',
    'Potasio': 'Potassium',
    'Hierro': 'Iron',
    'Azúcar de soda': 'Soda sugar',
    '¿Qué tiene mucho el huevo?': 'What does an egg have a lot of?',
    '¿Qué vitamina tiene mucha la naranja?': 'Which vitamin does an orange have a lot of?',
    '¿Qué tiene mucho el aguacate?': 'What does avocado have a lot of?',
    '¿Qué da mucha energía natural?': 'What gives natural energy?',
    '¿Qué tiene mucho la carne?': 'What does meat have a lot of?',
    '¿Qué vitamina ayuda a los ojos?': 'Which vitamin helps the eyes?',
    '¿Qué mineral ayuda a los huesos?': 'Which mineral helps the bones?',
    '¿Qué tienen mucho los frijoles?': 'What do beans have a lot of?',
    '¿Qué mineral tiene la banana?': 'Which mineral does banana have?',
    '¿Qué tiene mucho la espinaca?': 'What does spinach have a lot of?',
    'Pasaste': 'You passed',
    'Sigue practicando': 'Keep practicing',
    'Comidas simples desbloqueadas:': 'Simple meals unlocked:',

    // Selva
    'Selva: ¿Verdad o Falso?': 'Jungle: True or False?',
    'Gana estrellas y abre el cofre': 'Earn stars and open the chest',
    'Escucha o lee la pregunta.': 'Listen or read the question.',
    'Toca Verdadero o Falso.': 'Tap True or False.',
    'Abre el cofre al final.': 'Open the chest at the end.',
    '¿Listo?': 'Ready?',
    'Toca Cómo jugar o empieza.': 'Tap How to Play or start.',
    '¿Verdadero o falso?': 'True or false?',
    'Verdadero ✅': 'True ✅',
    'Falso ❌': 'False ❌',
    'Los monos usan celulares.': 'Monkeys use phones.',
    'El tucán tiene un pico grande.': 'The toucan has a big beak.',
    'Los cocodrilos manejan carros.': 'Crocodiles drive cars.',
    'Hay ranas de muchos colores.': 'There are frogs in many colors.',
    'El perezoso corre como moto.': 'The sloth runs like a motorcycle.',
    'Las hormigas trabajan juntas.': 'Ants work together.',
    'Las serpientes tienen piernas.': 'Snakes have legs.',
    'La mariposa fue oruga.': 'The butterfly was a caterpillar.',
    'Los árboles caminan a comprar agua.': 'Trees walk to buy water.',
    'Hay jaguares en Panamá.': 'There are jaguars in Panama.',
    'Cofre abierto:': 'Chest opened:',
    'Jugar otra vez 🔁': 'Play again 🔁',
    'Ver errores 💬': 'See mistakes 💬',
    'Colección:': 'Collection:',
    'Próximo reto: 9 estrellas para premio grande.': 'Next challenge: 9 stars for the big prize.',

    // Math
    'Gana XP y desbloquea carros': 'Earn XP and unlock cars',
    'Lee la multiplicación.': 'Read the multiplication.',
    'Toca el número correcto.': 'Tap the correct number.',
    'Cuida tus corazones.': 'Protect your hearts.',
    'Llena la barra de XP.': 'Fill the XP bar.',
    'Abre el garaje al final.': 'Open the garage at the end.',
    'Maneja al resultado correcto.': 'Drive to the correct answer.',
    'Garaje:': 'Garage:',
    'Premio nuevo:': 'New prize:',
    'Tu garaje:': 'Your garage:',
    'Próximo desbloqueo: 9 estrellas para el Carro Arcoíris.': 'Next unlock: 9 stars for the Rainbow Car.',

    // Beats
    'Toca un botón': 'Tap a pad',
    'Mini MPC. Botones grandes. Haz música.': 'Mini MPC. Big buttons. Make noise.',
    'BOMBO': 'KICK',
    'CAJA': 'SNARE',
    'PALMA': 'CLAP',
    'BAJO': 'BASS',
    'GOLPE': 'HYPE HIT',
    'VOZ': 'VOICE CUT',
    '■ Parar': '■ Stop',
    'Teclas: A S D / Z X C. Espacio = FX. V = HEY.': 'Keys: A S D / Z X C. Space = FX. V = HEY.',
    'Parado': 'Stopped'
  };

  const enToEs = Object.fromEntries(Object.entries(esToEn).map(([es, en]) => [en, es]));
  let lang = localStorage.getItem(KEY) || 'es';
  document.documentElement.lang = lang;

  function normalizeToEs(value) {
    const trimmed = value.trim();
    if (!trimmed) return trimmed;
    if (esToEn[trimmed]) return trimmed;
    if (enToEs[trimmed]) return enToEs[trimmed];
    return trimmed;
  }

  function renderValue(value) {
    const trimmed = value.trim();
    if (!trimmed) return value;
    const es = normalizeToEs(trimmed);
    const rendered = lang === 'en' ? (esToEn[es] || es) : es;
    return value.replace(trimmed, rendered);
  }

  function translateAttributes(root = document.body) {
    root.querySelectorAll('[aria-label],[title]').forEach(el => {
      ['aria-label','title'].forEach(attr => {
        if (el.hasAttribute(attr)) el.setAttribute(attr, renderValue(el.getAttribute(attr)));
      });
    });
  }

  function walk(root = document.body) {
    const skip = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && skip.includes(node.parentElement.tagName)) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && node.parentElement.closest('.lang-toggle')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => { node.nodeValue = renderValue(node.nodeValue); });
    translateAttributes(root);
  }

  function setActive() {
    document.querySelectorAll('.lang-toggle button').forEach(button => {
      button.classList.toggle('active', button.dataset.lang === lang);
    });
  }

  function addToggle() {
    if (document.querySelector('.lang-toggle')) return;
    const style = document.createElement('style');
    style.textContent = `.lang-toggle{position:fixed;right:12px;top:12px;z-index:9999;background:#fff;border:3px solid #12351d;border-radius:999px;box-shadow:0 6px 0 rgba(0,0,0,.18);overflow:hidden;font-family:Arial,sans-serif}.lang-toggle button{border:0!important;background:transparent;padding:9px 11px!important;font-size:14px!important;font-weight:900;color:#12351d;min-height:auto!important;box-shadow:none!important;width:auto!important;border-radius:0!important}.lang-toggle button.active{background:#ffd84d!important}@media(max-width:390px){.lang-toggle{right:8px;top:8px}.lang-toggle button{padding:7px 9px!important;font-size:12px!important}}`;
    document.head.appendChild(style);
    const box = document.createElement('div');
    box.className = 'lang-toggle';
    box.innerHTML = '<button data-lang="es" type="button">ES</button><button data-lang="en" type="button">EN</button>';
    box.addEventListener('click', event => {
      const button = event.target.closest('button[data-lang]');
      if (!button) return;
      lang = button.dataset.lang;
      localStorage.setItem(KEY, lang);
      document.documentElement.lang = lang;
      setActive();
      walk();
    });
    document.body.appendChild(box);
    setActive();
  }

  function run() {
    addToggle();
    walk();
  }

  const observer = new MutationObserver(mutations => {
    if (!mutations.some(m => m.addedNodes.length || m.type === 'characterData')) return;
    clearTimeout(window.__seanLangTimer);
    window.__seanLangTimer = setTimeout(() => walk(), 50);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      run();
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });
  } else {
    run();
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
})();
