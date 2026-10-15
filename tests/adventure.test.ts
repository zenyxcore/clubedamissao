import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AVATARS } from '../src/lib/avatars';
import { advance, checkAnswer, newRun, parseState, runKey, saveProfiles, STEPS, EMPTY } from '../src/lib/adventure';
test('a real expedition requires preparation, the matching physical clue and the correct answer in order',()=>{
 let run=newRun(['ana']);
 assert.equal(advance(run,0,'SOL','Uma bússola'),run);
 run={...run,prepared:true};
 assert.equal(advance(run,1,'LUA','Triângulo'),run);
 assert.equal(advance(run,0,'LUA','Uma bússola'),run);
 assert.equal(advance(run,0,'SOL','Uma chave'),run);
 for(let i=0;i<STEPS.length;i++){run=advance(run,i,STEPS[i].token,STEPS[i].answer);assert.equal(run.step,i+1);}
 assert.ok(run.completedAt);
 assert.equal(advance(run,6,'OURO','427'),run);
});
test('answers accept accents, casing and whitespace without accepting wrong codes',()=>{
 assert.equal(checkAnswer(0,' uma bussola '),true);assert.equal(checkAnswer(1,'triangulo'),true);assert.equal(checkAnswer(4,'baú'),true);assert.equal(checkAnswer(3,'semente  broto arvore'),true);assert.equal(checkAnswer(5,'472'),false);assert.equal(checkAnswer(-1,'427'),false);
});
test('team keys are stable and progress stays independent for solo players',()=>{
 assert.equal(runKey(['b','a']),runKey(['a','b']));assert.notEqual(runKey(['a']),runKey(['a','b']));assert.equal(runKey(['a','a']),runKey(['a']));
});
test('local storage recovers safely from malformed data',()=>{
 for(const input of [null,'{','null','{"version":2}',JSON.stringify({...EMPTY,profiles:[{id:'x',name:1,avatar:'Bússola'}]})]) assert.deepEqual(parseState(input),EMPTY);
 const profile={id:'ana',name:'Ana',avatar:'explorador-01'};
 const run={...newRun(['ana']),prepared:true,step:2};
 const saved={version:1,profiles:[profile],active:'ana',runs:{ana:run}};
 assert.deepEqual(parseState(JSON.stringify(saved)),saved);
 assert.deepEqual(parseState(JSON.stringify({...saved,runs:{ana:{...run,step:70}}})).runs,{});
});

test('legacy symbol avatars migrate to characters without resetting names or expedition progress',()=>{
 const run={...newRun(['ana']),prepared:true,step:4};
 const stored={version:1,profiles:[{id:'ana',name:'Ana',avatar:'Bússola'}],active:'ana',runs:{ana:run}};
 const migrated=parseState(JSON.stringify(stored));
 assert.equal(migrated.profiles[0].avatar,'explorador-01');assert.equal(migrated.profiles[0].name,'Ana');assert.deepEqual(migrated.runs.ana,run);assert.equal(migrated.active,'ana');
});
test('removing a profile removes its teams but preserves unrelated profiles and expeditions',()=>{
 const ana={id:'ana',name:'Ana',avatar:'explorador-01' as const};
 const leo={id:'leo',name:'Léo',avatar:'explorador-02' as const};
 const state={version:1 as const,profiles:[ana,leo],active:'ana:leo',runs:{ana:{...newRun(['ana']),step:2},leo:{...newRun(['leo']),step:3},'ana:leo':{...newRun(['ana','leo']),step:5}}};
 const next=saveProfiles(state,[leo]);
 assert.deepEqual(next.profiles,[leo]);assert.equal(next.active,'');assert.deepEqual(Object.keys(next.runs),['leo']);assert.equal(next.runs.leo.step,3);
 assert.equal(state.runs.ana.step,2);
 const allRemoved=saveProfiles(state,[]);assert.equal(allRemoved.profiles.length,0);assert.deepEqual(allRemoved.runs,{});assert.equal(allRemoved.active,'');
 assert.deepEqual(parseState(JSON.stringify(allRemoved)),allRemoved);
});
test('editing a name or portrait preserves all mission progress and active team',()=>{
 const profile={id:'ana',name:'Ana',avatar:'explorador-01' as const};
 const state={version:1 as const,profiles:[profile],active:'ana',runs:{ana:{...newRun(['ana']),step:4}}};
 const next=saveProfiles(state,[{...profile,name:'Aninha',avatar:'explorador-10'}]);
 assert.equal(next.profiles[0].name,'Aninha');assert.equal(next.profiles[0].avatar,'explorador-10');assert.deepEqual(next.runs,state.runs);assert.equal(next.active,'ana');
});

test('invalid avatar IDs and duplicate profile IDs are rejected safely',()=>{
 const profile={id:'ana',name:'Ana',avatar:'__proto__'};
 assert.deepEqual(parseState(JSON.stringify({version:1,profiles:[profile],active:'',runs:{}})),EMPTY);
 const valid={...profile,avatar:'explorador-01'};
 assert.deepEqual(parseState(JSON.stringify({version:1,profiles:[valid,valid],active:'',runs:{}})),EMPTY);
});

test('all ten selectable avatars have a unique ID and a real WebP asset',()=>{
 assert.equal(AVATARS.length,10);assert.equal(new Set(AVATARS.map(a=>a.id)).size,10);
 for(const avatar of AVATARS){
  const bytes=readFileSync(join(process.cwd(),'public',avatar.image));
  assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WEBP');assert.ok(bytes.length>1000);
 }
});
