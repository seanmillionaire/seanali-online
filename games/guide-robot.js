(() => {
  if (document.querySelector('[data-guide-robot]')) return;

  const STORAGE_KEY = 'seanGameUserName';
  const GUIDE_SHOWN_KEY = 'seanGameGuideShown';

  // Guide messages for different contexts
  const messages = {
    welcome: (name) => [
      `Hey ${name}! 👋 I'm your game guide!`,
      `I'm here to help you navigate and have fun!`,
      `Tap me anytime for tips, or just explore!`
    ],
    gameStart: (name, gameName) => [
      `Ready to play, ${name}? 🎮`,
      `Let's explore ${gameName} together!`,
      `Tap me if you need help!`
    ],
    tip: (name) => [
      `Pro tip, ${name}! 💡`,
      `Pay attention to the hints.`,
      `You're doing great!`
    ],
    stuck: (name) => [
      `Stuck, ${name}? 🤔`,
      `Try reading the question again.`,
      `You've got this!`
    ],
    celebrate: (name) => [
      `Amazing, ${name}! 🎉`,
      `You crushed it!`,
      `Keep going!`
    ]
  };

  let userName = localStorage.getItem(STORAGE_KEY);
  let currentMessageIndex = 0;
  let isOpen = false;

  // Create styles
  const style = document.createElement('style');
  style.textContent = `
    [data-guide-robot] {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999;
      font-family: Arial, sans-serif;
    }

    .guide-robot-button {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: 4px solid #fff;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      transition: all 0.3s ease;
      animation: guidePulse 2.5s ease-in-out infinite;
    }

    .guide-robot-button:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
    }

    .guide-robot-button:active {
      transform: scale(0.95);
    }

    @keyframes guidePulse {
      0%, 100% {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      }
      50% {
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.5);
      }
    }

    .guide-robot-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 1000;
    }

    .guide-robot-modal.show {
      display: flex;
    }

    .guide-robot-panel {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 24px;
      padding: 28px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.4s ease;
      color: white;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .guide-robot-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      font-size: 24px;
    }

    .guide-robot-title {
      font-size: 22px;
      font-weight: 900;
      margin: 0;
    }

    .guide-robot-message {
      font-size: 18px;
      line-height: 1.4;
      margin: 16px 0;
      min-height: 54px;
      display: flex;
      align-items: center;
    }

    .guide-robot-buttons {
      display: grid;
      gap: 10px;
      margin-top: 20px;
    }

    .guide-robot-btn {
      border: 0;
      border-radius: 12px;
      padding: 14px 16px;
      font-size: 16px;
      font-weight: 900;
      cursor: pointer;
      transition: all 0.2s ease;
      color: #764ba2;
    }

    .guide-robot-btn-primary {
      background: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .guide-robot-btn-primary:hover {
      background: #f5f5f5;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .guide-robot-btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.4);
    }

    .guide-robot-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.6);
    }

    .guide-robot-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(255, 255, 255, 0.2);
      border: 0;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      font-size: 24px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .guide-robot-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .guide-robot-name-input {
      width: 100%;
      border: 0;
      border-radius: 12px;
      padding: 14px;
      font-size: 16px;
      font-weight: 900;
      margin: 12px 0;
      box-sizing: border-box;
    }

    .guide-robot-name-input::placeholder {
      color: #ccc;
    }

    .guide-robot-dots {
      display: flex;
      gap: 6px;
      justify-content: center;
      margin-top: 12px;
    }

    .guide-robot-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .guide-robot-dot.active {
      background: white;
      transform: scale(1.3);
    }

    @media (max-width: 480px) {
      [data-guide-robot] {
        bottom: 16px;
        right: 16px;
      }

      .guide-robot-button {
        width: 60px;
        height: 60px;
        font-size: 32px;
      }

      .guide-robot-panel {
        padding: 20px;
        max-width: 100%;
      }

      .guide-robot-title {
        font-size: 18px;
      }

      .guide-robot-message {
        font-size: 16px;
        min-height: 48px;
      }
    }
  `;
  document.head.appendChild(style);

  // Create robot container
  const container = document.createElement('div');
  container.setAttribute('data-guide-robot', 'true');

  // Create button
  const button = document.createElement('button');
  button.className = 'guide-robot-button';
  button.textContent = '🤖';
  button.setAttribute('aria-label', 'Open guide');

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'guide-robot-modal';

  const panel = document.createElement('div');
  panel.className = 'guide-robot-panel';
  panel.style.position = 'relative';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'guide-robot-close';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Close guide');

  const header = document.createElement('div');
  header.className = 'guide-robot-header';
  header.innerHTML = '<span>🤖</span>';

  const title = document.createElement('h2');
  title.className = 'guide-robot-title';
  title.textContent = 'Guide';

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

  // Helper functions
  function saveName(name) {
    localStorage.setItem(STORAGE_KEY, name.trim());
    userName = name.trim();
  }

  function showNamePrompt() {
    currentMessageIndex = 0;
    messageDiv.innerHTML = '';
    buttonsDiv.innerHTML = '';

    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.fontSize = '14px';
    label.style.fontWeight = '900';
    label.style.marginBottom = '8px';
    label.textContent = 'What\'s your name?';

    const input = document.createElement('input');
    input.className = 'guide-robot-name-input';
    input.type = 'text';
    input.placeholder = 'Enter your name';
    input.value = userName || '';

    messageDiv.appendChild(label);
    messageDiv.appendChild(input);

    const submitBtn = document.createElement('button');
    submitBtn.className = 'guide-robot-btn guide-robot-btn-primary';
    submitBtn.textContent = 'Let\'s Go! 🚀';

    const skipBtn = document.createElement('button');
    skipBtn.className = 'guide-robot-btn guide-robot-btn-secondary';
    skipBtn.textContent = 'Skip';

    buttonsDiv.appendChild(submitBtn);
    buttonsDiv.appendChild(skipBtn);

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

    input.focus();
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        submitBtn.click();
      }
    });
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
    msgText.style.fontSize = '18px';
    msgText.style.lineHeight = '1.4';
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
    nextBtn.textContent = currentMessageIndex < msgs.length - 1 ? 'Next →' : 'Got it! 👍';

    const closeBtn2 = document.createElement('button');
    closeBtn2.className = 'guide-robot-btn guide-robot-btn-secondary';
    closeBtn2.textContent = 'Close';

    buttonsDiv.appendChild(nextBtn);
    buttonsDiv.appendChild(closeBtn2);

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
    if (!userName) {
      showNamePrompt();
    } else {
      showWelcome();
    }
  }

  function closeModal() {
    isOpen = false;
    modal.classList.remove('show');
  }

  // Event listeners
  button.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Show welcome on first visit
  if (!localStorage.getItem(GUIDE_SHOWN_KEY)) {
    setTimeout(() => {
      openModal();
    }, 800);
  }

  // Expose API for games to interact with guide
  window.GameGuide = {
    setName: saveName,
    getName: () => userName,
    showTip: () => {
      if (userName) {
        showMessageCarousel(messages.tip(userName));
        openModal();
      }
    },
    showStuck: () => {
      if (userName) {
        showMessageCarousel(messages.stuck(userName));
        openModal();
      }
    },
    celebrate: () => {
      if (userName) {
        showMessageCarousel(messages.celebrate(userName));
        openModal();
      }
    },
    open: openModal,
    close: closeModal
  };
})();
