(() => {
  if (window.SeanGameLangLoaded) return;
  window.SeanGameLangLoaded = true;

  const KEY = 'seanGameLang';
  const dictionary = {
    'Mobile learning games':'Juegos móviles educativos','Sean Ali Free Education Games':'Sean Ali Juegos Educativos Gratis','For kids: money, math, Spanish, food, music, memory and fun — tap and play.':'Para niños: dinero, matemáticas, español, comida, música, memoria y diversión — toca y juega.','Money':'Money','Learn money principles and unlock positive affirmations.':'Aprende principios de dinero y desbloquea afirmaciones positivas.','Comida Natural':'Natural Food','Learn what natural foods have and unlock simple meal ideas.':'Aprende qué tienen los alimentos naturales y desbloquea ideas de comidas simples.','Carrera de Multiplicación':'Multiplication Race','Drive to the correct multiplication answer.':'Maneja al resultado correcto de multiplicación.','Selva':'Jungle','Funny true or false jungle quiz in Spanish.':'Quiz divertido de verdadero o falso de la selva.','Beats':'Beats','Mini MPC beat pad with drums, voice cuts and FX.':'Mini beat pad con tambores, voces y efectos.','Play Money →':'Jugar Money →','Play Food Game →':'Jugar Comida →','Play Math Race →':'Jugar Carrera →','Play Selva →':'Jugar Selva →','Play Beats →':'Jugar Beats →','Built for attention, senses and learning:':'Hecho para atención, sentidos y aprendizaje:','big buttons, quick rewards, simple Spanish, school practice and playful loops.':'botones grandes, premios rápidos, lenguaje simple, práctica escolar y juegos divertidos.','Home':'Inicio','Games':'Juegos','More games':'Más juegos',
    'Principios de dinero + afirmaciones':'Money principles + affirmations','Lee la idea de dinero.':'Read the money idea.','Toca la mejor respuesta.':'Tap the best answer.','Gana monedas y llena tu bóveda.':'Earn coins and fill your vault.','Desbloquea afirmaciones positivas.':'Unlock positive affirmations.','Al final gana tu badge de Money Wisdom.':'At the end, win your Money Wisdom badge.','Cómo jugar':'How to Play','Cómo':'How','¡Vamos!':'Let’s go!','Pregunta':'Question','Money Law':'Money Law','Principio':'Principle','Valor':'Value','Ahorro':'Saving','Metas':'Goals','Dar':'Giving','Pensamiento':'Thinking','Plan':'Plan','Construir':'Build','Actitud':'Attitude','Sueño':'Dream','¿Qué es una semilla de dinero?':'What is a money seed?','Guardar un poco':'Save a little','Gastar todo rápido':'Spend it all fast','Perderlo a propósito':'Lose it on purpose','¿Cómo se gana buen dinero?':'How do you earn good money?','Creando valor':'Creating value','Quejándose mucho':'Complaining a lot','No aprendiendo nada':'Learning nothing','Si recibes dinero, una buena idea es...':'When you receive money, a good idea is...','Ahorrar una parte':'Save a part','Gastar todo hoy':'Spend it all today','Tirarlo':'Throw it away','¿Para qué sirve una meta de dinero?':'What is a money goal for?','Para saber qué construir':'To know what to build','Para confundirse':'To get confused','Para rendirse':'To give up','Dar con amor significa...':'Giving with love means...','Compartir algo bueno':'Sharing something good','Quedarte vacío':'Becoming empty','Ser obligado':'Being forced','Un pensamiento fuerte sobre dinero es...':'A strong money thought is...','Puedo aprender':'I can learn','Nunca puedo':'I never can','No intento':'I do not try','Antes de comprar, puedes...':'Before buying, you can...','Pensar si lo necesitas':'Think if you need it','Comprar sin mirar':'Buy without looking','Cerrar los ojos':'Close your eyes','El dinero crece mejor cuando...':'Money grows better when...','Construyes habilidades':'You build skills','Solo esperas':'You only wait','Te rindes rápido':'You give up fast','Una buena actitud con dinero es...':'A good money attitude is...','Gratitud y aprendizaje':'Gratitude and learning','Miedo y enojo':'Fear and anger','Culpar siempre':'Always blaming','El dinero puede ayudarte a...':'Money can help you...','Crear una vida mejor':'Create a better life','Ser mala persona':'Be a bad person','Nunca ayudar':'Never help','Money Wisdom':'Money Wisdom','Money Learner':'Money Learner','¡Money Wisdom!':'Money Wisdom!','Buen intento.':'Good try.','Afirmaciones desbloqueadas:':'Unlocked affirmations:','Próximo premio: 9 monedas para Master Money Wisdom.':'Next prize: 9 coins for Master Money Wisdom.',
    'Aprende qué tiene cada alimento':'Learn what each food has','Mira el alimento natural.':'Look at the natural food.','Toca qué tiene más.':'Tap what it has most.','Gana estrellas.':'Earn stars.','Al final desbloqueas comidas simples.':'At the end, unlock simple meals.','Proteína':'Protein','Vitamina C':'Vitamin C','Grasa saludable':'Healthy fat','Carbohidrato':'Carbohydrate','Vitamina A':'Vitamin A','Calcio':'Calcium','Fibra':'Fiber','Potasio':'Potassium','Hierro':'Iron','Azúcar de soda':'Soda sugar','¿Qué tiene mucho el huevo?':'What does an egg have a lot of?','¿Qué vitamina tiene mucha la naranja?':'Which vitamin does an orange have a lot of?','¿Qué tiene mucho el aguacate?':'What does avocado have a lot of?','¿Qué da mucha energía natural?':'What gives natural energy?','¿Qué tiene mucho la carne?':'What does meat have a lot of?','¿Qué vitamina ayuda a los ojos?':'Which vitamin helps the eyes?','¿Qué mineral ayuda a los huesos?':'Which mineral helps the bones?','¿Qué tienen mucho los frijoles?':'What do beans have a lot of?','¿Qué mineral tiene la banana?':'Which mineral does banana have?','¿Qué tiene mucho la espinaca?':'What does spinach have a lot of?','Pasaste':'You passed','Sigue practicando':'Keep practicing','Comidas simples desbloqueadas:':'Simple meals unlocked:',
    'Selva: ¿Verdad o Falso?':'Jungle: True or False?','Gana estrellas y abre el cofre':'Earn stars and open the chest','Escucha o lee la pregunta.':'Listen or read the question.','Toca Verdadero o Falso.':'Tap True or False.','Abre el cofre al final.':'Open the chest at the end.','¿Listo?':'Ready?','Toca Cómo jugar o empieza.':'Tap How to Play or start.','¿Verdadero o falso?':'True or false?','Verdadero ✅':'True ✅','Falso ❌':'False ❌','Los monos usan celulares.':'Monkeys use phones.','El tucán tiene un pico grande.':'The toucan has a big beak.','Los cocodrilos manejan carros.':'Crocodiles drive cars.','Hay ranas de muchos colores.':'There are frogs in many colors.','El perezoso corre como moto.':'The sloth runs like a motorcycle.','Las hormigas trabajan juntas.':'Ants work together.','Las serpientes tienen piernas.':'Snakes have legs.','La mariposa fue oruga.':'The butterfly was a caterpillar.','Los árboles caminan a comprar agua.':'Trees walk to buy water.','Hay jaguares en Panamá.':'There are jaguars in Panama.','Cofre abierto:':'Chest opened:','Jugar otra vez 🔁':'Play again 🔁','Ver errores 💬':'See mistakes 💬','Colección:':'Collection:','Próximo reto: 9 estrellas para premio grande.':'Next challenge: 9 stars for the big prize.',
    'Carrera de Multiplicación':'Multiplication Race','Gana XP y desbloquea carros':'Earn XP and unlock cars','Lee la multiplicación.':'Read the multiplication.','Toca el número correcto.':'Tap the correct number.','Cuida tus corazones.':'Protect your hearts.','Llena la barra de XP.':'Fill the XP bar.','Abre el garaje al final.':'Open the garage at the end.','Toca el número correcto.':'Tap the correct number.','Maneja al resultado correcto.':'Drive to the correct answer.','Garaje:':'Garage:','Premio nuevo:':'New prize:','Tu garaje:':'Your garage:','Próximo desbloqueo: 9 estrellas para el Carro Arcoíris.':'Next unlock: 9 stars for the Rainbow Car.',
    'Tap a pad':'Toca un botón','Mini MPC. Big buttons. Make noise.':'Mini MPC. Botones grandes. Haz música.','KICK':'BOMBO','SNARE':'CAJA','HAT':'HAT','CLAP':'PALMA','RIM':'RIM','BASS':'BAJO','HYPE HIT':'GOLPE','VOICE CUT':'VOZ','HEY':'HEY','▶ Reggaeton':'▶ Reggaeton','▶ Dancehall':'▶ Dancehall','■ Stop':'■ Parar','Keys: A S D / Z X C. Space = FX. V = HEY.':'Teclas: A S D / Z X C. Espacio = FX. V = HEY.','Stopped':'Parado'
  };

  const reverse = Object.fromEntries(Object.entries(dictionary).map(([es,en]) => [en, es]));
  let lang = localStorage.getItem(KEY) || 'es';
  document.documentElement.lang = lang;

  function translateText(text) {
    const t = text.trim();
    if (!t) return text;
    const map = lang === 'en' ? dictionary : reverse;
    if (map[t]) return text.replace(t, map[t]);
    return text;
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
    nodes.forEach(n => { n.nodeValue = translateText(n.nodeValue); });
  }

  function addToggle() {
    if (document.querySelector('.lang-toggle')) return;
    const style = document.createElement('style');
    style.textContent = `.lang-toggle{position:fixed;right:12px;top:12px;z-index:9999;background:#fff;border:3px solid #12351d;border-radius:999px;box-shadow:0 6px 0 rgba(0,0,0,.18);overflow:hidden;font-family:Arial,sans-serif}.lang-toggle button{border:0;background:transparent;padding:9px 11px;font-size:14px;font-weight:900;color:#12351d;min-height:auto;box-shadow:none;width:auto}.lang-toggle button.active{background:#ffd84d}@media(max-width:390px){.lang-toggle{right:8px;top:8px}.lang-toggle button{padding:7px 9px;font-size:12px}}`;
    document.head.appendChild(style);
    const box = document.createElement('div');
    box.className = 'lang-toggle';
    box.innerHTML = '<button data-lang="es">ES</button><button data-lang="en">EN</button>';
    box.onclick = e => {
      const btn = e.target.closest('button[data-lang]');
      if (!btn) return;
      lang = btn.dataset.lang;
      localStorage.setItem(KEY, lang);
      document.documentElement.lang = lang;
      setActive();
      walk();
    };
    document.body.appendChild(box);
    setActive();
  }

  function setActive() {
    document.querySelectorAll('.lang-toggle button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  }

  function run() {
    addToggle();
    walk();
  }

  const observer = new MutationObserver(mutations => {
    if (!mutations.some(m => m.addedNodes.length || m.type === 'characterData')) return;
    clearTimeout(window.__seanLangTimer);
    window.__seanLangTimer = setTimeout(() => walk(), 40);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { run(); observer.observe(document.body,{childList:true,subtree:true,characterData:true}); });
  } else {
    run(); observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  }
})();
