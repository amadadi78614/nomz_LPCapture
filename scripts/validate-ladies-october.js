import assert from 'node:assert/strict';
import '../src/data/ladiesSeason2Matchweek3Update';
import { LADIES_S2_ROUND4_RESULTS } from '../src/data/ladiesSeason2Matchweek4Update';
import '../src/data/ladiesSeason2Matchweek5Update';
import '../src/data/ladiesSeason2Matchweek5FinalUpdate';
import { LADIES_S2_TEAMS } from '../src/data/ladiesSeason2Data';
import { LADIES_S2_STANDINGS, LADIES_S2_RANKINGS } from '../src/data/ladiesSeason2Round1Update';
import { LADIES_S2_OCTOBER_RESULTS } from '../src/data/ladiesSeason2OctoberResults';
const corrected = LADIES_S2_ROUND4_RESULTS.find(m => m.id === 'ladies-s2-2026-09-09-lunar-phoenix');
assert.equal(corrected.awayPoints, 9, '9 September organiser correction awards Flames nine points');
assert.equal(corrected.rubbers.reduce((sum,r)=>sum+r.awayPoints,0), corrected.awayPoints);
assert.equal(LADIES_S2_STANDINGS.find(t=>t.name==='Phoenix Flames').points,38);
assert.equal(LADIES_S2_STANDINGS.find(t=>t.name==='Backhand Blossoms').points,53);
const baseline = structuredClone(LADIES_S2_TEAMS);
const standings = JSON.stringify(LADIES_S2_STANDINGS);
const { applyOctoberPlayerResults } = await import('../src/data/ladiesSeason2OctoberMvpUpdate');
assert.equal(LADIES_S2_OCTOBER_RESULTS.length, 4);
assert.equal(new Set(LADIES_S2_OCTOBER_RESULTS.map(m=>m.id)).size, 4);
let count=0;
for(const match of LADIES_S2_OCTOBER_RESULTS) {
  assert.equal(match.rubbers.length,4);
  for(const side of ['home','away']) assert.equal(match.rubbers.reduce((n,r)=>n+r[`${side}Points`],0),match[`${side}Points`]);
  for(const rubber of match.rubbers) {
    count++;
    for(const side of ['home','away']) {
      assert.equal(rubber[side].length,2);
      for(const name of rubber[side]) assert.ok(LADIES_S2_TEAMS.find(t=>t.name===match[side]).players.some(p=>p.name===name),name);
    }
  }
}
assert.equal(count,16);
for(const team of LADIES_S2_TEAMS) for(const player of team.players) {
  const before=baseline.find(t=>t.id===team.id).players.find(p=>p.id===player.id).stats;
  let appearances=0,wins=0,points=0,bonus=0,sw=0,sl=0;
  for(const m of LADIES_S2_OCTOBER_RESULTS) for(const r of m.rubbers) for(const side of ['home','away']) {
    if(m[side]!==team.name||!r[side].includes(player.name)) continue;
    appearances++; const won=r[`${side}Points`]>0; wins+=Number(won); points+=r[`${side}Points`]; bonus+=Number(r[`${side}Points`]===4);
    for(const set of r.sets) { const [h,a]=set.split('-').map(Number); if(side==='home'?h>a:a>h)sw++;else sl++; }
  }
  for(const [key,delta] of Object.entries({played:appearances,wins,losses:appearances-wins,mvp_points:points,bonus_points:bonus,sets_won:sw,sets_lost:sl})) assert.equal(player.stats[key],before[key]+delta,`${player.name}: ${key}`);
}
assert.equal(JSON.stringify(LADIES_S2_STANDINGS),standings,'Playoffs must not change regular-season standings');
const snapshot=JSON.stringify(LADIES_S2_TEAMS);
applyOctoberPlayerResults();
assert.equal(JSON.stringify(LADIES_S2_TEAMS),snapshot,'Repeated application must be idempotent');
for(const name of ['Sunel Grote','Imaan Packery','Jeanetha Boshoff','Miané Swart']) {
 const p=LADIES_S2_RANKINGS.find(p=>p.name===name);console.log(`${p.name}: ${p.played} played, ${p.wins}W ${p.losses}L, ${p.mvp_points} MVP`);
}
console.log('PASS: 4 October fixtures, 16 rubbers, all player deltas, unchanged league log, no duplicate credit.');
