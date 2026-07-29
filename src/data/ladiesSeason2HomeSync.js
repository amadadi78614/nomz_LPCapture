import { LADIES_S2_TEAMS } from './ladiesSeason2Data';

function updateLadiesHomepage() {
  if (location.pathname !== '/' && location.pathname !== '') return;

  document.querySelectorAll('h1,h2,h3,p,span,b,strong').forEach((node) => {
    const text = node.textContent?.trim();
    if (text === 'Ladies League Auction Next') node.textContent = 'Ladies Season 2 squads confirmed';
    if (text === 'Record season') node.textContent = 'Auction complete';
    if (text === '60 ladies. Six franchises. Season preparations continue.') node.textContent = 'Six franchises and 60 players are now confirmed after the Season 2 auction.';
    if (text?.includes('biggest Ladies League auction yet')) node.textContent = 'The Season 2 auction is complete, with six official 10-player squads now confirmed.';
  });

  const root = document.querySelector('.lpv2');
  if (!root || root.querySelector('[data-ladies-s2-home]')) return;
  const section = document.createElement('section');
  section.className = 'lpv2-section';
  section.dataset.ladiesS2Home = 'true';
  section.innerHTML = `
    <div class="lpv2-section-heading lpv2-heading-row">
      <div><span class="lpv2-kicker">LADIES FRANCHISE LEAGUE · SEASON 2</span><h2>Auction complete. Squads confirmed.</h2></div>
      <a href="/leagues">View all teams →</a>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px">
      ${LADIES_S2_TEAMS.map((team) => `<a href="/ladies-franchise/${team.id}" class="card" style="text-decoration:none;padding:12px;display:block"><img src="${team.logo}" alt="${team.name}" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px"><b style="display:block;margin-top:8px">${team.name}</b><span class="muted" style="font-size:11px">Owner: ${team.owner}<br>Captain: ${team.captain}</span></a>`).join('')}
    </div>`;
  const pulse = root.querySelector('.lpv2-pulse');
  if (pulse?.nextSibling) root.insertBefore(section, pulse.nextSibling);
  else root.appendChild(section);
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', updateLadiesHomepage);
  const observer = new MutationObserver(() => requestAnimationFrame(updateLadiesHomepage));
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
