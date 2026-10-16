import test from 'node:test';
import assert from 'node:assert/strict';
import {grantsSeason,validOrderId} from '../src/server/purchase-policy';
import content from '../src/server/season-content.json';
test('only the matching paid upsell grants access; pending, refunds and other products never grant it',()=>{
 const paid={status:'paid',product:{id:'season'},customer:{email:'diego@example.com'}};
 assert.ok(grantsSeason(paid,'season',' Diego@example.com '));
 for(const status of ['waiting_payment','authorized','processing','refunded','chargedback','partially_paid'])assert.equal(grantsSeason({...paid,status},'season','diego@example.com'),false);
 assert.equal(grantsSeason(paid,'main','diego@example.com'),false);assert.equal(grantsSeason(paid,'season','other@example.com'),false);assert.equal(grantsSeason(paid,'','diego@example.com'),false);
 assert.equal(grantsSeason({...paid,refundedAt:'2026-01-01'},'season'),false);
 assert.equal(validOrderId('../../orders'),false);
});
test('five complete adventures have six physical clue codes, resolvable choices and a three digit ending',()=>{
 assert.equal(Object.keys(content).length,5);
 for(const mission of Object.values(content)){assert.equal(mission.steps.length,6);assert.equal(new Set(mission.steps.map(s=>s.token)).size,6);for(const step of mission.steps){assert.ok(step.print.length>35);assert.ok(step.hint);if(step.options.length)assert.ok(step.options.includes(step.answer));}assert.match(mission.steps[5].answer,/^\d{3}$/);}
});
