import { LADIES_S2_TEAMS } from './ladiesSeason2Data';

// Ladies Franchise League Season 2 — Matchweek 1 results received 19 August 2026.
// MVP scoring follows the site-wide rule: 3 points per rubber win + 1 bonus for a clean 4–0.
// IMPORTANT: both partners in a rubber always receive identical MVP scoring.
export const LADIES_S2_ROUND1_RESULTS = [
  { id:'ladies-s2-2026-08-19-phoenix-arctic',date:'2026-08-19',venue:'Play 360',status:'FT',home:'Phoenix Flames',away:'Arctic Angels',homePoints:8,awayPoints:7,rubbers:[
    {home:['Martinette Meyer','Samantha de Araujo'],away:['Mieke Swart','Deeja Badat'],sets:['6-4','6-2','10-4'],homePoints:4,awayPoints:0},
    {home:['Marz Asvat','Maryke Botha'],away:['Brigitte du Preez','Aldorette Van Der Mescht'],sets:['3-6','3-6','3-10'],homePoints:0,awayPoints:4},
    {home:['Helene Van der Merwe','Anneri Duvenage'],away:['Nazrana Meer','Zantelle Hopkins'],sets:['6-1','6-2','10-8'],homePoints:4,awayPoints:0},
  ]},
  { id:'ladies-s2-2026-08-19-blossoms-novas',date:'2026-08-19',venue:'Padel 24',status:'FT',home:'Backhand Blossoms',away:'Net Novas',homePoints:8,awayPoints:7,rubbers:[
    {home:['Amor Caromba','Diyaana Nomani'],away:['Maxine Lambourn','Mufeedah Hoosen'],sets:['1-6','4-6','10-6'],homePoints:0,awayPoints:3},
    {home:['Sunel Grote','Imaan Packery'],away:['Simone Maritz','Carien Vos'],sets:['6-2','6-4','10-5'],homePoints:4,awayPoints:0},
    {home:['Rinie De Klerk','Jana Kotze'],away:['Emily Anders','Mariette Venter'],sets:['4-6','3-6','6-10'],homePoints:0,awayPoints:4},
    {home:['Nasreen Methar','Zahra Jogi'],away:['Imaan Shaik','Larisa de Kock'],sets:['6-3','6-0','10-5'],homePoints:4,awayPoints:0},
  ]},
  { id:'ladies-s2-2026-08-19-lunar-desert',date:'2026-08-19',venue:'Padel 24',status:'LIVE / PARTIAL',home:'Lunar Lillies',away:'Desert Roses',homePoints:3,awayPoints:4,rubbers:[
    {home:['Bianca Renell Morgan','Lizle Tilburn'],away:['Aletia Van Rooyen','Annali Hugo'],sets:['1-6','1-6','4-10'],homePoints:0,awayPoints:4},
    {home:['Stephanie Steenekamp','Dalene Minnaar'],away:['Icem Wilken','Tasneem Sheikh'],sets:['6-2','6-3','12-14'],homePoints:3,awayPoints:0},
  ]},
];

const teamByName=Object.fromEntries(LADIES_S2_TEAMS.map(t=>[t.name,t]));
const playerByName=Object.fromEntries(LADIES_S2_TEAMS.flatMap(t=>t.players.map(p=>[p.name,p])));
LADIES_S2_TEAMS.forEach(t=>{t.stats={played:0,wins:0,losses:0,points:0,pointsFor:0,pointsAgainst:0,differential:0,status:'Awaiting result'};t.players.forEach(p=>Object.assign(p.stats,{played:0,wins:0,losses:0,rubbers_won:0,bonus_points:0,mvp_points:0}));});

LADIES_S2_ROUND1_RESULTS.forEach(match=>{
 const home=teamByName[match.home],away=teamByName[match.away];
 if(home&&away){home.stats.points+=match.homePoints;away.stats.points+=match.awayPoints;home.stats.pointsFor+=match.homePoints;home.stats.pointsAgainst+=match.awayPoints;away.stats.pointsFor+=match.awayPoints;away.stats.pointsAgainst+=match.homePoints;home.stats.differential=home.stats.pointsFor-home.stats.pointsAgainst;away.stats.differential=away.stats.pointsFor-away.stats.pointsAgainst;home.stats.status=match.status;away.stats.status=match.status;if(match.status==='FT'){home.stats.played++;away.stats.played++;if(match.homePoints>match.awayPoints){home.stats.wins++;away.stats.losses++;}else{away.stats.wins++;home.stats.losses++;}}}
 match.rubbers.forEach(r=>{
   const homeWon=r.homePoints>r.awayPoints;
   const winners=homeWon?r.home:r.away;
   const losers=homeWon?r.away:r.home;
   // A 4-point rubber is a clean win: 3 MVP win points + 1 BP. A 3-point rubber = 3 MVP points.
   const winningRubberPoints=homeWon?r.homePoints:r.awayPoints;
   const mvpForWinner=3+(winningRubberPoints===4?1:0);
   [...r.home,...r.away].forEach(name=>{const p=playerByName[name];if(p)p.stats.played++;});
   winners.forEach(name=>{const p=playerByName[name];if(!p)return;p.stats.wins++;p.stats.rubbers_won++;p.stats.mvp_points+=mvpForWinner;if(winningRubberPoints===4)p.stats.bonus_points++;});
   losers.forEach(name=>{const p=playerByName[name];if(!p)return;p.stats.losses++;});
 });
});

export const LADIES_S2_STANDINGS=LADIES_S2_TEAMS.map(t=>({...t.stats,id:t.id,name:t.name,logo:t.logo})).sort((a,b)=>b.points-a.points||b.differential-a.differential||a.name.localeCompare(b.name));
export const LADIES_S2_RANKINGS=LADIES_S2_TEAMS.flatMap(t=>t.players.map(p=>({...p.stats,id:p.id,name:p.name,team:t.name,logo:t.logo}))).filter(p=>p.played>0).sort((a,b)=>b.mvp_points-a.mvp_points||b.wins-a.wins||a.name.localeCompare(b.name));

// Competition ranking: tied records share the same displayed rank.
export const ladiesRankNumber=(players,index)=>{if(index===0)return 1;const a=players[index],b=players[index-1];return a.mvp_points===b.mvp_points&&a.wins===b.wins?ladiesRankNumber(players,index-1):index+1;};

function renderLadiesRound1Live(){
 const root=document.querySelector('.lpv2');if(root&&!root.querySelector('[data-ladies-round1-live]')){const s=document.createElement('section');s.className='lpv2-section';s.dataset.ladiesRound1Live='true';s.innerHTML=`<div class="lpv2-section-heading"><span class="lpv2-kicker">LADIES FRANCHISE LEAGUE · MATCHWEEK 1</span><h2>Season 2 is underway</h2><p class="muted">Opening-night scores · 19 August 2026</p></div><div class="grid cols-2">${LADIES_S2_ROUND1_RESULTS.map(m=>`<div class="card" style="padding:16px"><span class="eyebrow">${m.status} · ${m.venue}</span><div class="row spread" style="margin-top:10px"><b>${m.home}</b><strong>${m.homePoints}</strong></div><div class="row spread"><b>${m.away}</b><strong>${m.awayPoints}</strong></div></div>`).join('')}</div>`;const pulse=root.querySelector('.lpv2-pulse');if(pulse?.nextSibling)root.insertBefore(s,pulse.nextSibling);else root.appendChild(s);}
 if(location.pathname==='/leagues'){const page=document.querySelector('.leagues-page');const active=page&&[...page.querySelectorAll('button')].some(b=>b.classList.contains('on')&&b.textContent.includes('Ladies Franchise League'));if(active&&!page.querySelector('[data-ladies-round1-table]')){const s=document.createElement('section');s.dataset.ladiesRound1Table='true';s.className='card';s.style.cssText='padding:18px;margin:16px 0';s.innerHTML=`<span class="eyebrow">Season 2 · Matchweek 1 live</span><h2 class="display" style="margin:5px 0 6px">Live standings</h2><p class="muted" style="margin:0 0 12px;font-size:11px">Pts = rubber points accumulated from results received.</p>${LADIES_S2_STANDINGS.map((t,i)=>`<div class="row spread" style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,.08)"><span>${i+1}. ${t.name}${t.status!=='FT'&&t.status!=='Awaiting result'?` <small class="muted">· partial</small>`:''}</span><b>${t.points} pts</b></div>`).join('')}<h3 class="display" style="margin:18px 0 4px">Player MVP rankings</h3><p class="muted" style="margin:0 0 8px;font-size:11px">3 points per rubber win + 1 bonus for a clean 4–0. Partners always receive identical points. Ties share a rank.</p>${LADIES_S2_RANKINGS.map((p,i)=>`<div class="row spread" style="padding:7px 0"><span>${ladiesRankNumber(LADIES_S2_RANKINGS,i)}. ${p.name} <small class="muted">· ${p.team}</small></span><b>${p.mvp_points} MVP pts</b></div>`).join('')}`;page.prepend(s);}}
}
if(typeof window!=='undefined'){window.addEventListener('load',renderLadiesRound1Live);new MutationObserver(()=>requestAnimationFrame(renderLadiesRound1Live)).observe(document.documentElement,{childList:true,subtree:true});}
