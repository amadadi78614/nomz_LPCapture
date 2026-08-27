import { LADIES_S2_RANKINGS, LADIES_S2_STANDINGS, ladiesRankNumber } from './ladiesSeason2Round1Update';

const signed=(value)=>Number(value)>0?`+${value}`:String(value);

function syncLadiesRankingsPage() {
  if (location.pathname !== '/rankings') return;
  const page = document.querySelector('.page');
  if (!page) return;
  const ladiesButton = [...page.querySelectorAll('button')].find((button) => button.textContent?.includes('Ladies Season 2'));
  const ladiesActive = ladiesButton?.classList.contains('on');
  if (!ladiesActive) { page.querySelector('[data-ladies-s2-rankings-live]')?.remove(); return; }

  [...page.querySelectorAll('.card')].forEach((card) => {
    if (card.textContent?.includes('Competitive rankings will activate from completed Season 2 results')) card.style.display = 'none';
  });
  page.querySelector('[data-ladies-s2-rankings-live]')?.remove();
  const anchor = page.querySelectorAll('.tabbar')[0];
  if (!anchor) return;

  const section = document.createElement('section');
  section.dataset.ladiesS2RankingsLive='true';
  section.className='mt';
  section.innerHTML=`
    <div class="card" style="border-left:4px solid #f0abcc;padding:18px">
      <span class="eyebrow">Ladies Season 2 · Through Matchweek 2</span>
      <h2 class="display" style="margin:5px 0 6px">Official player MVP rankings</h2>
      <p class="muted" style="margin:0;font-size:12px">Updated from all verified played rubbers through 26 August 2026. 3 MVP points per rubber win + 1 bonus for a clean 4–0. Partners receive identical points. Administrative awards carry no player appearance, win, bonus or MVP credit.</p>
    </div>
    <div class="grid mt">
      ${LADIES_S2_RANKINGS.map((p,i)=>`<div class="card" style="padding:12px"><div class="row spread"><span><b class="num muted" style="display:inline-block;width:30px">${ladiesRankNumber(LADIES_S2_RANKINGS,i)}</b><b>${p.name}</b><div class="muted" style="font-size:11px;margin-left:30px">${p.team} · ${p.played} played · ${p.wins} W · ${p.losses} L${p.bonus_points?` · ${p.bonus_points} BP`:''}</div></span><b class="num" style="font-size:17px">${p.mvp_points} MVP pts</b></div></div>`).join('')}
    </div>
    <div class="card mt" style="padding:18px;overflow-x:auto">
      <span class="eyebrow">Ladies Season 2 · Franchise log</span>
      <h3 class="display" style="margin:5px 0 8px">Table through Matchweek 2</h3>
      <p class="muted" style="font-size:11px;margin:0 0 10px">P/W/L = completed franchise fixtures · Pts/PF/PA = rubber points · GD = PF−PA · SW/SL/SD = played-set totals only.</p>
      <table class="tbl" style="min-width:760px;width:100%"><thead><tr><th>#</th><th>Franchise</th><th>P</th><th>W</th><th>L</th><th>Pts</th><th>PF</th><th>PA</th><th>GD</th><th>SW</th><th>SL</th><th>SD</th></tr></thead><tbody>${LADIES_S2_STANDINGS.map((t,i)=>`<tr><td>${i+1}</td><td><b>${t.name}</b></td><td>${t.played}</td><td>${t.wins}</td><td>${t.losses}</td><td><b>${t.points}</b></td><td>${t.pointsFor}</td><td>${t.pointsAgainst}</td><td>${signed(t.differential)}</td><td>${t.setsWon}</td><td>${t.setsLost}</td><td>${signed(t.setDifferential)}</td></tr>`).join('')}</tbody></table>
      <p class="muted" style="font-size:11px;margin:10px 0 0">Week 1 Lunar Lillies v Desert Roses: one unfulfilled rubber was awarded 4–0 to Lunar Lillies as a team-only administrative award. No individual player or set statistics were created for that rubber.</p>
    </div>`;
  anchor.insertAdjacentElement('afterend',section);
}

if(typeof window!=='undefined'){
  window.addEventListener('load',syncLadiesRankingsPage);
  new MutationObserver(()=>requestAnimationFrame(syncLadiesRankingsPage)).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
}
