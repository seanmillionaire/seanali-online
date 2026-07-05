(() => {
  const path = window.location.pathname.replace(/\/+$/, '/') || '/';
  if (window.SeanGameAppViewLoaded) return;
  window.SeanGameAppViewLoaded = true;
  window.SeanGameAppViewReady = true;

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
    .game-guide-btn{position:fixed;right:14px;bottom:14px;z-index:9999;border:3px solid #1d144b;border-radius:999px;background:linear-gradient(180deg,#fff26f,#ffc83d);color:#1d144b;font:900 16px/1 Arial,sans-serif;padding:13px 15px;box-shadow:0 7px 0 rgba(0,0,0,.28),0 0 22px rgba(255,200,61,.35);cursor:pointer}
    .game-guide-panel{position:fixed;right:14px;bottom:74px;z-index:9998;width:min(360px,calc(100vw - 28px));background:#fff6e6;color:#101436;border:4px solid #1d144b;border-radius:24px;padding:16px;box-shadow:0 18px 40px rgba(0,0,0,.35);font-family:Arial,sans-serif;display:none;text-shadow:none!important}
    .game-guide-panel.open{display:block}
    .game-guide-panel h3{margin:0 0 8px;font-size:22px;line-height:1.05;color:#1d144b!important}
    .game-guide-panel p{margin:7px 0;font-size:16px;line-height:1.22;font-weight:800;color:#101436!important}
    .game-guide-panel .guide-step{background:#fff;border:3px solid #ffc83d;border-radius:16px;padding:10px;margin:9px 0;font-weight:900;color:#101436!important}
    .game-guide-panel a{display:block;text-align:center;margin-top:10px;background:linear-gradient(180deg,#b9ffe1,#34d17a);border:3px solid #1d144b;border-radius:16px;padding:12px;color:#101436!important;text-decoration:none;font-weight:900;box-shadow:0 5px 0 rgba(0,0,0,.18)}
    .game-nudge,.mind.is-nudge{margin:10px 0 12px!important;padding:12px 14px!important;border-radius:18px!important;border:3px solid #ffc83d!important;background:linear-gradient(180deg,#fffdf4,#fff1bd)!important;color:#101436!important;font-size:18px!important;line-height:1.18!important;font-weight:900!important;box-shadow:0 6px 0 rgba(0,0,0,.16)!important;text-align:left!important;text-shadow:none!important;min-height:auto!important}
    .game-nudge b,.mind.is-nudge b{color:#1d144b!important}
    @media(max-width:390px){.game-guide-btn{right:10px;bottom:10px;font-size:15px}.game-guide-panel{right:10px;bottom:68px;width:calc(100vw - 20px)}.game-nudge,.mind.is-nudge{font-size:16px!important;padding:10px 12px!important}}
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
      intro: ['This is the main game wall. Pick one world, finish one round, then come back and choose the next challenge.', 'Esta es la pared principal. Elige un mundo, termina una ronda y vuelve para escoger el siguiente reto.'],
      step: ['Start with Math, Piano, Elements, or Angelique’s folder if this is for school.', 'Empieza con Matemática, Piano, Elementos o la carpeta de Angelique si es para la escuela.'],
      link: ['/games/angelique/', 'Go to Angelique’s folder', 'Ir a la carpeta de Angelique']
    },
    '/games/angelique/': {
      title: ['Angelique Folder', 'Carpeta de Angelique'],
      intro: ['This is her private school game folder. Start with Today’s Assignment, then use the subject cards for practice.', 'Esta es su carpeta privada. Empieza con la tarea de hoy y luego usa las categorías para practicar.'],
      step: ['Do one assignment game first. Then replay it faster to lock it into memory.', 'Haz primero un juego de tarea. Luego repítelo más rápido para memorizar.'],
      link: ['/games/angelique/reproduccion/', 'Start today’s assignment', 'Empezar la tarea de hoy']
    },
    '/games/angelique/reproduccion/': {
      title: ['Reproduction Assignment', 'Tarea de Reproducción'],
      intro: ['This is not just a quiz. Read the school question, use the rhyme, then choose the answer that sounds like the worksheet.', 'Esto no es solo un quiz. Lee la pregunta, usa la rima y escoge la respuesta que suena como la hoja.'],
      step: ['Replay until she can say the final song without looking.', 'Repite hasta que pueda decir la canción final sin mirar.'],
      link: ['/games/angelique/', 'Back to Angelique folder', 'Volver a la carpeta']
    },
    '/games/math-race/': {
      title: ['Math Race Guide', 'Guía de Matemática'],
      intro: ['This game is for speed and pattern memory. Do not only get it right. Try to get faster.', 'Este juego es para velocidad y memoria de patrones. No solo aciertes. Intenta hacerlo más rápido.'],
      step: ['Finish Level 1, then replay and beat your score.', 'Termina Nivel 1, luego repite y supera tu resultado.'],
      link: ['/games/', 'Back to game wall', 'Volver a juegos']
    },
    '/games/tongue-twister/': {
      title: ['Tongue Twister Guide', 'Guía de Trabalenguas'],
      intro: ['Pick a letter, say the phrase out loud three times, then tap another letter.', 'Elige una letra, dilo en voz alta tres veces y toca otra letra.'],
      step: ['The goal is speaking practice, not just tapping buttons.', 'La meta es practicar hablar, no solo tocar botones.'],
      link: ['/games/angelique/', 'Back to Angelique folder', 'Volver a Angelique']
    },
    '/games/elements/': {
      title: ['Elements Guide', 'Guía de Elementos'],
      intro: ['This teaches nature patterns. Choose the answer, then say the lesson back in your own words.', 'Esto enseña patrones de la naturaleza. Escoge la respuesta y luego explica la idea con tus palabras.'],
      step: ['Replay for a better score and try to explain each answer.', 'Repite para mejorar el resultado y explicar cada respuesta.'],
      link: ['/games/', 'Back to game wall', 'Volver a juegos']
    },
    '/games/piano/': {
      title: ['Piano Guide', 'Guía de Piano'],
      intro: ['Listen first. Then repeat the pattern. This trains memory, timing, and focus.', 'Escucha primero. Luego repite el patrón. Esto entrena memoria, ritmo y enfoque.'],
      step: ['Replay the same pattern until it feels easy, then move on.', 'Repite el mismo patrón hasta que sea fácil, luego sigue.'],
      link: ['/games/', 'Back to game wall', 'Volver a juegos']
    },
    '/games/beats/': {
      title: ['Beats Guide', 'Guía de Beats'],
      intro: ['Tap pads, listen to the rhythm, then try making your own loop.', 'Toca los pads, escucha el ritmo y luego crea tu propio loop.'],
      step: ['This is a creative break. Use it between school games.', 'Esto es un descanso creativo. Úsalo entre juegos de escuela.'],
      link: ['/games/', 'Back to game wall', 'Volver a juegos']
    }
  };

  function guideForPath() {
    return guides[path] || {
      title: ['Game Guide', 'Guía del Juego'],
      intro: ['Play one round. If you feel lost, read the question, tap slowly, and follow the feedback.', 'Juega una ronda. Si estás perdido, lee la pregunta, toca despacio y sigue la guía.'],
      step: ['When you finish, replay once to make it stick.', 'Cuando termines, repite una vez para memorizar.'],
      link: ['/games/', 'Back to game wall', 'Volver a juegos']
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
    panel.innerHTML = '<h3>' + text(g.title[0], g.title[1]) + '</h3><p>' + text(g.intro[0], g.intro[1]) + '</p><div class="guide-step">👉 ' + text(g.step[0], g.step[1]) + '</div><a href="' + g.link[0] + '">' + text(g.link[1], g.link[2]) + '</a>';
    btn.onclick = () => panel.classList.toggle('open');
    document.body.appendChild(panel);
    document.body.appendChild(btn);
  }

  function currentLang() {
    return localStorage.getItem('seanGameLang') === 'es' ? 'es' : 'en';
  }

  function installTongueTwisterNudge() {
    if (path !== '/games/tongue-twister/') return;
    const twister = document.querySelector('#twister');
    const mind = document.querySelector('#mind');
    if (!twister || !mind) return;
    const defaultText = 'Your tongue twister will appear here.';
    const defaultTextEs = 'Tu trabalenguas aparecerá aquí.';
    function nudgeText() {
      return currentLang() === 'es'
        ? '👉 <b>Sigue así:</b> 1) Léelo en voz alta 3 veces. 2) Mira los emojis. 3) Toca otra letra para abrir el siguiente portal.'
        : '👉 <b>Keep going:</b> 1) Say it out loud 3 times. 2) Look at the emojis. 3) Tap another letter to open the next portal.';
    }
    function check() {
      const value = (twister.textContent || '').trim();
      if (!value || value === defaultText || value === defaultTextEs) return;
      mind.classList.add('is-nudge');
      mind.innerHTML = nudgeText();
    }
    check();
    new MutationObserver(check).observe(twister, { childList: true, characterData: true, subtree: true });
    document.addEventListener('click', () => setTimeout(check, 50), true);
  }

  function area() {
    return document.querySelector('.stage') || document.querySelector('.scene') || document.querySelector('.road') || document.querySelector('.pads') || document.querySelector('.game') || document.querySelector('.mpc') || document.querySelector('.wrap') || document.body;
  }

  function centerAction() {
    try {
      if (path !== '/games/' && path !== '/games/angelique/') area().scrollIntoView({ block: 'center', inline: 'nearest' });
    } catch (e) {}
  }

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
