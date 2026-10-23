import {CITY_CENTER} from './geography.js';
export const CITY_BALLOON_START={...CITY_CENTER,altitude:110};
// A session entrance, not a save reset: leave possessions and world time alone.
export function startCityBalloon(world){world.x=CITY_BALLOON_START.x;world.z=CITY_BALLOON_START.z;world.flight=CITY_BALLOON_START.altitude;if(world.mansion)world.mansion.rooftop=false;if(world.city?.cruise)world.city.cruise.active=false;}
export function balloonCameraPose(x,y,z,phone=false){const wide=Math.max(0,Math.min(1,(y-35)/60));return {x,y:y+14+wide*(phone?46:42),z:z+(phone?35:32)+wide*(phone?56:44),lookX:x,lookY:y+2.25-wide*(phone?22:25),lookZ:z};}

