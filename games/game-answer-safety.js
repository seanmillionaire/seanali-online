(() => {
  if (window.GameAnswerSafetyLoaded) return;
  window.GameAnswerSafetyLoaded = true;

  const css = document.createElement('style');
  css.textContent = `
    .choice.good[data-answer-state="idle"],.answer.good[data-answer-state="idle"],
    .choice.correct[data-answer-state="idle"],.answer.correct[data-answer-state="idle"]{
      background:#fffdf6!important;
      color:#101436!important;
    }
    .choice.good[data-answer-state="idle"]::after,.answer.good[data-answer-state="idle"]::after,
    .choice.correct[data-answer-state="idle"]::after,.answer.correct[data-answer-state="idle"]::after{
      content:none!important;
      display:none!important;
    }
  `;
  document.head.appendChild(css);

  const groups = '.choices,.answers,#choices,#answers,.signs,.shared-level-two-answers';
  const answerButtons = '.choice,.answer,.shared-level-two-btn';
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  function cleanButton(btn) {
    if (!btn || btn.disabled || btn.classList.contains('hit') || btn.classList.contains('bad')) return;
    if (btn.classList.contains('good') || btn.classList.contains('correct')) {
      btn.classList.remove('good', 'correct');
      btn.dataset.answerState = 'idle';
    }
  }

  function labelGroup(group) {
    const buttons = [...group.querySelectorAll(answerButtons)].filter(btn => {
      if (btn.closest('.controls,.md-controls,.shared-level-two-actions')) return false;
      return btn.offsetParent !== null || btn.getClientRects().length;
    });

    const active = buttons.some(btn => btn.disabled || btn.classList.contains('hit') || btn.classList.contains('bad'));
    buttons.forEach((btn, index) => {
      if (!btn.dataset.choiceLabel && !btn.dataset.label) btn.dataset.choiceLabel = labels[index] || String(index + 1);
      if (!active) cleanButton(btn);
      if (!btn.disabled && !btn.classList.contains('hit') && !btn.classList.contains('bad') && !btn.classList.contains('good')) {
        btn.dataset.answerState = 'idle';
      } else {
        delete btn.dataset.answerState;
      }
    });
  }

  function run() {
    document.querySelectorAll(groups).forEach(labelGroup);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  new MutationObserver(() => {
    clearTimeout(window.__answerSafetyTimer);
    window.__answerSafetyTimer = setTimeout(run, 40);
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'disabled', 'style']
  });
})();
