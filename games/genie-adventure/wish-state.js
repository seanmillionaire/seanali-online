export const WISH_IDS=['shells','picnic','seed','song','care','light'];
export function normalizeWishes(raw){
  return {granted:[...new Set((Array.isArray(raw?.granted)?raw.granted:[]).filter(id=>WISH_IDS.includes(id)))]};
}
