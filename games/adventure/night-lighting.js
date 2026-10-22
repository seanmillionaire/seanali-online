// Light the scenery independently of the dark sky, including flight and storms.
export function nightLighting(day){day=Math.max(0,Math.min(1,day));return {moon:1.25+day*1.75,ambient:1.35+day*.10,fill:(1-day)*.45,focus:(1-day)*2.8};}
