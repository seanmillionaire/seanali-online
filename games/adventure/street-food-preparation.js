// A short, cancellable preparation pause. Payment happens only when collected.
export function watchFoodPreparation({panel,id,es=false,onCollect,onCancel}){
 const ice=id==='raspao',say=(a,b)=>es?a:b;
 const stages=ice?[['🧊 Raspando el hielo','🧊 Shaving the ice'],['🍧 Llenando el vasito','🍧 Filling the cup'],['🍓 Agregando sirope','🍓 Pouring syrup'],['🥛 El toque final','🥛 The finishing drizzle']]:[['🥬 Preparando ingredientes','🥬 Preparing ingredients'],['🍳 Cocinando al fuego','🍳 Cooking on the stove'],['🥄 Mezclando y terminando','🥄 Turning and finishing'],['🍽️ Sirviendo tu plato','🍽️ Plating your meal']];
 const title=document.createElement('h2');title.textContent=ice?say('🍧 Mira tu raspao','🍧 Watch your raspao'):say('👩‍🍳 Tu comida se prepara','👩‍🍳 Your meal is cooking');
 const canvas=document.createElement('canvas');canvas.width=640;canvas.height=440;canvas.className='street-food-film';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',ice?say('Vendedor raspando hielo y sirviendo sirope','Vendor shaving ice and pouring syrup'):say('Chef preparando y sirviendo comida','Chef cooking and plating food'));
 const label=document.createElement('p');label.setAttribute('aria-live','polite');const progress=document.createElement('progress');progress.max=6.4;progress.value=0;progress.style.width='100%';progress.setAttribute('aria-label',say('Preparación','Preparation'));
 const take=document.createElement('button');take.className='discover-place';take.textContent=say('🛍️ Recoger mi pedido','🛍️ Collect my order');take.disabled=true;
 const skip=document.createElement('button');skip.className='discover-place';skip.textContent=say('⏩ Ir al plato listo','⏩ Show finished food');
 const cancel=document.createElement('button');cancel.className='discover-place';cancel.textContent=say('↩️ Cancelar · sin pagar','↩️ Cancel · no charge');
 panel.append(title,canvas,label,progress,take,skip,cancel);
 let elapsed=0,last=performance.now(),frame=0,disposed=false,collected=false,phase=-1;const c=canvas.getContext('2d');
 function rect(x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h);}function oval(x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
 function line(points,color,width){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
 function draw(k,t){if(!c)return;rect(0,0,640,440,'#a8d6d5');rect(0,275,640,165,'#eee0c4');rect(30,22,580,28,ice?'#c95b65':'#d9a64d');for(let i=0;i<10;i++)rect(30+i*58,50,29,35,'#fff6de');rect(35,85,5,230,'#696d60');rect(600,85,5,230,'#696d60');
 // Vendor with apron, face, and moving articulated arms behind the worktop.
 oval(320,135,32,40,'#b77d55');oval(308,130,3,3,'#302820');oval(332,130,3,3,'#302820');line([[311,151],[321,154],[329,150]],'#744738',2);rect(283,170,74,115,'#f4f1de');rect(295,190,50,88,ice?'#517f87':'#5f7462');line([[303,172],[300,199],[339,199],[337,172]],'#e3d7b9',5);
 if(!ice){rect(279,91,81,17,'#fff9ec');for(const x of [295,320,345])oval(x,87,18,22,'#fff9ec');}else{oval(320,99,38,10,'#eee6ca');rect(291,80,58,19,'#eee6ca');}
 const sway=Math.sin(t*9)*(k===0?20:8);line([[285,187],[255,215],[220+sway,253]],'#b77d55',15);line([[355,187],[389,215],[420-sway,254]],'#b77d55',15);
 rect(55,292,530,100,ice?'#c95258':'#78866a');rect(45,278,550,18,'#f8f2e4');rect(65,398,510,8,'#6b6255');
 if(ice){
 rect(94,212,102,58,'#c9edf0');line([[94,212],[196,212],[196,270]],'#85b9c3',3);line([[100+sway,204],[160+sway,211]],'#66757a',7);
 for(let i=0;i<3;i++){rect(470+i*30,214,20,58,['#c33861','#e9b835','#396994'][i]);rect(475+i*30,205,10,12,'#eee8de');}
 rect(299,242,58,36,'#fff3df');if(k>=1){oval(328,240,33,26,'#f5fcfa');for(let i=0;i<18;i++)oval(304+(i*17)%47,226+(i*11)%24,2,2,'#d1e9e7');}
 if(k>=2){oval(328,236,28,15,'#d95078');if(k===2){rect(373,188,18,45,'#c33861');line([[380,230],[335,236]],'#d95078',4);}}
 if(k>=3)for(let i=0;i<4;i++)line([[307+i*12,227],[313+i*12,245]],'#fff2ca',3);
 }else{
 rect(102,267,130,10,'#303837');oval(168,260,66,15,'#303837');line([[222,260],[254,250]],'#404942',10);
 for(let i=0;i<7;i++){const x=120+i*15,y=254+Math.sin(i+t*3)*4;oval(x,y,8,4,id==='fishPlate'?'#c6a06b':id==='coconutRice'?'#f8ecd2':'#e6be55');}
 if(k>0&&k<3){for(let i=0;i<5;i++){const y=239-((t*28+i*13)%65);line([[140+i*12,y],[136+i*12,y-10],[141+i*12,y-20]],'#fff7df99',3);}line([[414,250],[187+sway,249]],'#a88254',5);}
 oval(435,265,64,11,'#fff7e7');if(k===0){rect(398,251,12,9,'#579358');rect(418,249,17,9,'#dc844d');}if(k===3&&id==='pizza'){oval(435,259,49,10,'#cfa263');oval(435,257,43,8,'#c95940');for(let i=0;i<8;i++)oval(403+i*9,255+Math.sin(i)*4,4,2,'#f6e4aa');}else if(k===3){for(let i=0;i<8;i++)oval(400+i*10,261+Math.sin(i)*4,11,5,id==='coconutRice'?'#f2e5cc':'#d8b45e');oval(470,257,14,5,'#5e9653');}
 }
 }
 function tick(now){if(disposed||!canvas.isConnected)return;const dt=Math.min(.1,(now-last)/1000);last=now;if(!document.hidden)elapsed=Math.min(6.4,elapsed+dt);const k=Math.min(3,Math.floor(elapsed/1.6));if(k!==phase){phase=k;label.textContent=say(...stages[k]);}progress.value=elapsed;draw(k,matchMedia('(prefers-reduced-motion: reduce)').matches?0:elapsed);if(elapsed>=6.4){take.disabled=false;skip.hidden=true;label.textContent=say('✅ ¡Listo para ti!','✅ Ready for you!');}frame=requestAnimationFrame(tick);}
 take.onclick=()=>{if(collected||elapsed<6.4)return;collected=true;dispose();onCollect();};skip.onclick=()=>{elapsed=6.4;};cancel.onclick=()=>{dispose();onCancel();};
 function dispose(){disposed=true;cancelAnimationFrame(frame);}frame=requestAnimationFrame(tick);return dispose;
}

