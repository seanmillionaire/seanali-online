(() => {
  if (location.pathname.replace(/\/+$/, '/') === '/games/' || window.SharedLevelTwoLoaded) return;
  window.SharedLevelTwoLoaded = true;

  const path = location.pathname.replace(/\/+$/, '/');
  let active = false;
  let index = 0;
  let score = 0;
  let deck = [];

  const configs = {
    '/games/math-race/': {
      title: 'Math Race · Level 2', icon: '🚗', badge: 'Medium Math Racer',
      intro: 'Medium mode: a little faster thinking.',
      questions: [
        { q: '6 groups of 7 plus 3 more?', a: ['45','42','49'], good: 0, why: '6 × 7 = 42. Add 3 = 45.' },
        { q: '9 × 4, then double it.', a: ['72','36','68'], good: 0, why: '9 × 4 = 36. Double 36 = 72.' },
        { q: '5 × 8 plus 10?', a: ['50','40','58'], good: 0, why: '5 × 8 = 40. Add 10 = 50.' },
        { q: '7 × 6 minus 2?', a: ['40','42','38'], good: 0, why: '7 × 6 = 42. Minus 2 = 40.' },
        { q: '3 rows of 12?', a: ['36','33','42'], good: 0, why: '12 + 12 + 12 = 36.' },
        { q: '4 bags with 9 apples. How many?', a: ['36','32','45'], good: 0, why: '4 × 9 = 36.' }
      ]
    },
    '/games/family-gems/': {
      title: 'Family Gems · Level 2', icon: '💎', badge: 'Roots Thinker',
      intro: 'Medium mode: use the clue feeling, not giveaway words.',
      questions: [
        { q: 'Cold air, huge land, quiet strength.', a: ['Canada','Panama','Trinidad & Tobago'], good: 0, why: 'That feeling points north.' },
        { q: 'Rhythm, color, street food, celebration.', a: ['Trinidad & Tobago','Canada','Panama'], good: 0, why: 'That is island celebration energy.' },
        { q: 'Warm rain, green hills, ocean doorway.', a: ['Panama','Canada','Trinidad & Tobago'], good: 0, why: 'That points to the tropical bridge place.' },
        { q: 'Ice, skates, lakes, big forests.', a: ['Canada','Panama','Trinidad & Tobago'], good: 0, why: 'That is the cold wide place.' },
        { q: 'Drums, costumes, bright streets.', a: ['Trinidad & Tobago','Panama','Canada'], good: 0, why: 'That is celebration rhythm.' },
        { q: 'Rainforest animals and ocean air.', a: ['Panama','Canada','Trinidad & Tobago'], good: 0, why: 'That is warm green nature.' }
      ]
    },
    '/games/elements/': {
      title: 'Nature Elements · Level 2', icon: '🌎', badge: 'Element Thinker',
      intro: 'Medium mode: connect cause and effect.',
      questions: [
        { q: 'What helps roots stay strong under a plant?', a: ['Earth','Air','Fire'], good: 0, why: 'Roots hold into soil.' },
        { q: 'What moves clouds across the sky?', a: ['Air','Earth','Ice'], good: 0, why: 'Wind is moving air.' },
        { q: 'What can water become when it gets very cold?', a: ['Ice','Fire','Soil'], good: 0, why: 'Frozen water becomes ice.' },
        { q: 'What gives heat and light to help plants grow?', a: ['Sun','Rock','Thunder'], good: 0, why: 'Sun gives light and warmth.' },
        { q: 'What can heavy rain and wind create?', a: ['Storm','Soil','Root'], good: 0, why: 'Storms can bring rain and wind.' },
        { q: 'What do plants need from the sky and ground?', a: ['Sun, water, soil','Only rocks','Only fire'], good: 0, why: 'Plants need a mix of nature elements.' }
      ]
    },
    '/games/math-dissector/': {
      title: 'Math Dissector · Level 2', icon: '🧠', badge: 'Step Solver',
      intro: 'Medium mode: do two small steps before answering.',
      questions: [
        { q: '24 + 18. First add ones, then tens.', a: ['42','32','52'], good: 0, why: '4+8=12. Carry 1. 2+1+1=4.' },
        { q: '63 - 28. Borrow first.', a: ['35','45','41'], good: 0, why: '13-8=5. 5-2=3.' },
        { q: '12 × 4. Think 10×4 and 2×4.', a: ['48','42','44'], good: 0, why: '40 + 8 = 48.' },
        { q: '35 + 27. Add ones then tens.', a: ['62','52','72'], good: 0, why: '5+7=12. Carry 1. 3+2+1=6.' },
        { q: '84 - 39. Borrow first.', a: ['45','55','43'], good: 0, why: '14-9=5. 7-3=4.' },
        { q: '15 × 3. Split 10 and 5.', a: ['45','35','50'], good: 0, why: '30 + 15 = 45.' }
      ]
    },
    '/games/tongue-twister/': {
      title: 'Tongue Twister · Level 2', icon: '🌀', badge: 'Clear Speaker',
      intro: 'Medium mode: choose the clearer phrase.',
      questions: [
        { q: 'Which phrase is easier to say clearly first?', a: ['Red rocks roll','Rrr red rock rocket race','Red red red red'], good: 0, why: 'Short and clear wins first.' },
        { q: 'What should you do when your tongue trips?', a: ['Slow down','Yell louder','Stop forever'], good: 0, why: 'Slow makes speech clear.' },
        { q: 'Which helps rhythm?', a: ['Clap each word','Rush fast','Skip words'], good: 0, why: 'Clapping creates timing.' },
        { q: 'Pick the best practice move.', a: ['Say it smooth twice','Say it messy once','Only whisper'], good: 0, why: 'Smooth practice builds control.' },
        { q: 'Which one is a good challenge?', a: ['Tiny turtles tiptoe','Turtle','Ttttttt'], good: 0, why: 'It is hard but still clear.' },
        { q: 'What is the goal?', a: ['Clear words','Fast noise','No breathing'], good: 0, why: 'Clear words matter most.' }
      ]
    },
    '/games/food-groups/': {
      title: 'Natural Food · Level 2', icon: '🥑', badge: 'Food Builder',
      intro: 'Medium mode: connect food to what it does.',
      questions: [
        { q: 'Avocado gives your body mostly what?', a: ['Healthy fat','Candy sugar','Plastic'], good: 0, why: 'Avocado has helpful fats.' },
        { q: 'Eggs help build what?', a: ['Muscle and body parts','Clouds','Shoes'], good: 0, why: 'Eggs have protein.' },
        { q: 'Watermelon helps with what?', a: ['Hydration','Fire','Metal'], good: 0, why: 'It has lots of water.' },
        { q: 'Potato gives steady what?', a: ['Energy','Rain','Air'], good: 0, why: 'Potatoes give carbs for energy.' },
        { q: 'Beef gives what?', a: ['Protein and minerals','Only water','Only sugar'], good: 0, why: 'Beef helps build and repair.' },
        { q: 'A balanced plate usually has?', a: ['Protein, energy, color','Only candy','Only sauce'], good: 0, why: 'Balance helps the body.' }
      ]
    },
    '/games/money/': {
      title: 'Money Tips · Level 2', icon: '💰', badge: 'Money Thinker',
      intro: 'Medium mode: pause before spending.',
      questions: [
        { q: 'You get $20. What is a smart first move?', a: ['Save part of it','Spend all fast','Forget it'], good: 0, why: 'Saving first builds control.' },
        { q: 'A toy is fun but you need lunch.', a: ['Buy lunch first','Buy toy first','Buy neither and cry'], good: 0, why: 'Needs come before wants.' },
        { q: 'A goal costs $50. What helps?', a: ['Save each week','Wish only','Spend every coin'], good: 0, why: 'Small savings build big goals.' },
        { q: 'Someone says “buy now fast.”', a: ['Pause and think','Buy fast','Copy everyone'], good: 0, why: 'Pause protects your money.' },
        { q: 'You make a money mistake.', a: ['Learn the lesson','Give up','Blame everyone'], good: 0, why: 'Mistakes can teach.' },
        { q: 'You want more money later.', a: ['Learn useful skills','Only complain','Wait forever'], good: 0, why: 'Skills can create value.' }
      ]
    },
    '/games/family/': {
      title: 'Family Habits · Level 2', icon: '👨‍👩‍👧', badge: 'Kind Helper',
      intro: 'Medium mode: pick the more helpful action.',
      questions: [
        { q: 'Someone is talking. What helps most?', a: ['Listen first','Interrupt fast','Walk away'], good: 0, why: 'Listening shows respect.' },
        { q: 'A mess is on the floor.', a: ['Help clean it','Ignore it','Make it worse'], good: 0, why: 'Helping builds family trust.' },
        { q: 'You feel upset.', a: ['Use calm words','Scream louder','Break something'], good: 0, why: 'Calm words solve more.' },
        { q: 'Someone helped you.', a: ['Say thank you','Say nothing','Complain'], good: 0, why: 'Thanks makes people feel seen.' },
        { q: 'You made a mistake.', a: ['Tell the truth','Hide it','Blame others'], good: 0, why: 'Truth fixes faster.' },
        { q: 'A family member is tired.', a: ['Be gentle','Ask for more','Make noise'], good: 0, why: 'Gentle energy helps.' }
      ]
    },
    '/games/selva/': {
      title: 'Selva Quiz · Level 2', icon: '🌿', badge: 'Jungle Thinker',
      intro: 'Medium mode: think about the jungle job.',
      questions: [
        { q: 'Why are trees important in the jungle?', a: ['They give homes and air','They make candy','They stop all rain'], good: 0, why: 'Trees help animals and air.' },
        { q: 'A sloth moves slowly. Why can that help?', a: ['It saves energy','It flies faster','It scares cars'], good: 0, why: 'Slow movement saves energy.' },
        { q: 'Birds can help forests by moving what?', a: ['Seeds','Rocks','Fire'], good: 0, why: 'Birds can spread seeds.' },
        { q: 'Rainforest means lots of?', a: ['Rain and life','Snow only','Desert sand'], good: 0, why: 'Rainforests are wet and full of life.' },
        { q: 'Which action protects the jungle?', a: ['Keep it clean','Throw trash','Cut everything'], good: 0, why: 'Clean nature is safer for life.' },
        { q: 'Many animals living together means?', a: ['Biodiversity','Empty land','No food'], good: 0, why: 'Biodiversity means many life forms.' }
      ]
    },
    '/games/isla-aventura/': {
      title: 'Isla Aventura · Level 2', icon: '🏝️', badge: 'Island Explorer',
      intro: 'Medium mode: choose the better adventure move.',
      questions: [
        { q: 'You find a locked treasure. First move?', a: ['Look for a clue','Kick it','Quit'], good: 0, why: 'Clues guide the next move.' },
        { q: 'A sign is in Spanish. What helps?', a: ['Read slowly','Ignore it','Run away'], good: 0, why: 'Slow reading helps meaning.' },
        { q: 'You need 3 coconuts and have 1.', a: ['Find 2 more','Say done','Throw it'], good: 0, why: '1 + 2 = 3.' },
        { q: 'A friend needs help crossing.', a: ['Help carefully','Push past','Laugh'], good: 0, why: 'Adventure needs teamwork.' },
        { q: 'You hear music on the island.', a: ['Follow rhythm','Cover ears forever','Break drums'], good: 0, why: 'Rhythm can guide you.' },
        { q: 'You reach a fork in the path.', a: ['Check the map','Guess fast','Sit forever'], good: 0, why: 'A map helps choices.' }
      ]
    },
    '/games/piano/': {
      title: 'Piano Patterns · Level 2', icon: '🎹', badge: 'Pattern Player',
      intro: 'Medium mode: listen for pattern logic.',
      questions: [
        { q: 'If the pattern is C D E, what comes next?', a: ['F','C','A'], good: 0, why: 'The notes move upward.' },
        { q: 'Which pattern repeats?', a: ['C D C D','C D E F','C B A G'], good: 0, why: 'C D repeats twice.' },
        { q: 'A higher sound usually feels?', a: ['Brighter','Lower','Silent'], good: 0, why: 'Higher notes often feel brighter.' },
        { q: 'What helps you remember notes?', a: ['Say them out loud','Look away','Tap random'], good: 0, why: 'Saying notes helps memory.' },
        { q: 'If you miss a note, what should you do?', a: ['Try slower','Quit','Hit all keys'], good: 0, why: 'Slow practice builds skill.' },
        { q: 'Which is a good music habit?', a: ['Listen first','Rush first','Guess every note'], good: 0, why: 'Listening guides playing.' }
      ]
    },
    '/games/beats/': {
      title: 'Beat Maker · Level 2', icon: '🥁', badge: 'Beat Builder',
      intro: 'Medium mode: build rhythm choices.',
      questions: [
        { q: 'What makes a beat easier to follow?', a: ['Steady timing','Random taps','No sound'], good: 0, why: 'Steady timing creates rhythm.' },
        { q: 'Clap, clap, pause, clap is a?', a: ['Pattern','Mistake','Picture'], good: 0, why: 'Repeated timing is a pattern.' },
        { q: 'What should come after kick-snare-kick-snare?', a: ['Kick','Bell','Nothing forever'], good: 0, why: 'The pattern repeats.' },
        { q: 'A quiet sound after a loud sound creates?', a: ['Contrast','No rhythm','A color'], good: 0, why: 'Contrast makes music interesting.' },
        { q: 'Best way to improve a beat?', a: ['Add one change at a time','Add everything','Delete all sound'], good: 0, why: 'Small changes stay clear.' },
        { q: 'What helps you keep time?', a: ['Count 1-2-3-4','Close your ears','Tap randomly'], good: 0, why: 'Counting keeps rhythm steady.' }
      ]
    }
  };

  const cfg = configs[path];
  if (!cfg) return;

  const style = document.createElement('style');
  style.textContent = `
    .shared-level-two{position:fixed;inset:0;background:rgba(16,20,54,.72);z-index:20000;display:flex;align-items:center;justify-content:center;padding:14px;font-family:Arial,sans-serif}.shared-level-two-card{width:min(620px,100%);max-height:92vh;overflow:auto;background:linear-gradient(180deg,#fff6e6,#e8fbff);border:5px solid #101436;border-radius:30px;padding:16px;color:#101436;box-shadow:0 18px 0 rgba(0,0,0,.32),0 0 42px rgba(255,200,61,.45)}.shared-level-two-title{text-align:center;font-size:30px;font-weight:900;background:#ffc83d;border:4px solid #101436;border-radius:20px;padding:12px;margin-bottom:10px}.shared-level-two-intro{text-align:center;font-size:18px;font-weight:900;background:#fff;border:3px solid #34d17a;border-radius:18px;padding:10px;margin-bottom:10px}.shared-level-two-progress{font-size:16px;font-weight:900;text-align:center;margin-bottom:8px}.shared-level-two-q{font-size:27px;line-height:1.08;font-weight:900;background:#fff;border:4px solid #101436;border-radius:22px;padding:16px;text-align:center;box-shadow:0 7px 0 rgba(0,0,0,.14)}.shared-level-two-answers{display:grid;gap:10px;margin-top:12px}.shared-level-two-btn{position:relative;border:4px solid #101436;border-radius:20px;padding:16px 14px 16px 58px;font-size:21px;font-weight:900;text-align:left;background:#fffdf6;color:#101436;box-shadow:0 7px 0 #101436;cursor:pointer}.shared-level-two-btn::before{content:attr(data-label);position:absolute;left:13px;top:50%;transform:translateY(-50%);width:32px;height:32px;border:3px solid #101436;border-radius:50%;background:#ffc83d;display:flex;align-items:center;justify-content:center}.shared-level-two-btn:nth-child(2){background:#b8f2ff}.shared-level-two-btn:nth-child(3){background:#d7b9ff}.shared-level-two-btn.good{background:linear-gradient(180deg,#d9ffe9,#7dffb0)!important}.shared-level-two-btn.bad{background:linear-gradient(180deg,#ff3d3d,#b40020)!important;color:#fff!important}.shared-level-two-note{font-size:18px;font-weight:900;line-height:1.2;background:#f1fff3;border:3px solid #34d17a;border-radius:16px;margin-top:12px;padding:10px;text-align:center;min-height:44px}.shared-level-two-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.shared-level-two-actions button{border:4px solid #101436;border-radius:18px;padding:13px 8px;font-size:17px;font-weight:900;background:#ffc83d;box-shadow:0 6px 0 rgba(0,0,0,.22);color:#101436}@media(max-width:430px){.shared-level-two-title{font-size:24px}.shared-level-two-q{font-size:22px}.shared-level-two-btn{font-size:18px}.shared-level-two-actions{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  function shuffle(list) { return list.map(v => ({ v, r: Math.random() })).sort((a,b) => a.r - b.r).map(x => x.v); }
  function sound(name){ try{ if(window.SeanGameSounds && SeanGameSounds[name]) SeanGameSounds[name](); }catch(e){} }
  function speak(text){ try{ if(window.SeanGameVoice && SeanGameVoice.speak) SeanGameVoice.speak(text); }catch(e){} }

  function start() {
    active = true;
    index = 0;
    score = 0;
    deck = shuffle(cfg.questions).slice(0, 6);
    document.querySelector('.shared-level-two')?.remove();
    const wrap = document.createElement('div');
    wrap.className = 'shared-level-two';
    wrap.innerHTML = '<div class="shared-level-two-card"><div class="shared-level-two-title">' + cfg.icon + ' ' + cfg.title + '</div><div class="shared-level-two-intro">' + cfg.intro + '</div><div class="shared-level-two-progress"></div><div class="shared-level-two-q"></div><div class="shared-level-two-answers"></div><div class="shared-level-two-note">Look first. Then choose.</div><div class="shared-level-two-actions"><button class="level-two-again">🔁 Play Again</button><button class="level-two-menu">🏠 Main Menu</button><button class="level-two-close">✕ Close</button></div></div>';
    document.body.appendChild(wrap);
    wrap.querySelector('.level-two-again').onclick = start;
    wrap.querySelector('.level-two-menu').onclick = () => location.href = '/games/';
    wrap.querySelector('.level-two-close').onclick = () => wrap.remove();
    render();
    sound('levelUp');
  }

  function render() {
    const wrap = document.querySelector('.shared-level-two');
    if (!wrap) return;
    if (index >= deck.length) return finish();
    const item = deck[index];
    wrap.querySelector('.shared-level-two-progress').textContent = 'Level 2 · Step ' + (index + 1) + ' of ' + deck.length + ' · Score ' + score;
    wrap.querySelector('.shared-level-two-q').textContent = item.q;
    wrap.querySelector('.shared-level-two-note').textContent = 'Medium mode: think one step deeper.';
    const answers = shuffle(item.a.map((text, i) => ({ text, ok: i === item.good })));
    wrap.querySelector('.shared-level-two-answers').innerHTML = answers.map((a, i) => '<button class="shared-level-two-btn" data-label="' + String.fromCharCode(65 + i) + '">' + a.text + '</button>').join('');
    wrap.querySelectorAll('.shared-level-two-btn').forEach((btn, i) => {
      btn.onclick = () => pick(btn, answers[i], item);
    });
  }

  function pick(btn, answer, item) {
    const wrap = document.querySelector('.shared-level-two');
    if (!wrap) return;
    wrap.querySelectorAll('.shared-level-two-btn').forEach(b => b.disabled = true);
    if (answer.ok) {
      score += 10;
      btn.classList.add('good');
      wrap.querySelector('.shared-level-two-note').textContent = item.why;
      sound('correct');
      speak('Correct, you got it!');
      setTimeout(() => { index++; render(); }, 1100);
    } else {
      btn.classList.add('bad');
      wrap.querySelector('.shared-level-two-note').textContent = 'Incorrect. Try again.';
      sound('wrong');
      speak('Incorrect.');
      setTimeout(() => {
        wrap.querySelectorAll('.shared-level-two-btn').forEach(b => { b.disabled = false; b.classList.remove('bad'); });
      }, 800);
    }
  }

  function finish() {
    const wrap = document.querySelector('.shared-level-two');
    if (!wrap) return;
    wrap.querySelector('.shared-level-two-progress').textContent = 'Level 2 complete · Score ' + score;
    wrap.querySelector('.shared-level-two-q').textContent = '🏆 You earned the ' + cfg.badge + ' badge!';
    wrap.querySelector('.shared-level-two-answers').innerHTML = '';
    wrap.querySelector('.shared-level-two-note').textContent = 'Medium mode complete. You can repeat it, go to the menu, or close.';
    sound('levelUp');
  }

  window.addEventListener('seanGameNextLevelRequest', start);
  window.SharedLevelTwoStart = start;
})();
