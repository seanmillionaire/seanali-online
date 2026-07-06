(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/math-dissector/' || window.MathDissectorElementaryLoaded) return;
  window.MathDissectorElementaryLoaded = true;

  document.title = 'Elementary Math Dissector';

  const problems = [
    {
      type: 'multiplication',
      title: 'Stacked Multiplication',
      top: '32',
      bottom: '× 34',
      answer: 1088,
      rows: ['128', '960'],
      steps: [
        'Copy it like school: 32 on top, 34 under it. Ones line up with ones.',
        'Use the bottom ones digit first: 4. Do 4 × 2, then 4 × 3. Write the first row: 128.',
        'Now move to the bottom tens digit: 3. Because it is the tens row, put a 0 placeholder first.',
        'Do 3 × 2, then 3 × 3. Your tens row should look like 960.',
        'Now add the two rows on paper. Do not guess. Pick the answer that matches your work.'
      ],
      work: ['    32', '×   34', '------', '   128', '+  960', '------', '  ????'],
      wrong: 'Check the first row, the zero placeholder, and then add both rows.'
    },
    {
      type: 'addition',
      title: 'Big Addition',
      top: '4,879',
      bottom: '+ 2,456',
      answer: 7335,
      steps: [
        'Stack the numbers. Ones under ones. Tens under tens. Hundreds under hundreds.',
        'Start on the right. Ones column: 9 + 6. Write the ones digit and carry the 1.',
        'Move one column left. Tens column: 7 + 5 plus your carry.',
        'Keep moving left: hundreds, then thousands. Carry whenever a column makes 10 or more.',
        'Now finish the total on paper. Do not guess. Pick the answer that matches your work.'
      ],
      work: ['   ¹ ¹¹', '   4879', '+  2456', '-------', '  ????'],
      wrong: 'Start from the ones column and follow the carry marks.'
    },
    {
      type: 'subtraction',
      title: 'Subtraction With Borrowing',
      top: '804',
      bottom: '− 257',
      answer: 547,
      steps: [
        'Stack the numbers. Ones under ones. Tens under tens. Hundreds under hundreds.',
        'Start on the right. You cannot do 4 − 7, so you need to borrow.',
        'The tens digit is 0, so borrow from the hundreds first. 8 becomes 7. The 0 becomes 10.',
        'Now borrow from the 10 tens. The ones becomes 14 and the tens becomes 9.',
        'Subtract each column on paper. Do not guess. Pick the answer that matches your work.'
      ],
      work: ['   7 9 14', '    804', '−   257', '-------', '   ???'],
      wrong: 'Check the borrowing across the zero, then subtract right to left.'
    },
    {
      type: 'multiplication',
      title: 'Stacked Multiplication',
      top: '47',
      bottom: '× 23',
      answer: 1081,
      rows: ['141', '940'],
      steps: [
        'Copy it like school: 47 on top, 23 under it. Ones line up with ones.',
        'Use the bottom ones digit first: 3. Do 3 × 7, then 3 × 4. Write the first row: 141.',
        'Now move to the bottom tens digit: 2. Because it is the tens row, put a 0 placeholder first.',
        'Do 2 × 7, then 2 × 4. Your tens row should look like 940.',
        'Now add the two rows on paper. Do not guess. Pick the answer that matches your work.'
      ],
      work: ['    47', '×   23', '------', '   141', '+  940', '------', '  ????'],
      wrong: 'Check the 3 row, the 20 row with the zero, and then add.'
    },
    {
      type: 'addition',
      title: 'Big Addition',
      top: '8,765',
      bottom: '+ 9,438',
      answer: 18203,
      steps: [
        'Stack the numbers. Keep every digit in its own place-value column.',
        'Start on the right. Ones column: 5 + 8. Write the ones digit and carry.',
        'Tens column: add 6 + 3 plus your carry. Write and carry if needed.',
        'Hundreds and thousands work the same way. Move one column at a time.',
        'Now finish the total on paper. Do not guess. Pick the answer that matches your work.'
      ],
      work: ['   ¹¹¹', '   8765', '+  9438', '-------', ' ?????'],
      wrong: 'Use the carry row and add one column at a time from right to left.'
    }
  ];

  let round = 0;
  let step = 0;
  let score = 0;
  let streak = 0;
  let done = 0;
  let locked = false;

  function css() {
    const style = document.createElement('style');
    style.textContent = `
      body{margin:0!important;min-height:100vh!important;font-family:Arial,sans-serif!important;background:radial-gradient(circle at top,#e8fbff,#b9ffe1 48%,#7d4cff)!important;color:#101436!important;padding:12px!important;user-select:none!important}
      .md-game{width:100%;max-width:780px;margin:0 auto;background:#fff6e6;border:5px solid #101436;border-radius:30px;overflow:hidden;box-shadow:0 18px 0 rgba(0,0,0,.22)}
      .md-top{text-align:center;color:white;background:radial-gradient(circle at top,#ffc83d,transparent 35%),linear-gradient(135deg,#00a7c9,#1d144b);padding:16px;border-bottom:5px solid #101436}
      .md-tag{display:inline-block;background:white;color:#101436;border:3px solid #ffc83d;border-radius:999px;padding:7px 12px;font-size:15px;font-weight:900;margin-bottom:8px}.md-top h1{font-size:clamp(33px,8vw,58px);line-height:.95;margin:0}.md-sub{font-size:18px;font-weight:900;margin-top:8px;color:#fff6e6}
      .md-hud{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;background:#e8fbff;padding:10px;border-bottom:4px solid #101436}.md-pill{background:#fff;border:3px solid #101436;border-radius:16px;text-align:center;font-size:15px;font-weight:900;padding:7px 4px}.md-barBox{height:18px;background:#101436;border:3px solid #101436;border-radius:999px;margin:10px 14px;overflow:hidden}.md-bar{height:100%;width:0;background:linear-gradient(90deg,#34d17a,#00d4ff,#ffc83d);transition:.3s}
      .md-stage{padding:14px 16px 18px}.md-teacher{display:flex;gap:10px;align-items:center;background:#fff;border:4px solid #ffc83d;border-radius:22px;padding:10px 12px;margin-bottom:10px;box-shadow:0 6px 0 rgba(0,0,0,.14)}.md-face{font-size:46px}.md-talk{font-size:18px;line-height:1.18;font-weight:900}
      .md-board{background:#123b31;color:#eafff4;border:7px solid #8b5a2b;border-radius:24px;padding:14px;box-shadow:inset 0 0 0 3px rgba(255,255,255,.08),0 9px 0 rgba(0,0,0,.2)}.md-title{font-size:20px;font-weight:900;color:#fff6a8;text-align:center;margin:0 0 10px}.md-work{font-family:'Courier New',monospace;white-space:pre;text-align:right;width:max-content;max-width:100%;margin:0 auto 12px;background:rgba(0,0,0,.18);border:2px solid rgba(255,255,255,.2);border-radius:16px;padding:12px 18px;font-size:clamp(25px,7vw,42px);line-height:1.05;font-weight:900;color:#fff}
      .md-line{display:grid;grid-template-columns:58px 1fr;gap:8px;align-items:start;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.18);border-radius:14px;padding:10px;margin-top:8px}.md-lineNum{background:#ffc83d;color:#101436;border-radius:999px;font-size:15px;font-weight:900;text-align:center;padding:7px 4px}.md-lineText{font-size:20px;line-height:1.18;font-weight:900;color:#fff}.md-helper{margin-top:10px;background:#fff;color:#101436;border:4px dashed #00a7c9;border-radius:18px;padding:11px;font-size:18px;line-height:1.2;font-weight:900}
      .md-answers{display:grid;gap:10px;margin-top:13px}.md-answer{border:3px solid #101436;border-radius:22px;padding:17px 12px;font-size:24px;font-weight:900;min-height:66px;color:#101436;box-shadow:0 7px 0 #101436;background:#fffdf6;cursor:pointer;text-align:center}.md-answer:nth-child(2){background:#b8f2ff}.md-answer:nth-child(3){background:#d7b9ff}.md-answer:active,.md-answer.hit{transform:translateY(6px);box-shadow:0 1px 0 #101436}.md-answer.good{background:linear-gradient(180deg,#d9ffe9,#7dffb0)!important}.md-answer.bad{background:linear-gradient(180deg,#ff3d3d,#b40020)!important;color:#fff!important}.md-controls{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:13px}.md-small{border:0;border-radius:17px;padding:13px 8px;font-size:15px;font-weight:900;background:#e7ffe8;box-shadow:0 6px 0 #7abf81;color:#101436}.md-primary{background:#ffc83d;box-shadow:0 6px 0 #9b5d00}.md-popup{position:fixed;left:50%;top:44%;transform:translate(-50%,-50%) scale(.75);background:#fff;border:5px solid #101436;border-radius:28px;padding:22px 28px;font-size:31px;font-weight:900;z-index:30;opacity:0;pointer-events:none;text-align:center}.md-popup.show{animation:mdpop .85s forwards}@keyframes mdpop{20%,75%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}100%{opacity:0;transform:translate(-50%,-70%) scale(.9)}}@media(max-width:430px){body{padding:10px!important}.md-hud{grid-template-columns:repeat(2,1fr)}.md-stage{padding:12px}.md-line{grid-template-columns:48px 1fr}.md-lineText{font-size:17px}.md-controls{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function html() {
    document.body.innerHTML = '<main class="md-game"><section class="md-top"><div class="md-tag">🏫 Elementary Whiteboard</div><h1>🧠 Math Dissector</h1><div class="md-sub">Do it like school: stack, column, carry, borrow.</div></section><section class="md-hud"><div class="md-pill">⭐ <span id="mdScore">0</span></div><div class="md-pill">🔥 <span id="mdStreak">0</span></div><div class="md-pill">✏️ <span id="mdDone">0</span></div><div class="md-pill">📘 <span id="mdRound">1</span>/<span id="mdTotal">5</span></div></section><div class="md-barBox"><div class="md-bar" id="mdBar"></div></div><section class="md-stage"><div class="md-teacher"><div class="md-face">👩‍🏫</div><div class="md-talk" id="mdTeacher">Get paper and pen. Copy the problem exactly.</div></div><div class="md-board"><div class="md-title" id="mdTitle"></div><div class="md-work" id="mdWork"></div><div id="mdLines"></div><div class="md-helper" id="mdHelper">Copy the stacked problem first.</div></div><div class="md-answers" id="mdAnswers"></div><div class="md-controls"><button class="md-small" id="mdHow">📘 School Rule</button><button class="md-small md-primary" id="mdNext">Next Line →</button><button class="md-small" id="mdRestart">🔁 New</button></div></section></main><div class="md-popup" id="mdPopup">Nice!</div>';
  }

  const $ = id => document.getElementById(id);
  function speak(t) { try { if (window.SeanGameVoice?.speak) window.SeanGameVoice.speak(t); } catch(e) {} }
  function sound(n) { try { if (window.SeanGameSounds?.[n]) window.SeanGameSounds[n](); } catch(e) {} }
  function pop(t){ const p=$('mdPopup'); p.textContent=t; p.classList.remove('show'); void p.offsetWidth; p.classList.add('show'); }
  function shuffle(a){ return [...a].sort(()=>Math.random()-.5); }
  function choices(ans){ const n=Number(ans); return shuffle([n,n+10,n-10,n+100,n-100,n+7,n-7].filter((x,i,a)=>x>0&&a.indexOf(x)===i)).slice(0,4).sort(()=>Math.random()-.5); }
  function current(){ return problems[round % problems.length]; }
  function format(n){ return Number(n).toLocaleString(); }

  function render(){
    if(round >= problems.length) return finish();
    locked = false;
    step = 0;
    const p = current();
    $('mdTitle').textContent = p.title;
    $('mdWork').textContent = p.work.join('\n');
    $('mdLines').innerHTML = '';
    $('mdAnswers').innerHTML = '';
    $('mdHelper').textContent = '✏️ Copy the stacked setup on paper. The game will not solve the final answer for you.';
    $('mdTeacher').textContent = 'Get paper and pen. Copy it exactly like the board.';
    $('mdRound').textContent = round + 1;
    $('mdTotal').textContent = problems.length;
    $('mdScore').textContent = score;
    $('mdStreak').textContent = streak;
    $('mdDone').textContent = done;
    $('mdBar').style.width = Math.round(done / problems.length * 100) + '%';
    $('mdNext').style.display = 'block';
    speak('Get paper and pen. Copy the stacked problem exactly like school.');
  }

  function nextLine(){
    const p = current();
    if(step >= p.steps.length) return showAnswers();
    step++;
    $('mdLines').innerHTML = p.steps.slice(0, step).map((s,i)=>'<div class="md-line"><div class="md-lineNum">Line '+(i+1)+'</div><div class="md-lineText">'+s+'</div></div>').join('');
    $('mdHelper').textContent = step < p.steps.length ? '✏️ Do line ' + step + ' on your paper. Then press Next Line.' : '✏️ Stop. Finish the answer on paper. Then pick the matching choice.';
    $('mdTeacher').textContent = step < p.steps.length ? 'Good. One school line at a time.' : 'Now your paper has to prove the answer.';
    sound('tap');
    speak(p.steps[step-1].replace(/<[^>]*>/g,''));
  }

  function showAnswers(){
    const p = current();
    $('mdNext').style.display = 'none';
    $('mdHelper').textContent = '✅ Paper proof check: choose the answer that matches what YOU wrote.';
    $('mdTeacher').textContent = 'Do not guess. Match the answer to your paper.';
    $('mdAnswers').innerHTML = choices(p.answer).map(x=>'<button class="md-answer">'+format(x)+'</button>').join('');
    document.querySelectorAll('.md-answer').forEach(b => b.onclick = () => pick(b, p));
    speak('Choose the answer that matches your paper. Do not guess.');
  }

  function pick(btn, p){
    if(locked) return;
    locked = true;
    const val = btn.textContent.replace(/,/g,'').trim();
    if(String(p.answer) === val){
      btn.classList.add('good','hit');
      score += 10;
      streak++;
      done++;
      pop('Proved!');
      sound('correct');
      speak('Correct. You proved it on paper.');
      setTimeout(()=>{ round++; render(); }, 1250);
    } else {
      btn.classList.add('bad','wrong');
      streak = 0;
      $('mdHelper').textContent = 'Wrong answer. ' + p.wrong;
      $('mdStreak').textContent = streak;
      pop('Check paper.');
      sound('wrong');
      setTimeout(()=>{ locked=false; btn.classList.remove('bad','wrong'); }, 950);
    }
    $('mdScore').textContent = score;
    $('mdStreak').textContent = streak;
    $('mdDone').textContent = done;
    $('mdBar').style.width = Math.round(done / problems.length * 100) + '%';
  }

  function finish(){
    $('mdBar').style.width = '100%';
    $('mdTitle').textContent = 'Class Complete';
    $('mdWork').textContent = '🏆';
    $('mdLines').innerHTML = '<div class="md-line"><div class="md-lineNum">Badge</div><div class="md-lineText"><b>Elementary Math Dissector</b>: you stacked it, worked the columns, and proved the answer.</div></div>';
    $('mdHelper').textContent = 'Big math is just small columns done in the right order.';
    $('mdAnswers').innerHTML = '';
    $('mdNext').style.display = 'none';
    pop('Badge!');
    sound('levelUp');
    speak('Badge earned. Elementary Math Dissector.');
  }

  function restart(){ score=0; streak=0; done=0; round=0; render(); }

  css();
  html();
  $('mdNext').onclick = nextLine;
  $('mdRestart').onclick = restart;
  $('mdHow').onclick = () => {
    $('mdHelper').textContent = 'School rule: stack the numbers, start on the right, use carry or borrow marks, then check your final answer.';
    speak('School rule. Stack the numbers. Start on the right. Use carry or borrow marks. Then check your answer.');
  };
  render();
})();
