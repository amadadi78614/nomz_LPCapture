import { LEGACY_LIVE_FIXTURES } from './legacyLive';
import { legacyFranchiseById } from './seed';

const teamIds = ['lp-honey-badgers','lp-cheetahs','lp-jackals','lp-leopards','lp-rhinos','lp-eagles'];

export const LEGACY_DETAILED_STANDINGS = teamIds.map((id) => ({
  franchise_id: id, played: 0, won: 0, lost: 0, points: 0,
  pf: 0, pa: 0, gd: 0, sw: 0, sl: 0, sd: 0,
}));

const rowFor = (id) => LEGACY_DETAILED_STANDINGS.find((row) => row.franchise_id === id);

LEGACY_LIVE_FIXTURES.forEach((fixture) => {
  const home = rowFor(fixture.home);
  const away = rowFor(fixture.away);
  if (!home || !away) return;

  const [homePoints = 0, awayPoints = 0] = fixture.score?.totals || [];
  home.played += 1; away.played += 1;
  home.points += homePoints; away.points += awayPoints;
  home.pf += homePoints; home.pa += awayPoints;
  away.pf += awayPoints; away.pa += homePoints;

  if (homePoints > awayPoints) { home.won += 1; away.lost += 1; }
  else if (awayPoints > homePoints) { away.won += 1; home.lost += 1; }

  (fixture.score?.rubbers || []).forEach((rubber) => {
    (rubber.sets || []).forEach(([h, a]) => {
      const hs = Number(h) || 0;
      const as = Number(a) || 0;
      if (hs > as) { home.sw += 1; away.sl += 1; }
      else if (as > hs) { away.sw += 1; home.sl += 1; }
    });
  });
});

LEGACY_DETAILED_STANDINGS.forEach((row) => {
  row.gd = row.pf - row.pa;
  row.sd = row.sw - row.sl;
});

LEGACY_DETAILED_STANDINGS.sort((a, b) =>
  b.points - a.points || b.won - a.won || b.gd - a.gd || b.sd - a.sd
);

const signed = (value) => {
  const n = Number(value) || 0;
  return n > 0 ? `+${n}` : String(n);
};

function buildDetailedTable() {
  return `
    <div class="card" data-legacy-detailed-log style="padding:0;overflow:hidden;margin-top:14px">
      <div style="padding:16px 16px 10px">
        <span class="eyebrow">LP Legacy League · Full Log</span>
        <h3 class="display" style="margin:5px 0 4px">Detailed standings</h3>
        <p class="muted" style="margin:0;font-size:11px">P = played · W/L = fixture wins/losses · Pts = accumulated league/rubber points · PF/PA = points for/against · GD = PF−PA · SW/SL = sets won/lost · SD = set difference.</p>
      </div>
      <div style="overflow-x:auto;-webkit-overflow-scrolling:touch">
        <table class="tbl" style="width:100%;min-width:900px;border-collapse:collapse">
          <thead><tr>
            <th>#</th><th style="text-align:left">Franchise</th><th class="num">P</th><th class="num">W</th><th class="num">L</th>
            <th class="num">Pts</th><th class="num">PF</th><th class="num">PA</th><th class="num">GD</th>
            <th class="num">SW</th><th class="num">SL</th><th class="num">SD</th>
          </tr></thead>
          <tbody>${LEGACY_DETAILED_STANDINGS.map((row, index) => {
            const fr = legacyFranchiseById(row.franchise_id);
            if (!fr) return '';
            return `<tr>
              <td class="num"><b>${index + 1}</b></td>
              <td><a href="/legacy-franchise/${fr.id}" style="display:flex;align-items:center;gap:8px;text-decoration:none;color:inherit;white-space:nowrap"><img src="${fr.logo}" alt="" style="width:28px;height:28px;object-fit:contain"><b>${fr.name}</b></a></td>
              <td class="num">${row.played}</td><td class="num">${row.won}</td><td class="num">${row.lost}</td>
              <td class="num"><b>${row.points}</b></td><td class="num">${row.pf}</td><td class="num">${row.pa}</td>
              <td class="num"><b>${signed(row.gd)}</b></td><td class="num">${row.sw}</td><td class="num">${row.sl}</td>
              <td class="num"><b>${signed(row.sd)}</b></td>
            </tr>`;
          }).join('')}</tbody>
        </table>
      </div>
    </div>`;
}

function restoreLegacyBaseTable(page) {
  const hidden = page?.querySelector('[data-legacy-base-table-hidden]');
  if (hidden) {
    hidden.style.display = '';
    hidden.removeAttribute('data-legacy-base-table-hidden');
  }
}

function syncLegacyDetailedLog() {
  if (location.pathname !== '/leagues' && location.pathname !== '/rankings') return;
  const page = document.querySelector('.page');
  if (!page) return;

  if (location.pathname === '/leagues') {
    const legacyActive = [...page.querySelectorAll('button')].some((button) =>
      button.classList.contains('on') && /legacy/i.test(button.textContent || '')
    );

    if (!legacyActive) {
      page.querySelector('[data-legacy-detailed-log]')?.remove();
      restoreLegacyBaseTable(page);
      return;
    }

    const tables = [...page.querySelectorAll('table')];
    const legacyTable = tables.find((table) => {
      const text = (table.textContent || '').toUpperCase();
      return text.includes('FRANCHISE') && text.includes('GD') && text.includes('PTS');
    });

    if (legacyTable) {
      const shell = legacyTable.closest('.card, .league-standings-shell') || legacyTable.parentElement;
      if (shell && !shell.hasAttribute('data-legacy-base-table-hidden')) {
        shell.setAttribute('data-legacy-base-table-hidden', 'true');
        shell.style.display = 'none';
      }
      if (!page.querySelector('[data-legacy-detailed-log]')) {
        shell?.insertAdjacentHTML('beforebegin', buildDetailedTable());
      }
    } else if (!page.querySelector('[data-legacy-detailed-log]')) {
      const anchor = page.querySelector('.tabbar.mt') || page.firstElementChild;
      anchor?.insertAdjacentHTML('afterend', buildDetailedTable());
    }
  }

  if (location.pathname === '/rankings') {
    const legacyActive = [...page.querySelectorAll('button')].some((button) =>
      button.classList.contains('on') && /LP Legacy/i.test(button.textContent || '')
    );
    const franchiseView = [...page.querySelectorAll('button')].some((button) =>
      button.classList.contains('on') && /Franchise Rankings/i.test(button.textContent || '')
    );

    if (!(legacyActive && franchiseView)) {
      page.querySelector('[data-legacy-detailed-log]')?.remove();
      restoreLegacyBaseTable(page);
      return;
    }

    const table = page.querySelector('table');
    if (table) {
      const shell = table.closest('.card') || table.parentElement;
      if (shell && !shell.hasAttribute('data-legacy-base-table-hidden')) {
        shell.setAttribute('data-legacy-base-table-hidden', 'true');
        shell.style.display = 'none';
      }
      if (!page.querySelector('[data-legacy-detailed-log]')) {
        shell?.insertAdjacentHTML('beforebegin', buildDetailedTable());
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', syncLegacyDetailedLog);
  new MutationObserver(() => requestAnimationFrame(syncLegacyDetailedLog)).observe(document.documentElement, { childList: true, subtree: true });
}
