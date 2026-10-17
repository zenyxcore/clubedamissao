import { parseState, STORAGE_KEY, type ClubState } from './adventure';
import { SEASON_CATALOG } from './season-catalog';
export const EXTRAS_KEY='clube:extras:v1';
export const EMBLEMS=['Bússola','Estrela','Guardião','Lanterna'] as const;
export type Stamp={missionId:string;teamKey:string;names:string;date:string};
export type Extras={teamName:string;emblem:string;memory:string;stamps:Stamp[]};
export const EMPTY_EXTRAS:Extras={teamName:'Equipe da Descoberta',emblem:'Bússola',memory:'',stamps:[]};
const ids=new Set(['missao-secreta',...SEASON_CATALOG.map(m=>m.id)]);
export function parseExtras(value:unknown):Extras{
 const s=value as Partial<Extras>|null;
 if(!s||typeof s!=='object')return EMPTY_EXTRAS;
 return {teamName:typeof s.teamName==='string'?s.teamName.trim().slice(0,40)||EMPTY_EXTRAS.teamName:EMPTY_EXTRAS.teamName,emblem:EMBLEMS.some(e=>e===s.emblem)?s.emblem!:'Bússola',memory:typeof s.memory==='string'?s.memory.slice(0,400):'',stamps:Array.isArray(s.stamps)?s.stamps.filter((x):x is Stamp=>!!x&&ids.has(x.missionId)&&typeof x.teamKey==='string'&&x.teamKey.length<200&&typeof x.names==='string'&&x.names.length<=100&&typeof x.date==='string'&&Number.isFinite(Date.parse(x.date))).slice(-100):[]};
}
export function readExtras(){try{return parseExtras(JSON.parse(localStorage.getItem(EXTRAS_KEY)||'null'));}catch{return EMPTY_EXTRAS;}}
export function writeExtras(extras:Extras){localStorage.setItem(EXTRAS_KEY,JSON.stringify(parseExtras(extras)));window.dispatchEvent(new Event('clube:extras'));}
export function recordStamp(stamp:Stamp){const extras=readExtras();if(!extras.stamps.some(s=>s.missionId===stamp.missionId&&s.teamKey===stamp.teamKey))writeExtras({...extras,stamps:[...extras.stamps,stamp]});}
export type SeasonProgress={step:number;ready:boolean;checks?:boolean[]};
export function parseSeasonProgress(raw:string):SeasonProgress|null{try{const r=JSON.parse(raw);if(!r||!Number.isInteger(r.step)||r.step<0||r.step>6||typeof r.ready!=='boolean')return null;return {step:r.step,ready:r.ready,checks:Array.isArray(r.checks)&&r.checks.length===3&&r.checks.every((x:unknown)=>typeof x==='boolean')?r.checks:[false,false,false]};}catch{return null;}}
export function validateBackup(raw:string):{state:ClubState;extras:Extras;season:Record<string,SeasonProgress>}{
 if(raw.length>1_000_000)throw new Error('Arquivo muito grande.');
 const b=JSON.parse(raw);if(b?.format!=='clube-backup-v1'||b.state?.version!==1||!Array.isArray(b.state.profiles)||!b.state.profiles.length)throw new Error('Este arquivo não é um backup válido do Clube.');
 const state=parseState(JSON.stringify(b.state));if(!state.profiles.length)throw new Error('Os dados da equipe não são válidos.');
 const season:Record<string,SeasonProgress>={};
 if(b.season&&typeof b.season==='object')for(const [key,value] of Object.entries(b.season)){
  if(!SEASON_CATALOG.some(m=>key.startsWith('clube-season:v1:'+m.id+':'))||key.length>250)continue;
  const progress=parseSeasonProgress(JSON.stringify(value));if(progress)season[key]=progress;
 }
 return {state,extras:parseExtras(b.extras),season};
}
export function createBackup(state:ClubState){const season:Record<string,SeasonProgress>={};for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i)!;if(key.startsWith('clube-season:v1:')){const p=parseSeasonProgress(localStorage.getItem(key)||'');if(p)season[key]=p;}}return JSON.stringify({format:'clube-backup-v1',savedAt:new Date().toISOString(),state,extras:readExtras(),season},null,2);}
export function downloadText(name:string,text:string,type='application/json'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
export function restoreBackup(data:ReturnType<typeof validateBackup>){
 // Keep a recoverable snapshot before replacing progress. Purchase sessions are never imported.
 const old=localStorage.getItem(STORAGE_KEY);if(old)localStorage.setItem('clube:before-restore',old);
 localStorage.setItem(STORAGE_KEY,JSON.stringify(data.state));writeExtras(data.extras);
 for(const [key,value] of Object.entries(data.season))localStorage.setItem(key,JSON.stringify(value));
}
