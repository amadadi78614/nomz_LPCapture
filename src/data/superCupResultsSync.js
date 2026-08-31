export const SUPER_CUP_FINAL_STANDINGS = [
  { pos: 1, team: 'Infinity Padel', played: 20, won: 20, lost: 0, bp: 12, gd: 118, points: 52 },
  { pos: 2, team: 'Vamos Padel', played: 20, won: 11, lost: 9, bp: 8, gd: 22, points: 34 },
  { pos: 3, team: 'Lowveld Padel', played: 20, won: 10, lost: 10, bp: 5, gd: 7, points: 28 },
  { pos: 4, team: 'Azaadville Padel', played: 20, won: 8, lost: 12, bp: 5, gd: -24, points: 23 },
  { pos: 5, team: 'Padel Society', played: 20, won: 6, lost: 14, bp: 2, gd: -51, points: 19 },
  { pos: 6, team: 'Team Padel', played: 20, won: 5, lost: 15, bp: 2, gd: -72, points: 13 },
];

const signed = (n) => Number(n) > 0 ? `+${n}` : String(n);

function buildSuperCupBlock() {
  return `<section data-super-cup-final-block class="card" style="padding:18px;margin:18px 0;border:1px solid rgba(218,174,68,.55);background:linear-gradient(135deg,rgba(6,53,31,.96),rgba(8,15,25,.98))">
    <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap">
      <div><span class="eyebrow" style="color:#d9ad45">SUPER CUP · FINAL STANDINGS</span><h2 class="display" style="margin:5px 0 6px">LOWVELD FINISHES ON THE PODIUM</h2><p class="muted" style="margin:0;max-width:720px">A top-three national finish after 20 matches. Lowveld Padel closes the Super Cup in third place with 28 points, 10 wins, five bonus points and a +7 game differential.</p></div>
      <div style="text-align:center;min-width:110px"><div style="font-family:var(--display);font-size:54px;line-height:1;color:#e5b944">3RD</div><div class="muted" style="font-size:11px">SUPER CUP</div></div>
    </div>
    <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;margin-top:16px">
      <table class="tbl" style="width:100%;min-width:680px"><thead><tr><th>#</th><th style="text-align:left">Team</th><th class="num">P</th><th class="num">W</th><th class="num">L</th><th class="num">BP</th><th class="num">GD</th><th class="num">Pts</th></tr></thead>
      <tbody>${SUPER_CUP_FINAL_STANDINGS.map(r => `<tr${r.team==='Lowveld Padel'?' style="background:rgba(20,110,61,.22)"':''}><td class="num"><b>${r.pos}</b></td><td><b>${r.team}</b></td><td class="num">${r.played}</td><td class="num">${r.won}</td><td class="num">${r.lost}</td><td class="num">${r.bp}</td><td class="num"><b>${signed(r.gd)}</b></td><td class="num"><b>${r.points}</b></td></tr>`).join('')}</tbody></table>
    </div>
    <div style="margin-top:12px;font-size:11px" class="muted">Final table supplied after 20 matches · Infinity Padel champions · Vamos Padel runners-up · Lowveld Padel third.</div>
  </section>`;
}

function syncSuperCupResults() {
  if (location.pathname !== '/360-super-cup' && location.pathname !== '/road-to-360' && location.pathname !== '/') return;
  if (document.querySelector('[data-super-cup-final-block]')) return;

  if (location.pathname === '/') {
    const root = document.querySelector('.hv3');
    if (!root) return;
    const hero = root.querySelector('.hv3-hero');
    hero?.insertAdjacentHTML('afterend', buildSuperCupBlock());
    return;
  }

  const page = document.querySelector('.page');
  if (!page) return;
  const hero = page.firstElementChild?.nextElementSibling || page.firstElementChild;
  hero?.insertAdjacentHTML('afterend', buildSuperCupBlock());
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', syncSuperCupResults);
  new MutationObserver(() => requestAnimationFrame(syncSuperCupResults)).observe(document.documentElement, { childList: true, subtree: true });
}
