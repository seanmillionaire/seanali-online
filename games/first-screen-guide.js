(() => {
  if (window.GameFirstScreenGuideLoaded) return;
  window.GameFirstScreenGuideLoaded = true;

  const path = location.pathname.replace(/\/+$/, '/') || '/';
  if (path === '/games/' || path.startsWith('/games/piano/') || path.startsWith('/games/beats/')) return;

  const guide = {
    '/games/mirror/': { title: '👀 Step 1: Read this', esTitle: '👀 Paso 1: Lee esto', steps: ['🪞 Life moment', '👉 Pick a thought', '✨ Clear the mirror'], esSteps: ['🪞 Momento de vida', '👉 Elige un pensamiento', '✨ Aclara el espejo'], focus: '#situation,.situation' },
    '/games/math-race/': { title: '👀 Step 1: Read this', esTitle: '👀 Paso 1: Lee esto', steps: ['🚗 Math problem', '👉 Count groups', '🏁 Tap answer'], esSteps: ['🚗 Problema', '👉 Cuenta grupos', '🏁 Toca respuesta'], focus: '#question,.question' },
    '/games/math-dissector/': { title: '👀 Step 1: Read this', esTitle: '👀 Paso 1: Lee esto', steps: ['🧠 Look at problem', '✏️ Use paper', '👉 Tap answer'], esSteps: ['🧠 Mira el problema', '✏️ Usa papel', '👉 Toca respuesta'], focus: '#question,.question,.problem,.board,.whiteboard' },
    '/games/elements/': { title: '👀 Step 1: Read this', esTitle: '👀 Paso 1: Lee esto', steps: ['🌎 Read clue', '👀 Look at icons', '👉 Pick element'], esSteps: ['🌎 Lee la pista', '👀 Mira iconos', '👉 Elige elemento'], focus: '#question,.question,.clue,.prompt' },
    '/games/family-gems/': { title: '👀 Step 1: Read this', esTitle: '👀 Paso 1: Lee esto', steps: ['💎 Read clue', '👀 Look at picture', '👉 Pick country'], esSteps: ['💎 Lee pista', '👀 Mira imagen', '👉 Elige país'], focus: '#question,.question,.clue,.prompt' },
    '/games/tongue-twister/': { title: '👀 Step 1: Tap one', esTitle: '👀 Paso 1: Toca una', steps: ['🔤 Pick letter', '🗣️ Say it', '🔁 Try smoother'], esSteps: ['🔤 Elige letra', '🗣️ Dilo', '🔁 Más suave'], focus: '#twister,.twister,.prompt,.question,.letters' },
    '/games/food-groups/': { title: '👀 Step 1: Read this', esTitle: '👀 Paso 1: Lee esto', steps: ['🥑 Look food', '👀 Read question', '👉 Pick answer'], esSteps: ['🥑 Mira comida', '👀 Lee pregunta', '👉 Toca respuesta'], focus: '#question,.question,.food,.prompt' },
    '/games/family/': { title: '👀 Step 1: Read this', esTitle: '👀 Paso 1: Lee esto', steps: ['💛 Family moment', '🧠 Think help', '👉 Pick kind choice'], esSteps: ['💛 Momento familia', '🧠 Piensa ayuda', '👉 Elige bondad'], focus: '#question,.question,.prompt,.situation' },
    '/games/money/': { title: '👀 Step 1: Read this', esTitle: '👀 Paso 1: Lee esto', steps: ['💰 Money choice', '🧠 Need or want?', '👉 Tap smart answer'], esSteps: ['💰 Opción dinero', '🧠 ¿Necesidad o deseo?', '👉 Toca respuesta'], focus: '#question,.question,.prompt,.principle' },
    '/games/selva/': { title: '👀 Step 1: Read this', esTitle: '👀 Paso 1: Lee esto', steps: ['🌿 Read fact', '🧠 True or false?', '👉 Tap answer'], esSteps: ['🌿 Lee dato', '🧠 ¿Verdad o falso?', '👉 Toca respuesta'], focus: '#question,.question,.prompt' }
  };

  const data = guide[path];
  if (!data) return;
  const isEs = () => localStorage.getItem('seanGameLang') === 'es';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes gameTargetPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,200,61,1),0 8px 0 rgba(0,0,0,.22);transform:scale(1)}50%{box-shadow:0 0 0 14px rgba(255,200,61,0),0 8px 0 rgba(0,0,0,.22);transform:scale(1.045)}}
    @keyframes gameActionBob{50%{transform:translateY(7px) scale(1.02)}}
    .game-start-guide{margin:12px auto 0;max-width:540px;background:#fff;border:5px solid #ffc83d;border-radius:24px;padding:12px;box-shadow:0 8px 0 rgba(0,0,0,.24),0 0 24px rgba(255,200,61,.35);text-align:left;color:#101436;font-family:Arial,sans-serif}.game-start-title{display:flex;align-items:center;justify-content:center;gap:7px;text-align:center;font-size:23px;font-weight:900;margin-bottom:9px;background:#ffc83d;border:3px solid #101436;border-radius:18px;padding:9px;animation:gameActionBob 1.15s ease-in-out infinite}.game-start-list{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.game-start-step{background:#f1fff3;border:3px solid #34d17a;border-radius:16px;padding:9px 8px;font-size:16px;font-weight:900;line-height:1.08;text-align:center}.game-focus-target{outline:7px solid #ffc83d!important;outline-offset:5px!important;animation:gameTargetPulse 1.05s ease-in-out infinite!important;position:relative;z-index:20}.game-focus-arrow{position:fixed;left:50%;top:122px;transform:translateX(-50%);z-index:9998;background:#ff3b30;color:white;border:5px solid #101436;border-radius:999px;padding:10px 15px;font-size:20px;font-weight:900;box-shadow:0 7px 0 rgba(0,0,0,.28);pointer-events:none;animation:bobArrow 1s ease-in-out infinite}.game-focus-arrow::after{content:' ↓';font-size:24px}@keyframes bobArrow{50%{transform:translateX(-50%) translateY(9px)}}@media(max-width:430px){.game-start-list{grid-template-columns:1fr}.game-start-step{font-size:15px}.game-start-title{font-size:19px}.game-focus-arrow{top:104px;font-size:16px}}
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
      arrow.textContent = isEs() ? 'Lee esto primero' : 'Read this first';
      document.body.appendChild(arrow);
      setTimeout(() => arrow.remove(), 7600);
    }
    setTimeout(() => target.classList.remove('game-focus-target'), 11000);
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
