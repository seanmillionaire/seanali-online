(() => {
  if (window.MathDissectorEsFixLoaded) return;
  window.MathDissectorEsFixLoaded = true;

  const path = location.pathname.replace(/\/+$/, '/') || '/';
  if (path !== '/games/math-dissector/') return;

  const map = {
    'Math Dissector': 'Disector Matemático',
    'Whiteboard teacher': 'Maestra de pizarra',
    'Start Here 🧠': 'Empieza Aquí 🧠',
    '1️⃣ Read the top problem.': '1️⃣ Lee el problema de arriba.',
    '2️⃣ Use paper if needed.': '2️⃣ Usa papel si necesitas.',
    '3️⃣ Tap the best answer.': '3️⃣ Toca la mejor respuesta.',
    'Read the problem first': 'Lee el problema primero',
    'What do I do?': '¿Qué hago?',
    'Step 1: Read this': 'Paso 1: Lee esto',
    'Then pick the answer': 'Luego elige la respuesta',
    'Get paper and pen first.': 'Primero busca papel y lápiz.',
    'Copy the stacked problem.': 'Copia el problema apilado.',
    'Do the work on paper, then choose the matching answer.': 'Haz el trabajo en papel y luego elige la respuesta igual.',
    'Correct, you got it!': '¡Correcto, lo tienes!',
    'Incorrect.': 'Incorrecto.',
    'How': 'Cómo',
    'Voice': 'Voz',
    'New': 'Nuevo',
    'Play again': 'Jugar otra vez',
    'Question': 'Pregunta',
    'Round': 'Ronda',
    'Score': 'Puntos',
    'Streak': 'Racha',
    'Step': 'Paso',
    'Finish': 'Meta',
    'Brain rounds': 'Rondas de cerebro',
    'Finish: solve the full set 🧠': 'Meta: resuelve todo 🧠'
  };

  function isEs() {
    return localStorage.getItem('seanGameLang') === 'es';
  }

  function cleanText(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function translateNode(node) {
    if (!node || !node.childNodes) return;
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        let text = child.nodeValue;
        Object.entries(map).forEach(([en, es]) => {
          text = text.replaceAll(en, es);
        });
        child.nodeValue = text;
      }
    });
  }

  function translate() {
    if (!isEs()) return;
    document.documentElement.lang = 'es';
    document.title = 'Disector Matemático | Juego de Matemática';
    document.querySelectorAll('h1,h2,h3,p,div,span,button,li,label').forEach(translateNode);

    const title = document.querySelector('h1,#gameTitle,.game-title');
    if (title && /Math Dissector/i.test(title.textContent)) title.textContent = title.textContent.replace(/Math Dissector/i, 'Disector Matemático');

    const guide = document.querySelector('.game-action-title');
    if (guide) guide.textContent = '👀 Paso 1: Lee esto';
  }

  window.addEventListener('seanGameLangChange', () => setTimeout(translate, 60));
  document.addEventListener('click', e => {
    if (e.target.closest('[data-lang],.lang-toggle,.lang-btn,button')) setTimeout(translate, 120);
  }, true);

  new MutationObserver(() => {
    clearTimeout(window.__mathDissectorEsTimer);
    window.__mathDissectorEsTimer = setTimeout(translate, 80);
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  translate();
})();
