import { LADIES_S2_RESULTS, LADIES_S2_STANDINGS, LADIES_S2_RANKINGS } from './ladiesSeason2Round1Update';
import { LADIES_S2_TEAMS } from './ladiesSeason2Data';

// Verified result supplied by league administration — 15 September 2026.
// Official standings tiebreak: PTS -> SD -> GD -> H2H.
export const LADIES_S2_ROUND5_RESULTS = [
  {id:'ladies-s2-2026-09-15-novas-arctic',date:'2026-09-15',venue:'',status:'FT',home:'Net Novas',away:'Arctic Angels',homePoints:6,awayPoints:7,rubbers:[
    {time:'18:00',home:['Mariette Venter','Larisa de Kock'],away:['Brigitte du Preez','Aldorette Van Der Mescht'],sets:['6-2','6-3','7-10'],homePoints:3,awayPoints:0},
    {time:'18:00',home:['Maxine Lambourn','Jeanine Pillay'],away:['Lana Nel','Nazrana Meer'],sets:['0-6','1-6','4-10'],homePoints:0,awayPoints:4},
    {time:'19:00',home:['Simone Maritz','Carien Vos'],away:['Storme Spearpoint','Noerien Moolla'],sets:['3-6','6-4','6-10'],homePoints:0,awayPoints:3},
    {time:'19:00',home:['Emily Anders','Elsa Fryer'],away:['Michelle Wagner','Mieke Swart'],sets:['6-1','4-6','10-7'],homePoints:3,awayPoints:0}
  ]}
];

const teamByName=Object.fromEntries(LADIES_S2_TEAMS.map(t=>[t.name,t]));
const playerByName=Object.fromEntries(LADIES_S2_TEAMS.flatMap(t=>t.players.map(p=>[p.name,p])));
const scoreParts=s=>String(s||'').split('-').map(Number);

for(const match of LADIES_S2_ROUND5_RESULTS){
  LADIES_S2_RESULTS.push(match);
  const home=teamByName[match.home],away=teamByName[match.away];
  home.stats.points+=match.homePoints;away.stats.points+=match.awayPoints;
  home.stats.pointsFor+=match.homePoints;home.stats.pointsAgainst+=match.awayPoints;
  away.stats.pointsFor+=match.awayPoints;away.stats.pointsAgainst+=match.homePoints;
  home.stats.differential=home.stats.pointsFor-home.stats.pointsAgainst;away.stats.differential=away.stats.pointsFor-away.stats.pointsAgainst;
  home.stats.played++;away.stats.played++;away.stats.wins++;home.stats.losses++;
  for(const r of match.rubbers){
    const hw=r.homePoints>r.awayPoints,winners=hw?r.home:r.away,losers=hw?r.away:r.home,wp=hw?r.homePoints:r.awayPoints;
    [...r.home,...r.away].forEach(n=>{const p=playerByName[n];if(p)p.stats.played++;});
    winners.forEach(n=>{const p=playerByName[n];if(p){p.stats.wins++;p.stats.rubbers_won++;p.stats.mvp_points+=3+(wp===4?1:0);if(wp===4)p.stats.bonus_points++;}});
    losers.forEach(n=>{const p=playerByName[n];if(p)p.stats.losses++;});
    for(const score of r.sets){const[h,a]=scoreParts(score);if(!Number.isFinite(h)||!Number.isFinite(a)||h===a)continue;if(h>a){home.stats.setsWon++;away.stats.setsLost++;r.home.forEach(n=>{const p=playerByName[n];if(p)p.stats.sets_won++;});r.away.forEach(n=>{const p=playerByName[n];if(p)p.stats.sets_lost++;});}else{away.stats.setsWon++;home.stats.setsLost++;r.away.forEach(n=>{const p=playerByName[n];if(p)p.stats.sets_won++;});r.home.forEach(n=>{const p=playerByName[n];if(p)p.stats.sets_lost++;});}}
  }
}
LADIES_S2_TEAMS.forEach(t=>{t.stats.setDifferential=t.stats.setsWon-t.stats.setsLost;});
// Official order: points, set difference, point/game difference. H2H is only required if still tied.
LADIES_S2_STANDINGS.splice(0,LADIES_S2_STANDINGS.length,...LADIES_S2_TEAMS.map(t=>({...t.stats,id:t.id,name:t.name,logo:t.logo})).sort((a,b)=>b.points-a.points||b.setDifferential-a.setDifferential||b.differential-a.differential||a.name.localeCompare(b.name)));
const ranked=LADIES_S2_TEAMS.flatMap(t=>t.players.map(p=>({...p.stats,id:p.id,name:p.name,team:t.name,logo:t.logo}))).filter(p=>p.played>0).sort((a,b)=>b.mvp_points-a.mvp_points||b.wins-a.wins||b.sets_won-a.sets_won||a.name.localeCompare(b.name));
LADIES_S2_RANKINGS.splice(0,LADIES_S2_RANKINGS.length,...ranked);

function block(){return `<section data-ladies-mw5 class="card" style="padding:18px;margin:18px 0;border:1px solid rgba(236,72,153,.55)"><span class="eyebrow">LADIES FRANCHISE LEAGUE · 15 SEPTEMBER 2026</span><h2 class="display" style="margin:5px 0 10px">ANGELS EDGE NOVAS IN 7–6 THRILLER</h2><div class="grid cols-2"><div><b>Net Novas 6–7 Arctic Angels</b><div class="muted">The teams split the four rubbers, but Arctic's 4-point win from Lana/Nazrana proves decisive.</div></div><div><b>Rubber winners</b><div class="muted">Novas: Mariette/Larisa, Emily/Elsa · Angels: Lana/Nazrana, Storme/Noerien.</div></div></div></section>`;}
function sync(){if(location.pathname!=='/'&&location.pathname!=='/leagues')return;if(document.querySelector('[data-ladies-mw5]'))return;const root=document.querySelector(location.pathname==='/'?'.hv3':'.page');if(!root)return;const target=root.querySelector('[data-ladies-mw4]')||root.querySelector('[data-ladies-mw3]')||root.firstElementChild;target?.insertAdjacentHTML('afterend',block());}
if(typeof window!=='undefined'){window.addEventListener('load',sync);new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.documentElement,{childList:true,subtree:true});}
