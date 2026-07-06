(function(){
  const $=s=>document.querySelector(s);
  const data=window.AbundancePortalData;
  const stateKey='abundancePortalState';
  const resultKey='abundancePortalResult';
  function saveState(state){localStorage.setItem(stateKey,JSON.stringify(state));}
  function loadState(){try{return JSON.parse(localStorage.getItem(stateKey))||{step:0,answers:[]};}catch(e){return{step:0,answers:[]};}}
  function saveResult(key,counts){localStorage.setItem(resultKey,JSON.stringify({key,counts,at:new Date().toISOString()}));}
  function loadResult(){try{return JSON.parse(localStorage.getItem(resultKey));}catch(e){return null;}}
  function resultFromSlug(slug){return Object.entries(data.results).find(([,r])=>r.slug===slug)?.[0]||null;}
  function topCounts(answers){return answers.reduce((m,k)=>{m[k]=(m[k]||0)+1;return m;},{});}
  function restart(){localStorage.removeItem(stateKey);localStorage.removeItem(resultKey);location.href='/portal/quiz/';}
  window.AbundancePortal={restart};

  if(document.body.dataset.portalPage==='quiz'){
    let state=loadState();
    const total=data.questions.length;
    function render(){
      if(state.step>=total){
        const counts=topCounts(state.answers);
        const key=data.getResultKey(counts);
        saveResult(key,counts);
        location.href='/portal/results/?r='+data.results[key].slug;
        return;
      }
      const item=data.questions[state.step];
      $('.ap-step').textContent=state.step+1;
      $('.ap-total').textContent=total;
      $('.ap-bar-fill').style.width=((state.step)/total*100)+'%';
      $('.ap-question').textContent=item.q;
      $('.ap-answers').innerHTML=item.a.map(([key,text])=>`<button class="ap-choice" data-key="${key}"><b>${key}</b><span>${text}</span></button>`).join('');
      document.querySelectorAll('.ap-choice').forEach(btn=>btn.addEventListener('click',()=>{
        state.answers.push(btn.dataset.key);
        state.step++;
        saveState(state);
        render();
      }));
    }
    $('.ap-back')?.addEventListener('click',()=>{if(state.step>0){state.step--;state.answers.pop();saveState(state);render();}});
    render();
  }

  if(document.body.dataset.portalPage==='result'){
    const params=new URLSearchParams(location.search);
    let key=resultFromSlug(params.get('r'));
    const saved=loadResult();
    if(!key && saved?.key)key=saved.key;
    if(!key)key='E';
    const r=data.results[key];
    document.title=r.title+' | The Abundance Portal';
    $('.ap-result-title').textContent=r.scoreLine;
    $('.ap-result-tag').textContent=r.tag;
    $('.ap-diagnosis').textContent=r.diagnosis;
    $('.ap-hit').textContent=r.hit;
    $('.ap-reset').textContent='“'+r.reset+'”';
    $('.ap-main-cta').textContent=r.cta;
    $('.ap-main-cta').href='/portal/reset/?r='+r.slug;
    $('.ap-retake')?.addEventListener('click',restart);
  }

  if(document.body.dataset.portalPage==='reset'){
    const params=new URLSearchParams(location.search);
    const key=resultFromSlug(params.get('r'))||loadResult()?.key||'E';
    const r=data.results[key];
    $('.ap-reset-type').textContent=r.title;
    $('.ap-reset-line').textContent=r.reset;
  }
})();
