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

function ensureBackToLeagues(section) {
  if (!section || document.querySelector('[data-ladies-back-to-leagues]')) return;
  const back = document.createElement('a');
  back.href = '/leagues';
  back.dataset.ladiesBackToLeagues = 'true';
  back.setAttribute('aria-label', 'Back to Leagues');
  back.textContent = '← Back to Leagues';
  back.style.display = 'inline-flex';
  back.style.alignItems = 'center';
  back.style.gap = '7px';
  back.style.margin = '0 0 12px';
  back.style.padding = '9px 13px';
  back.style.border = '1px solid rgba(148,163,184,.35)';
  back.style.borderRadius = '10px';
  back.style.background = 'rgba(15,23,42,.55)';
  back.style.color = '#e5e7eb';
  back.style.fontWeight = '700';
  back.style.fontSize = '13px';
  back.style.textDecoration = 'none';
  back.style.width = 'fit-content';
  section.parentNode?.insertBefore(back, section);
}

function polishLadiesLog() {
  const section = document.querySelector('[data-ladies-round1-table]');
  if (!section) return;

  // This is the actual Ladies League view shown on /leagues, so the back
  // control must be injected here rather than only on /rankings.
  ensureBackToLeagues(section);

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
