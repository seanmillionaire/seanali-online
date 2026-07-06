(() => {
  if (window.GameFirstScreenGuideLoaded) return;
  window.GameFirstScreenGuideLoaded = true;

  const path = location.pathname.replace(/\/+$/, '/') || '/';
  if (path === '/games/' || path.startsWith('/games/piano/') || path.startsWith('/games/beats/')) return;

  const guide = {
    '/games/mirror/': { title: '🚨 READ THIS FIRST', esTitle: '🚨 LEE ESTO PRIMERO', steps: ['1️⃣ Read the moment', '2️⃣ Pick the thought', '3️⃣ Watch mirror clear'], esSteps: ['1️⃣ Lee el momento', '2️⃣ Elige pensamiento', '3️⃣ Mira el espejo'], focus: '#situation,.situation' },
    '/games/math-race/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['1️⃣ Read problem', '2️⃣ Count groups', '3️⃣ Tap answer'], esSteps: ['1️⃣ Lee problema', '2️⃣ Cuenta grupos', '3️⃣ Toca respuesta'], focus: '#question,.question' },
    '/games/math-dissector/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['1️⃣ Look at board', '2️⃣ Use paper', '3️⃣ Tap answer'], esSteps: ['1️⃣ Mira pizarra', '2️⃣ Usa papel', '3️⃣ Toca respuesta'], focus: '#question,.question,.problem,.board,.whiteboard' },
    '/games/elements/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['1️⃣ Read clue', '2️⃣ Look icons', '3️⃣ Pick element'], esSteps: ['1️⃣ Lee pista', '2️⃣ Mira iconos', '3️⃣ Elige elemento'], focus: '#question,.question,.clue,.prompt' },
    '/games/family-gems/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['1️⃣ Read clue', '2️⃣ Feel picture', '3️⃣ Pick country'], esSteps: ['1️⃣ Lee pista', '2️⃣ Siente imagen', '3️⃣ Elige país'], focus: '#question,.question,.clue,.prompt' },
    '/games/tongue-twister/': { title: '👀 STEP 1: TAP ONE', esTitle: '👀 PASO 1: TOCA UNA', steps: ['1️⃣ Pick letter', '2️⃣ Say it', '3️⃣ Try smoother'], esSteps: ['1️⃣ Elige letra', '2️⃣ Dilo', '3️⃣ Más suave'], focus: '#twister,.twister,.prompt,.question,.letters' },
    '/games/food-groups/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['1️⃣ Look food', '2️⃣ Read question', '3️⃣ Pick answer'], esSteps: ['1️⃣ Mira comida', '2️⃣ Lee pregunta', '3️⃣ Toca respuesta'], focus: '#question,.question,.food,.prompt' },
    '/games/family/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['1️⃣ Read moment', '2️⃣ Think help', '3️⃣ Pick kind'], esSteps: ['1️⃣ Lee momento', '2️⃣ Piensa ayuda', '3️⃣ Elige bondad'], focus: '#question,.question,.prompt,.situation' },
    '/games/money/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['1️⃣ Read choice', '2️⃣ Need or want?', '3️⃣ Tap smart'], esSteps: ['1️⃣ Lee opción', '2️⃣ ¿Necesidad?', '3️⃣ Toca inteligente'], focus: '#question,.question,.prompt,.principle' },
    '/games/selva/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['1️⃣ Read fact', '2️⃣ True or false?', '3️⃣ Tap answer'], esSteps: ['1️⃣ Lee dato', '2️⃣ ¿Verdad?', '3️⃣ Toca respuesta'], focus: '#question,.question,.prompt' },
    '/games/isla-aventura/': { title: '👀 STEP 1: START HERE', esTitle: '👀 PASO 1: EMPIEZA AQUÍ', steps: ['1️⃣ Read mission', '2️⃣ Choose move', '3️⃣ Win treasure'], esSteps: ['1️⃣ Lee misión', '2️⃣ Elige acción', '3️⃣ Gana tesoro'], focus: '#question,.question,.prompt,.mission' }
  };

  const data = guide[path];
  if (!data) return;
  const isEs = () => localStorage.getItem('seanGameLang') === 'es';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes gameTargetPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,200,61,1),0 10px 0 rgba(0,0,0,.28);transform:scale(1)}50%{box-shadow:0 0 0 20px rgba(255,200,61,0),0 10px 0 rgba(0,0,0,.28);transform:scale(1.055)}}
    @keyframes gameActionBob{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(7px) scale(1.025)}}
    @keyframes gameGlow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.18)}}
    .game-start-guide{margin:12px auto 0;max-width:560px;background:#fff;border:6px solid #ff3b30;border-radius:26px;padding:12px;box-shadow:0 9px 0 rgba(0,0,0,.28),0 0 34px rgba(255,59,48,.42);text-align:left;color:#101436;font-family:Arial,sans-serif;animation:gameGlow 1.4s ease-in-out infinite}.game-start-title{display:flex;align-items:center;justify-content:center;gap:8px;text-align:center;font-size:25px;font-weight:900;margin-bottom:9px;background:#ffc83d;border:4px solid #101436;border-radius:18px;padding:11px;animation:gameActionBob 1.05s ease-in-out infinite}.game-start-list{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.game-start-step{background:#f1fff3;border:3px solid #34d17a;border-radius:16px;padding:10px 8px;font-size:17px;font-weight:900;line-height:1.06;text-align:center}.game-focus-target{outline:8px solid #ff3b30!important;outline-offset:6px!important;animation:gameTargetPulse .95s ease-in-out infinite!important;position:relative;z-index:20}.game-focus-target::before{content:'👀 READ HERE';position:absolute;left:50%;top:-45px;transform:translateX(-50%);background:#ff3b30;color:#fff;border:4px solid #101436;border-radius:999px;padding:7px 12px;font-size:17px;font-weight:900;white-space:nowrap;z-index:30;box-shadow:0 6px 0 rgba(0,0,0,.25)}body[data-read-mode="mirror"] .game-focus-target{outline:10px solid #ff3b30!important;background:#fff9cf!important;border-color:#ff3b30!important}body[data-read-mode="mirror"] .game-focus-target::before{content:'🚨 READ THIS FIRST';font-size:20px;background:#ff3b30}.game-focus-arrow{position:fixed;left:50%;top:122px;transform:translateX(-50%);z-index:9998;background:#ff3b30;color:white;border:5px solid #101436;border-radius:999px;padding:11px 16px;font-size:21px;font-weight:900;box-shadow:0 7px 0 rgba(0,0,0,.28);pointer-events:none;animation:bobArrow 1s ease-in-out infinite}.game-focus-arrow::after{content:' ↓';font-size:25px}@keyframes bobArrow{50%{transform:translateX(-50%) translateY(9px)}}@media(max-width:430px){.game-start-list{grid-template-columns:1fr}.game-start-step{font-size:16px}.game-start-title{font-size:19px}.game-focus-arrow{top:104px;font-size:16px}.game-focus-target::before{font-size:14px;top:-38px}body[data-read-mode="mirror"] .game-focus-target::before{font-size:15px}}
  `;
  document.head.appendChild(style);

  function addGuide() {
    const top = document.querySelector('.top') || document.querySelector('header') || document.body;
    if (!top || document.querySelector('.game-start-guide')) return;
    const box = document.createElement('div');
    box.className = 'game-start-guide';
    const title = isEs() ? (data.esTitle || data.title) : data.title;
    const steps = isEs() ? (data.esSteps || data.steps) : data.steps;
    box.innerHTML = '<div class="game-start-title">' + title + '</div><div class="game-start-list">' + steps.map(s => '<div class="game-start-step">' + s + '</div>').join('') + '</div>';
    top.appendChild(box);
  }

  function refreshGuideLang() {
    const box = document.querySelector('.game-start-guide');
    if (!box) return;
    box.remove();
    addGuide();
  }

  function focusFirstThing() {
    const target = document.querySelector(data.focus);
    if (!target) return;
    if (path === '/games/mirror/') document.body.dataset.readMode = 'mirror';
    target.classList.add('game-focus-target');
    if (!document.querySelector('.game-focus-arrow')) {
      const arrow = document.createElement('div');
      arrow.className = 'game-focus-arrow';
      arrow.textContent = isEs() ? 'Lee esto primero' : (path === '/games/mirror/' ? 'Read this first' : 'Look here first');
      document.body.appendChild(arrow);
      setTimeout(() => arrow.remove(), path === '/games/mirror/' ? 16000 : 10500);
    }
  }

  function introJingle() {
    const play = () => {
      if (window.SeanGameSounds && window.SeanGameSounds.jingle) window.SeanGameSounds.jingle();
      window.removeEventListener('pointerdown', play);
      window.removeEventListener('click', play);
    };
    window.addEventListener('pointerdown', play, { once: true, passive: true });
    window.addEventListener('click', play, { once: true, passive: true });
  }

  function run() {
    addGuide();
    setTimeout(focusFirstThing, 250);
    introJingle();
  }

  window.addEventListener('seanGameLangChange', () => { setTimeout(refreshGuideLang, 80); setTimeout(focusFirstThing, 140); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
