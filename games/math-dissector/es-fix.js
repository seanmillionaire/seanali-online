(() => {
  if (window.MathDissectorEsFixLoaded) return;
  window.MathDissectorEsFixLoaded = true;

  const path = location.pathname.replace(/\/+$/, '/') || '/';
  if (path !== '/games/math-dissector/') return;

  const exact = new Map([
    ['Math Dissector', 'Disector Matemático'],
    ['Whiteboard teacher', 'Maestra de pizarra'],
    ['Whiteboard teacher breaks big problems into small lines.', 'Maestra de pizarra. Problemas grandes en pasos pequeños.'],
    ['Start Here 🧠', 'Empieza Aquí 🧠'],
    ['STEP 1: READ THIS FIRST', 'PASO 1: LEE ESTO PRIMERO'],
    ['👀 STEP 1: READ THIS FIRST', '👀 PASO 1: LEE ESTO PRIMERO'],
    ['READ HERE', 'LEE AQUÍ'],
    ['Look here first', 'Mira aquí primero'],
    ['Look here', 'Mira aquí'],
    ['Use paper', 'Usa papel'],
    ['Tap answer', 'Toca respuesta'],
    ['Tap the answer', 'Toca la respuesta'],
    ['Read the problem first', 'Lee el problema primero'],
    ['Read the problem.', 'Lee el problema.'],
    ['Read the math problem.', 'Lee el problema de matemáticas.'],
    ['What do I do?', '¿Qué hago?'],
    ['Then pick the answer', 'Luego elige la respuesta'],
    ['Get paper and pen first.', 'Primero busca papel y lápiz.'],
    ['Copy the stacked problem.', 'Copia el problema apilado.'],
    ['Do the work on paper, then choose the matching answer.', 'Haz el trabajo en papel y luego elige la respuesta igual.'],
    ['Correct, you got it!', '¡Correcto, lo tienes!'],
    ['Incorrect.', 'Incorrecto.'],
    ['Correct!', '¡Correcto!'],
    ['Try again.', 'Intenta otra vez.'],
    ['How to Play', 'Cómo jugar'],
    ['Let’s go!', '¡Vamos!'],
    ['How', 'Cómo'],
    ['Voice', 'Voz'],
    ['New', 'Nuevo'],
    ['Play again', 'Jugar otra vez'],
    ['Question', 'Pregunta'],
    ['Round', 'Ronda'],
    ['Score', 'Puntos'],
    ['Streak', 'Racha'],
    ['Step', 'Paso'],
    ['of', 'de'],
    ['Finish', 'Meta'],
    ['Brain rounds', 'Rondas de cerebro'],
    ['Finish: solve the full set 🧠', 'Meta: resuelve todo 🧠']
  ]);

  const rules = [
    [/What is/g, '¿Cuánto es'],
    [/Solve/g, 'Resuelve'],
    [/Choose/g, 'Elige'],
    [/Pick/g, 'Elige'],
    [/Tap/g, 'Toca'],
    [/Look/g, 'Mira'],
    [/Read/g, 'Lee'],
    [/Use/g, 'Usa'],
    [/Add/g, 'Suma'],
    [/Subtract/g, 'Resta'],
    [/Multiply/g, 'Multiplica'],
    [/Divide/g, 'Divide'],
    [/problem/gi, 'problema'],
    [/answer/gi, 'respuesta'],
    [/number/gi, 'número'],
    [/first/gi, 'primero'],
    [/then/gi, 'luego'],
    [/next/gi, 'siguiente'],
    [/line/gi, 'línea'],
    [/small/g, 'pequeño'],
    [/big/g, 'grande']
  ];

  function isEs() {
    return localStorage.getItem('seanGameLang') === 'es';
  }

  function translateText(value) {
    let text = String(value || '');
    exact.forEach((es, en) => text = text.replaceAll(en, es));
    rules.forEach(([rx, rep]) => text = text.replace(rx, rep));
    return text;
  }

  function translateNode(node) {
    if (!node || !node.childNodes) return;
    node.childNodes.forEach(child => {
      if (child.nodeType !== Node.TEXT_NODE) return;
      const before = child.nodeValue;
      const after = translateText(before);
      if (after !== before) child.nodeValue = after;
    });
  }

  function translate() {
    if (!isEs()) return;
    document.documentElement.lang = 'es';
    document.title = 'Disector Matemático | Juego de Matemática';
    document.querySelectorAll('h1,h2,h3,p,div,span,button,li,label,strong,b,small').forEach(el => {
      if (el.closest('script,style')) return;
      translateNode(el);
    });
    document.querySelectorAll('[placeholder]').forEach(el => el.placeholder = translateText(el.placeholder));

    const title = document.querySelector('h1,#gameTitle,.game-title');
    if (title && /Math Dissector/i.test(title.textContent)) title.textContent = title.textContent.replace(/Math Dissector/i, 'Disector Matemático');

    const guideTitle = document.querySelector('.game-start-title,.game-action-title');
    if (guideTitle) guideTitle.textContent = '👀 PASO 1: LEE ESTO PRIMERO';
  }

  window.addEventListener('seanGameLangChange', () => setTimeout(translate, 60));
  document.addEventListener('click', e => {
    if (e.target.closest('[data-lang],.lang-toggle,.lang-btn,button')) setTimeout(translate, 120);
  }, true);

  new MutationObserver(() => {
    if (!isEs()) return;
    clearTimeout(window.__mathDissectorEsTimer);
    window.__mathDissectorEsTimer = setTimeout(translate, 80);
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  setInterval(translate, 900);
  translate();
})();
