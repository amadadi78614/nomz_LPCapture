import { LADIES_S2_RANKINGS, LADIES_S2_STANDINGS } from './ladiesSeason2Round1Update';

function syncLadiesRankingsPage() {
  if (location.pathname !== '/rankings') return;
  const page = document.querySelector('.page');
  if (!page) return;
  const ladiesButton = [...page.querySelectorAll('button')].find((button) => button.textContent?.includes('Ladies Season 2'));
  const ladiesActive = ladiesButton?.classList.contains('on');
  if (!ladiesActive) { page.querySelector('[data-ladies-s2-rankings-live]')?.remove(); return; }
  [...page.querySelectorAll('.card')].forEach((card) => { if (card.textContent?.includes('Competitive rankings will activate from completed Season 2 results')) card.style.display = 'none'; });
  page.querySelector('[data-ladies-s2-rankings-live]')?.remove();
  const anchor = page.querySelectorAll('.tabbar')[0]; if (!anchor) return;
  const section = document.createElement('section'); section.dataset.ladiesS2RankingsLive='true'; section.className='mt';
  section.innerHTML=`<div class="card" style="border-left:4px solid #f0abcc;padding:18px"><span class="eyebrow">Ladies Season 2 · Matchweek 2</span><h2 class="display" style="margin:5px 0 6px">Official player MVP rankings</h2><p class="muted" style="margin:0;font-size:12px">Updated from all results received through 26 August 2026. 3 MVP points per rubber win + 1 bonus for a clean 4–0. Partners receive identical points.</p></div><div class="grid mt">${LADIES_S2_RANKINGS.map((p,i)=>`<div class="card" style="padding:12px"><div class="row spread"><span><b class="num muted" style="display:inline-block;width:30px">${i+1}</b><b>${p.name}</b><div class="muted" style="font-size:11px;margin-left:30px">${p.team} · ${p.played} played · ${p.wins} W · ${p.losses} L${p.bonus_points?` · ${p.bonus_points} BP`:''}</div></span><b class="num" style="font-size:17px">${p.mvp_points} MVP pts</b></div></div>`).join('')}</div><div class="card mt" style="padding:18px"><span class="eyebrow">Ladies Season 2 · Match points</span><h3 class="display" style="margin:5px 0 8px">Rubber points accumulated</h3><p class="muted" style="font-size:11px;margin:0 0 8px">This is a points view, not a league/log table. Partial fixtures contribute only completed rubber points.</p>${LADIES_S2_STANDINGS.map((t,i)=>`<div class="row spread" style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08)"><span>${i+1}. ${t.name}${t.status!=='FT'&&t.status!=='Awaiting result'?' · partial':''}</span><b>${t.points} pts</b></div>`).join('')}</div>`;
  anchor.insertAdjacentElement('afterend',section);
}
if(typeof window!=='undefined'){window.addEventListener('load',syncLadiesRankingsPage);new MutationObserver(()=>requestAnimationFrame(syncLadiesRankingsPage)).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});}
