import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBackup, parseExtras, parseSeasonProgress, EMPTY_EXTRAS } from '../src/lib/club-extras';
import { newRun } from '../src/lib/adventure';
const state={version:1,profiles:[{id:'ana',name:'Ana',avatar:'explorador-01'}],active:'ana',runs:{ana:{...newRun(['ana']),step:3}}};
test('backup preserves existing main progress and validated extra adventures, excluding credentials',()=>{
 const data=validateBackup(JSON.stringify({format:'clube-backup-v1',state,extras:{teamName:'Equipe Solar',stamps:[{missionId:'missao-secreta',teamKey:'ana',names:'Ana',date:'2026-10-17'}]},season:{'clube-season:v1:codigo-espacial:ana':{step:4,ready:true},'clube-season:v1:invalid:ana':{step:6,ready:true},'clube-season':'fake-purchase-cookie'}}));
 assert.equal(data.state.runs.ana.step,3);assert.equal(data.extras.stamps.length,1);assert.equal(data.extras.teamName,'Equipe Solar');assert.deepEqual(Object.keys(data.season),['clube-season:v1:codigo-espacial:ana']);
});
test('malformed backups are rejected rather than silently erasing the current team',()=>{
 for(const b of [{},{format:'clube-backup-v1',state:{...state,profiles:[]}},{format:'clube-backup-v1',state:{...state,profiles:[{id:'ana',name:'Ana',avatar:'bogus'}]}}])assert.throws(()=>validateBackup(JSON.stringify(b)));
 assert.throws(()=>validateBackup('a'.repeat(1_000_001)));
});
test('only real catalog missions and valid completion dates become passport stamps',()=>{
 const e=parseExtras({teamName:'  Sol  ',emblem:'bad',stamps:[{missionId:'fake',teamKey:'a',names:'Ana',date:'2026-10-17'},{missionId:'missao-secreta',teamKey:'a',names:'Ana',date:'not-a-date'}]});
 assert.equal(e.teamName,'Sol');assert.equal(e.emblem,'Bússola');assert.equal(e.stamps.length,0);assert.deepEqual(parseExtras(null),EMPTY_EXTRAS);
});
test('season progress supports legacy saves and persisted preparation checklists',()=>{
 assert.deepEqual(parseSeasonProgress('{"step":2,"ready":true}'),{step:2,ready:true,checks:[false,false,false]});
 assert.equal(parseSeasonProgress('{"step":7,"ready":true}'),null);
 assert.deepEqual(parseSeasonProgress('{"step":0,"ready":false,"checks":[true,false,true]}')?.checks,[true,false,true]);
});
