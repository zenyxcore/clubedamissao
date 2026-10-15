import { ASSETS, type Avatar } from '@/lib/adventure';
const positions: Record<Avatar, {x:number;y:number;w:number;h:number}> = {
 'Bússola': {x:65,y:0,w:400,h:446}, 'Lanterna': {x:65,y:439,w:270,h:390}, 'Guardião': {x:790,y:458,w:325,h:337}, 'Estrela': {x:1110,y:450,w:330,h:320}, 'Tesouro': {x:385,y:480,w:380,h:310}, 'Mapa': {x:490,y:68,w:530,h:370},
};
export function Asset({name, className=''}:{name:Avatar;className?:string}) { const p=positions[name]; return <span role="img" aria-label={name} className={`asset ${className}`}><svg viewBox={`0 0 ${p.w} ${p.h}`} aria-hidden="true"><image href={ASSETS.objects} width="1448" height="1086" x={-p.x} y={-p.y}/></svg></span>; }
