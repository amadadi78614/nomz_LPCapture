#!/usr/bin/env node
// LP DATA VALIDATION SCRIPT — run: node scripts/validate-data.js
import { pathToFileURL } from 'url';
globalThis.console = console;
let errors = 0; let warnings = 0;
const err = (m) => { console.error('[ERROR] ' + m); errors++; };
const warn = (m) => { console.warn('[WARN]  ' + m); warnings++; };
const ok = (m) => console.log('[OK]    ' + m);
const seed = await import(pathToFileURL('./src/data/seed.js').href);
const { FIXTURES, PLAYERS, FRANCHISES, STANDINGS, NEWS, playerOfWeek } = seed;
const playerMap = new Map(PLAYERS.map(p => [p.id, p]));
const globo = FRANCHISES.find(f => f.id === 'globo-boomerangs');
if (!globo || globo.name !== 'Globo Boomerangs') err('Franchise name wrong: ' + (globo?.name || 'not found'));
else ok('Globo Boomerangs name OK');
ok(PLAYERS.length + ' players loaded');
for (const f of FIXTURES.filter(f => f.league === 'mens' && f.status === 'final' && f.score?.rubbers)) {
  const r = f.score.rubbers;
  if (r.length !== 6) { err(f.id + ': ' + r.length + ' rubbers (need 6)'); continue; }
  const courts = { P1: 0, P2: 0, P3: 0 };
  for (const rb of r) {
    if (!rb.court) err(f.id + ': rubber missing court field (use court not tier)');
    else if (courts[rb.court] !== undefined) courts[rb.court]++;
    if (rb.games && rb.winner) {
      if (rb.winner === 'home' && rb.games[0] <= rb.games[1]) err(f.id + ' ' + rb.court + ': winner=home but games contradict');
      if (rb.winner === 'away' && rb.games[1] <= rb.games[0]) err(f.id + ' ' + rb.court + ': winner=away but games contradict');
    }
    for (const pid of [...(rb.homeIds||[]), ...(rb.awayIds||[])]) {
      if (!pid) err(f.id + ' ' + rb.court + ': null playerID');
      else if (!playerMap.has(pid)) err(f.id + ': unknown ID ' + pid);
    }
    for (const pid of (rb.homeIds||[])) { const p = playerMap.get(pid); if (p && p.franchise_id !== f.home) err(f.id + ': ' + p.name + ' in wrong franchise'); }
    for (const pid of (rb.awayIds||[])) { const p = playerMap.get(pid); if (p && p.franchise_id !== f.away) err(f.id + ': ' + p.name + ' in wrong franchise'); }
  }
  if (courts.P1 !== 2 || courts.P2 !== 2 || courts.P3 !== 2) err(f.id + ': courts P1=' + courts.P1 + ' P2=' + courts.P2 + ' P3=' + courts.P3 + ' (need 2 each)');
  if (f.score.totals) {
    let h = 0, a = 0;
    for (const rb of r) { if (rb.games) { h += rb.games[0]; a += rb.games[1]; } }
    if (h !== f.score.totals[0] || a !== f.score.totals[1]) err(f.id + ': totals mismatch [' + h + ',' + a + '] vs ' + JSON.stringify(f.score.totals));
  }
  ok(f.id + ' OK');
}
const sFr = STANDINGS?.mens?.franchise;
if (!sFr?.length) err('STANDINGS.mens.franchise empty');
else ok('Standings: ' + sFr.length + ' teams, leader: ' + sFr[0].franchise_id + ' ' + sFr[0].points + ' pts');
if (!playerOfWeek?.current) warn('playerOfWeek.current is null');
else { const p = playerMap.get(playerOfWeek.current); if (!p) err('POTW ID not found: ' + playerOfWeek.current); else ok('POTW: ' + p.name); }
const nd = NEWS.map(n => n.date); const sorted = [...nd].sort((a,b) => b.localeCompare(a));
if (nd.join(',') !== sorted.join(',')) warn('NEWS not sorted newest-first'); else ok('NEWS sorted OK');
console.log('\n' + '='.repeat(40));
console.log('Errors: ' + errors + '  Warnings: ' + warnings);
if (errors) { console.error('FAILED'); process.exit(1); } else { console.log('PASSED'); }
