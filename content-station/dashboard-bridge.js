(()=>{
 const embedded=window.parent!==window&&new URLSearchParams(location.search).get('dashboard')==='1';if(!embedded)return;
 document.documentElement.classList.add('dashboard-embedded');
 const bar=document.createElement('aside');bar.className='dashboard-context';
 const context=document.createElement('p');context.textContent='My project workspace';
 const save=document.createElement('button');save.type='button';save.textContent='Save output to my dashboard';
 const status=document.createElement('p');status.setAttribute('role','status');status.className='bridge-status';
 bar.append(context,save,status);document.body.prepend(bar);
 save.addEventListener('click',()=>{const field=document.querySelector('#asset-output,#pack-output,#output');if(!field?.value.trim()){status.textContent='Create an output in this tool first.';return;}window.parent.postMessage({type:'sean-save-output',text:field.value},location.origin);status.textContent='Output sent to my dashboard draft.';});
 window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==window.parent||e.data?.type!=='sean-work-context')return;const d=e.data;context.textContent=(d.project||'My project')+' · '+(d.outcome||'Finish one useful thing');const input=document.querySelector('#seed,#market-input,#angle');if(input&&!input.value.trim()){input.value=String(d.topic||'').slice(0,2000);input.dispatchEvent(new Event('input',{bubbles:true}));}const brand=document.querySelector('#brand,#brand-select');if(brand&&[...brand.options].some(o=>o.value===d.project)){brand.value=d.project;brand.dispatchEvent(new Event('change',{bubbles:true}));}const offer=document.querySelector('#offer,#offer-select');if(offer){const selected=d.projectId==='hm'?'Money Flow':['reborn-refined','manifestation-genie-app-v1'].includes(d.projectId)?'Manifestation Genie':null;if(selected&&[...offer.options].some(o=>o.value===selected)){offer.value=selected;offer.dispatchEvent(new Event('change',{bubbles:true}));}}const lane=document.querySelector('#lane');if(lane&&['reborn-refined','manifestation-genie-app-v1'].includes(d.projectId)&&!document.querySelector('#asset-output')?.value){lane.value='genieFactory';lane.dispatchEvent(new Event('change',{bubbles:true}));}});
 // Template tools are drafts, not verified facts or current automation status.
 const note=document.createElement('p');note.className='bridge-status';note.textContent='Existing template tool. Review generated claims, personal stories and scores before use. “Active” labels in this tool do not verify any schedule.';bar.append(note);
 window.parent.postMessage({type:'sean-tool-ready'},location.origin);
})();

