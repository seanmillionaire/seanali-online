(() => {
  if (window.SeanGameLangLoaded) return;
  window.SeanGameLangLoaded = true;
  window.SeanGameLangReady = true;

  const KEY = 'seanGameLang';
  const esToEn = {
    'Juegos móviles educativos':'Mobile learning games',
    'Sean Ali Juegos Educativos Gratis':'Sean Ali Free Education Games',
    'Enfoca la mente. Practica la escuela. Aprende lecciones de vida en minutos.':'Build focus. Practice school skills. Learn life lessons in minutes.',
    '¿Qué quieres practicar hoy?':'What do you want to practice today?',

    'Mini portales de juegos':'Mini game portals',
    'Juegos Educativos de Sean Ali':'Sean Ali Education Games',
    'Juega con dinero, música, naturaleza, matemática, lenguaje, comida, ritmo, raíces y vida.':'Play through money, music, nature, math, language, food, rhythm, roots, and life.',

    'Carrera Matemática':'Math Race',
    'Disector Matemático':'Math Dissector',
    'Patrones de Piano':'Piano Patterns',
    'Elementos Naturales':'Nature Elements',
    'Gemas de Países':'Country Gems',
    'Trabalenguas':'Tongue Twister',
    'Comida Natural':'Natural Food',
    'Creador de Ritmos':'Beat Maker',
    'Hábitos Familiares':'Family Habits',
    'Consejos de Dinero':'Money Tips',
    'Quiz de Selva':'Selva Quiz',

    'Multiplicación, grupos, velocidad y confianza numérica.':'Multiplication, groups, speed, and number confidence.',
    'La maestra de pizarra divide problemas grandes en líneas pequeñas.':'Whiteboard teacher breaks big problems into small lines.',
    'Escucha, recuerda y repite patrones musicales.':'Listen, remember, and repeat music patterns.',
    'Tierra, agua, aire, fuego, tormentas, olas y equilibrio.':'Earth, water, air, fire, storms, waves, and balance.',
    'Raíces de Panamá, Canadá y Trinidad y Tobago.':'Panama, Canada, and Trinidad & Tobago country roots.',
    'Lenguaje, habla, ritmo y enfoque creativo.':'Language, speaking, rhythm, and creative focus.',
    'Comida, salud, comidas simples y conciencia del cuerpo.':'Food, health, simple meals, and body awareness.',
    'Toca pads, crea ritmo y toma un descanso creativo.':'Tap pads, make rhythm, and take a creative break.',
    'Escuchar, ayudar, respetar y trabajar en equipo.':'Listening, helping, respect, and teamwork.',
    'Necesidades, deseos, ahorro, valor y metas.':'Needs, wants, saving, value, and goals.',
    'Quiz de animales de selva en español, verdadero o falso.':'Spanish jungle true-or-false animal quiz.',

    'Jugar Carrera Matemática →':'Play Math Race →',
    'Jugar Disector Matemático →':'Play Math Dissector →',
    'Jugar Patrones de Piano →':'Play Piano Patterns →',
    'Jugar Elementos Naturales →':'Play Nature Elements →',
    'Jugar Gemas de Países →':'Play Country Gems →',
    'Jugar Trabalenguas →':'Play Tongue Twister →',
    'Jugar Comida Natural →':'Play Natural Food →',
    'Jugar Creador de Ritmos →':'Play Beat Maker →',
    'Jugar Hábitos Familiares →':'Play Family Habits →',
    'Jugar Consejos de Dinero →':'Play Money Tips →',
    'Jugar Quiz de Selva →':'Play Selva Quiz →',

    'Guía Amiga':'Buddy Guide',
    '¿Cuál es tu nombre? 🌈':'What is your name? 🌈',
    'Escribe tu nombre aquí ✨':'Type name here ✨',
    '🎮 Saltar':'🎮 Skip',
    '🚀 Guardar':'🚀 Save',
    '✅ Entendido':'✅ Got it',
    '💡 Consejo':'💡 Tip',
    'Cómo jugar':'How to play',
    'Elige una tarjeta de juego.':'Pick one game card.',
    'Toca el botón amarillo de Jugar.':'Tap the yellow Play button.',
    'Termina una ronda y luego prueba otro juego.':'Finish one round, then try another game.',
    'Lee el problema de matemática.':'Read the math problem.',
    'Piensa en la multiplicación.':'Think of the multiplication fact.',
    'Toca la respuesta rápido.':'Tap the answer fast.',
    'Primero busca papel y lápiz.':'Get paper and pen first.',
    'Copia el problema apilado.':'Copy the stacked problem.',
    'Haz el trabajo en papel y luego elige la respuesta que coincide.':'Do the work on paper, then choose the matching answer.',
    'Empieza un patrón y escucha.':'Start a pattern and listen.',
    'Toca las teclas en el mismo orden.':'Tap the keys in the same order.',
    'Usa Freestyle para tocar acordes.':'Use Freestyle to just play chords.',
    'Lee la pista de naturaleza.':'Read the nature clue.',
    'Elige el elemento que encaja.':'Choose the element that fits.',
    'Lee la lección pequeña después de cada respuesta.':'Read the small lesson after each answer.',
    'Lee la pista del país.':'Read the country clue.',
    'Elige el país.':'Choose the country.',
    'Colecciona las gemas de países.':'Collect the country gems.',
    'Elige una letra.':'Pick a letter.',
    'Di la oración en voz alta tres veces.':'Say the sentence out loud three times.',
    'Prueba otra letra y habla más suave.':'Try another letter and speak smoother.',
    'Lee la pregunta de comida.':'Read the food question.',
    'Elige la respuesta saludable.':'Pick the healthy answer.',
    'Lee la pista del cuerpo después de tocar.':'Read the body clue after each tap.',
    'Toca un pad de sonido.':'Tap a sound pad.',
    'Prueba dos o tres sonidos juntos.':'Try two or three sounds together.',
    'Haz tu propio ritmo pequeño.':'Make your own little beat.',
    'Lee la situación familiar.':'Read the family situation.',
    'Elige la opción que ayuda.':'Pick the helpful choice.',
    'Practica bondad y trabajo en equipo.':'Practice kindness and teamwork.',
    'Lee la opción de dinero.':'Read the money choice.',
    'Pregunta si es necesidad, deseo, ahorro o meta.':'Ask if it is a need, want, save, or goal.',
    'Toca la respuesta inteligente de dinero.':'Tap the smart money answer.',
    'Lee el dato de la selva.':'Read the jungle fact.',
    'Elige verdadero o falso.':'Choose true or false.',
    'Aprende la pista del animal.':'Learn the animal clue.',
    'Elige primero la tarea de hoy.':'Pick today’s assignment first.',
    'Juega un juego escolar.':'Play one school game.',
    'Repite hasta que se sienta fácil.':'Replay until it feels easy.',
    'Lee la pregunta rápido.':'Read the question fast.',
    'Toca A o B.':'Tap A or B.',
    'Usa la pista turbo cuando estés atascado.':'Use the turbo hint when stuck.',
    'Un paso a la vez. Tú puedes. ⭐':'One step at a time. You got this. ⭐',
    'Más lento, busca la pista y luego toca. 🧠':'Slow down, look for the clue, then tap. 🧠',
    'Más lento, ':'Slow down, ',
    '. Busca la pista y luego toca. 🧠':'. Look for the clue, then tap. 🧠',
    'Tú puedes, ':'You got this, ',

    'me gusta':'likes',
    'compartidos':'shares',
    '👍 Me gusta':'👍 Like',
    '👍 Te gusta':'👍 Liked',
    '↗ Compartir':'↗ Share',
    'Enlace listo para compartir ↗':'Share link ready ↗',
    'Me gusta quitado':'Like removed',

    'Juegos':'Games','Inicio':'Home','Más juegos':'More games','Dinero':'Money','Comida':'Food','Ritmos':'Beats','Español':'Spanish','Animales':'Animals','Música':'Music','Ritmo':'Rhythm','Sonido':'Sound','Mentalidad':'Mindset','Salud':'Health','Carros':'Cars','Matemática':'Math','Contar':'Counting',

    'Patrones de Piano':'Piano Patterns','Jugar Piano →':'Play Piano →','Mira loops simples de piano, repite las notas y aprende por qué funcionan.':'Watch simple piano loops, repeat the notes, and learn why they work.','Piano':'Piano','Memoria':'Memory',
    'Naturaleza':'Nature','Ciencia':'Science','Planeta':'Planet','Los Elementos':'The Elements','Jugar Elementos →':'Play Elements →','Aprende Tierra, Agua, Aire, Fuego, tormentas, olas y equilibrio natural.':'Learn Earth, Water, Air, Fire, storms, waves and nature balance.',
    'Familia':'Family','Aprende cómo una familia trabaja junta como un equipo fuerte.':'Learn how a family works together like a strong team.','Equipo':'Teamwork','Habilidades de vida':'Life Skills','Jugar Familia →':'Play Family →',
    'Aprende principios de dinero y desbloquea afirmaciones positivas.':'Learn money principles and unlock positive affirmations.',
    'Aprende qué tienen los alimentos naturales y desbloquea ideas de comidas simples.':'Learn what natural foods have and unlock simple meal ideas.',
    'Carrera de Multiplicación':'Multiplication Race','Maneja, cuenta grupos y resuelve multiplicación paso a paso.':'Drive, count groups, and solve multiplication step by step.','Jugar Carrera →':'Play Math Race →',
    'Selva':'Jungle','Quiz divertido de verdadero o falso de la selva.':'Funny true or false jungle quiz in Spanish.','Mini beat pad con tambores, voces y efectos.':'Mini MPC beat pad with drums, voice cuts and FX.','Jugar Money →':'Play Money →','Jugar Comida →':'Play Food Game →','Jugar Selva →':'Play Selva →','Jugar Beats →':'Play Beats →',
    'Hecho para atención, sentidos y aprendizaje:':'Built for attention, senses and learning:','botones grandes, premios rápidos, lenguaje simple, práctica escolar y juegos divertidos.':'big buttons, quick rewards, simple Spanish, school practice and playful loops.',
    'Principios de dinero + afirmaciones':'Money principles + affirmations','Lee la idea de dinero.':'Read the money idea.','Toca la mejor respuesta.':'Tap the best answer.','Gana monedas y llena tu bóveda.':'Earn coins and fill your vault.','Desbloquea afirmaciones positivas.':'Unlock positive affirmations.','Al final gana tu badge de Money Wisdom.':'At the end, win your Money Wisdom badge.','Cómo':'How','¡Vamos!':'Let’s go!','Pregunta':'Question','Principio':'Principle','Valor':'Value','Ahorro':'Saving','Metas':'Goals','Dar':'Giving','Pensamiento':'Thinking','Construir':'Build','Actitud':'Attitude','Sueño':'Dream','Guardar un poco':'Save a little','Gastar todo rápido':'Spend it all fast','Creando valor':'Creating value','Puedo aprender':'I can learn','Buen intento.':'Good try.','Afirmaciones desbloqueadas:':'Unlocked affirmations:',
    'Aprende qué tiene cada alimento':'Learn what each food has','Mira el alimento natural.':'Look at the natural food.','Toca qué tiene más.':'Tap what it has most.','Gana estrellas.':'Earn stars.','Al final desbloqueas comidas simples.':'At the end, unlock simple meals.','Proteína':'Protein','Vitamina C':'Vitamin C','Grasa saludable':'Healthy fat','Carbohidrato':'Carbohydrate','Vitamina A':'Vitamin A','Calcio':'Calcium','Fibra':'Fiber','Potasio':'Potassium','Hierro':'Iron','Pasaste':'You passed','Sigue practicando':'Keep practicing','Comidas simples desbloqueadas:':'Simple meals unlocked:',
    'Selva: ¿Verdad o Falso?':'Jungle: True or False?','Gana estrellas y abre el cofre':'Earn stars and open the chest','Escucha o lee la pregunta.':'Listen or read the question.','Toca Verdadero o Falso.':'Tap True or False.','Abre el cofre al final.':'Open the chest at the end.','¿Listo?':'Ready?','Toca Cómo jugar o empieza.':'Tap How to Play or start.','¿Verdadero o falso?':'True or false?','Verdadero ✅':'True ✅','Falso ❌':'False ❌','Cofre abierto:':'Chest opened:','Jugar otra vez 🔁':'Play again 🔁','Ver errores 💬':'See mistakes 💬','Colección:':'Collection:',
    'Gana XP y desbloquea carros':'Earn XP and unlock cars','Lee la multiplicación.':'Read the multiplication.','Toca el número correcto.':'Tap the correct number.','Cuida tus corazones.':'Protect your hearts.','Llena la barra de XP.':'Fill the XP bar.','Abre el garaje al final.':'Open the garage at the end.','Maneja al resultado correcto.':'Drive to the correct answer.','Garaje:':'Garage:','Premio nuevo:':'New prize:','Tu garaje:':'Your garage:',
    'Toca un botón':'Tap a pad','Mini MPC. Botones grandes. Haz música.':'Mini MPC. Big buttons. Make noise.','BOMBO':'KICK','CAJA':'SNARE','PALMA':'CLAP','BAJO':'BASS','GOLPE':'HYPE HIT','VOZ':'VOICE CUT','■ Parar':'■ Stop','Parado':'Stopped'
  };

  const enToEs = Object.fromEntries(Object.entries(esToEn).map(([es,en]) => [en, es]));
  let lang = localStorage.getItem(KEY) || 'en';
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
    root.querySelectorAll('[aria-label],[title],input[placeholder]').forEach(el => {
      ['aria-label','title','placeholder'].forEach(attr => {
        if (el.hasAttribute(attr)) el.setAttribute(attr, renderValue(el.getAttribute(attr)));
      });
    });
  }

  function walk(root = document.body) {
    const skip = ['SCRIPT','STYLE','NOSCRIPT','TEXTAREA'];
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

  function setActive() { document.querySelectorAll('.lang-toggle button').forEach(button => button.classList.toggle('active', button.dataset.lang === lang)); }

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
      window.dispatchEvent(new CustomEvent('seanGameLangChange',{detail:{lang}}));
    });
    document.body.appendChild(box);
    setActive();
  }

  function run() { addToggle(); walk(); }
  const observer = new MutationObserver(mutations => {
    if (!mutations.some(m => m.addedNodes.length || m.type === 'characterData')) return;
    clearTimeout(window.__seanLangTimer);
    window.__seanLangTimer = setTimeout(() => walk(), 50);
  });

  window.SeanGameLang = { get: () => lang, set: value => { lang = value === 'es' ? 'es' : 'en'; localStorage.setItem(KEY, lang); document.documentElement.lang = lang; setActive(); walk(); window.dispatchEvent(new CustomEvent('seanGameLangChange',{detail:{lang}})); }, walk };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { run(); observer.observe(document.body,{childList:true,subtree:true,characterData:true}); });
  } else {
    run(); observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  }
})();
