import { FIXTURES, FRANCHISES } from './seed';

function formatDiff(value) {
  const number = Number(value) || 0;
  return number > 0 ? `+${number}` : String(number);
}

function getActiveTier() {
  const label = document.querySelector('.leagues-page .league-tier-tabs .on')?.textContent?.trim();
  return ['P1', 'P2', 'P3'].includes(label) ? label : 'franchise';
}

function buildDifferentials(tier) {
  const stats = Object.fromEntries(FRANCHISES.filter((franchise) => franchise.league === 'mens').map((franchise) => [franchise.id, { sd: 0, gd: 0, scoredRubbers: 0 }]));

  FIXTURES.filter((fixture) => fixture.league === 'mens' && fixture.status === 'final').forEach((fixture) => {
    const rubbers = fixture.score?.rubbers || [];
    rubbers.forEach((rubber) => {
      if (tier !== 'franchise' && rubber.court !== tier) return;
      if (!Array.isArray(rubber.sets) || rubber.sets.length === 0) return;

      let homeSets = 0;
      let awaySets = 0;
      let homeGames = 0;
      let awayGames = 0;

      rubber.sets.forEach((setScore) => {
        if (!Array.isArray(setScore) || setScore.length < 2) return;
        const home = Number(setScore[0]) || 0;
        const away = Number(setScore[1]) || 0;
        homeGames += home;
        awayGames += away;
        if (home > away) homeSets += 1;
        if (away > home) awaySets += 1;
      });

      if (stats[fixture.home]) {
        stats[fixture.home].sd += homeSets - awaySets;
        stats[fixture.home].gd += homeGames - awayGames;
        stats[fixture.home].scoredRubbers += 1;
      }
      if (stats[fixture.away]) {
        stats[fixture.away].sd += awaySets - homeSets;
        stats[fixture.away].gd += awayGames - homeGames;
        stats[fixture.away].scoredRubbers += 1;
      }
    });
  });

  return stats;
}

function enhanceLeagueStandings() {
  const tables = document.querySelectorAll('.leagues-page .league-standings-table');
  const tier = getActiveTier();
  const differentials = buildDifferentials(tier);

  tables.forEach((table) => {
    const headers = [...table.querySelectorAll('thead th')].map((cell) => cell.textContent.trim());
    const isMensTable = headers.includes('BP') && headers.includes('Pts') && headers.includes('W') && headers.includes('L');
    if (!isMensTable) return;

    if (!headers.includes('RD')) {
      const headerRow = table.querySelector('thead tr');
      const bpHeader = [...headerRow.children].find((cell) => cell.textContent.trim() === 'BP');
      if (!bpHeader) return;
      ['RD', 'SD', 'GD'].forEach((label) => {
        const th = document.createElement('th');
        th.className = 'num league-diff-column';
        th.textContent = label;
        headerRow.insertBefore(th, bpHeader);
      });
    }

    const headerRow = table.querySelector('thead tr');
    const currentHeaders = [...headerRow.children].map((cell) => cell.textContent.trim());
    const winIndex = currentHeaders.indexOf('W');
    const lossIndex = currentHeaders.indexOf('L');
    const rdIndex = currentHeaders.indexOf('RD');
    const sdIndex = currentHeaders.indexOf('SD');
    const gdIndex = currentHeaders.indexOf('GD');

    table.querySelectorAll('tbody tr').forEach((row) => {
      const cells = [...row.children];
      const teamName = row.querySelector('.league-team-cell b')?.textContent?.replace('*', '').trim();
      const franchise = FRANCHISES.find((item) => item.name === teamName);
      const teamStats = franchise ? differentials[franchise.id] : null;
      const wins = Number(cells[winIndex]?.textContent.trim()) || 0;
      const losses = Number(cells[lossIndex]?.textContent.trim()) || 0;

      const values = [
        { index: rdIndex, value: wins - losses, title: 'Rubber difference' },
        { index: sdIndex, value: teamStats?.sd || 0, title: `Set difference from ${teamStats?.scoredRubbers || 0} rubbers with recorded set scores` },
        { index: gdIndex, value: teamStats?.gd || 0, title: `Game difference from ${teamStats?.scoredRubbers || 0} rubbers with recorded set scores` },
      ];

      values.forEach(({ index, value, title }) => {
        let cell = row.children[index];
        if (!cell) return;
        cell.className = `num league-diff-column ${value > 0 ? 'diff-positive' : value < 0 ? 'diff-negative' : ''}`;
        cell.textContent = formatDiff(value);
        cell.title = title;
      });
    });

    const shell = table.closest('.league-standings-shell');
    const key = shell?.querySelector('.league-standings-key');
    if (key) {
      const base = key.textContent.split(' · RD =')[0];
      key.textContent = `${base} · RD = rubber difference · SD = set difference · GD = game difference. SD and GD are calculated from all currently recorded set scores.`;
    }
  });
}

let scheduled = false;
function scheduleEnhancement() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    enhanceLeagueStandings();
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', scheduleEnhancement);
  const observer = new MutationObserver(scheduleEnhancement);
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
