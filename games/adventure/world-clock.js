// Preserve the original saved 240-unit celestial phase: zero still means 6 AM (sunrise is now 7 AM).
export const DAY_CYCLE_SECONDS=1200;
export const MORNING_TIME=20; // 08:00 after sleeping
export function worldClock(value=40){
 const units=((Number.isFinite(value)?value:40)%240+240)%240;
 const minutes=Math.floor((units*6+360)%1440+1e-7)%1440;
 const hour=Math.floor(minutes/60),minute=minutes%60;
 const night=hour<7||hour>=19;
 const icon=hour===7?'🌅':hour===18?'🌇':night?'🌙':'☀️';
 return {phase:units/240,hour,minute,night,icon,time:`${hour%12||12}:${String(minute).padStart(2,'0')} ${hour<12?'AM':'PM'}`,isoTime:`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`};
}

