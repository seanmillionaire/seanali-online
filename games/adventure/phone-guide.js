// Small, bilingual walkthroughs: one picture, one instruction, one next action.
export function phoneGuide({parent,steps,es=false,onDone,onClose}){
 let index=0;const card=document.createElement('section');card.className='phone-walkthrough';card.setAttribute('aria-label',es?'Guía paso a paso':'Step-by-step guide');parent.append(card);
 function draw(){card.replaceChildren();const step=steps[index],count=document.createElement('p');count.className='guide-count';count.textContent=`${index+1} / ${steps.length}`;
 const icon=document.createElement('div');icon.className='guide-picture';icon.textContent=step[0];icon.setAttribute('aria-hidden','true');const title=document.createElement('h3');title.textContent=step[es?1:2];title.tabIndex=-1;const text=document.createElement('p');text.textContent=step[es?3:4];const nav=document.createElement('div');nav.className='guide-actions';
 function button(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;nav.append(b);}
 if(index)button(es?'← Atrás':'← Back',()=>{index--;draw();});button(index===steps.length-1?(es?'✅ ¡Vamos!':'✅ Let’s go!'):(es?'Siguiente →':'Next →'),()=>{if(index<steps.length-1){index++;draw();}else onDone();});if(onClose)button(es?'Cerrar guía':'Close guide',onClose);
 card.append(count,icon,title,text,nav);if(index)title.focus({preventScroll:true});}
 draw();return card;
}
export const CLEANUP_GUIDE=[['📍🗑️','Busca los contenedores','Find the bins','Camina hasta un punto de limpieza.','Walk to a cleanup spot.'],['🧴🎒','Recoge un objeto','Pick up one item','Toca Recoger. Va a tu bolsa.','Tap Pick up. It goes in your bag.'],['🧴➡️♻️','Elige el contenedor','Choose the right bin','Envases → ♻️. Residuos → 🗑️.','Containers → ♻️. Waste → 🗑️.'],['🪙🌱','¡Tu ayuda cuenta!','Your help counts!','Ganas monedas y limpias el barrio. Entrega 6 objetos en un turno para un bono.','Earn coins and clean the neighborhood. Sort 6 items in a shift for a bonus.']];
