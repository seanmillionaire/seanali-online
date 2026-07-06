(() => {
  if (window.GameFirstScreenGuideLoaded) return;
  window.GameFirstScreenGuideLoaded = true;

  const path = location.pathname.replace(/\/+$/, '/') || '/';
  if (path === '/games/' || path.startsWith('/games/piano/') || path.startsWith('/games/beats/')) return;

  const guide = {
    '/games/mirror/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['🪞 Read life moment', '👉 Pick a thought', '✨ Clear mirror'], esSteps: ['🪞 Lee momento', '👉 Elige pensamiento', '✨ Aclara espejo'], focus: '#situation,.situation' },
    '/games/math-race/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['🚗 Read problem', '👉 Count groups', '🏁 Tap answer'], esSteps: ['🚗 Lee problema', '👉 Cuenta grupos', '🏁 Toca respuesta'], focus: '#question,.question' },
    '/games/math-dissector/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['🧠 Look here', '✏️ Use paper', '👉 Tap answer'], esSteps: ['🧠 Mira aquí', '✏️ Usa papel', '👉 Toca respuesta'], focus: '#question,.question,.problem,.board,.whiteboard' },
    '/games/elements/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['🌎 Read clue', '👀 Look icons', '👉 Pick element'], esSteps: ['🌎 Lee pista', '👀 Mira iconos', '👉 Elige elemento'], focus: '#question,.question,.clue,.prompt' },
    '/games/family-gems/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['💎 Read clue', '👀 Look picture', '👉 Pick country'], esSteps: ['💎 Lee pista', '👀 Mira imagen', '👉 Elige país'], focus: '#question,.question,.clue,.prompt' },
    '/games/tongue-twister/': { title: '👀 STEP 1: TAP ONE', esTitle: '👀 PASO 1: TOCA UNA', steps: ['🔤 Pick letter', '🗣️ Say it', '🔁 Try smoother'], esSteps: ['🔤 Elige letra', '🗣️ Dilo', '🔁 Más suave'], focus: '#twister,.twister,.prompt,.question,.letters' },
    '/games/food-groups/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['🥑 Look food', '👀 Read question', '👉 Pick answer'], esSteps: ['🥑 Mira comida', '👀 Lee pregunta', '👉 Toca respuesta'], focus: '#question,.question,.food,.prompt' },
    '/games/family/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['💛 Read moment', '🧠 Think help', '👉 Pick kind'], esSteps: ['💛 Lee momento', '🧠 Piensa ayuda', '👉 Elige bondad'], focus: '#question,.question,.prompt,.situation' },
    '/games/money/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['💰 Read choice', '🧠 Need/want?', '👉 Tap smart'], esSteps: ['💰 Lee opción', '🧠 ¿Necesidad/deseo?', '👉 Toca inteligente'], focus: '#question,.question,.prompt,.principle' },
    '/games/selva/': { title: '👀 STEP 1: READ THIS FIRST', esTitle: '👀 PASO 1: LEE ESTO PRIMERO', steps: ['🌿 Read fact', '🧠 True/false?', '👉 Tap answer'], esSteps: ['🌿 Lee dato', '🧠 ¿Verdad/falso?', '👉 Toca respuesta'], focus: '#question,.question,.prompt' }
  };

  const data = guide[path];
  if (!data) return;
  const isEs = () => localStorage.getItem('seanGameLang') === 'es';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes gameTargetPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,200,61,1),0 10px 0 rgba(0,0,0,.28);transform:scale(1)}50%{box-shadow:0 0 0 18px rgba(255,200,61,0),0 10px 0 rgba(0,0,0,.28);transform:scale(1.055)}}
    @keyframes gameActionBob{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(7px) scale(1.025)}}
    @keyframes gameGlow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.18)}}
    .game-start-guide{margin:12px auto 0;max-width:560px;background:#fff;border:6px solid #ff3b30;border-radius:26px;padding:12px;box-shadow:0 9px 0 rgba(0,0,0,.28),0 0 34px rgba(255,59,48,.42);text-align:left;color:#101436;font-family:Arial,sans-serif;animation:gameGlow 1.4s ease-in-out infinite}.game-start-title{display:flex;align-items:center;justify-content:center;gap:8px;text-align:center;font-size:25px;font-weight:900;margin-bottom:9px;background:#ffc83d;border:4px solid #101436;border-radius:18px;padding:11px;animation:gameActionBob 1.05s ease-in-out infinite}.game-start-list{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.game-start-step{background:#f1fff3;border:3px solid #34d17a;border-radius:16px;padding:10px 8px;font-size:17px;font-weight:900;line-height:1.06;text-align:center}.game-focus-target{outline:8px solid #ff3b30!important;outline-offset:6px!important;animation:gameTargetPulse .95s ease-in-out infinite!important;position:relative;z-index:20}.game-focus-target::before{content:'👀 READ HERE';position:absolute;left:50%;top:-45px;transform:translateX(-50%);background:#ff3b30;color:#fff;border:4px solid #101436;border-radius:999px;padding:7px 12px;font-size:17px;font-weight:900;white-space:nowrap;z-index:30;box-shadow:0 6px 0 rgba(0,0,0,.25)}.game-focus-arrow{position:fixed;left:50%;top:122px;transform:translateX(-50%);z-index:9998;background:#ff3b30;color:white;border:5px solid #101436;border-radius:999px;padding:11px 16px;font-size:21px;font-weight:900;box-shadow:0 7px 0 rgba(0,0,0,.28);pointer-events:none;animation:bobArrow 1s ease-in-out infinite}.game-focus-arrow::after{content:' ↓';font-size:25px}@keyframes bobArrow{50%{transform:translateX(-50%) translateY(9px)}}@media(max-width:430px){.game-start-list{grid-template-columns:1fr}.game-start-step{font-size:16px}.game-start-title{font-size:19px}.game-focus-arrow{top:104px;font-size:16px}.game-focus-target::before{font-size:14px;top:-38px}}
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
    target.classList.add('game-focus-target');
    if (!document.querySelector('.game-focus-arrow')) {
      const arrow = document.createElement('div');
      arrow.className = 'game-focus-arrow';
      arrow.textContent = isEs() ? 'Mira aquí primero' : 'Look here first';
      document.body.appendChild(arrow);
      setTimeout(() => arrow.remove(), 10500);
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
