(() => {
  'use strict';
  const questions = [
    { title: 'What do you want more of right now?', helper: "Choose what feels closest. There isn't a wrong answer.", options: [
      { icon: '\u2600', label: 'More money and the freedom to enjoy my life', desire: 'more money and freedom', headline: 'Make room for more freedom in your life.', intro: "It's not just about a number. It's about having more choice in how you live." },
      { icon: '\u2726', label: 'A clearer direction and something to feel excited about', desire: 'a clearer direction', headline: 'Your next chapter can have a direction.', intro: "You want something to move toward. Something that feels like your life, not just another obligation." },
      { icon: '\u2661', label: 'A fresh start that feels more like me', desire: 'a fresh start that feels like me', headline: 'There is room for a new chapter.', intro: "You want a life that feels more like you. Naming that is a place to begin." }
    ] },
    { title: 'What tends to get in the way?', helper: "You don't have to explain it perfectly. Pick the closest one.", options: [
      { icon: '\u21ba', label: 'I fall back into the same doubts', reflection: 'You said the same doubts keep coming back. Start by naming one thought that makes it harder to move forward. You can explore it without treating it as the whole truth.', blocker: 'I keep coming back to the same doubts' },
      { icon: '\u25ce', label: 'I get overwhelmed by all the advice', reflection: "You said all the advice can feel overwhelming. You don't need to sort out everything today. Start with one wish and one question you actually want help thinking through.", blocker: 'I feel overwhelmed by all the advice' },
      { icon: '?', label: "I'm not sure where to start", reflection: "You don't need a perfect plan to begin. Put your wish into simple words, even if they're unfinished. The conversation can start there.", blocker: "I'm not sure where to start" }
    ] },
    { title: 'What would that change mean to you?', helper: 'Think about the feeling, not just the achievement.', options: [
      { icon: '\u2661', label: 'Relief. I could finally breathe a little easier.', feeling: 'More room to breathe. Less of the same old pressure.', prompt: 'feel more at ease' },
      { icon: '\u2600', label: 'Pride. I would feel like I was moving forward.', feeling: 'The feeling of moving forward, in a direction you chose.', prompt: 'feel proud of the progress I am making' },
      { icon: '\u2726', label: 'Freedom. More time and choice for what matters.', feeling: 'More time. More choice. More room for what matters.', prompt: 'have more time and choice for what matters' }
    ] }
  ];
  const byId = id => document.getElementById(id);
  const entry = byId('entry'), finish = byId('finish'), answers = byId('answers');
  const selections = [];
  let step = 0, lockedUntil = 0, started = false, completed = false;
  const track = event => {
    try { if (typeof window.fbq === 'function') window.fbq('trackCustom', event, { content_name: 'Manifestation Genie introduction' }); } catch { /* Analytics must not interrupt the quiz. */ }
  };
  function focusQuestion() {
    byId('question-title').focus({ preventScroll: true });
    byId('quiz').scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  function render(focus = false) {
    const question = questions[step];
    const progress = Math.round(step / questions.length * 100);
    byId('step-label').textContent = `Question ${step + 1} of ${questions.length}`;
    byId('progress-label').textContent = `${progress}% complete`;
    byId('progress-fill').style.width = `${progress}%`;
    document.querySelector('.progress-track').setAttribute('aria-valuenow', String(progress));
    byId('question-title').textContent = question.title;
    byId('question-helper').textContent = question.helper;
    answers.replaceChildren();
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'answer';
      button.dataset.option = String(index); button.dataset.step = String(step);
      button.setAttribute('aria-pressed', String(selections[step] === index));
      const icon = document.createElement('span'), text = document.createElement('span'), arrow = document.createElement('span');
      icon.className = 'answer-symbol'; icon.textContent = option.icon; icon.setAttribute('aria-hidden', 'true');
      text.className = 'answer-text'; text.textContent = option.label;
      arrow.className = 'answer-arrow'; arrow.textContent = '\u2192'; arrow.setAttribute('aria-hidden', 'true');
      button.append(icon, text, arrow); answers.append(button);
    });
    byId('back').hidden = step === 0;
    byId('first-step-note').hidden = step !== 0;
    byId('announcement').textContent = `Question ${step + 1} of ${questions.length}.`;
    if (focus) focusQuestion();
  }
  function showFinish() {
    const desire = questions[0].options[selections[0]];
    const blocker = questions[1].options[selections[1]];
    const feeling = questions[2].options[selections[2]];
    byId('finish-title').textContent = 'Turn What You Want Into a Clear Next Step.';
    byId('finish-intro').textContent = `You said you want ${desire.desire}. Manifestation Genie helps you work through what's stopping you and find a practical place to start.`;
    byId('finish-feeling').textContent = feeling.feeling;
    byId('reflection-copy').textContent = blocker.reflection;
    byId('conversation-prompt').textContent = `"I want ${desire.desire}. ${blocker.blocker}. I want to ${feeling.prompt}. Can you help me find one practical next step?"`;
    entry.hidden = true; finish.hidden = false;
    document.querySelector('.skip-link').href = '#finish-title';
    window.scrollTo({ top: 0, behavior: 'instant' });
    byId('finish-title').focus({ preventScroll: true });
    if (!completed) { completed = true; track('ManifestQuizComplete'); }
  }
  answers.addEventListener('click', event => {
    const button = event.target.closest('button.answer');
    const now = performance.now();
    if (!button || step >= questions.length || Number(button.dataset.step) !== step || now < lockedUntil || event.detail > 1) return;
    lockedUntil = now + 350;
    if (!started) { started = true; track('ManifestQuizStart'); }
    selections[step] = Number(button.dataset.option); selections.length = step + 1;
    step += 1;
    if (step === questions.length) showFinish(); else render(true);
  });
  byId('back').addEventListener('click', () => {
    if (step <= 0 || step >= questions.length) return;
    step -= 1; lockedUntil = performance.now() + 250; render(true);
  });
  byId('return-to-quiz').addEventListener('click', event => { event.preventDefault(); focusQuestion(); });
  byId('restart').addEventListener('click', () => {
    step = 0; selections.length = 0; lockedUntil = performance.now() + 250;
    finish.hidden = true; entry.hidden = false;
    document.querySelector('.skip-link').href = '#question-title'; render(true);
  });
  const form = byId('manifest-optin-form'), submit = byId('manifest-submit');
  let submitting = false;
  function resetSubmit() { submitting = false; submit.disabled = false; submit.textContent = 'UNLOCK MY FREE GENIE ACCESS \u2192'; }
  form.addEventListener('submit', event => {
    const name = byId('manifest-name');
    name.setCustomValidity(name.value.trim() ? '' : 'Please enter your first name.');
    if (!form.reportValidity()) { event.preventDefault(); return; }
    if (submitting) { event.preventDefault(); return; }
    submitting = true; submit.disabled = true; submit.textContent = 'Opening your next step...';
    byId('form-error').hidden = true;
    try { window.sessionStorage.setItem('hm_god_money_first_name', name.value.trim().split(/\s+/)[0].slice(0, 40)); } catch { /* Signup still works when browser storage is unavailable. */ }
    try { if (typeof window.fbq === 'function') window.fbq('track', 'Lead'); } catch { /* Preserve native submission if tracking is blocked. */ }
    window.setTimeout(() => {
      if (document.visibilityState !== 'hidden') {
        resetSubmit(); byId('form-error').textContent = 'Still here? Check your connection and try again.'; byId('form-error').hidden = false;
      }
    }, 15000);
  });
  byId('manifest-name').addEventListener('input', () => byId('manifest-name').setCustomValidity(''));
  window.addEventListener('pageshow', resetSubmit);
  render();
})();
