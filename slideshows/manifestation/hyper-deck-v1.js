function renderHyperDeck(data){
  if(!document.querySelector('link[href*="hyper-deck-master-overrides.css"]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/slideshows/manifestation/hyper-deck-master-overrides.css?v=2';
    document.head.appendChild(link);
  }

  const AUTHOR_PHOTOS={
    'Neville Goddard':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Neville_Goddard.jpg/250px-Neville_Goddard.jpg',
    'Napoleon Hill':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Napoleon_Hill_headshot.jpg/250px-Napoleon_Hill_headshot.jpg',
    'Wallace Wattles':'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/The_Science_of_Getting_Rich_-_Frontispiece.jpg/250px-The_Science_of_Getting_Rich_-_Frontispiece.jpg'
  };

  const inputSlides=data.slides||[];
  const offerSlide={
    icon:'🔥',
    headline:`Subscribe for huge<br>real-world value.`,
    copy:[
      `📘 Real teachers. Real mechanisms.`,
      `🧠 Simple breakdowns you can actually use.`,
      `⚡ Every video gives you a sharper way to think, move, and create results.`
    ],
    callout:`No fluff. No fantasy. Real-world manifestation lessons for money, confidence, business, and life.`,
    cta:`Subscribe now — get real value every video.`
  };

  const slides=inputSlides.map((s,i)=>i===inputSlides.length-1?offerSlide:s);
  const root=document.getElementById('slides');
  const progress=document.getElementById('progress');
  let current=0;

  const deck=document.querySelector('.deck');
  if(deck&&!deck.querySelector('.creator-footer')){
    const footer=document.createElement('div');
    footer.className='creator-footer';
    footer.innerHTML=`<span>Created by <strong>Sean Ali</strong></span><a href='https://seanali.online' target='_blank' rel='noopener'>SeanAli.online</a><span>•</span><a href='https://hypnoticmeditations.ai' target='_blank' rel='noopener'>Hypnotic Meditations</a><span>•</span><a href='https://manifestationgenie.app' target='_blank' rel='noopener'>Manifestation Genie</a>`;
    const controls=deck.querySelector('.controls');
    deck.insertBefore(footer,controls||null);
  }

  function fullNames(text){
    if(typeof text!=='string')return text;
    return text
      .replace(/\bNeville\b(?!\s+Goddard)/g,'Neville Goddard')
      .replace(/\bMurphy\b/g,'Joseph Murphy')
      .replace(/\bHill\b/g,'Napoleon Hill')
      .replace(/\bWattles\b/g,'Wallace Wattles')
      .replace(/\bDispenza\b/g,'Joe Dispenza');
  }

  function initials(name){return name.split(' ').filter(Boolean).map(p=>p[0]).join('').slice(0,2).toUpperCase()}
  function authorVisual(name){
    const src=AUTHOR_PHOTOS[name];
    if(src)return `<div class='author-photo-wrap'><img class='author-photo' src='${src}' alt='${name} portrait' loading='lazy' referrerpolicy='no-referrer' onerror='this.parentElement.outerHTML="<div class=\'avatar-fallback\'>${initials(name)}</div>"'></div>`;
    return `<div class='avatar-fallback'>${initials(name)}</div>`;
  }

  function bodyClass(s){
    const copyCount=(s.copy||[]).length;
    const extras=(s.grid?2:0)+(s.steps?2:0)+(s.teacher?1:0)+(s.callout?1:0)+(s.pill?1:0)+(s.cta?1:0);
    const weight=copyCount+extras;
    if(weight<=3)return 'short';
    if(weight<=5)return 'medium';
    return 'dense';
  }

  function badge(i){return `<div class='topbar'><div class='badge'><span>${String(i+1).padStart(2,'0')}</span> / <span class='total'>${slides.length}</span></div><div class='mini-icon'>${slides[i].icon||'🔥'}</div></div>`}

  function renderSlide(s,i){
    let body='';
    body+=s.hero?`<h1>${fullNames(s.headline)}</h1>`:`<h2>${fullNames(s.headline)}</h2>`;
    if(s.copy)body+=`<div class='copy'>${s.copy.map(x=>`<p>${fullNames(x)}</p>`).join('')}</div>`;
    if(s.grid)body+=`<div class='grid'>${s.grid.map(x=>`<div class='tile ${x[0]}'>${fullNames(x[1])}</div>`).join('')}</div>`;
    if(s.teacher)body+=`<div class='teacher-card'>${authorVisual(s.teacher.name)}<div><div class='teacher-label'>${s.teacher.name} ✦</div><div class='teacher-quote'>${fullNames(s.teacher.quote)}</div></div></div>`;
    if(s.callout)body+=`<div class='callout'><p>${fullNames(s.callout)}</p></div>`;
    if(s.steps)body+=`<div class='steps'>${s.steps.map((x,idx)=>`<div class='step'><div class='num'>${idx+1}</div><div>${fullNames(x)}</div></div>`).join('')}</div>`;
    if(s.pill)body+=`<div class='icon-lines'><div class='icon-line'><div class='icon-bubble'>✦</div><span>${fullNames(s.pill)}</span></div></div>`;
    if(s.cta)body+=`<div class='cta'>${fullNames(s.cta)}</div>`;
    return `<section class='slide'>${badge(i)}<div class='slide-body ${bodyClass(s)}'>${body}</div></section>`;
  }

  function showSlide(i){
    current=(i+slides.length)%slides.length;
    document.querySelectorAll('.slide').forEach((s,idx)=>{const on=idx===current;s.classList.toggle('active',on);s.style.display=on?'flex':'none';s.style.visibility=on?'visible':'hidden';s.style.opacity=on?'1':'0'});
    document.querySelectorAll('.dot').forEach((d,idx)=>d.classList.toggle('on',idx<=current));
  }

  root.innerHTML=slides.map(renderSlide).join('');
  progress.innerHTML=slides.map(()=>`<div class='dot'></div>`).join('');
  window.nextSlide=()=>showSlide(current+1);
  window.prevSlide=()=>showSlide(current-1);
  document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')window.nextSlide();if(e.key==='ArrowLeft')window.prevSlide()});
  showSlide(0);
}