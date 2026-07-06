(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/math-dissector/' || window.MathDissectorFocusLoaded) return;
  window.MathDissectorFocusLoaded = true;

  const css = document.createElement('style');
  css.textContent = `
    #work.math-focus-work{white-space:pre;text-align:left!important;position:relative;line-height:1.08!important}
    #work .mf-line{display:block;text-align:right;min-height:1em}
    #work .mf-char{display:inline-block;min-width:.62em;text-align:center;border-radius:8px;position:relative;transition:.18s ease}
    #work .mf-hot{background:#ffc83d!important;color:#101436!important;box-shadow:0 0 0 3px #fff,0 0 18px rgba(255,200,61,.9);transform:scale(1.18);z-index:3;font-weight:900}
    #work .mf-soft{background:rgba(255,255,255,.22);box-shadow:0 0 0 2px rgba(255,255,255,.18)}
    #work .mf-result{background:#7dffb0!important;color:#101436!important;box-shadow:0 0 0 3px #fff,0 0 14px rgba(125,255,176,.8);transform:scale(1.12);z-index:2}
    .math-eye-note{display:block;margin:8px auto 0;width:max-content;max-width:100%;background:#ffc83d;color:#101436;border:3px solid #101436;border-radius:999px;padding:7px 12px;font-size:16px;font-weight:900;box-shadow:0 4px 0 rgba(0,0,0,.2);animation:mathEyeBob 1s infinite}
    @keyframes mathEyeBob{50%{transform:translateY(4px)}}
  `;
  document.head.appendChild(css);

  function isEs(){ return localStorage.getItem('seanGameLang') === 'es'; }
  function stepNumber(){ return Math.max(0, parseInt(window.step || '0', 10) || 0); }
  function titleText(){ return document.querySelector('#lessonTitle')?.textContent || ''; }
  function rawText(work){ return work.dataset.rawMath || work.textContent || ''; }
  function esc(ch){ return ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch; }

  function hotForLine(line, chars){
    const hits = [];
    chars.forEach(ch => {
      let idx = -1;
      while ((idx = line.indexOf(ch, idx + 1)) !== -1) hits.push(idx);
    });
    return hits;
  }

  function plan(lines, title, s){
    const hot = new Map(), soft = new Map(), result = new Map();
    const add = (map, line, chars) => {
      if (!lines[line]) return;
      const set = map.get(line) || new Set();
      hotForLine(lines[line], chars).forEach(i => set.add(i));
      map.set(line, set);
    };
    const addRight = (map, line, count) => {
      if (!lines[line]) return;
      const set = map.get(line) || new Set();
      for (let i = lines[line].length - 1, c = 0; i >= 0 && c < count; i--) {
        if (/[0-9]/.test(lines[line][i])) { set.add(i); c++; }
      }
      map.set(line, set);
    };
    const titleLower = title.toLowerCase();
    if (titleLower.includes('multiplication') || titleLower.includes('multiplicación')) {
      if (s <= 0) { add(soft,0,['3','2']); add(soft,1,['3','4','2']); }
      if (s === 1) { add(hot,0,['2','7']); add(hot,1,['4','3']); addRight(result,3,1); }
      else if (s === 2) { add(hot,0,['3','4']); add(hot,1,['4','3']); addRight(result,3,3); }
      else if (s === 3) { add(hot,1,['3','2']); addRight(result,4,1); }
      else if (s === 4) { add(hot,0,['3','2','4','7']); add(hot,1,['3','2']); addRight(result,4,3); }
      else { add(result,3,['1','2','8','4']); add(result,4,['9','6','0','4']); }
    } else if (titleLower.includes('addition') || titleLower.includes('suma')) {
      if (s <= 0) { add(soft,0,['4','8','7','9']); add(soft,1,['2','4','5','6']); }
      if (s === 1) { addRight(hot,0,1); addRight(hot,1,1); addRight(result,3,1); }
      else if (s === 2) { addRight(hot,1,2); addRight(hot,2,2); addRight(result,4,2); }
      else if (s === 3) { addRight(hot,1,3); addRight(hot,2,3); addRight(result,4,3); }
      else { add(hot,1,['4','8','7','9','8','7','6','5']); add(hot,2,['2','4','5','6','9','4','3','8']); }
    } else if (titleLower.includes('subtraction') || titleLower.includes('resta')) {
      if (s <= 0) { add(soft,0,['8','0','4']); add(soft,1,['2','5','7']); }
      if (s === 1) { addRight(hot,0,1); addRight(hot,1,1); addRight(result,3,1); }
      else if (s === 2) { add(hot,0,['8','0']); add(hot,2,['7','1','0']); }
      else if (s === 3) { add(hot,0,['4']); add(hot,1,['7']); add(hot,2,['1','4','9']); addRight(result,4,2); }
      else { add(hot,2,['7','9','1','4']); addRight(result,4,3); }
    }
    return {hot, soft, result};
  }

  function renderWork(){
    const work = document.querySelector('#work');
    if (!work) return;
    const currentText = work.textContent || '';
    if (!work.dataset.rawMath || currentText.indexOf('\n') >= 0) work.dataset.rawMath = currentText;
    const raw = rawText(work);
    if (!raw.trim()) return;
    const lines = raw.split('\n');
    const p = plan(lines, titleText(), stepNumber());
    let html = '';
    lines.forEach((line, li) => {
      html += '<span class="mf-line">';
      [...line].forEach((ch, ci) => {
        let cls = 'mf-char';
        if (p.soft.get(li)?.has(ci)) cls += ' mf-soft';
        if (p.result.get(li)?.has(ci)) cls += ' mf-result';
        if (p.hot.get(li)?.has(ci)) cls += ' mf-hot';
        html += '<span class="' + cls + '">' + (ch === ' ' ? '&nbsp;' : esc(ch)) + '</span>';
      });
      html += '</span>';
    });
    work.classList.add('math-focus-work');
    if (work.innerHTML !== html) work.innerHTML = html;
  }

  function addEyeNote(){
    const teacher = document.querySelector('#teacher');
    if (!teacher || teacher.querySelector('.math-eye-note')) return;
    const note = document.createElement('span');
    note.className = 'math-eye-note';
    note.textContent = isEs() ? '👀 Mira los números brillantes' : '👀 Look at the glowing numbers';
    teacher.appendChild(note);
  }

  function run(){
    addEyeNote();
    renderWork();
  }

  setInterval(run, 180);
  new MutationObserver(() => {
    clearTimeout(window.__mathFocusTimer);
    window.__mathFocusTimer = setTimeout(run, 50);
  }).observe(document.body, {childList:true, subtree:true, characterData:true});
  window.addEventListener('seanGameLangChange', () => setTimeout(run, 80));
  run();
})();
