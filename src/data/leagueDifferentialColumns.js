function formatDiff(value) {
  const number = Number(value) || 0;
  return number > 0 ? `+${number}` : String(number);
}

function enhanceLeagueStandings() {
  const tables = document.querySelectorAll('.leagues-page .league-standings-table');

  tables.forEach((table) => {
    const headers = [...table.querySelectorAll('thead th')].map((cell) => cell.textContent.trim());
    const isMensTable = headers.includes('BP') && headers.includes('Pts') && headers.includes('W') && headers.includes('L');
    if (!isMensTable || headers.includes('RD')) return;

    const headerRow = table.querySelector('thead tr');
    const bpHeader = [...headerRow.children].find((cell) => cell.textContent.trim() === 'BP');
    if (!bpHeader) return;

    ['RD', 'SD', 'GD'].forEach((label) => {
      const th = document.createElement('th');
      th.className = 'num league-diff-column';
      th.textContent = label;
      headerRow.insertBefore(th, bpHeader);
    });

    table.querySelectorAll('tbody tr').forEach((row) => {
      const cells = [...row.children];
      const currentHeaders = [...headerRow.children].map((cell) => cell.textContent.trim());
      const winIndex = currentHeaders.indexOf('W');
      const lossIndex = currentHeaders.indexOf('L');
      const bpIndex = currentHeaders.indexOf('BP');
      const wins = Number(cells[winIndex]?.textContent.trim()) || 0;
      const losses = Number(cells[lossIndex]?.textContent.trim()) || 0;
      const bpCell = cells[bpIndex - 3];

      const rd = document.createElement('td');
      rd.className = `num league-diff-column ${wins - losses > 0 ? 'diff-positive' : wins - losses < 0 ? 'diff-negative' : ''}`;
      rd.textContent = formatDiff(wins - losses);

      const sd = document.createElement('td');
      sd.className = 'num league-diff-column league-diff-pending';
      sd.textContent = '—';
      sd.title = 'Pending verification of complete historical set scores';

      const gd = document.createElement('td');
      gd.className = 'num league-diff-column league-diff-pending';
      gd.textContent = '—';
      gd.title = 'Pending verification of complete historical game scores';

      row.insertBefore(rd, bpCell);
      row.insertBefore(sd, bpCell);
      row.insertBefore(gd, bpCell);
    });

    const shell = table.closest('.league-standings-shell');
    const key = shell?.querySelector('.league-standings-key');
    if (key && !key.textContent.includes('RD =')) {
      key.textContent += ' · RD = rubber difference · SD = set difference · GD = game difference · — = pending verified historical scores.';
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
