// Keep the displayed R column consistent everywhere in the site.
// Franchise tables play six rubbers per completed fixture; P1/P2/P3 tables play two.
function syncRoundsColumns() {
  document.querySelectorAll('table').forEach((table) => {
    const headers = [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim().toUpperCase());
    const roundsIndex = headers.indexOf('R');
    const playedIndex = headers.indexOf('P');
    if (roundsIndex < 0 || playedIndex < 0) return;

    const isTierTable = /P1|P2|P3/.test(
      `${table.closest('.page')?.textContent || ''} ${table.previousElementSibling?.textContent || ''}`,
    ) && !headers.includes('FRANCHISE');
    const rubbersPerFixture = isTierTable ? 2 : 6;

    table.querySelectorAll('tbody tr').forEach((row) => {
      const cells = row.querySelectorAll('td');
      const played = Number.parseInt(cells[playedIndex]?.textContent || '', 10);
      if (!Number.isFinite(played)) return;
      const rounds = Math.floor(played / rubbersPerFixture);
      const roundsCell = cells[roundsIndex];
      if (!roundsCell) return;
      const target = roundsCell.querySelector('b') || roundsCell;
      if (target.textContent !== String(rounds)) target.textContent = String(rounds);
    });
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', syncRoundsColumns);
  const observer = new MutationObserver(() => window.requestAnimationFrame(syncRoundsColumns));
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
