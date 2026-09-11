// Keep the Ladies Season 2 league page labels aligned with the latest verified results.
const replacements = [
  ['Ladies Season 2 · Through Matchweek 2', 'Ladies Season 2 · Through Matchweek 4 · 9 September 2026'],
  ['Through Matchweek 2', 'Through Matchweek 4 · 9 September 2026'],
  ['Table through Matchweek 2', 'Standings through Matchweek 4'],
  ['Updated from all verified played rubbers through 26 August 2026.', 'Updated from all verified played rubbers through 9 September 2026.'],
  ['Season 2 · Through Matchweek 2', 'Season 2 · Through Matchweek 4 · 9 September 2026'],
];

function refreshLadiesLabels() {
  if (location.pathname !== '/leagues') return;
  const params = new URLSearchParams(location.search);
  if (params.get('league') !== 'ladies') return;

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
