// Adapt rendering work only. World state, collisions and simulation stay authoritative.
export function createRenderBudget({ratio=1,compact=false,cores=8,memory=8}={}){
 const ceiling=compact?1:2;let tier=compact||cores<=4||memory<=4?0:ceiling,ema=0,frames=0,lastChange=0,goodSince=0;
 const settings=()=>({tier,pixelRatio:Math.min(ratio,[.85,1.15,1.5][tier]),shadows:tier>0,shadowSize:tier===2?2048:1024,shadowInterval:tier===2?1/20:1/12});
 return {get settings(){return settings();},sample(workMs,intervalMs,now){if(!Number.isFinite(workMs)||workMs<0)return false;ema=frames?ema*.9+workMs*.1:workMs;frames++;if(frames<25||now-lastChange<1500)return false;const overloaded=ema>23||intervalMs>42&&ema>13;if(overloaded&&tier>0){tier--;lastChange=now;goodSince=0;return true;}if(ema<10&&intervalMs<24){goodSince||=now;if(now-goodSince>8000&&tier<ceiling){tier++;lastChange=now;goodSince=0;return true;}}else goodSince=0;return false;},get workMs(){return ema;}};
}
export function spatialInstances(items,size=64){const chunks=new Map();for(const item of items){const key=Math.floor(item.x/size)+','+Math.floor(item.z/size);if(!chunks.has(key))chunks.set(key,[]);chunks.get(key).push(item);}return [...chunks.values()];}
