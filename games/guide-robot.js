(() => {
  if (document.querySelector('[data-guide-robot-final]')) return;

  const NAME_KEY = 'seanGuideRobotName';
  const SEEN_KEY = 'seanGuideRobotSeen';
  const userFromStorage = localStorage.getItem(NAME_KEY);
  let userName = userFromStorage || '';
  let welcomeStep = 0;
  let ruleStep = 0;

  const welcomeMessages = name => [
    `🌈 HI ${name.toUpperCase()}! I'M ROBOT BUDDY! 🤖`,
    `⭐ LET'S HAVE A SUPER FUN TIME! 🎮`,
    `🚀 TAP A BUTTON AND LET'S GO! ✨`
  ];

  const tips = name => [
    `💡 YOU CAN DO IT, ${name.toUpperCase()}!`,
    '👀 READ THE CLUE FIRST.',
    '☝️ THEN TAP YOUR BEST ANSWER.',
    '🔄 IF YOU MISS, TRY AGAIN!'
  ];

  const style = document.createElement('style');
  style.textContent = `
    [data-guide-robot-final] { font-family: Arial, Helvetica, sans-serif; }
    [data-guide-robot-final] .robot-buddy-btn {
      position: fixed; right: 24px; bottom: 24px; z-index: 10000;
      width: 82px; height: 82px; border: 7px solid #fff; border-radius: 50%;
      background: linear-gradient(45deg, #ff0080, #ff8c00); cursor: pointer;
      font-size: 46px; line-height: 1; box-shadow: 0 10px 28px rgba(255, 0, 128, .48);
      animation: robotBuddyFloat 2.8s ease-in-out infinite;
    }
    [data-guide-robot-final] .robot-buddy-btn:hover { transform: scale(1.1) rotate(8deg); }
    @keyframes robotBuddyFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
    [data-guide-robot-final] .robot-buddy-modal {
      position: fixed; inset: 0; z-index: 10001; display: none; align-items: center;
      justify-content: center; padding: 18px; background: rgba(0, 0, 0, .68);
    }
    [data-guide-robot-final] .robot-buddy-modal.show { display: flex; }
    [data-guide-robot-final] .robot-buddy-card {
      position: relative; width: min(500px, 100%); max-height: min(700px, 92vh); overflow: auto;
      box-sizing: border-box; padding: 34px 30px 30px; border: 9px solid #ff0080;
      border-radius: 38px; background: #fff; text-align: center;
      box-shadow: 0 28px 60px rgba(0,0,0,.5); animation: robotBuddyPop .35s ease-out;
    }
    @keyframes robotBuddyPop { from { opacity: 0; transform: scale(.82); } to { opacity: 1; transform: scale(1); } }
    [data-guide-robot-final] .robot-buddy-card h2 { margin: 0 0 18px; color: #ff0080; font-size: 27px; }
    [data-guide-robot-final] .robot-buddy-text {
      margin: 16px 0 24px; color: #ff0080; font-size: 24px; font-weight: 900; line-height: 1.35;
    }
    [data-guide-robot-final] .robot-buddy-close {
      position: absolute; top: 10px; right: 12px; width: 42px; height: 42px;
      border: 4px solid #ff0080; border-radius: 50%; background: #fff; color: #ff0080;
      font-size: 24px; font-weight: 900; cursor: pointer;
    }
    [data-guide-robot-final] .robot-buddy-input {
      width: 100%; box-sizing: border-box; padding: 17px; margin: 14px 0 20px;
      border: 4px solid #ff9800; border-radius: 18px; color: #444; background: #fff;
      font-size: 18px; text-align: center; outline: none;
    }
    [data-guide-robot-final] .robot-buddy-input:focus { border-color: #ff0080; }
    [data-guide-robot-final] .robot-buddy-grid { display: grid; gap: 11px; }
    [data-guide-robot-final] .robot-buddy-btn-action {
      width: 100%; padding: 16px 18px; border: 0; border-radius: 18px; cursor: pointer;
      color: #fff; font-size: 17px; font-weight: 900; box-shadow: 0 6px 0 rgba(0,0,0,.18);
    }
    [data-guide-robot-final] .robot-buddy-btn-action:active { transform: translateY(3px); box-shadow: 0 3px 0 rgba(0,0,0,.18); }
    [data-guide-robot-final] .robot-buddy-go { background: #ff9800; box-shadow: 0 6px 0 #cf7000; }
    [data-guide-robot-final] .robot-buddy-next { background: #ff9800; }
    [data-guide-robot-final] .robot-buddy-rules { background: #377dff; }
    [data-guide-robot-final] .robot-buddy-tip { background: #7b61ff; }
    [data-guide-robot-final] .robot-buddy-close-action { background: #39b96a; }
    [data-guide-robot-final] .robot-buddy-icons { display: flex; justify-content: center; gap: 10px; margin: 8px 0 22px; }
    [data-guide-robot-final] .robot-buddy-icon {
      width: 52px; height: 52px; border: 3px solid #ff9800; border-radius: 15px;
      background: #fff6d8; font-size: 28px;
    }
    [data-guide-robot-final] .robot-buddy-rule {
      min-height: 86px; display: flex; align-items: center; justify-content: center;
      padding: 14px; border: 4px solid #ffd33d; border-radius: 18px;
      color: #333; font-size: 21px; font-weight: 900; line-height: 1.35;
    }
    [data-guide-robot-final] .robot-buddy-dots { margin: 14px 0; color: #ff0080; font-weight: 900; }
    @media (max-width: 560px) {
      [data-guide-robot-final] .robot-buddy-btn { right: 14px; bottom: 14px; width: 70px; height: 70px; font-size: 39px; }
      [data-guide-robot-final] .robot-buddy-card { padding: 30px 20px 22px; border-width: 7px; }
      [data-guide-robot-final] .robot-buddy-text { font-size: 21px; }
    }
  `;
  document.head.appendChild(style);

  function hideLegacyHelp() {
    const oldButton = document.getElementById('manualBtn');
    if (oldButton) oldButton.style.display = 'none';
    const oldClose = document.getElementById('closeManual');
    if (oldClose) oldClose.style.display = 'none';
    document.querySelectorAll('#manualTitle, #manualList').forEach(node => {
      const box = node.closest('#modal, .modal, [role="dialog"], .manual-modal, .manual');
      if (box) box.style.display = 'none';
    });
    document.querySelectorAll('button').forEach(button => {
      if (button.closest('[data-guide-robot-final]')) return;
      const label = (button.textContent || '').trim().toLowerCase();
      if (/^(how to play|manual|game help)$/.test(label)) button.style.display = 'none';
    });
  }

  function pageKey() {
    const cleanPath = location.pathname.replace(/\/+$/, '');
    const parts = cleanPath.split('/');
    if (parts[parts.length - 1].toLowerCase() === 'index.html') parts.pop();
    return parts[parts.length - 1] || 'console';
  }

  function pageRules() {
    const all = window.GameRules || {};
    return all[pageKey()] || all.console || [];
  }

  const root = document.createElement('div');
  root.setAttribute('data-guide-robot-final', 'true');
  root.innerHTML = `
    <button class="robot-buddy-btn" aria-label="Open Robot Buddy">🤖</button>
    <div class="robot-buddy-modal" role="dialog" aria-modal="true" aria-label="Robot Buddy">
      <div class="robot-buddy-card">
        <button class="robot-buddy-close" aria-label="Close">×</button>
        <h2>🤖 ROBOT BUDDY</h2>
        <div class="robot-buddy-content"></div>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  const openButton = root.querySelector('.robot-buddy-btn');
  const modal = root.querySelector('.robot-buddy-modal');
  const card = root.querySelector('.robot-buddy-card');
  const content = root.querySelector('.robot-buddy-content');
  const closeButton = root.querySelector('.robot-buddy-close');

  function actionButton(label, className, handler) {
    const button = document.createElement('button');
    button.className = `robot-buddy-btn-action ${className}`;
    button.textContent = label;
    button.addEventListener('click', handler);
    return button;
  }

  function showNamePrompt() {
    content.innerHTML = '';
    const text = document.createElement('div');
    text.className = 'robot-buddy-text';
    text.textContent = '👋 WHAT IS YOUR NAME?';
    const input = document.createElement('input');
    input.className = 'robot-buddy-input';
    input.placeholder = 'TYPE HERE!';
    input.autocomplete = 'nickname';
    const icons = document.createElement('div');
    icons.className = 'robot-buddy-icons';
    ['🎮', '🎨', '🎵', '🏆'].forEach(icon => {
      const item = document.createElement('span');
      item.className = 'robot-buddy-icon';
      item.textContent = icon;
      icons.appendChild(item);
    });
    const go = actionButton('🚀 GO!', 'robot-buddy-go', () => {
      const value = input.value.trim().slice(0, 24);
      if (!value) { input.focus(); return; }
      userName = value;
      localStorage.setItem(NAME_KEY, userName);
      localStorage.setItem(SEEN_KEY, 'true');
      welcomeStep = 0;
      renderWelcome();
    });
    input.addEventListener('keydown', event => { if (event.key === 'Enter') go.click(); });
    content.append(text, input, icons, go);
    setTimeout(() => input.focus(), 0);
  }

  function renderWelcome() {
    const messages = welcomeMessages(userName);
    content.innerHTML = '';
    const text = document.createElement('div');
    text.className = 'robot-buddy-text';
    text.textContent = messages[welcomeStep];
    const grid = document.createElement('div');
    grid.className = 'robot-buddy-grid';
    if (welcomeStep < messages.length - 1) {
      grid.appendChild(actionButton('⏭️ NEXT', 'robot-buddy-next', () => { welcomeStep += 1; renderWelcome(); }));
    } else {
      grid.appendChild(actionButton('🎮 SHOW ME THE GAMES', 'robot-buddy-next', renderMenu));
    }
    content.append(text, grid);
  }

  function renderMenu() {
    content.innerHTML = '';
    const text = document.createElement('div');
    text.className = 'robot-buddy-text';
    text.textContent = `🎉 READY TO PLAY, ${userName.toUpperCase()}?`;
    const grid = document.createElement('div');
    grid.className = 'robot-buddy-grid';
    const rules = pageRules();
    if (rules.length) grid.appendChild(actionButton('📘 HOW TO PLAY', 'robot-buddy-rules', renderRules));
    grid.appendChild(actionButton('💡 GIVE ME A TIP', 'robot-buddy-tip', () => renderTips(0)));
    grid.appendChild(actionButton('🗺️ GO TO GAME HUB', 'robot-buddy-next', () => { location.href = '/games/'; }));
    grid.appendChild(actionButton('👋 CLOSE', 'robot-buddy-close-action', closeModal));
    content.append(text, grid);
  }

  function renderTips(index) {
    const list = tips(userName);
    content.innerHTML = '';
    const text = document.createElement('div');
    text.className = 'robot-buddy-text';
    text.textContent = list[index];
    const dots = document.createElement('div');
    dots.className = 'robot-buddy-dots';
    dots.textContent = `${index + 1} of ${list.length} ⭐`;
    const grid = document.createElement('div');
    grid.className = 'robot-buddy-grid';
    if (index < list.length - 1) grid.appendChild(actionButton('⏭️ NEXT TIP', 'robot-buddy-tip', () => renderTips(index + 1)));
    grid.appendChild(actionButton('🏠 BACK', 'robot-buddy-close-action', renderMenu));
    content.append(text, dots, grid);
  }

  function renderRules() {
    const rules = pageRules();
    if (!rules.length) { renderMenu(); return; }
    ruleStep = Math.min(ruleStep, rules.length - 1);
    content.innerHTML = '';
    const text = document.createElement('div');
    text.className = 'robot-buddy-text';
    text.textContent = `📘 HOW TO PLAY, ${userName.toUpperCase()}!`;
    const rule = document.createElement('div');
    rule.className = 'robot-buddy-rule';
    rule.textContent = `⭐ ${rules[ruleStep]}`;
    const dots = document.createElement('div');
    dots.className = 'robot-buddy-dots';
    dots.textContent = `${ruleStep + 1} of ${rules.length} ⭐`;
    const grid = document.createElement('div');
    grid.className = 'robot-buddy-grid';
    if (ruleStep < rules.length - 1) grid.appendChild(actionButton('⏭️ NEXT RULE', 'robot-buddy-rules', () => { ruleStep += 1; renderRules(); }));
    grid.appendChild(actionButton('🏠 BACK', 'robot-buddy-close-action', renderMenu));
    content.append(text, rule, dots, grid);
  }

  function openModal() {
    modal.classList.add('show');
    hideLegacyHelp();
    if (!userName) showNamePrompt(); else renderMenu();
  }

  function closeModal() { modal.classList.remove('show'); }

  openButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  hideLegacyHelp();

  window.GameGuide = {
    open: openModal,
    close: closeModal,
    getName: () => userName,
    setName: name => { userName = String(name || '').trim().slice(0, 24); localStorage.setItem(NAME_KEY, userName); },
    showTip: () => { if (!userName) userName = 'FRIEND'; modal.classList.add('show'); renderTips(0); },
    showRules: () => { if (!userName) userName = 'FRIEND'; modal.classList.add('show'); renderRules(); },
    celebrate: () => { if (!userName) userName = 'FRIEND'; modal.classList.add('show'); content.innerHTML = ''; const text = document.createElement('div'); text.className = 'robot-buddy-text'; text.textContent = `🏆 AMAZING, ${userName.toUpperCase()}! 🎉`; const grid = document.createElement('div'); grid.className = 'robot-buddy-grid'; grid.appendChild(actionButton('✅ YAY!', 'robot-buddy-go', closeModal)); content.append(text, grid); }
  };

  if (!localStorage.getItem(SEEN_KEY)) setTimeout(openModal, 900);
})();
