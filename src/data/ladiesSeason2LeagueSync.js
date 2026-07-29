import { LADIES_S2_TEAMS } from './ladiesSeason2Data';

function updateLadiesLeaguePage() {
  if (location.pathname !== '/leagues') return;
  const page = document.querySelector('.leagues-page');
  if (!page) return;
  const ladiesActive = [...page.querySelectorAll('button')].some((button) => button.classList.contains('on') && button.textContent.includes('Ladies Franchise League'));
  if (!ladiesActive) return;

  page.querySelectorAll('p').forEach((node) => {
    if (node.textContent?.includes('Empower. Compete. Inspire.')) return;
    if (node.textContent?.includes('Season preparations')) node.textContent = 'The Season 2 auction is complete. All six 10-player squads are confirmed.';
  });

  if (page.querySelector('[data-ladies-season-two-squads]')) return;
  const target = page.querySelector('.mt[style*="flex-direction"]') || page.querySelector('.mt');
  if (!target) return;
  const section = document.createElement('section');
  section.dataset.ladiesSeasonTwoSquads = 'true';
  section.innerHTML = `
    <div class="card" style="padding:18px;margin-bottom:16px;background:linear-gradient(135deg,rgba(219,39,119,.10),rgba(219,39,119,.02));border-color:rgba(219,39,119,.25)">
      <span class="eyebrow">Auction complete · 29 July 2026</span>
      <h2 class="display" style="margin:6px 0">Season 2 squads confirmed</h2>
      <p class="muted" style="margin:0">Six franchises. Sixty players. Official owners, captains and player allocations are now live.</p>
    </div>
    <div class="grid cols-2">
      ${LADIES_S2_TEAMS.map((team) => `<a href="/ladies-franchise/${team.id}" class="card" style="display:grid;grid-template-columns:72px 1fr;gap:12px;align-items:center;text-decoration:none"><img src="${team.logo}" alt="${team.name}" style="width:72px;height:72px;object-fit:cover;border-radius:10px"><div><b style="font-family:var(--display);text-transform:uppercase;font-size:16px">${team.name}</b><div class="muted" style="font-size:11px;margin-top:4px">Owner: ${team.owner}</div><div class="muted" style="font-size:11px">Captain: ${team.captain}</div><span class="chip" style="display:inline-block;margin-top:7px">View 10-player squad →</span></div></a>`).join('')}
    </div>`;
  target.prepend(section);
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', updateLadiesLeaguePage);
  const observer = new MutationObserver(() => requestAnimationFrame(updateLadiesLeaguePage));
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
