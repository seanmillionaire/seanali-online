// Shared pavement, terrain clearance and traffic layout for the intercity corridor.
export const BASE_ROAD_WIDTH=9.5,FOUR_LANE_WIDTH=17.5;
export const FOUR_LANE_ROADS=new Set(['cityToGorgona','cityToBaru','cityToColon']);
export function highwayWidth(id,x=0,z=0){
 if(id.startsWith('mansion'))return 5.6;
 if(!FOUR_LANE_ROADS.has(id))return BASE_ROAD_WIDTH;
 // After the Volcán turnoff the mountain ascent returns gently to two lanes.
 const taper=id==='cityToBaru'&&x< -370?Math.max(0,Math.min(1,(-z-30)/25)):0;
 return FOUR_LANE_WIDTH+(BASE_ROAD_WIDTH-FOUR_LANE_WIDTH)*taper;
}
export const highwayExtra=(id,x,z)=>Math.max(0,(highwayWidth(id,x,z)-BASE_ROAD_WIDTH)/2);
export function highwayLane(id,outer,x,z){const expansion=(highwayWidth(id,x,z)-BASE_ROAD_WIDTH)/(FOUR_LANE_WIDTH-BASE_ROAD_WIDTH);return 1.8+expansion*(outer?4.4:.5);}
