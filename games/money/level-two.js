(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/money/' || window.MoneyLevelTwoLoaded) return;
  window.MoneyLevelTwoLoaded = true;

  let active = false;
  let round = 0;
  let score = 0;
  let deck = [];
  const total = 8;
  const labels = ['A','B','C'];

  const levelTwo = [
    { q:'You get $10. What comes first?', a:['Save a little first.','Spend it all today.','Hide it and forget.'], good:0, why:'Saving first builds control.' },
    { q:'A toy looks fun. You also need food.', a:['Buy the food first.','Buy the toy first.','Buy both with no plan.'], good:0, why:'Needs come before wants.' },
    { q:'You want a bike. What helps most?', a:['Save each week.','Wish only.','Spend every coin.'], good:0, why:'Small saving builds big goals.' },
    { q:'Someone says buy now fast.', a:['Pause and think.','Buy fast.','Copy everyone.'], good:0, why:'A pause protects your money.' },
    { q:'You have old toys. What can you do?', a:['Sell or trade one.','Throw all away.','Ask for more only.'], good:0, why:'Value can be reused.' },
    { q:'You earn money helping.', a:['Keep some for later.','Spend before thinking.','Lose track of it.'], good:0, why:'Tracking helps money grow.' },
    { q:'Two things cost the same.', a:['Pick what helps more.','Pick the shiny one.','Pick without looking.'], good:0, why:'Value matters more than shiny.' },
    { q:'You made a money mistake.', a:['Learn the lesson.','Give up.','Blame everyone.'], good:0, why:'Mistakes can become money wisdom.' },
    { q:'A friend buys candy.', a:['Choose for my goal.','Copy my friend.','Forget my plan.'], good:0, why:'Your goal needs your choice.' },
    { q:'You want more money.', a:['Learn a useful skill.','Wait forever.','Only complain.'], good:0, why:'Skills can create more value.' },
    { q:'You find $5.', a:['Put it toward a goal.','Waste it fast.','Buy random stuff.'], good:0, why:'Found money can still have a job.' },
    { q:'Your money is almost gone.', a:['Stop and plan.','Keep spending.','Pretend it is fine.'], good:0, why:'A plan helps before empty.' }
  ];

  function $(id){ return document.getElementById(id); }
  function sound(name){ try{ if(window.SeanGameSounds && SeanGameSounds[name]) SeanGameSounds[name](); }catch(e){} }
  function speak(text){ try{ if(window.SeanGameVoice && SeanGameVoice.speak) SeanGameVoice.speak(text); }catch(e){} }
  function shuffle(list){ return list.map(value => ({ value, sort: Math.random() })).sort((a,b) => a.sort - b.sort).map(x => x.value); }
  function makeDeck(){ deck = shuffle(levelTwo).slice(0,total); }

  function findQuestionBox(){ return $('question') || document.querySelector('.question,.prompt,.principle,.scenario,h2'); }
  function findChoices(){ return $('choices') || document.querySelector('.choices,.answers'); }
  function findFeedback(){ return $('feedback') || document.querySelector('.feedback,.helper,.lesson'); }
  function findRound(){ return $('round') || document.querySelector('.round,[data-round]'); }

  function setText(el,text){ if(el) el.textContent = text; }
  function setHud(){ const r=findRound(); if(r) r.textContent = Math.min(round+1,total); }

  function render(){
    active = true;
    setHud();
    const item = deck[round];
    const q = findQuestionBox();
    const fb = findFeedback();
    const choices = findChoices();
    setText(q, 'Level 2: ' + item.q);
    setText(fb, 'Think first. Pick the smartest money move.');
    if(!choices) return;
    choices.innerHTML = '';
    const mixed = shuffle(item.a.map((text,i)=>({ text, ok:i===item.good })));
    mixed.forEach((opt,i)=>{
      const btn = document.createElement('button');
      btn.className = 'choice answer';
      btn.dataset.choiceLabel = labels[i] || String(i+1);
      btn.textContent = opt.text;
      btn.onclick = () => pick(btn,opt.ok,item);
      choices.appendChild(btn);
    });
  }

  function pick(btn, ok, item){
    document.querySelectorAll('.choice,.answer').forEach(b=>b.disabled=true);
    const fb = findFeedback();
    if(ok){
      score += 10;
      btn.classList.add('good');
      setText(fb, item.why);
      sound('correct');
      speak('Correct, you got it!');
      setTimeout(()=>{ round += 1; if(round >= total) finish(); else render(); }, 1400);
    } else {
      btn.classList.add('bad');
      setText(fb, 'Incorrect. Try again.');
      sound('wrong');
      speak('Incorrect.');
      setTimeout(()=>{ document.querySelectorAll('.choice,.answer').forEach(b=>{ b.disabled=false; b.classList.remove('bad'); }); }, 850);
    }
  }

  function finish(){
    const q = findQuestionBox();
    const fb = findFeedback();
    const choices = findChoices();
    setText(q, 'Level 2 complete! 💰');
    setText(fb, 'You built stronger money thinking. Score: ' + score);
    if(choices) choices.innerHTML = '<button class="choice answer" data-choice-label="A">🔁 Play again</button>';
    const btn = choices && choices.querySelector('button');
    if(btn) btn.onclick = () => { active=false; startLevelTwo(); };
    sound('levelUp');
  }

  function startLevelTwo(){
    active = true;
    round = 0;
    score = 0;
    makeDeck();
    render();
  }

  function detectEnd(){
    if(active) return;
    const text = document.body.innerText || '';
    if(!/complete|finished|play again|level up|badge|score/i.test(text)) return;
    const choices = findChoices();
    if(!choices || choices.querySelector('.money-level-two-btn')) return;
    choices.innerHTML = '<button class="choice answer money-level-two-btn" data-choice-label="A">🚀 Start Level 2</button><button class="choice answer" data-choice-label="B">🔁 Start over</button>';
    choices.querySelector('.money-level-two-btn').onclick = startLevelTwo;
    const restart = choices.querySelectorAll('button')[1];
    restart.onclick = () => location.reload();
    const fb = findFeedback();
    setText(fb, 'Level 1 done. Now try harder money choices.');
  }

  setInterval(detectEnd, 600);
})();
