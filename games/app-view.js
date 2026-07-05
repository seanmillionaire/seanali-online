(() => {
  const path = window.location.pathname.replace(/\/+$/, '/') || '/';
  if (window.SeanGameAppViewLoaded) return;
  window.SeanGameAppViewLoaded = true;

  if (path.startsWith('/games/angelique/') && path !== '/games/angelique/' && !document.querySelector('script[src^="/games/angelique/question-reader.js"]')) {
    const reader = document.createElement('script');
    reader.src = '/games/angelique/question-reader.js?v=1';
    document.head.appendChild(reader);
  }

  if (path !== '/games/' && !document.querySelector('link[href="/games/arcade-skin.css"]')) {
    const skin = document.createElement('link');
    skin.rel = 'stylesheet';
    skin.href = '/games/arcade-skin.css';
    document.head.appendChild(skin);
  }

  const style = document.createElement('style');
  style.textContent = `
    html{scroll-behavior:auto!important;scroll-padding-top:0!important}
    body{overflow-x:hidden!important}
    body:not(.games-wall){align-items:center!important;justify-content:flex-start!important;flex-direction:column!important;width:100%!important;padding-top:calc(48px + env(safe-area-inset-top,0px))!important}
    .game,.mpc,.wrap{width:100%!important;flex:0 0 auto!important;scroll-margin-top:24px}
    .game-breadcrumbs{width:100%!important;flex:0 0 auto!important}
    .game-guide-btn{position:fixed!important;right:10px!important;bottom:10px!important;z-index:9999!important;border:2px solid #1d144b!important;border-radius:999px!important;background:linear-gradient(180deg,#fff26f,#ffc83d)!important;color:#1d144b!important;font:900 13px/1 Arial,sans-serif!important;padding:9px 10px!important;min-width:auto!important;min-height:auto!important;width:auto!important;height:auto!important;box-shadow:0 4px 0 rgba(0,0,0,.25),0 0 14px rgba(255,200,61,.28)!important;cursor:pointer!important;transform:none!important}
    .game-guide-panel{position:fixed;right:10px;bottom:58px;z-index:9998;width:min(330px,calc(100vw - 20px));background:#fff6e6;color:#101436;border:3px solid #1d144b;border-radius:20px;padding:13px;box-shadow:0 18px 40px rgba(0,0,0,.35);font-family:Arial,sans-serif;display:none;text-shadow:none!important}
    .game-guide-panel.open{display:block}
    .game-guide-panel h3{margin:0 0 10px;font-size:20px;line-height:1.05;color:#1d144b!important}
    .game-guide-panel p{margin:0;font-size:15px;line-height:1.22;font-weight:800;color:#101436!important}
    .game-guide-panel .guide-step{background:#fff;border:2px solid #ffc83d;border-radius:14px;padding:9px;margin:8px 0;font-weight:900;color:#101436!important;font-size:15px;line-height:1.2}
    .game-nudge,.mind.is-nudge{margin:10px 0 12px!important;padding:12px 14px!important;border-radius:18px!important;border:3px solid #ffc83d!important;background:linear-gradient(180deg,#fffdf4,#fff1bd)!important;color:#101436!important;font-size:18px!important;line-height:1.18!important;font-weight:900!important;box-shadow:0 6px 0 rgba(0,0,0,.16)!important;text-align:left!important;text-shadow:none!important;min-height:auto!important}
    .game-nudge b,.mind.is-nudge b{color:#1d144b!important}
    @media(max-width:390px){.game-guide-btn{right:8px!important;bottom:8px!important;font-size:12px!important;padding:8px 9px!important}.game-guide-panel{right:8px;bottom:52px;width:calc(100vw - 16px)}.game-nudge,.mind.is-nudge{font-size:16px!important;padding:10px 12px!important}}
  `;
  document.head.appendChild(style);

  function lang() {
    return localStorage.getItem('seanGameLang') === 'es' ? 'es' : 'en';
  }

  function text(en, es) {
    return lang() === 'es' ? es : en;
  }

  const guides = {
    '/games/': {
      title: ['Game Console', 'Consola de Juegos'],
      steps: [
        ['This is the main game wall.', 'Esta es la pared principal de juegos.'],
        ['Pick one game world and finish one round.', 'Escoge un mundo y termina una ronda.'],
        ['Replay the best one to make the lesson stick.', 'Repite el mejor para que la lección se quede.']
      ]
    },
    '/games/angelique/': {
      title: ['Angelique Folder', 'Carpeta de Angelique'],
      steps: [
        ['This is Angelique’s private school folder.', 'Esta es la carpeta privada de Angelique.'],
        ['Start with Today’s Assignment first.', 'Empieza con la tarea de hoy primero.'],
        ['Replay the assignment faster after she finishes.', 'Repite la tarea más rápido cuando termine.']
      ]
    },
    '/games/angelique/reproduccion/': {
      title: ['Reproduction Assignment', 'Tarea de Reproducción'],
      steps: [
        ['This game helps memorize the school worksheet.', 'Este juego ayuda a memorizar la hoja de la escuela.'],
        ['Tap Leer pregunta, listen, follow the highlighted words, then answer.', 'Toca Leer pregunta, escucha, sigue las palabras iluminadas y responde.'],
        ['Finish once, then replay until she can say the final song without looking.', 'Termina una vez y repite hasta decir la canción final sin mirar.']
      ]
    },
    '/games/math-race/': {
      title: ['Math Race Guide', 'Guía de Matemática'],
      steps: [
        ['This game trains multiplication speed.', 'Este juego entrena velocidad de multiplicación.'],
        ['Read the problem and tap the answer.', 'Lee el problema y toca la respuesta.'],
        ['Replay to beat your score, not just to finish.', 'Repite para superar tu resultado, no solo terminar.']
      ]
    },
    '/games/tongue-twister/': {
      title: ['Tongue Twister Guide', 'Guía de Trabalenguas'],
      steps: [
        ['This game trains speaking and mouth control.', 'Este juego entrena hablar y controlar la boca.'],
        ['Pick a letter and say the phrase out loud three times.', 'Escoge una letra y di la frase en voz alta tres veces.'],
        ['Try the next letter without rushing.', 'Prueba la siguiente letra sin apurarte.']
      ]
    },
    '/games/elements/': {
      title: ['Elements Guide', 'Guía de Elementos'],
      steps: [
        ['This game teaches nature patterns.', 'Este juego enseña patrones de la naturaleza.'],
        ['Choose the answer and read the lesson.', 'Escoge la respuesta y lee la lección.'],
        ['Explain the answer in your own words after each round.', 'Explica la respuesta con tus palabras después de cada ronda.']
      ]
    },
    '/games/piano/': {
      title: ['Piano Guide', 'Guía de Piano'],
      steps: [
        ['This game trains listening and memory.', 'Este juego entrena escuchar y recordar.'],
        ['Listen first, then repeat the pattern.', 'Escucha primero y luego repite el patrón.'],
        ['Replay until the pattern feels easy.', 'Repite hasta que el patrón se sienta fácil.']
      ]
    },
    '/games/beats/': {
      title: ['Beats Guide', 'Guía de Beats'],
      steps: [
        ['This is a creative rhythm break.', 'Esto es un descanso creativo de ritmo.'],
        ['Tap pads and listen to what each sound does.', 'Toca los botones y escucha lo que hace cada sonido.'],
        ['Make one simple loop before leaving.', 'Haz un loop simple antes de salir.']
      ]
    }
  };

  function guideForPath() {
    return guides[path] || {
      title: ['Game Guide', 'Guía del Juego'],
      steps: [
        ['This is a quick mini game.', 'Este es un mini juego rápido.'],
        ['Read slowly, tap carefully, and follow the feedback.', 'Lee despacio, toca con cuidado y sigue la guía.'],
        ['Replay once to make the lesson stick.', 'Repite una vez para que la lección se quede.']
      ]
    };
  }

  function installGuide() {
    if (document.querySelector('.game-guide-btn')) return;
    const g = guideForPath();
    const btn = document.createElement('button');
    btn.className = 'game-guide-btn';
    btn.textContent = text('🧭 Guide', '🧭 Guía');
    const panel = document.createElement('div');
    panel.className = 'game-guide-panel';
    const steps = g.steps.map((s, i) => '<div class="guide-step"><b>' + (i + 1) + '.</b> ' + text(s[0], s[1]) + '</div>').join('');
    panel.innerHTML = '<h3>' + text(g.title[0], g.title[1]) + '</h3>' + steps;
    btn.onclick = () => panel.classList.toggle('open');
    document.body.appendChild(panel);
    document.body.appendChild(btn);
  }

  function installTongueTwisterNudge() {
    if (path !== '/games/tongue-twister/') return;
    const twister = document.querySelector('#twister');
    const mind = document.querySelector('#mind');
    if (!twister || !mind) return;
    const defaultText = 'Your tongue twister will appear here.';
    const defaultTextEs = 'Tu trabalenguas aparecerá aquí.';
    function nudgeText() { return lang() === 'es' ? '👉 <b>Sigue así:</b> 1) Léelo en voz alta 3 veces. 2) Mira los emojis. 3) Toca otra letra para abrir el siguiente portal.' : '👉 <b>Keep going:</b> 1) Say it out loud 3 times. 2) Look at the emojis. 3) Tap another letter to open the next portal.'; }
    function check() { const value = (twister.textContent || '').trim(); if (!value || value === defaultText || value === defaultTextEs) return; mind.classList.add('is-nudge'); mind.innerHTML = nudgeText(); }
    check();
    new MutationObserver(check).observe(twister, { childList: true, characterData: true, subtree: true });
    document.addEventListener('click', () => setTimeout(check, 50), true);
  }

  function area() { return document.querySelector('.stage') || document.querySelector('.scene') || document.querySelector('.road') || document.querySelector('.pads') || document.querySelector('.game') || document.querySelector('.mpc') || document.querySelector('.wrap') || document.body; }
  function centerAction() { try { if (path !== '/games/' && path !== '/games/angelique/') area().scrollIntoView({ block: 'center', inline: 'nearest' }); } catch (e) {} }
  function later() { setTimeout(centerAction, 60); }

  window.addEventListener('load', later);
  window.addEventListener('pageshow', later);
  window.addEventListener('resize', later);
  window.addEventListener('orientationchange', later);
  document.addEventListener('click', later, true);
  document.addEventListener('pointerup', later, true);
  installGuide();
  installTongueTwisterNudge();
  later();
})();
