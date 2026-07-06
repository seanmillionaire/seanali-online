(() => {
  if (window.GameAutoEsLoaded) return;
  window.GameAutoEsLoaded = true;

  const KEY = 'seanGameLang';
  const path = location.pathname.replace(/\/+$/, '/') || '/';

  const dict = {
    'The Mirror': 'El Espejo',
    'Change your thoughts. Change your life.': 'Cambia tus pensamientos. Cambia tu vida.',
    'What should your mind say?': '¿Qué debe decir tu mente?',
    'Pick the thought that makes your mirror clear.': 'Elige el pensamiento que aclara tu espejo.',
    'You make a mistake.': 'Cometes un error.',
    'I am bad.': 'Soy malo.',
    'I can try again.': 'Puedo intentar otra vez.',
    'I quit.': 'Me rindo.',
    'Good choice! Your mirror is clearer.': '¡Buena elección! Tu espejo está más claro.',

    'Math Race': 'Carrera Matemática',
    'Multiplication Race': 'Carrera de Multiplicación',
    'Drive to the correct answer.': 'Maneja al resultado correcto.',
    'Read the multiplication.': 'Lee la multiplicación.',
    'Tap the correct number.': 'Toca el número correcto.',
    'Protect your hearts.': 'Cuida tus corazones.',
    'Open the garage at the end.': 'Abre el garaje al final.',

    'Math Dissector': 'Disector Matemático',
    'Whiteboard teacher': 'Maestra de pizarra',
    'Read the top problem.': 'Lee el problema de arriba.',
    'Use paper if needed.': 'Usa papel si necesitas.',
    'Tap the best answer.': 'Toca la mejor respuesta.',
    'Get paper and pen first.': 'Primero busca papel y lápiz.',
    'Copy the stacked problem.': 'Copia el problema apilado.',
    'Do the work on paper, then choose the matching answer.': 'Haz el trabajo en papel y luego elige la respuesta igual.',
    'Brain rounds': 'Rondas de cerebro',
    'Finish: solve the full set 🧠': 'Meta: resuelve todo 🧠',

    'The Elements': 'Los Elementos',
    'Nature Elements': 'Elementos Naturales',
    'Learn the forces that shape life.': 'Aprende las fuerzas que forman la vida.',
    'Element Portal': 'Portal de Elementos',
    'Choose the best answer to unlock the lesson.': 'Elige la mejor respuesta para desbloquear la lección.',
    'Earth': 'Tierra',
    'Water': 'Agua',
    'Air': 'Aire',
    'Fire': 'Fuego',
    'Weather': 'Clima',
    'Storms': 'Tormentas',
    'Nature Balance': 'Equilibrio Natural',
    'Which element helps plants grow from soil?': '¿Qué elemento ayuda a las plantas a crecer desde el suelo?',
    'Why is water called a life element?': '¿Por qué el agua se llama un elemento de vida?',
    'What does air give humans and animals?': '¿Qué da el aire a humanos y animales?',
    'What is the safe power of fire and sunlight?': '¿Cuál es el poder seguro del fuego y la luz solar?',

    'Family Gems': 'Gemas Familiares',
    'Country Gems': 'Gemas de Países',
    'Family Roots Game': 'Juego de Raíces Familiares',
    'Family Map': 'Mapa Familiar',
    'Gem clue:': 'Pista de gema:',
    'Read the clue.': 'Lee la pista.',
    'Pick the country gem it belongs to.': 'Elige el país correcto.',
    'Unlock a family memory lesson.': 'Desbloquea una lección familiar.',
    'Gem unlocked!': '¡Gema desbloqueada!',
    'Panama': 'Panamá',
    'Canada': 'Canadá',
    'Trinidad & Tobago': 'Trinidad y Tobago',

    'Tongue Twister': 'Trabalenguas',
    'Pick a letter.': 'Elige una letra.',
    'Say it out loud.': 'Dilo en voz alta.',
    'Try again smoother.': 'Intenta más suave.',

    'Natural Food': 'Comida Natural',
    'Food': 'Comida',
    'Look at the natural food.': 'Mira la comida natural.',
    'Tap what it has most.': 'Toca lo que más tiene.',
    'Protein': 'Proteína',
    'Healthy fat': 'Grasa saludable',
    'Carbohydrate': 'Carbohidrato',
    'Fiber': 'Fibra',
    'Potassium': 'Potasio',
    'Iron': 'Hierro',
    'Vitamin C': 'Vitamina C',
    'What can you make with this food?': '¿Qué puedes hacer con esta comida?',

    'Family Habits': 'Hábitos Familiares',
    'Money Tips': 'Consejos de Dinero',
    'Selva Quiz': 'Quiz de Selva',
    'Beat Maker': 'Creador de Ritmos',
    'Piano Patterns': 'Patrones de Piano',

    'Start Here': 'Empieza Aquí',
    'Step 1': 'Paso 1',
    'Read this first': 'Lee esto primero',
    'Read this': 'Lee esto',
    'Tap answer': 'Toca respuesta',
    'Tap the answer': 'Toca la respuesta',
    'Pick answer': 'Elige respuesta',
    'Pick the answer': 'Elige la respuesta',
    'Choose the answer': 'Elige la respuesta',
    'Look at icons': 'Mira iconos',
    'Look at picture': 'Mira imagen',
    'Read question': 'Lee pregunta',
    'Read clue': 'Lee pista',
    'What do I do?': '¿Qué hago?',

    'How': 'Cómo',
    'Voice': 'Voz',
    'New': 'Nuevo',
    'Score': 'Puntos',
    'Streak': 'Racha',
    'Round': 'Ronda',
    'Question': 'Pregunta',
    'Correct!': '¡Correcto!',
    'Correct, you got it!': '¡Correcto, lo tienes!',
    'Incorrect.': 'Incorrecto.',
    'Almost.': 'Casi.',
    'Try again.': 'Intenta otra vez.',
    'Play again': 'Jugar otra vez',
    'Review lessons': 'Ver lecciones',
    'Step': 'Paso',
    'of': 'de',
    'Finish': 'Meta',
    'Finish:': 'Meta:',
    'Game rounds': 'Rondas del juego',
    'Mirror rounds': 'Rondas de espejo',
    'Race rounds': 'Rondas de carrera',
    'Nature rounds': 'Rondas de naturaleza',
    'Gem rounds': 'Rondas de gemas',
    'Speaking rounds': 'Rondas de habla',
    'Food rounds': 'Rondas de comida',
    'Life rounds': 'Rondas de vida',
    'Money rounds': 'Rondas de dinero',
    'Jungle rounds': 'Rondas de selva',
    'Finish: complete the game 🏆': 'Meta: completa el juego 🏆'
  };

  const reverse = Object.fromEntries(Object.entries(dict).map(([en, es]) => [es, en]));

  function lang() { return localStorage.getItem(KEY) === 'es' ? 'es' : 'en'; }
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function translateText(value) {
    if (!value || !value.trim()) return value;
    let out = value;
    if (lang() === 'es') {
      Object.entries(dict).sort((a,b) => b[0].length - a[0].length).forEach(([en, es]) => {
        out = out.replace(new RegExp(esc(en), 'g'), es);
      });
    } else {
      Object.entries(reverse).sort((a,b) => b[0].length - a[0].length).forEach(([es, en]) => {
        out = out.replace(new RegExp(esc(es), 'g'), en);
      });
    }
    return out;
  }

  function walk(node) {
    if (!node || node.nodeType === Node.SCRIPT_NODE || node.nodeType === Node.STYLE_NODE) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const next = translateText(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.closest && node.closest('script,style,noscript,svg')) return;
    ['aria-label','title','placeholder','alt'].forEach(attr => {
      if (node.hasAttribute && node.hasAttribute(attr)) node.setAttribute(attr, translateText(node.getAttribute(attr)));
    });
    node.childNodes.forEach(walk);
  }

  function forceTranslate() {
    document.documentElement.lang = lang();
    walk(document.body);
    document.title = translateText(document.title);
  }

  function patchLangButtons() {
    document.addEventListener('click', e => {
      const text = (e.target.textContent || '').trim().toLowerCase();
      if (text === 'es' || text.includes('español') || e.target.matches('[data-lang="es"],.lang-es')) {
        localStorage.setItem(KEY, 'es');
        window.dispatchEvent(new CustomEvent('seanGameLangChange', { detail: { lang: 'es' } }));
        setTimeout(forceTranslate, 40);
        setTimeout(forceTranslate, 180);
      }
      if (text === 'en' || text.includes('english') || e.target.matches('[data-lang="en"],.lang-en')) {
        localStorage.setItem(KEY, 'en');
        window.dispatchEvent(new CustomEvent('seanGameLangChange', { detail: { lang: 'en' } }));
        setTimeout(forceTranslate, 40);
        setTimeout(forceTranslate, 180);
      }
    }, true);
  }

  patchLangButtons();
  forceTranslate();
  window.addEventListener('seanGameLangChange', () => { setTimeout(forceTranslate, 30); setTimeout(forceTranslate, 160); });
  new MutationObserver(() => {
    clearTimeout(window.__autoEsTimer);
    window.__autoEsTimer = setTimeout(forceTranslate, 70);
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder','title','aria-label','alt'] });

  window.GameAutoEs = { translate: forceTranslate, dict };
})();
