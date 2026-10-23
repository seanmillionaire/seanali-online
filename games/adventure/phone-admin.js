// Local sandbox only. This dial code is not authentication for online services.
export const ADMIN_CODE='777';
export const ADMIN_SAVE_KEY='isla-adventure-admin-sandbox-v1';
export const ADMIN_ACTIVE_KEY='isla-adventure-admin-active-v1';
export function activeSaveKey(storage,normalKey){return storage.getItem(ADMIN_ACTIVE_KEY)==='1'&&storage.getItem(ADMIN_SAVE_KEY)?ADMIN_SAVE_KEY:normalKey;}
export function dialAdmin(code,state,storage,normalKey){
 if(code!==ADMIN_CODE)return false;
 if(state.adminMode){storage.removeItem(ADMIN_ACTIVE_KEY);return true;}
 // Write the normal game first. A failed write must never enable the sandbox.
 storage.setItem(normalKey,JSON.stringify(state));
 let previous=null;try{previous=JSON.parse(storage.getItem(ADMIN_SAVE_KEY));}catch{}
 const copy=previous?.version===1&&previous?.world?previous:JSON.parse(JSON.stringify(state));copy.adminMode=true;copy.world.adminMode=true;
 copy.world.sanitation.unlocked=['city','gorgona','colon','chiriqui','east'];
 storage.setItem(ADMIN_SAVE_KEY,JSON.stringify(copy));storage.setItem(ADMIN_ACTIVE_KEY,'1');return true;
}
