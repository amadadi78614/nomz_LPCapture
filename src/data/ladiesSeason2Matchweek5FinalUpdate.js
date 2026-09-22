import { LADIES_S2_RESULTS, LADIES_S2_STANDINGS, LADIES_S2_RANKINGS } from './ladiesSeason2Round1Update';
import { LADIES_S2_TEAMS } from './ladiesSeason2Data';

// Verified Matchweek 5 results supplied by league administration — 16 September 2026.
// These two fixtures complete Matchweek 5. Net Novas 6–7 Arctic Angels (15 Sep)
// is applied by ladiesSeason2Matchweek5Update before this module runs.
// Official standings tiebreak: PTS -> SD -> GD -> H2H.
export const LADIES_S2_ROUND5_FINAL_RESULTS = [
  {
    id:'ladies-s2-2026-09-16-lunar-blossoms',date:'2026-09-16',venue:'Padel 24',status:'FT',
    home:'Lunar Lillies',away:'Backhand Blossoms',homePoints:11,awayPoints:4,
    rubbers:[
      {time:'17:30',home:['Bianca Renell Morgan','Mari Jaquire'],away:['Faeeza Patel','Diyaana Nomani'],sets:[],homePoints:0,awayPoints:4},
      {time:'18:30',home:['Jeanetha Boshoff','Miané Swart'],away:['Imaan Packery','Rinie De Klerk'],sets:[],homePoints:4,awayPoints:0},
      {time:'18:30',home:['Firdaus Hoosen','Dalene Minnaar'],away:['Nasreen Methar','Amor Caromba'],sets:[],homePoints:4,awayPoints:0},
      {time:'19:30',home:['Dirkie Coomans','Stephanie Steenekamp'],away:['Jana Kotze','Dhiya Ismail'],sets:[],homePoints:3,awayPoints:0}
    ]
  },
  {
    id:'ladies-s2-2026-09-16-phoenix-desert',date:'2026-09-16',venue:'',status:'FT',
    home:'Phoenix Flames',away:'Desert Roses',homePoints:10,awayPoints:3,
    rubbers:[
      {time:'17:30',home:['Tanija De Villiers','Helene Van der Merwe'],away:['Lia Odendaal','Simone'],sets:[],homePoints:3,awayPoints:0},
      {time:'17:30',home:['Karlien Janse van Rensburg','Martinette Meyer'],away:['Debbie','Michelle Human'],sets:[],homePoints:0,awayPoints:3},
      {time:'18:30',home:['Samantha de Araujo','Anneri Duvenage'],away:['Icem Wilken','Aletia Van Rooyen'],sets:[],homePoints:4,awayPoints:0},
      {time:'19:30',home:['Maryke Botha','Marz Asvat'],away:['Annali Hugo','Fazila Hafesji'],sets:[],homePoints:3,awayPoints:0}
    ]
  }
];

const teamByName=Object.fromEntries(LADIES_S2_TEAMS.map(t=>[t.name,t]));
const playerByName=Object.fromEntries(LADIES_S2_TEAMS.flatMap(t=>t.players.map(p=>[p.name,p])));

// The Matchweek 5 posters publish rubber points rather than individual set scores.
// League scoring makes the set split deterministic: 4 pts = 3–0 sets, 3 pts = 2–1 sets.
const setSplit=(homePoints,awayPoints)=>{
  if(homePoints===4&&awayPoints===0)return [3,0];
  if(homePoints===3&&awayPoints===0)return [2,1];
  if(homePoints===0&&awayPoints===3)return [1,2];
  if(homePoints===0&&awayPoints===4)return [0,3];
  return [0,0];
};

for(const match of LADIES_S2_ROUND5_FINAL_RESULTS){
  LADIES_S2_RESULTS.push(match);
  const home=teamByName[match.home],away=teamByName[match.away];
  if(home&&away){
    home.stats.points+=match.homePoints;away.stats.points+=match.awayPoints;
    home.stats.pointsFor+=match.homePoints;home.stats.pointsAgainst+=match.awayPoints;
    away.stats.pointsFor+=match.awayPoints;away.stats.pointsAgainst+=match.homePoints;
    home.stats.differential=home.stats.pointsFor-home.stats.pointsAgainst;
    away.stats.differential=away.stats.pointsFor-away.stats.pointsAgainst;
    home.stats.played++;away.stats.played++;
    if(match.homePoints>match.awayPoints){home.stats.wins++;away.stats.losses++;}
    else if(match.awayPoints>match.homePoints){away.stats.wins++;home.stats.losses++;}
  }

  for(const r of match.rubbers){
    const hw=r.homePoints>r.awayPoints;
    const winners=hw?r.home:r.away,losers=hw?r.away:r.home,wp=hw?r.homePoints:r.awayPoints;
    [...r.home,...r.away].forEach(n=>{const p=playerByName[n];if(p)p.stats.played++;});
    winners.forEach(n=>{const p=playerByName[n];if(p){p.stats.wins++;p.stats.rubbers_won++;p.stats.mvp_points+=3+(wp===4?1:0);if(wp===4)p.stats.bonus_points++;}});
    losers.forEach(n=>{const p=playerByName[n];if(p)p.stats.losses++;});

    const [hs,as]=setSplit(r.homePoints,r.awayPoints);
    home.stats.setsWon+=hs;home.stats.setsLost+=as;
    away.stats.setsWon+=as;away.stats.setsLost+=hs;
    r.home.forEach(n=>{const p=playerByName[n];if(p){p.stats.sets_won+=hs;p.stats.sets_lost+=as;}});
    r.away.forEach(n=>{const p=playerByName[n];if(p){p.stats.sets_won+=as;p.stats.sets_lost+=hs;}});
  }
}

LADIES_S2_TEAMS.forEach(t=>{t.stats.setDifferential=t.stats.setsWon-t.stats.setsLost;});
LADIES_S2_STANDINGS.splice(0,LADIES_S2_STANDINGS.length,...LADIES_S2_TEAMS.map(t=>({...t.stats,id:t.id,name:t.name,logo:t.logo})).sort((a,b)=>b.points-a.points||b.setDifferential-a.setDifferential||b.differential-a.differential||a.name.localeCompare(b.name)));
const ranked=LADIES_S2_TEAMS.flatMap(t=>t.players.map(p=>({...p.stats,id:p.id,name:p.name,team:t.name,logo:t.logo}))).filter(p=>p.played>0).sort((a,b)=>b.mvp_points-a.mvp_points||b.wins-a.wins||b.sets_won-a.sets_won||a.name.localeCompare(b.name));
LADIES_S2_RANKINGS.splice(0,LADIES_S2_RANKINGS.length,...ranked);

function block(){return `<section data-ladies-mw5-final class="card" style="padding:18px;margin:18px 0;border:1px solid rgba(236,72,153,.6)"><span class="eyebrow">LADIES FRANCHISE LEAGUE · MATCHWEEK 5 COMPLETE · 16 SEPTEMBER 2026</span><h2 class="display" style="margin:5px 0 10px">LILLIES ROAR · FLAMES WIN · BLOSSOMS STILL LEAD</h2><div class="grid cols-2"><div><b>Lunar Lillies 11–4 Backhand Blossoms</b><div class="muted">Lillies hand the leaders their first defeat and surge to 44 points.</div></div><div><b>Phoenix Flames 10–3 Desert Roses</b><div class="muted">Phoenix finish Matchweek 5 on 39 points.</div></div></div></section>`;}
function sync(){if(location.pathname!=='/leagues')return;if(document.querySelector('[data-ladies-mw5-final]'))return;const root=document.querySelector('.page');if(!root)return;const target=root.querySelector('[data-ladies-mw5]')||root.querySelector('[data-ladies-mw4]')||root.firstElementChild;target?.insertAdjacentHTML('afterend',block());}
if(typeof window!=='undefined'){window.addEventListener('load',sync);new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.documentElement,{childList:true,subtree:true});}
