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
  const stats = Object.fromEntries(
    FRANCHISES
      .filter((franchise) => franchise.league === 'mens')
      .map((franchise) => [franchise.id, { sd: 0, gd: 0, scoredRubbers: 0 }]),
  );

  FIXTURES
    .filter((fixture) => fixture.league === 'mens' && fixture.status === 'final')
    .forEach((fixture) => {
      (fixture.score?.rubbers || []).forEach((rubber) => {
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

function ensureDifferenceColumns(table) {
  const headerRow = table.querySelector('thead tr');
  if (!headerRow) return null;

  let headers = [...headerRow.children].map((cell) => cell.textContent.trim());
  const bpHeader = [...headerRow.children].find((cell) => cell.textContent.trim() === 'BP');
  if (!bpHeader) return null;

  if (!headers.includes('RD')) {
    ['RD', 'SD', 'GD'].forEach((label) => {
      const th = document.createElement('th');
      th.className = 'num league-diff-column';
      th.textContent = label;
      headerRow.insertBefore(th, bpHeader);
    });
    headers = [...headerRow.children].map((cell) => cell.textContent.trim());
  }

  const expectedCellCount = headers.length;

  table.querySelectorAll('tbody tr').forEach((row) => {
    // React replaces the table body when switching Franchise/P1/P2/P3, while
    // the enhanced header can remain in the DOM. Re-create the three body
    // cells whenever a newly rendered row still has the original 9 columns.
    if (row.children.length < expectedCellCount) {
      const originalBpCell = row.children[row.children.length - 2];
      if (!originalBpCell) return;
      ['RD', 'SD', 'GD'].forEach((label) => {
        const td = document.createElement('td');
        td.className = 'num league-diff-column';
        td.dataset.difference = label;
        row.insertBefore(td, originalBpCell);
      });
    }
  });

  return [...headerRow.children].map((cell) => cell.textContent.trim());
}

function enhanceLeagueStandings() {
  const tier = getActiveTier();
  const differentials = buildDifferentials(tier);

  document.querySelectorAll('.leagues-page .league-standings-table').forEach((table) => {
    const initialHeaders = [...table.querySelectorAll('thead th')].map((cell) => cell.textContent.trim());
    const isMensTable = initialHeaders.includes('BP') && initialHeaders.includes('Pts') && initialHeaders.includes('W') && initialHeaders.includes('L');
    if (!isMensTable) return;

    const headers = ensureDifferenceColumns(table);
    if (!headers) return;

    const winIndex = headers.indexOf('W');
    const lossIndex = headers.indexOf('L');
    const rdIndex = headers.indexOf('RD');
    const sdIndex = headers.indexOf('SD');
    const gdIndex = headers.indexOf('GD');

    table.querySelectorAll('tbody tr').forEach((row) => {
      const cells = [...row.children];
      const teamName = row.querySelector('.league-team-cell b')?.textContent?.replace('*', '').trim();
      const franchise = FRANCHISES.find((item) => item.name === teamName);
      const teamStats = franchise ? differentials[franchise.id] : null;
      const wins = Number(cells[winIndex]?.textContent.trim()) || 0;
      const losses = Number(cells[lossIndex]?.textContent.trim()) || 0;

      [
        { index: rdIndex, value: wins - losses, title: 'Rubber difference' },
        { index: sdIndex, value: teamStats?.sd ?? 0, title: `Set difference from ${teamStats?.scoredRubbers || 0} rubbers with recorded set scores` },
        { index: gdIndex, value: teamStats?.gd ?? 0, title: `Game difference from ${teamStats?.scoredRubbers || 0} rubbers with recorded set scores` },
      ].forEach(({ index, value, title }) => {
        const cell = row.children[index];
        if (!cell) return;
        const nextText = formatDiff(value);
        const nextClass = `num league-diff-column ${value > 0 ? 'diff-positive' : value < 0 ? 'diff-negative' : ''}`.trim();
        if (cell.textContent !== nextText) cell.textContent = nextText;
        if (cell.className !== nextClass) cell.className = nextClass;
        cell.title = title;
      });
    });

    const key = table.closest('.league-standings-shell')?.querySelector('.league-standings-key');
    if (key) {
      const base = key.textContent.split(' · RD =')[0];
      const nextKey = `${base} · RD = rubber difference · SD = set difference · GD = game difference. SD and GD are calculated from all currently recorded set scores.`;
      if (key.textContent !== nextKey) key.textContent = nextKey;
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
