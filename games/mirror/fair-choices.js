(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/mirror/' || window.MirrorFairChoicesLoaded) return;
  window.MirrorFairChoicesLoaded = true;

  const replacements = {
    'I am bad.': 'I feel bad right now.',
    'I can try again.': 'I can try one more time.',
    'I quit.': 'I want to stop.',
    'They hate me.': 'Maybe they feel upset.',
    'Maybe they are busy. I am okay.': 'Maybe they are busy.',
    'I should be mad.': 'I feel mad.',
    'I can take one small step.': 'I can take one step.',
    'I can never do it.': 'This feels too hard.',
    'I should hide.': 'I want to hide.',
    'I am happy for them. My turn can come too.': 'I can clap for them.',
    'That is not fair.': 'That feels unfair.',
    'I will never win.': 'Winning feels far away.',
    'I am not enough.': 'I feel small today.',
    'I am learning and growing.': 'I am still growing.',
    'I should be someone else.': 'I wish I was different.',
    'Hard means I should stop.': 'Hard feels like stop.',
    'Hard means my brain is growing.': 'Hard can grow my brain.',
    'I am not smart.': 'I feel not smart.',
    'Their words choose who I am.': 'Their words feel loud.',
    'I can stay calm and know my worth.': 'I can stay calm.',
    'I must be mean back.': 'I want to be mean back.',
    'I can grow into it step by step.': 'I can take tiny steps.',
    'It is too big for me.': 'It feels too big.',
    'Only other people can do that.': 'Other people can do it.'
  };

  const esReplacements = {
    'Soy malo.': 'Me siento mal ahora.',
    'Puedo intentar otra vez.': 'Puedo intentar una vez más.',
    'Me rindo.': 'Quiero parar.',
    'Me odian.': 'Tal vez están molestos.',
    'Tal vez están ocupados. Estoy bien.': 'Tal vez están ocupados.',
    'Debo enojarme.': 'Me siento enojado.',
    'Puedo dar un paso pequeño.': 'Puedo dar un paso.',
    'Nunca podré hacerlo.': 'Se siente muy difícil.',
    'Debo esconderme.': 'Quiero esconderme.',
    'Me alegro por ellos. Mi turno también puede llegar.': 'Puedo aplaudir por ellos.',
    'No es justo.': 'Se siente injusto.',
    'Nunca ganaré.': 'Ganar se siente lejos.',
    'No soy suficiente.': 'Me siento pequeño hoy.',
    'Estoy aprendiendo y creciendo.': 'Todavía estoy creciendo.',
    'Debo ser otra persona.': 'Quisiera ser diferente.',
    'Difícil significa que debo parar.': 'Difícil se siente como parar.',
    'Difícil significa que mi cerebro crece.': 'Difícil puede crecer mi cerebro.',
    'No soy inteligente.': 'Me siento no inteligente.',
    'Sus palabras eligen quién soy.': 'Sus palabras se sienten fuertes.',
    'Puedo estar calmado y saber mi valor.': 'Puedo estar calmado.',
    'Debo ser feo también.': 'Quiero responder feo.',
    'Puedo crecer hacia eso paso a paso.': 'Puedo dar pasos pequeños.',
    'Es demasiado grande para mí.': 'Se siente muy grande.',
    'Solo otros pueden hacerlo.': 'Otros pueden hacerlo.'
  };

  const style = document.createElement('style');
  style.textContent = `
    #prompt{font-size:0!important}
    #prompt::after{content:'Pick one thought.';font-size:19px!important;font-weight:900}
    html[lang="es"] #prompt::after{content:'Elige un pensamiento.'}
    #choices .choice{background:#fffdf6!important;border:4px solid #101436!important;color:#101436!important;min-height:76px!important}
    #choices .choice:nth-child(2),#choices .choice:nth-child(3){background:#fffdf6!important}
    #choices .choice.good{background:linear-gradient(180deg,#d9ffe9,#7dffb0)!important;color:#101436!important}
    #choices .choice.bad{background:linear-gradient(180deg,#ff3d3d,#b40020)!important;color:#fff!important}
  `;
  document.head.appendChild(style);

  function cleanText(text) {
    return String(text || '').replace(/^[A-F]\.?\s*/,'').replace(/\s+/g,' ').trim();
  }

  function replaceChoiceText(btn) {
    const text = cleanText(btn.textContent);
    const next = replacements[text] || esReplacements[text];
    if (next) btn.textContent = next;
  }

  function shuffleButtons(group) {
    if (!group || group.dataset.mirrorRoundKey === document.querySelector('#round')?.textContent) return;
    const buttons = [...group.querySelectorAll('.choice')];
    if (buttons.length < 2) return;
    const shuffled = buttons
      .map(value => ({ value, sort: Math.random() }))
      .sort((a,b) => a.sort - b.sort)
      .map(item => item.value);
    shuffled.forEach(btn => group.appendChild(btn));
    group.dataset.mirrorRoundKey = document.querySelector('#round')?.textContent || String(Date.now());
  }

  function relabel() {
    const labels = ['A','B','C'];
    document.querySelectorAll('#choices .choice').forEach((btn, i) => {
      replaceChoiceText(btn);
      btn.dataset.choiceLabel = labels[i] || String(i + 1);
    });
  }

  function run() {
    const group = document.querySelector('#choices');
    if (!group) return;
    shuffleButtons(group);
    relabel();
  }

  setTimeout(run, 120);
  new MutationObserver(() => {
    clearTimeout(window.__mirrorFairTimer);
    window.__mirrorFairTimer = setTimeout(run, 60);
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
