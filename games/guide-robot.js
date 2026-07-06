(() => {
  if (document.querySelector('[data-guide-robot]')) return;

  const STORAGE_KEY = 'seanGameUserName';
  const GUIDE_SHOWN_KEY = 'seanGameGuideShown';
  const MAP_PROGRESS_KEY = 'seanGameMapProgress:v1';

  const messages = {
    welcome: (name) => [
      `Hi ${name}! 👋✨`,
      `I’m your game buddy 🤖🎮`,
      `Tap buttons. Try answers. Have fun! 🚀⭐`
    ],
    gameStart: (name, gameName) => [
      `Ready, ${name}? 🎮`,
      `${gameName} time! 🌈`,
      `Read. Tap. Win! 🏆`
    ],
    tip: (name) => [
      `Tiny tip, ${name}! 💡`,
      `Look for clues 👀`,
      `Then tap your best answer ⭐`
    ],
    stuck: (name) => [
      `Oops moment? 🫣`,
      `Read it one more time 📖`,
      `You can do it! 💪✨`
    ],
    celebrate: (name) => [
      `YES ${name}! 🎉`,
      `Big brain move! 🧠⚡`,
      `Keep going! 🏁⭐`
    ]
  };

  let userName = localStorage.getItem(STORAGE_KEY);
  let currentMessageIndex = 0;
  let isOpen = false;

  const style = document.createElement('style');
  style.textContent = `
    [data-guide-robot]{position:fixed;bottom:16px;right:14px;z-index:999;font-family:Arial,sans-serif}
    .guide-robot-button{width:76px;height:76px;border-radius:50%;background:radial-gradient(circle at 30% 20%,#fff,#fff26f 24%,#ff62b7 58%,#7d4cff);border:5px solid #101436;box-shadow:0 8px 0 rgba(0,0,0,.28),0 0 22px rgba(255,98,183,.45);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:42px;animation:guideBounce 1.35s ease-in-out infinite;touch-action:manipulation}
    .guide-robot-button:active{transform:translateY(6px) scale(.96);box-shadow:0 2px 0 rgba(0,0,0,.28),0 0 18px rgba(255,98,183,.55)}
    @keyframes guideBounce{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-6px) rotate(2deg)}}
    .guide-robot-modal{position:fixed;inset:0;background:rgba(16,20,54,.55);display:none;align-items:center;justify-content:center;padding:14px;z-index:1000}.guide-robot-modal.show{display:flex}
    .guide-robot-panel{position:relative;width:min(430px,100%);background:linear-gradient(180deg,#fff6e6,#e8fbff);border:5px solid #101436;border-radius:30px;padding:18px;box-shadow:0 18px 0 rgba(0,0,0,.25),0 0 40px rgba(255,200,61,.45);color:#101436;animation:guidePop .28s ease}
    @keyframes guidePop{from{opacity:0;transform:scale(.9) translateY(18px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .guide-robot-header{display:flex;align-items:center;gap:10px;margin-bottom:10px;background:linear-gradient(90deg,#ff62b7,#ffc83d,#34d17a,#00d4ff);border:4px solid #101436;border-radius:22px;padding:10px;color:#101436}.guide-robot-header span{font-size:38px}.guide-robot-title{font-size:25px;line-height:1;margin:0;font-weight:900}
    .guide-robot-message{font-size:24px;line-height:1.12;margin:12px 0;min-height:78px;display:flex;align-items:center;justify-content:center;text-align:center;background:#fff;border:4px solid #ffc83d;border-radius:22px;padding:14px;font-weight:900;color:#101436;box-shadow:0 7px 0 rgba(0,0,0,.14)}
    .guide-robot-buttons{display:grid;grid-template-columns:1fr;gap:10px;margin-top:12px}.guide-robot-btn{border:4px solid #101436;border-radius:20px;padding:15px 14px;font-size:20px;font-weight:900;cursor:pointer;color:#101436;box-shadow:0 7px 0 rgba(0,0,0,.25);touch-action:manipulation}.guide-robot-btn:active{transform:translateY(6px);box-shadow:0 1px 0 rgba(0,0,0,.25)}
    .guide-robot-btn-primary{background:linear-gradient(180deg,#fff26f,#ffc83d)}.guide-robot-btn-secondary{background:linear-gradient(180deg,#d7b9ff,#9b7cff);color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.18)}
    .guide-robot-close{position:absolute;top:10px;right:10px;background:#ff3d3d;border:4px solid #101436;border-radius:50%;width:46px;height:46px;cursor:pointer;font-size:24px;color:white;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 5px 0 rgba(0,0,0,.25)}
    .guide-robot-name-input{width:100%;border:5px solid #101436;border-radius:24px;padding:22px 16px;font-size:30px;font-weight:900;margin:14px 0 4px;box-sizing:border-box;text-align:center;background:#fff;color:#101436;min-height:78px;box-shadow:0 7px 0 rgba(0,0,0,.18)}.guide-robot-name-input::placeholder{color:#777;font-size:22px}
    .guide-robot-name-label{font-size:26px;font-weight:900;line-height:1.08;margin-bottom:4px}.guide-robot-name-wrap{width:100%}.guide-robot-name-hint{font-size:15px;font-weight:900;color:#334;text-align:center;margin-top:6px}
    .guide-robot-dots{display:flex;gap:8px;justify-content:center;margin-top:12px}.guide-robot-dot{width:15px;height:15px;border-radius:50%;border:2px solid #101436;background:#fff;cursor:pointer}.guide-robot-dot.active{background:#ff62b7;transform:scale(1.25)}
    .guide-robot-secret{margin-top:6px;background:transparent!important;border:0!important;box-shadow:none!important;color:#101436!important;opacity:.26;font-size:13px!important;padding:5px!important}.guide-robot-secret:active,.guide-robot-secret:hover{opacity:1}.guide-robot-unlocked{background:#f1fff3;border:4px solid #34d17a;border-radius:18px;padding:10px;margin-top:10px;font-size:18px;font-weight:900;text-align:center}
    @media(max-width:480px){[data-guide-robot]{bottom:12px;right:10px}.guide-robot-button{width:66px;height:66px;font-size:36px}.guide-robot-panel{padding:14px}.guide-robot-title{font-size:21px}.guide-robot-message{font-size:21px;min-height:70px}.guide-robot-btn{font-size:18px;padding:14px 12px}.guide-robot-name-input{font-size:28px;min-height:82px;padding:22px 12px}.guide-robot-name-label{font-size:24px}}
  `;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.setAttribute('data-guide-robot', 'true');

  const button = document.createElement('button');
  button.className = 'guide-robot-button';
  button.textContent = '🤖';
  button.setAttribute('aria-label', 'Open game buddy');

  const modal = document.createElement('div');
  modal.className = 'guide-robot-modal';

  const panel = document.createElement('div');
  panel.className = 'guide-robot-panel';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'guide-robot-close';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Close guide');

  const header = document.createElement('div');
  header.className = 'guide-robot-header';
  header.innerHTML = '<span>🤖</span>';

  const title = document.createElement('h2');
  title.className = 'guide-robot-title';
  title.textContent = 'Buddy Guide';

  const messageDiv = document.createElement('div');
  messageDiv.className = 'guide-robot-message';

  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'guide-robot-buttons';

  header.appendChild(title);
  panel.appendChild(closeBtn);
  panel.appendChild(header);
  panel.appendChild(messageDiv);
  panel.appendChild(buttonsDiv);
  modal.appendChild(panel);
  container.appendChild(button);
  container.appendChild(modal);
  document.body.appendChild(container);

  function saveName(name) {
    localStorage.setItem(STORAGE_KEY, name.trim());
    userName = name.trim();
  }

  function unlockAllGames() {
    localStorage.setItem(MAP_PROGRESS_KEY, '99');
    localStorage.setItem('seanGameMapUnlockedAll:v1', 'true');
    const box = document.createElement('div');
    box.className = 'guide-robot-unlocked';
    box.textContent = '🔓 All games unlocked!';
    buttonsDiv.prepend(box);
    setTimeout(() => { if (location.pathname.replace(/\/+$/, '/') === '/games/') location.reload(); }, 650);
  }

  function showNamePrompt() {
    currentMessageIndex = 0;
    messageDiv.innerHTML = '';
    buttonsDiv.innerHTML = '';

    const wrap = document.createElement('div');
    wrap.className = 'guide-robot-name-wrap';

    const label = document.createElement('div');
    label.className = 'guide-robot-name-label';
    label.textContent = 'What is your name?';

    const input = document.createElement('input');
    input.className = 'guide-robot-name-input';
    input.type = 'text';
    input.placeholder = 'Type name here';
    input.value = userName || '';

    const hint = document.createElement('div');
    hint.className = 'guide-robot-name-hint';
    hint.textContent = 'Big letters are easier to tap.';

    wrap.appendChild(label);
    wrap.appendChild(input);
    wrap.appendChild(hint);
    messageDiv.appendChild(wrap);

    const submitBtn = document.createElement('button');
    submitBtn.className = 'guide-robot-btn guide-robot-btn-primary';
    submitBtn.textContent = '🚀 Start Playing';

    const skipBtn = document.createElement('button');
    skipBtn.className = 'guide-robot-btn guide-robot-btn-secondary';
    skipBtn.textContent = '🎮 Play Now';

    buttonsDiv.appendChild(submitBtn);
    buttonsDiv.appendChild(skipBtn);
    addSecretButton();

    submitBtn.addEventListener('click', () => {
      if (input.value.trim()) {
        saveName(input.value);
        localStorage.setItem(GUIDE_SHOWN_KEY, 'true');
        showWelcome();
      }
    });

    skipBtn.addEventListener('click', () => {
      localStorage.setItem(GUIDE_SHOWN_KEY, 'true');
      closeModal();
    });

    setTimeout(() => input.focus(), 50);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && input.value.trim()) submitBtn.click();
    });
  }

  function addSecretButton() {
    if (buttonsDiv.querySelector('.guide-robot-secret')) return;
    const secret = document.createElement('button');
    secret.className = 'guide-robot-btn guide-robot-secret';
    secret.type = 'button';
    secret.textContent = 'secret unlock';
    secret.title = 'Unlock all games';
    secret.addEventListener('click', unlockAllGames);
    buttonsDiv.appendChild(secret);
  }

  function showWelcome() {
    currentMessageIndex = 0;
    const msgs = messages.welcome(userName || 'Friend');
    showMessageCarousel(msgs);
  }

  function showMessageCarousel(msgs) {
    messageDiv.innerHTML = '';
    buttonsDiv.innerHTML = '';

    const msgText = document.createElement('p');
    msgText.style.margin = '0';
    msgText.textContent = msgs[currentMessageIndex];
    messageDiv.appendChild(msgText);

    if (msgs.length > 1) {
      const dotsDiv = document.createElement('div');
      dotsDiv.className = 'guide-robot-dots';
      msgs.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'guide-robot-dot' + (idx === currentMessageIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Message ${idx + 1}`);
        dot.addEventListener('click', () => {
          currentMessageIndex = idx;
          showMessageCarousel(msgs);
        });
        dotsDiv.appendChild(dot);
      });
      messageDiv.appendChild(dotsDiv);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'guide-robot-btn guide-robot-btn-primary';
    nextBtn.textContent = currentMessageIndex < msgs.length - 1 ? '👉 Next' : '✅ Got It';

    const closeBtn2 = document.createElement('button');
    closeBtn2.className = 'guide-robot-btn guide-robot-btn-secondary';
    closeBtn2.textContent = '🎮 Play';

    buttonsDiv.appendChild(nextBtn);
    buttonsDiv.appendChild(closeBtn2);
    addSecretButton();

    nextBtn.addEventListener('click', () => {
      if (currentMessageIndex < msgs.length - 1) {
        currentMessageIndex++;
        showMessageCarousel(msgs);
      } else {
        closeModal();
      }
    });
    closeBtn2.addEventListener('click', closeModal);
  }

  function openModal() {
    isOpen = true;
    modal.classList.add('show');
    if (!userName) showNamePrompt();
    else showWelcome();
  }

  function closeModal() {
    isOpen = false;
    modal.classList.remove('show');
  }

  button.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  if (!localStorage.getItem(GUIDE_SHOWN_KEY)) {
    setTimeout(openModal, 800);
  }

  window.GameGuide = {
    setName: saveName,
    getName: () => userName,
    showTip: () => { showMessageCarousel(messages.tip(userName || 'Friend')); modal.classList.add('show'); },
    showStuck: () => { showMessageCarousel(messages.stuck(userName || 'Friend')); modal.classList.add('show'); },
    celebrate: () => { showMessageCarousel(messages.celebrate(userName || 'Friend')); modal.classList.add('show'); },
    unlockAllGames,
    open: openModal,
    close: closeModal
  };
})();
