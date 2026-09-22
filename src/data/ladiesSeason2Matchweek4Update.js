import { LADIES_S2_RESULTS, LADIES_S2_STANDINGS, LADIES_S2_RANKINGS } from './ladiesSeason2Round1Update';
import { LADIES_S2_TEAMS } from './ladiesSeason2Data';

// Complete Matchweek 4 results supplied by league administration — 9 September 2026.
export const LADIES_S2_ROUND4_RESULTS = [
  {id:'ladies-s2-2026-09-09-arctic-blossoms',date:'2026-09-09',venue:'',status:'FT',home:'Arctic Angels',away:'Backhand Blossoms',homePoints:4,awayPoints:12,rubbers:[
    {time:'17:30',home:['Storme Spearpoint','Noerien Moolla'],away:['Sunel Grote','Imaan Packery'],sets:['0-6','6-7','6-10'],homePoints:0,awayPoints:4},
    {time:'18:30',home:['Zantelle Hopkins','Brigitte du Preez'],away:['Nasreen Methar','Zahra Jogi'],sets:['2-6','5-7','5-10'],homePoints:0,awayPoints:4},
    {time:'18:30',home:['Lana Nel','Nazrana Meer'],away:['Faeeza Patel','Diyaana Nomani'],sets:['7-5','6-4','10-4'],homePoints:4,awayPoints:0},
    {time:'19:30',home:['Deeja Badat','Mieke Swart'],away:['Rinie De Klerk','Dhiya Ismail'],sets:['3-6','1-6','7-10'],homePoints:0,awayPoints:4}
  ]},
  {id:'ladies-s2-2026-09-09-novas-desert',date:'2026-09-09',venue:'Padel 24',status:'FT',home:'Net Novas',away:'Desert Roses',homePoints:15,awayPoints:0,rubbers:[
    {time:'17:30',home:['Simone Maritz','Carien Vos'],away:['Simoné','Michelle Human'],sets:['6-3','2-6','10-7'],homePoints:3,awayPoints:0},
    {time:'17:30',home:['Mariette Venter','Imaan Shaik'],away:['Aletia Van Rooyen','Anje Hope'],sets:['6-3','6-1','11-9'],homePoints:4,awayPoints:0},
    {time:'18:30',home:['Emily Anders','Elsa Fryer'],away:['Debbie','Tasneem Sheikh'],sets:['7-5','6-1','10-5'],homePoints:4,awayPoints:0},
    {time:'19:30',home:['Maxine Lambourn','Mufeedah Hoosen'],away:['Annali Hugo','Fazila Hafesji'],sets:['6-2','6-2','10-6'],homePoints:4,awayPoints:0}
  ]},
  {id:'ladies-s2-2026-09-09-lunar-phoenix',date:'2026-09-09',venue:'Play 360',status:'FT',home:'Lunar Lillies',away:'Phoenix Flames',homePoints:4,awayPoints:10,rubbers:[
    {time:'18:00',home:['Dirkie Coomans','Stephanie Steenekamp'],away:['Karlien Janse van Rensburg','Helene Van der Merwe'],sets:['2-6','7-5','12-14'],homePoints:0,awayPoints:3},
    {time:'18:00',home:['Bianca Renell Morgan','Heleen Van Der Mescht'],away:['Gizelle Taylor','Maryke Botha'],sets:['7-6','1-6','10-12'],homePoints:0,awayPoints:3},
    {time:'19:00',home:['Jeanetha Boshoff','Miané Swart'],away:['Nasreen Omar','Tanija De Villiers'],sets:['6-2','6-0','10-7'],homePoints:4,awayPoints:0},
    {time:'19:00',home:['Dalene Minnaar','Firdaus Hoosen'],away:['Samantha de Araujo','Anneri Duvenage'],sets:['6-7','2-6','6-10'],homePoints:0,awayPoints:4}
  ]}
];

const teamByName=Object.fromEntries(LADIES_S2_TEAMS.map(t=>[t.name,t]));
const playerByName=Object.fromEntries(LADIES_S2_TEAMS.flatMap(t=>t.players.map(p=>[p.name,p])));
const aliases={'Storm':'Storme Spearpoint','Mufeeda':'Mufeedah Hoosen','Mariëtte':'Mariette Venter','Sammy':'Samantha de Araujo'};
const scoreParts=s=>String(s||'').split('-').map(Number);
const guestStats={};
const blank=()=>({played:0,wins:0,losses:0,rubbers_won:0,bonus_points:0,mvp_points:0,sets_won:0,sets_lost:0});
const resolve=(name,team)=>{const n=aliases[name]||name;if(playerByName[n])return playerByName[n];if(!guestStats[n])guestStats[n]={id:`ladies-s2-guest-${n.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,name:n,team,stats:blank()};return guestStats[n];};

for(const match of LADIES_S2_ROUND4_RESULTS){
  LADIES_S2_RESULTS.push(match);
  const home=teamByName[match.home],away=teamByName[match.away];
  if(home&&away){home.stats.points+=match.homePoints;away.stats.points+=match.awayPoints;home.stats.pointsFor+=match.homePoints;home.stats.pointsAgainst+=match.awayPoints;away.stats.pointsFor+=match.awayPoints;away.stats.pointsAgainst+=match.homePoints;home.stats.differential=home.stats.pointsFor-home.stats.pointsAgainst;away.stats.differential=away.stats.pointsFor-away.stats.pointsAgainst;home.stats.played++;away.stats.played++;if(match.homePoints>match.awayPoints){home.stats.wins++;away.stats.losses++;}else if(match.awayPoints>match.homePoints){away.stats.wins++;home.stats.losses++;}}
  for(const r of match.rubbers){const hw=r.homePoints>r.awayPoints,winners=hw?r.home:r.away,losers=hw?r.away:r.home,wp=hw?r.homePoints:r.awayPoints;[...r.home,...r.away].forEach(n=>resolve(n,r.home.includes(n)?match.home:match.away).stats.played++);winners.forEach(n=>{const p=resolve(n,hw?match.home:match.away);p.stats.wins++;p.stats.rubbers_won++;p.stats.mvp_points+=3+(wp===4?1:0);if(wp===4)p.stats.bonus_points++;});losers.forEach(n=>resolve(n,hw?match.away:match.home).stats.losses++);for(const score of r.sets){const[h,a]=scoreParts(score);if(!Number.isFinite(h)||!Number.isFinite(a)||h===a)continue;if(h>a){home.stats.setsWon++;away.stats.setsLost++;r.home.forEach(n=>resolve(n,match.home).stats.sets_won++);r.away.forEach(n=>resolve(n,match.away).stats.sets_lost++);}else{away.stats.setsWon++;home.stats.setsLost++;r.away.forEach(n=>resolve(n,match.away).stats.sets_won++);r.home.forEach(n=>resolve(n,match.home).stats.sets_lost++);}}}
}
LADIES_S2_TEAMS.forEach(t=>{t.stats.setDifferential=t.stats.setsWon-t.stats.setsLost;});
LADIES_S2_STANDINGS.splice(0,LADIES_S2_STANDINGS.length,...LADIES_S2_TEAMS.map(t=>({...t.stats,id:t.id,name:t.name,logo:t.logo})).sort((a,b)=>b.points-a.points||b.wins-a.wins||b.differential-a.differential||b.setDifferential-a.setDifferential||a.name.localeCompare(b.name)));
const ranked=[...LADIES_S2_TEAMS.flatMap(t=>t.players.map(p=>({...p.stats,id:p.id,name:p.name,team:t.name,logo:t.logo}))),...Object.values(guestStats).map(p=>({...p.stats,id:p.id,name:p.name,team:p.team,logo:teamByName[p.team]?.logo||''}))].filter(p=>p.played>0).sort((a,b)=>b.mvp_points-a.mvp_points||b.wins-a.wins||b.sets_won-a.sets_won||a.name.localeCompare(b.name));
LADIES_S2_RANKINGS.splice(0,LADIES_S2_RANKINGS.length,...ranked);

function block(){return `<section data-ladies-mw4 class="card" style="padding:18px;margin:18px 0;border:1px solid rgba(236,72,153,.5)"><span class="eyebrow">LADIES FRANCHISE LEAGUE · MATCHWEEK 4 · 9 SEPTEMBER</span><h2 class="display" style="margin:5px 0 10px">BLOSSOMS STRIKE · NOVAS SWEEP · FLAMES WIN</h2><div class="grid cols-3"><div><b>Arctic Angels 4–12 Backhand Blossoms</b><div class="muted">Blossoms take three of four rubbers.</div></div><div><b>Net Novas 15–0 Desert Roses</b><div class="muted">A complete four-rubber sweep at Padel 24.</div></div><div><b>Lunar Lillies 4–10 Phoenix Flames</b><div class="muted">Phoenix take three rubbers at Play 360.</div></div></div></section>`;}
function sync(){if(location.pathname!=='/leagues')return;if(document.querySelector('[data-ladies-mw4]'))return;const root=document.querySelector('.page');if(!root)return;const target=root.querySelector('[data-ladies-mw3]')||root.querySelector('[data-super-cup-final-block]')||root.firstElementChild;target?.insertAdjacentHTML('afterend',block());}
if(typeof window!=='undefined'){window.addEventListener('load',sync);new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.documentElement,{childList:true,subtree:true});}
