import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advance, checkAnswer, newRun, parseState, runKey, STEPS, EMPTY } from '../src/lib/adventure';
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
 const profile={id:'ana',name:'Ana',avatar:'Bússola'};
 const run={...newRun(['ana']),prepared:true,step:2};
 const saved={version:1,profiles:[profile],active:'ana',runs:{ana:run}};
 assert.deepEqual(parseState(JSON.stringify(saved)),saved);
 assert.deepEqual(parseState(JSON.stringify({...saved,runs:{ana:{...run,step:70}}})).runs,{});
});
