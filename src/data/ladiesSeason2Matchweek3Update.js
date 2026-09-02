import { LADIES_S2_RESULTS, LADIES_S2_STANDINGS, LADIES_S2_RANKINGS } from './ladiesSeason2Round1Update';
import { LADIES_S2_TEAMS } from './ladiesSeason2Data';

// Verified Matchweek 3 results supplied 2 September 2026.
export const LADIES_S2_ROUND3_RESULTS = [
  {id:'ladies-s2-2026-09-02-desert-blossoms',date:'2026-09-02',venue:'Play 360',status:'FT',home:'Desert Roses',away:'Backhand Blossoms',homePoints:0,awayPoints:14,rubbers:[
    {home:['Debbie','Icem Wilken'],away:['Jana Kotze','Dhiya Ismail'],sets:['2-6','4-6','3-10'],homePoints:0,awayPoints:4},
    {home:['Tasneem Sheikh','Anje Hope'],away:['Nasreen Methar','Zahra Jogi'],sets:['3-6','6-7','7-10'],homePoints:0,awayPoints:3},
    {home:['Annali Hugo','Fazila Hafesji'],away:['Amor Caromba','Faeeza Patel'],sets:['2-6','1-6','8-10'],homePoints:0,awayPoints:4},
    {home:['Lia Odendaal','Simone'],away:['Sunel Grote','Imaan Packery'],sets:['0-6','6-4','7-10'],homePoints:0,awayPoints:3}
  ]},
  {id:'ladies-s2-2026-09-02-lunar-arctic',date:'2026-09-02',venue:'Padel 24',status:'FT',home:'Lunar Lillies',away:'Arctic Angels',homePoints:7,awayPoints:8,rubbers:[
    {home:['Stephanie Steenekamp','Dalene Minnaar'],away:['Michelle Wagner','Deeja Badat'],sets:['6-0','6-3','4-10'],homePoints:3,awayPoints:0},
    {home:['Jeanetha Boshoff','Miané Swart'],away:['Storme Spearpoint','Noerien Moolla'],sets:['6-2','6-4','10-7'],homePoints:4,awayPoints:0},
    {home:['Firdaus Hoosen','Lizle Tilburn'],away:['Mieke Swart','Zantelle Hopkins'],sets:['3-6','3-6','8-10'],homePoints:0,awayPoints:4},
    {home:['Heleen Van Der Mescht','Mari Jaquire'],away:['Aldorette Van Der Mescht','Nazrana Meer'],sets:['3-6','3-6','8-10'],homePoints:0,awayPoints:4}
  ]},
  {id:'ladies-s2-2026-09-02-phoenix-novas',date:'2026-09-02',venue:'Padel 24',status:'FT',home:'Phoenix Flames',away:'Net Novas',homePoints:11,awayPoints:3,rubbers:[
    {home:['Helene Van der Merwe','Karlien Janse van Rensburg'],away:['Emily Anders','Mariette Venter'],sets:['6-4','6-7','10-8'],homePoints:3,awayPoints:0},
    {home:['Nasreen Omar','Tanija De Villiers'],away:['Simone Maritz','Carien Vos'],sets:['4-6','3-6','10-7'],homePoints:0,awayPoints:3},
    {home:['Martinette Meyer','Samantha de Araujo'],away:['Imaan Shaik','Larisa de Kock'],sets:['6-1','6-1','10-4'],homePoints:4,awayPoints:0},
    {home:['Gizelle Taylor','Marz Asvat'],away:['Mufeedah Hoosen','Jeanine Pillay'],sets:['6-0','6-2','10-5'],homePoints:4,awayPoints:0}
  ]}
];

const teamByName = Object.fromEntries(LADIES_S2_TEAMS.map(t => [t.name, t]));
const playerByName = Object.fromEntries(LADIES_S2_TEAMS.flatMap(t => t.players.map(p => [p.name, p])));
const aliases = {'Shelly':'Michelle Wagner'};
const scoreParts = s => String(s || '').split('-').map(Number);

for (const match of LADIES_S2_ROUND3_RESULTS) {
  LADIES_S2_RESULTS.push(match);
  const home = teamByName[match.home], away = teamByName[match.away];
  if (home && away) {
    home.stats.points += match.homePoints; away.stats.points += match.awayPoints;
    home.stats.pointsFor += match.homePoints; home.stats.pointsAgainst += match.awayPoints;
    away.stats.pointsFor += match.awayPoints; away.stats.pointsAgainst += match.homePoints;
    home.stats.differential = home.stats.pointsFor-home.stats.pointsAgainst; away.stats.differential = away.stats.pointsFor-away.stats.pointsAgainst;
    home.stats.played++; away.stats.played++;
    if(match.homePoints>match.awayPoints){home.stats.wins++;away.stats.losses++;}else{away.stats.wins++;home.stats.losses++;}
  }
  for (const r of match.rubbers) {
    const hw=r.homePoints>r.awayPoints, winners=hw?r.home:r.away, losers=hw?r.away:r.home, wp=hw?r.homePoints:r.awayPoints;
    const resolve=n=>playerByName[aliases[n]||n];
    [...r.home,...r.away].forEach(n=>{const p=resolve(n);if(p)p.stats.played++;});
    winners.forEach(n=>{const p=resolve(n);if(p){p.stats.wins++;p.stats.rubbers_won++;p.stats.mvp_points+=3+(wp===4?1:0);if(wp===4)p.stats.bonus_points++;}});
    losers.forEach(n=>{const p=resolve(n);if(p)p.stats.losses++;});
    for(const score of r.sets){const [h,a]=scoreParts(score);if(!Number.isFinite(h)||!Number.isFinite(a)||h===a)continue;if(h>a){home.stats.setsWon++;away.stats.setsLost++;r.home.forEach(n=>{const p=resolve(n);if(p)p.stats.sets_won++;});r.away.forEach(n=>{const p=resolve(n);if(p)p.stats.sets_lost++;});}else{away.stats.setsWon++;home.stats.setsLost++;r.away.forEach(n=>{const p=resolve(n);if(p)p.stats.sets_won++;});r.home.forEach(n=>{const p=resolve(n);if(p)p.stats.sets_lost++;});}}
  }
}
LADIES_S2_TEAMS.forEach(t=>{t.stats.setDifferential=t.stats.setsWon-t.stats.setsLost;});
LADIES_S2_STANDINGS.splice(0,LADIES_S2_STANDINGS.length,...LADIES_S2_TEAMS.map(t=>({...t.stats,id:t.id,name:t.name,logo:t.logo})).sort((a,b)=>b.points-a.points||b.wins-a.wins||b.differential-a.differential||b.setDifferential-a.setDifferential||a.name.localeCompare(b.name)));
const ranked=LADIES_S2_TEAMS.flatMap(t=>t.players.map(p=>({...p.stats,id:p.id,name:p.name,team:t.name,logo:t.logo}))).filter(p=>p.played>0).sort((a,b)=>b.mvp_points-a.mvp_points||b.wins-a.wins||b.sets_won-a.sets_won||a.name.localeCompare(b.name));
LADIES_S2_RANKINGS.splice(0,LADIES_S2_RANKINGS.length,...ranked);

function block(){return `<section data-ladies-mw3 class="card" style="padding:18px;margin:18px 0;border:1px solid rgba(236,72,153,.45)"><span class="eyebrow">LADIES FRANCHISE LEAGUE · MATCHWEEK 3</span><h2 class="display" style="margin:5px 0 10px">BLOSSOMS SWEEP · FLAMES FIRE · ANGELS EDGE LILLIES</h2><div class="grid cols-3"><div><b>Backhand Blossoms 14–0 Desert Roses</b><div class="muted">A perfect four-rubber sweep at Play 360.</div></div><div><b>Phoenix Flames 11–3 Net Novas</b><div class="muted">Three rubber wins power Phoenix to 11 points.</div></div><div><b>Arctic Angels 8–7 Lunar Lillies</b><div class="muted">A one-point thriller at Padel 24.</div></div></div></section>`;}
function sync(){if(location.pathname!=='/'&&location.pathname!=='/leagues')return;if(document.querySelector('[data-ladies-mw3]'))return;const root=document.querySelector(location.pathname==='/'?'.hv3':'.page');if(!root)return;const target=root.querySelector('[data-super-cup-final-block]')||root.firstElementChild;target?.insertAdjacentHTML('afterend',block());}
if(typeof window!=='undefined'){window.addEventListener('load',sync);new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.documentElement,{childList:true,subtree:true});}
