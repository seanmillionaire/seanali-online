(() => {
  if (window.SeanGameLangLoaded) return;
  window.SeanGameLangLoaded = true;
  window.SeanGameLangReady = true;

  const KEY = 'seanGameLang';
  const esToEn = {
    'Juegos móviles educativos':'Mobile learning games',
    'Sean Ali Juegos Educativos Gratis':'Sean Ali Free Education Games',
    'Para niños: familia, dinero, matemáticas, español, comida, música, memoria y diversión — toca y juega.':'For kids: family, money, math, Spanish, food, music, memory and fun — tap and play.',
    'Familia':'Family',
    'Aprende cómo una familia trabaja junta como un equipo fuerte.':'Learn how a family works together like a strong team.',
    'Equipo':'Teamwork',
    'Habilidades de vida':'Life Skills',
    'Jugar Familia →':'Play Family →',
    'Aprende principios de dinero y desbloquea afirmaciones positivas.':'Learn money principles and unlock positive affirmations.',
    'Comida Natural':'Natural Food',
    'Aprende qué tienen los alimentos naturales y desbloquea ideas de comidas simples.':'Learn what natural foods have and unlock simple meal ideas.',
    'Carrera de Multiplicación':'Multiplication Race',
    'Maneja al resultado correcto de multiplicación.':'Drive to the correct multiplication answer.',
    'Selva':'Jungle',
    'Quiz divertido de verdadero o falso de la selva.':'Funny true or false jungle quiz in Spanish.',
    'Mini beat pad con tambores, voces y efectos.':'Mini MPC beat pad with drums, voice cuts and FX.',
    'Jugar Money →':'Play Money →',
    'Jugar Comida →':'Play Food Game →',
    'Jugar Carrera →':'Play Math Race →',
    'Jugar Selva →':'Play Selva →',
    'Jugar Beats →':'Play Beats →',
    'Hecho para atención, sentidos y aprendizaje:':'Built for attention, senses and learning:',
    'botones grandes, premios rápidos, lenguaje simple, práctica escolar y juegos divertidos.':'big buttons, quick rewards, simple Spanish, school practice and playful loops.',
    'Inicio':'Home','Juegos':'Games','Más juegos':'More games','Money':'Money','Food':'Food','Math Race':'Math Race','Beats':'Beats','Spanish':'Spanish','Quiz':'Quiz','Animals':'Animals','Music':'Music','Rhythm':'Rhythm','Sound':'Sound','Mindset':'Mindset','Health':'Health','Cars':'Cars','Math':'Math',
    'Principios de dinero + afirmaciones':'Money principles + affirmations','Lee la idea de dinero.':'Read the money idea.','Toca la mejor respuesta.':'Tap the best answer.','Gana monedas y llena tu bóveda.':'Earn coins and fill your vault.','Desbloquea afirmaciones positivas.':'Unlock positive affirmations.','Al final gana tu badge de Money Wisdom.':'At the end, win your Money Wisdom badge.','Cómo jugar':'How to Play','Cómo':'How','¡Vamos!':'Let’s go!','Pregunta':'Question','Principio':'Principle','Valor':'Value','Ahorro':'Saving','Metas':'Goals','Dar':'Giving','Pensamiento':'Thinking','Construir':'Build','Actitud':'Attitude','Sueño':'Dream','Guardar un poco':'Save a little','Gastar todo rápido':'Spend it all fast','Creando valor':'Creating value','Puedo aprender':'I can learn','Buen intento.':'Good try.','Afirmaciones desbloqueadas:':'Unlocked affirmations:',
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
    root.querySelectorAll('[aria-label],[title]').forEach(el => {
      ['aria-label','title'].forEach(attr => {
        if (el.hasAttribute(attr)) el.setAttribute(attr, renderValue(el.getAttribute(attr)));
      });
    });
  }

  function walk(root = document.body) {
    const skip = ['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT'];
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
    document.querySelectorAll('.lang-toggle button').forEach(button => button.classList.toggle('active', button.dataset.lang === lang));
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

  function run() { addToggle(); walk(); }
  const observer = new MutationObserver(mutations => {
    if (!mutations.some(m => m.addedNodes.length || m.type === 'characterData')) return;
    clearTimeout(window.__seanLangTimer);
    window.__seanLangTimer = setTimeout(() => walk(), 50);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { run(); observer.observe(document.body,{childList:true,subtree:true,characterData:true}); });
  } else {
    run(); observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  }
})();
