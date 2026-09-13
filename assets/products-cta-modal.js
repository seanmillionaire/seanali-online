(function(){
  'use strict';

  var CONFIG={
    genie:{
      eyebrow:'Manifestation Genie',
      title:'Choose how you want to use Manifestation Genie',
      support:'Start with your first wish free, or use the Genie for 30 days.',
      options:[
        {name:'First Wish Free',price:'$0',billing:'free',summary:'Try the Genie with your first wish before paying.',benefits:['Clarify the goal you want to work on','Get a personalized visualization and script','Leave with one concrete next action'],url:'https://www.manifestationgenie.ai/',cta:'Start My Free Wish',value:0,paid:false,original:true,nextTitle:'Start with your first wish',nextCopy:'Open Manifestation Genie and begin free.'},
        {name:'30-Day Pass',price:'$10',billing:'30 days',summary:'Keep using the same guided money-goal process for 30 days.',benefits:['30 days of Manifestation Genie access','Repeat the daily money-goal ritual','Keep the same goal moving with concrete actions'],url:'https://www.manifestationgenie.ai/pricing',cta:'See The 30-Day Pass — $10',value:10,paid:true,badge:'Recommended',nextTitle:'Use the Genie for 30 days',nextCopy:'Review the 30-day access option and continue from the pricing page.'}
      ]
    },
    'money-flow':{
      eyebrow:'Money Flow',
      title:'Choose your Money Flow path',
      support:'Start with Money Flow, or get the broader five-session Money Mind Stack.',
      options:[
        {name:'Money Flow',price:'$27',billing:'one-time',summary:'The focused money-mindset audio you clicked to see.',benefits:['Focused wealth-hypnosis session','Built around earning, receiving, and keeping money','See the full Money Flow page before you decide'],url:'/moneyflow.html',cta:'See Money Flow — $27',value:27,paid:true,original:true,nextTitle:'See Money Flow',nextCopy:'Continue to the full Money Flow page.'},
        {name:'Money Mind Stack',price:'$57',billing:'one-time',summary:'Five money-focused sessions in one bundle.',benefits:['Money Flow included','ATM In Your Mind + Money Magnet','Quantum Cash + Money Wave'],url:'https://buy.hypnoticmeditations.ai/l/bundle-money',cta:'Get The Money Mind Stack — $57',value:57,paid:true,badge:'Best Value',nextTitle:'Get the broader money stack',nextCopy:'Go directly to the Money Mind Stack checkout.'}
      ]
    },
    'ai-freedom':{
      eyebrow:'AI Freedom System',
      title:'Choose your AI Freedom path',
      support:'See the system first, or go straight to the complete full-system course.',
      options:[
        {name:'AI Freedom System',price:'$7',billing:'/mo path',summary:'See the full system page and the lower-friction membership path.',benefits:['Practical AI workflows and training','Build content, products, leads, and funnels','Choose the path that fits before paying'],url:'/system.html',cta:'See AI Freedom System',value:7,paid:false,original:true,nextTitle:'Explore the system',nextCopy:'Continue to the full AI Freedom System page.'},
        {name:'AI Freedom Full System',price:'$297',billing:'one-time',summary:'Go straight to the complete course checkout.',benefits:['Complete AI Freedom System course','Choose and build a simple online offer','Create sales-page and email assets with AI'],url:'https://whop.com/checkout/1pbVYNc863wiBvTlYd-4Xtw-ZbJ1-n6mO-V5FR2Xq3VxPp/',cta:'Get The Full System — $297',value:297,paid:true,badge:'Full System',nextTitle:'Get the complete course',nextCopy:'Continue to the secure Whop checkout.'}
      ]
    },
    'money-wave':{
      eyebrow:'MoneyWave',
      title:'Choose your money-audio starting point',
      support:'Keep the free MoneyWave path, or move into the focused Money Flow practice.',
      options:[
        {name:'MoneyWave Free',price:'$0',billing:'free',summary:'Get the free 7-minute money meditation you clicked for.',benefits:['Free 7-minute money meditation','Listen before deciding on anything paid','Download it and use it again'],url:'/free.html',cta:'Get MoneyWave Free',value:0,paid:false,original:true,nextTitle:'Get the free audio',nextCopy:'Continue to the free MoneyWave page.'},
        {name:'Money Flow',price:'$27',billing:'one-time',summary:'Move from the free sample into the flagship money-focused audio.',benefits:['Focused wealth-hypnosis session','Built around financial resistance and receiving','One-time purchase'],url:'https://buy.hypnoticmeditations.ai/l/hzxybu',cta:'Get Money Flow — $27',value:27,paid:true,badge:'Next Step',nextTitle:'Go deeper with Money Flow',nextCopy:'Continue directly to Money Flow checkout.'}
      ]
    },
    reset:{
      eyebrow:'60-Second New Life Reset',
      title:'Choose your next reset',
      support:'Take the 60-second reset free, or continue with a 30-day guided Genie practice.',
      options:[
        {name:'60-Second New Life Reset',price:'$0',billing:'free',summary:'Take the short questionnaire you clicked to try.',benefits:['Answer seven short questions','Get a reflection based on your answers','Receive a few lines to read and practice'],url:'/assets/2026-07-09-60-second-new-life-reset.html',cta:'Try The Free Reset',value:0,paid:false,original:true,nextTitle:'Take the free reset',nextCopy:'Continue to the 60-second questionnaire.'},
        {name:'Manifestation Genie 30-Day Pass',price:'$10',billing:'30 days',summary:'Turn the same reflection into a longer guided goal practice.',benefits:['Interactive goal questions','Personalized visualization and script','Repeat the guided process for 30 days'],url:'https://www.manifestationgenie.ai/pricing',cta:'See 30-Day Genie — $10',value:10,paid:true,badge:'Deeper Path',nextTitle:'Continue for 30 days',nextCopy:'Review the 30-day Manifestation Genie option.'}
      ]
    }
  };

  function resolveKey(link){
    var href=link.getAttribute('href')||'';
    if(href.indexOf('manifestationgenie.ai')!==-1)return 'genie';
    if(href==='/moneyflow.html')return 'money-flow';
    if(href==='/system.html')return 'ai-freedom';
    if(href==='/free.html')return 'money-wave';
    if(href.indexOf('2026-07-09-60-second-new-life-reset.html')!==-1)return 'reset';
    return null;
  }

  var modal=document.createElement('div');
  modal.className='sa-offer-modal';
  modal.hidden=true;
  modal.innerHTML='<div class="sa-offer-dialog" role="dialog" aria-modal="true" aria-labelledby="sa-offer-title" aria-describedby="sa-offer-support"><button class="sa-offer-close" type="button" aria-label="Close offer options">×</button><div class="sa-offer-head"><span class="sa-offer-eyebrow" id="sa-offer-eyebrow"></span><h2 class="sa-offer-title" id="sa-offer-title"></h2><p class="sa-offer-support" id="sa-offer-support"></p></div><div class="sa-offer-body"><div class="sa-offer-options" id="sa-offer-options"></div><div class="sa-offer-selected"><div><h3 id="sa-offer-detail-title"></h3><ul class="sa-offer-benefits" id="sa-offer-benefits"></ul></div><div class="sa-offer-next"><span class="sa-offer-next-label">Your next step</span><strong id="sa-offer-next-title"></strong><p id="sa-offer-next-copy"></p></div></div></div><div class="sa-offer-footer"><a class="sa-offer-continue" id="sa-offer-continue" href="#"></a><p class="sa-offer-note" id="sa-offer-note"></p></div></div>';
  document.body.appendChild(modal);

  var dialog=modal.querySelector('.sa-offer-dialog');
  var closeButton=modal.querySelector('.sa-offer-close');
  var optionsWrap=modal.querySelector('#sa-offer-options');
  var continueLink=modal.querySelector('#sa-offer-continue');
  var lastTrigger=null,currentKey=null,currentConfig=null,selectedIndex=0;

  function text(id,value){var el=modal.querySelector('#'+id);if(el)el.textContent=value||'';}
  function track(name,data){if(Array.isArray(window.dataLayer)){window.dataLayer.push(Object.assign({event:name},data||{}));}}

  function renderSelected(){
    var offer=currentConfig.options[selectedIndex];
    Array.prototype.forEach.call(optionsWrap.querySelectorAll('.sa-offer-option'),function(btn,i){btn.setAttribute('aria-pressed',String(i===selectedIndex));});
    text('sa-offer-detail-title','What you get with '+offer.name);
    var benefits=modal.querySelector('#sa-offer-benefits');benefits.textContent='';
    offer.benefits.forEach(function(item){var li=document.createElement('li');li.textContent=item;benefits.appendChild(li);});
    text('sa-offer-next-title',offer.nextTitle);
    text('sa-offer-next-copy',offer.nextCopy);
    continueLink.textContent=offer.cta+' →';
    continueLink.href=offer.url;
    text('sa-offer-note',offer.paid?'Pricing shown before final payment.':'Free path stays available. No payment required to continue.');
  }

  function renderOptions(){
    optionsWrap.textContent='';
    currentConfig.options.forEach(function(offer,index){
      var button=document.createElement('button');
      button.type='button';button.className='sa-offer-option';button.setAttribute('aria-pressed',String(index===selectedIndex));
      var top=document.createElement('div');top.className='sa-offer-option-top';
      if(offer.original){var origin=document.createElement('span');origin.className='sa-offer-origin';origin.textContent='The path you clicked';top.appendChild(origin);}
      else if(offer.badge){var badge=document.createElement('span');badge.className='sa-offer-badge';badge.textContent=offer.badge;top.appendChild(badge);}
      var check=document.createElement('span');check.className='sa-offer-check';check.setAttribute('aria-hidden','true');check.textContent='✓';top.appendChild(check);
      var name=document.createElement('h3');name.className='sa-offer-name';name.textContent=offer.name;
      var priceLine=document.createElement('div');priceLine.className='sa-offer-price-line';
      var price=document.createElement('strong');price.className='sa-offer-price';price.textContent=offer.price;
      var billing=document.createElement('span');billing.className='sa-offer-billing';billing.textContent=offer.billing;
      priceLine.appendChild(price);priceLine.appendChild(billing);
      var summary=document.createElement('p');summary.className='sa-offer-summary';summary.textContent=offer.summary;
      button.appendChild(top);button.appendChild(name);button.appendChild(priceLine);button.appendChild(summary);
      button.addEventListener('click',function(){selectedIndex=index;renderSelected();track('contextual_offer_selected',{context:currentKey,offer:offer.name,value:offer.value,currency:'USD'});});
      optionsWrap.appendChild(button);
    });
  }

  function openModal(trigger,key){
    var config=CONFIG[key];if(!config)return;
    lastTrigger=trigger;currentKey=key;currentConfig=config;selectedIndex=0;
    text('sa-offer-eyebrow',config.eyebrow);text('sa-offer-title',config.title);text('sa-offer-support',config.support);
    renderOptions();renderSelected();
    modal.hidden=false;document.body.classList.add('sa-modal-open');closeButton.focus();
    track('contextual_offer_modal_view',{context:key});
  }

  function closeModal(){
    modal.hidden=true;document.body.classList.remove('sa-modal-open');
    if(lastTrigger)lastTrigger.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.sa-card .sa-button'),function(link){
    var key=resolveKey(link);if(!key||!CONFIG[key])return;
    link.addEventListener('click',function(event){event.preventDefault();openModal(link,key);});
  });

  closeButton.addEventListener('click',closeModal);
  modal.addEventListener('click',function(event){if(event.target===modal)closeModal();});
  document.addEventListener('keydown',function(event){
    if(modal.hidden)return;
    if(event.key==='Escape'){event.preventDefault();closeModal();return;}
    if(event.key!=='Tab')return;
    var focusable=Array.prototype.filter.call(dialog.querySelectorAll('button,a[href]'),function(el){return !el.disabled&&el.offsetParent!==null;});
    if(!focusable.length)return;
    var first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  continueLink.addEventListener('click',function(){
    if(!currentConfig)return;
    var offer=currentConfig.options[selectedIndex];
    track('contextual_offer_continue',{context:currentKey,offer:offer.name,value:offer.value,currency:'USD'});
    if(typeof window.fbq==='function'){
      if(offer.paid){window.fbq('track','InitiateCheckout',{content_name:offer.name,value:offer.value,currency:'USD'});}
      else{window.fbq('trackCustom','ContextualFreePathContinue',{content_name:offer.name});}
    }
  });
}());
