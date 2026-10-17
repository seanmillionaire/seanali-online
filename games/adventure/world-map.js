/* Shared, coordinate-accurate archipelago map for the open-world explorer.
   X is east/right and Z is south/down, matching ArrowUp (negative Z). */
export function createWorldMap({host,panel,world,islands,places,language,onTravel,onOpen}){
 const es=language==='es',say=(a,b)=>es?a:b,ns='http://www.w3.org/2000/svg';
 const land=[{id:'home',x:0,z:0,rx:20,rz:14,es:'Playa Gorgona',en:'Playa Gorgona',icon:'🏡'}]
   .concat(islands.map(i=>({id:i.id,x:i.x,z:i.z,rx:i.rx,rz:i.rz,es:i.es,en:i.en,
     icon:({islet:'🦋',wilds:'🍌',coconutCoast:'🥥',sunset:'🌋',crystalCove:'💎',pizzaCity:'🍕'})[i.id]||'🏝️'})));
 const point=(x,z)=>({x:Number(x)||0,z:Number(z)||0});
 const name=i=>es?i.es:i.en;
 const svgEl=(tag,attrs={},text)=>{const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=text;return n;};
 const elem=(tag,cls,txt)=>{const n=document.createElement(tag);n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
 const currentPlace=()=>{const p=land.filter(i=>Math.hypot((world.x-i.x)/i.rx,(world.z-i.z)/i.rz)<1.22).sort((a,b)=>Math.hypot(world.x-a.x,world.z-a.z)-Math.hypot(world.x-b.x,world.z-b.z))[0];return p?name(p):say('En el mar','At sea');};
 const islandTarget=id=>places.find(p=>p.id===id)||(id==='home'?places.find(p=>p.id==='pip'):null);
 function drawing(mini){
  const svg=svgEl('svg',{class:'island-map-art',viewBox:'-175 -155 350 310',role:'img',
    'aria-label':say('Mapa del archipiélago con la posición actual','Archipelago map with your current position')});
  const defs=svgEl('defs'),gradient=svgEl('linearGradient',{id:mini?'ocean-mini':'ocean-big',x1:'0%',y1:'0%',x2:'100%',y2:'100%'});
  gradient.append(svgEl('stop',{offset:'0%','stop-color':'#77cfd4'}),svgEl('stop',{offset:'100%','stop-color':'#267eac'}));
  defs.append(gradient);svg.append(defs);
  svg.append(svgEl('rect',{x:-175,y:-155,width:350,height:310,fill:'url(#'+(mini?'ocean-mini':'ocean-big')+')'}));
  for(const i of land){
    const g=svgEl('g',{class:'island-map-land','data-island':i.id});
    // Match the real island biome rather than painting every landmass green.
    const palette=({
      home:['#ead3aa','#6bae69','#a5cf82'],
      islet:['#f4d8b3','#92d39c','#eea9d0'],
      wilds:['#d3c18a','#338454','#73b95c'],
      coconutCoast:['#f1e7c5','#f8dea0','#7bdcc2'],
      sunset:['#b1a58e','#615c53','#857764'],
      crystalCove:['#d8eafa','#79c2d9','#b0a4ed'],
      pizzaCity:['#eaddc4','#e6c18e','#86ba88']
    })[i.id]||['#e9d7a6','#62ab70','#93c988'];
    g.append(svgEl('ellipse',{cx:i.x,cy:i.z,rx:i.rx+2,ry:i.rz+2,fill:palette[0]}));
    g.append(svgEl('ellipse',{cx:i.x,cy:i.z,rx:i.rx*.83,ry:i.rz*.82,fill:palette[1]}));
    g.append(svgEl('ellipse',{cx:i.x-i.rx*.18,cy:i.z-i.rz*.18,rx:i.rx*.36,ry:i.rz*.36,fill:palette[2],opacity:'.6'}));
    if(!mini){
      const icon=svgEl('text',{x:i.x,y:i.z+2,'font-size':i.id==='home'?12:13,'text-anchor':'middle',
        'dominant-baseline':'central','pointer-events':'none'},i.icon);
      g.append(icon);
      if(islandTarget(i.id)){
        g.setAttribute('class','island-map-land island-map-target');
        g.setAttribute('role','button');g.setAttribute('tabindex','0');
        g.setAttribute('aria-label',name(i));
        const activate=()=>choose(i.id);
        g.addEventListener('click',activate);
        g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
      }
    }
    svg.append(g);
  }
  if(!mini)for(const p of places.filter(p=>['friend','boat','balloon'].includes(p.kind))){
    svg.append(svgEl('circle',{cx:p.x,cy:p.z,r:3.5,fill:'#fff9de',stroke:'#3d6775','stroke-width':1}));
  }
  const target=svgEl('circle',{r:6,fill:'none',stroke:'#fff3a1','stroke-width':2,
    'stroke-dasharray':'3 2',visibility:'hidden'});
  svg.append(target);
  const group=svgEl('g',{'aria-label':say('Estás aquí','You are here')});
  group.append(svgEl('circle',{r:8,fill:'#fcf7e6',stroke:'#123d46','stroke-width':1.7}));
  const arrow=svgEl('path',{d:'M0 -6 L5 5 L0 2 L-5 5 Z',fill:'#ed6b36',stroke:'#843b22','stroke-width':'.7'});
  group.append(arrow);
  svg.append(group);
  return {svg,group,arrow,target};
 }
 let last=0,opened=false,zoom=1,center=point(world.x,world.z),chosen=null,full=null,placeReadout=null;
 const preview=drawing(true),mini=elem('button','island-map-mini');
 mini.type='button';mini.setAttribute('aria-label',say('Abrir mapa. Ver dónde estoy','Open map. See where I am'));
 const label=elem('span','island-map-mini-label','🗺️ '+say('MAPA','MAP'));
 preview.svg.setAttribute('aria-hidden','true');
 mini.append(preview.svg,label);host.append(mini);
 function close(focus=true){opened=false;panel.hidden=true;panel.classList.remove('island-map-open');if(focus)mini.focus({preventScroll:true});}
 function choose(id){const dest=islandTarget(id);if(!dest)return;close(false);onTravel(dest);}
 function drawControls(){
  const buttons=elem('div','island-map-controls');
  function control(txt,label,fn){const b=elem('button','island-map-control',txt);b.type='button';b.setAttribute('aria-label',label);b.addEventListener('click',fn);buttons.append(b);return b;}
  control('−',say('Alejar','Zoom out'),()=>{zoom=Math.max(1,zoom/1.5);update(true);});
  control('+',say('Acercar','Zoom in'),()=>{zoom=Math.min(3,zoom*1.5);center=point(world.x,world.z);update(true);});
  control('📍',say('Centrar en mí','Center on me'),()=>{center=point(world.x,world.z);zoom=Math.max(1.8,zoom);update(true);});
  control('🏝️',say('Ver todas las islas','View all islands'),()=>{zoom=1;center=point(0,0);update(true);});
  return buttons;
 }
 function open(){
  onOpen?.();
  opened=true;zoom=1;chosen=null;center=point(0,0);
  panel.replaceChildren();panel.hidden=false;panel.classList.add('island-map-open');
  const title=elem('h2','island-map-heading','🗺️ '+say('Mapa de Panamá Fantástico','Fantasy Panama Adventure Map'));
  const closeButton=elem('button','panel-close','×');closeButton.type='button';
  closeButton.setAttribute('aria-label',say('Cerrar mapa','Close map'));closeButton.addEventListener('click',()=>close());panel.append(title,closeButton);
  placeReadout=elem('p','island-map-you-are');panel.append(placeReadout);
  const frame=elem('div','island-map-frame');
  full=drawing(false);frame.append(full.svg);
  panel.append(frame,drawControls());
  panel.append(elem('p','island-map-guide',say('📍 Panamá de fantasía: toca un destino para explorar. Las posiciones son de juego, no un mapa real.','📍 Fantasy Panama: tap a destination to explore. Locations are playful, not geographically exact.')));
  const destinations=elem('div','island-map-destinations');
  for(const island of land){
    const destination=islandTarget(island.id);if(!destination)continue;
    const b=elem('button','island-map-destination',island.icon+' '+name(island));
    b.type='button';b.addEventListener('click',()=>choose(island.id));
    destinations.append(b);
  }
  panel.append(destinations);
  update(true);closeButton.focus({preventScroll:true});
 }
 mini.addEventListener('click',open);
 function update(force=false,heading=0){
  const now=performance.now();
  if(!force&&now-last<90)return;last=now;
  const x=Number(world.x)||0,z=Number(world.z)||0;
  const angle=180-(Number(heading)||0)*180/Math.PI;
  function place(map){map.group.setAttribute('transform','translate('+x+' '+z+')');map.arrow.setAttribute('transform','rotate('+angle+')');}
  place(preview);
  // A moving local view keeps the player centered while approaching any island.
  preview.svg.setAttribute('viewBox',(x-37)+' '+(z-31)+' 74 62');
  if(!opened||!full)return;
  place(full);
  if(placeReadout)placeReadout.textContent='📍 '+say('ESTÁS AQUÍ: ','YOU ARE HERE: ')+currentPlace();
  const w=350/zoom,h=310/zoom;
  const cx=zoom===1?0:center.x,cz=zoom===1?0:center.z;
  full.svg.setAttribute('viewBox',(cx-w/2)+' '+(cz-h/2)+' '+w+' '+h);
 }
 function dispose(){mini.remove();if(opened)close(false);full=null;}
 update(true);
 return {open,close,update,dispose,isOpen:()=>opened};
}
