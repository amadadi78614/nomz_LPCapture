import { LADIES_S2_STANDINGS } from './ladiesSeason2Round1Update';
import { FRANCHISES } from './seed';

const signed=(v)=>Number(v)>0?`+${v}`:String(v);
const franchise=(name)=>FRANCHISES.find(f=>f.league==='ladies'&&f.name===name);

function standingsCard(){
  return `<section data-ladies-live-standings class="card" style="padding:18px;overflow-x:auto;border-top:3px solid #f0abcc">
    <span class="eyebrow">LADIES FRANCHISE LEAGUE · SEASON 2 · 15 SEPTEMBER 2026</span>
    <h2 class="display" style="margin:6px 0 6px">Current Standings</h2>
    <p class="muted" style="font-size:12px;margin:0 0 12px">Official ranking order: <b>PTS → SD → GD → H2H</b>. Latest: Arctic Angels edged Net Novas 7–6.</p>
    <table class="tbl" style="min-width:760px;width:100%"><thead><tr><th>#</th><th>Franchise</th><th>P</th><th>W</th><th>L</th><th>PTS</th><th>PF</th><th>PA</th><th>GD</th><th>SW</th><th>SL</th><th>SD</th></tr></thead><tbody>
    ${LADIES_S2_STANDINGS.map((t,i)=>{const f=franchise(t.name);return `<tr><td><b>${i+1}</b></td><td><span class="row" style="gap:8px;align-items:center">${f?.logo?`<img src="${f.logo}" alt="" style="width:28px;height:28px;object-fit:contain"/>`:''}<b>${t.name}</b></span></td><td>${t.played}</td><td>${t.wins}</td><td>${t.losses}</td><td><b>${t.points}</b></td><td>${t.pointsFor}</td><td>${t.pointsAgainst}</td><td>${signed(t.differential)}</td><td>${t.setsWon}</td><td>${t.setsLost}</td><td><b>${signed(t.setDifferential)}</b></td></tr>`}).join('')}
    </tbody></table>
    <p class="muted" style="font-size:11px;margin:10px 0 0">PTS = league points · PF/PA = points for/against · GD = point difference · SW/SL = sets won/lost · SD = set difference.</p>
  </section>`;
}

export function updateLadiesLeaguePage(){
  if(location.pathname!=='/leagues'||new URLSearchParams(location.search).get('league')!=='ladies')return;
  const page=document.querySelector('.page');
  if(!page||page.querySelector('[data-ladies-live-standings]'))return;
  const season2=[...page.querySelectorAll('button')].find(b=>b.textContent?.trim()==='Season 2');
  if(season2&&!season2.classList.contains('on'))return;
  const tabs=[...page.querySelectorAll('.tabbar')];
  const anchor=tabs[tabs.length-1]||page.firstElementChild;
  if(anchor)anchor.insertAdjacentHTML('afterend',standingsCard());
}

function sync(){updateLadiesLeaguePage();}
if(typeof window!=='undefined'){
  window.addEventListener('load',sync);
  window.addEventListener('popstate',sync);
  new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
}
