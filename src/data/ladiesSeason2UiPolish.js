import { LADIES_S2_STANDINGS, LADIES_S2_RANKINGS } from './ladiesSeason2Round1Update';

const teamByName = Object.fromEntries(LADIES_S2_STANDINGS.map((team) => [team.name, team]));
const playerTeam = Object.fromEntries(LADIES_S2_RANKINGS.map((player) => [player.name, player.team]));

function logoImg(src, alt, size = 28) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  img.loading = 'lazy';
  img.style.width = `${size}px`;
  img.style.height = `${size}px`;
  img.style.objectFit = 'contain';
  img.style.borderRadius = '8px';
  img.style.flex = '0 0 auto';
  return img;
}

function polishLadiesLog() {
  const section = document.querySelector('[data-ladies-round1-table]');
  if (!section) return;

  const rows = [...section.querySelectorAll('.row')];
  rows.forEach((row) => {
    const firstBold = row.querySelector('b');
    if (!firstBold || firstBold.querySelector('img')) return;
    const team = teamByName[firstBold.textContent.trim()];
    if (!team?.logo) return;
    firstBold.style.display = 'inline-flex';
    firstBold.style.alignItems = 'center';
    firstBold.style.gap = '8px';
    firstBold.prepend(logoImg(team.logo, team.name, 30));
  });

  // Player MVP rows: add the franchise logo next to the player name as well.
  rows.forEach((row) => {
    if (row.dataset.ladiesPlayerLogo === 'true') return;
    const text = row.textContent || '';
    const player = LADIES_S2_RANKINGS.find((item) => text.includes(item.name));
    if (!player) return;
    const team = teamByName[playerTeam[player.name]];
    const nameHost = row.querySelector('span');
    if (!team?.logo || !nameHost) return;
    const img = logoImg(team.logo, team.name, 22);
    img.style.marginRight = '7px';
    nameHost.prepend(img);
    row.dataset.ladiesPlayerLogo = 'true';
  });
}

function run() {
  if (location.pathname === '/leagues') polishLadiesLog();
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', run);
  new MutationObserver(() => requestAnimationFrame(run)).observe(document.documentElement, { childList: true, subtree: true });
}
