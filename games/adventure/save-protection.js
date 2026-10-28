export const backupKey=key=>key+'-previous';
export function readProtectedSave(storage,key){
 for(const candidate of [key,backupKey(key)]){
  try{const value=JSON.parse(storage.getItem(candidate));if(value&&typeof value==='object'&&!Array.isArray(value))return value;}catch{}
 }
 return null;
}
export function writeProtectedSave(storage,key,state){
 const next=JSON.stringify(state),previous=storage.getItem(key);
 if(previous&&previous!==next){
  try{const parsed=JSON.parse(previous);if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))storage.setItem(backupKey(key),previous);}catch(error){if(error instanceof SyntaxError){}else throw error;}
 }
 storage.setItem(key,next);
}
