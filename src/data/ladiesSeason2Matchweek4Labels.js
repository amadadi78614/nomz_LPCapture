// Keep the Ladies Season 2 league page labels aligned with the latest verified results.
const replacements = [
  ['Ladies Season 2 · Through Matchweek 2', 'Ladies Season 2 · Through Matchweek 4 · 9 September 2026'],
  ['Season 2 · Through Matchweek 2', 'Season 2 · Through Matchweek 4 · 9 September 2026'],
  ['Through Matchweek 2', 'Through Matchweek 4 · 9 September 2026'],
  ['Table through Matchweek 2', 'Standings through Matchweek 4'],
  ['Updated from all verified played rubbers through 26 August 2026.', 'Updated from all verified played rubbers through 9 September 2026.'],
  ['Latest verified scores · through 26 August 2026', 'Latest verified scores · through 9 September 2026'],
  ['LADIES FRANCHISE LEAGUE · MATCHWEEK 2', 'LADIES FRANCHISE LEAGUE · MATCHWEEK 4'],
  ['Ladies Franchise League · Matchweek 2', 'Ladies Franchise League · Matchweek 4'],
  ['MATCHWEEK 2 COMPLETE', 'MATCHWEEK 4 COMPLETE'],
  ['Matchweek 2 complete', 'Matchweek 4 complete'],
];

function refreshLadiesLabels() {
  if (location.pathname !== '/leagues') return;
  const params = new URLSearchParams(location.search);
  if (params.get('league') !== 'ladies') return;

  // Matchweek 3 remains in the data/history, but its old promotional summary
  // should no longer appear above the current Matchweek 4 league dashboard.
  document.querySelectorAll('[data-ladies-mw3]').forEach((node) => node.remove());

  const root = document.querySelector('.page');
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    let text = node.nodeValue || '';
    replacements.forEach(([from, to]) => { text = text.replaceAll(from, to); });
    if (text !== node.nodeValue) node.nodeValue = text;
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', refreshLadiesLabels);
  new MutationObserver(() => requestAnimationFrame(refreshLadiesLabels))
    .observe(document.documentElement, { childList: true, subtree: true });
}
