import { LADIES_S2_TEAMS } from './ladiesSeason2Data';

// Ladies Franchise League Season 2 — Matchweek 1 results received 19 August 2026.
// Lunar Lillies v Desert Roses is currently a PARTIAL fixture: two rubbers supplied, running score 3-4.
export const LADIES_S2_ROUND1_RESULTS = [
  {
    id: 'ladies-s2-2026-08-19-phoenix-arctic', date: '2026-08-19', venue: 'Play 360', status: 'FT',
    home: 'Phoenix Flames', away: 'Arctic Angels', homePoints: 8, awayPoints: 7,
    rubbers: [
      { home: ['Martinette Meyer','Samantha de Araujo'], away: ['Mieke Swart','Deeja Badat'], sets: ['6-4','6-2','10-4'], homePoints: 4, awayPoints: 0 },
      { home: ['Marz Asvat','Maryke Botha'], away: ['Brigitte du Preez','Aldorette Van Der Mescht'], sets: ['3-6','3-6','3-10'], homePoints: 0, awayPoints: 4 },
      { home: ['Helene Van der Merwe','Anneri Duvenage'], away: ['Nazrana Meer','Zantelle Hopkins'], sets: ['6-1','6-2','10-8'], homePoints: 4, awayPoints: 0 },
    ],
  },
  {
    id: 'ladies-s2-2026-08-19-blossoms-novas', date: '2026-08-19', venue: 'Padel 24', status: 'FT',
    home: 'Backhand Blossoms', away: 'Net Novas', homePoints: 8, awayPoints: 7,
    rubbers: [
      { home: ['Amor Caromba','Diyaana Nomani'], away: ['Maxine Lambourn','Mufeedah Hoosen'], sets: ['1-6','4-6','10-6'], homePoints: 0, awayPoints: 3 },
      { home: ['Sunel Grote','Imaan Packery'], away: ['Simone Maritz','Carien Vos'], sets: ['6-2','6-4','10-5'], homePoints: 4, awayPoints: 0 },
      { home: ['Rinie De Klerk','Jana Kotze'], away: ['Emily Anders','Mariette Venter'], sets: ['4-6','3-6','6-10'], homePoints: 0, awayPoints: 4 },
      { home: ['Nasreen Methar','Zahra Jogi'], away: ['Imaan Shaik','Larisa de Kock'], sets: ['6-3','6-0','10-5'], homePoints: 4, awayPoints: 0 },
    ],
  },
  {
    id: 'ladies-s2-2026-08-19-lunar-desert', date: '2026-08-19', venue: 'Padel 24', status: 'LIVE / PARTIAL',
    home: 'Lunar Lillies', away: 'Desert Roses', homePoints: 3, awayPoints: 4,
    rubbers: [
      { home: ['Bianca Renell Morgan','Lizle Tilburn'], away: ['Aletia Van Rooyen','Annali Hugo'], sets: ['1-6','1-6','4-10'], homePoints: 0, awayPoints: 4 },
      { home: ['Stephanie Steenekamp','Dalene Minnaar'], away: ['Icem Wilken','Tasneem Sheikh'], sets: ['6-2','6-3','12-14'], homePoints: 3, awayPoints: 0 },
    ],
  },
];

const teamByName = Object.fromEntries(LADIES_S2_TEAMS.map((team) => [team.name, team]));
const playerByName = Object.fromEntries(LADIES_S2_TEAMS.flatMap((team) => team.players.map((player) => [player.name, player])));

LADIES_S2_TEAMS.forEach((team) => {
  team.stats = { played: 0, wins: 0, losses: 0, points: 0, pointsFor: 0, pointsAgainst: 0, differential: 0 };
  team.players.forEach((player) => Object.assign(player.stats, { played: 0, wins: 0, losses: 0, rubbers_won: 0, bonus_points: 0, mvp_points: 0 }));
});

LADIES_S2_ROUND1_RESULTS.forEach((match) => {
  const home = teamByName[match.home]; const away = teamByName[match.away];
  // Only completed franchise fixtures count as P/W/L in the league table. Partial rubber points are displayed but not tabled yet.
  if (home && away && match.status === 'FT') {
    home.stats.played += 1; away.stats.played += 1;
    home.stats.points += match.homePoints; away.stats.points += match.awayPoints;
    home.stats.pointsFor += match.homePoints; home.stats.pointsAgainst += match.awayPoints;
    away.stats.pointsFor += match.awayPoints; away.stats.pointsAgainst += match.homePoints;
    home.stats.differential = home.stats.pointsFor - home.stats.pointsAgainst;
    away.stats.differential = away.stats.pointsFor - away.stats.pointsAgainst;
    if (match.homePoints > match.awayPoints) { home.stats.wins += 1; away.stats.losses += 1; }
    else { away.stats.wins += 1; home.stats.losses += 1; }
  }
  match.rubbers.forEach((rubber) => {
    const homeWon = rubber.homePoints > rubber.awayPoints;
    [...rubber.home, ...rubber.away].forEach((name) => { if (playerByName[name]) playerByName[name].stats.played += 1; });
    rubber.home.forEach((name) => { const p = playerByName[name]; if (!p) return; p.stats[homeWon ? 'wins' : 'losses'] += 1; if (homeWon) p.stats.rubbers_won += 1; p.stats.mvp_points += rubber.homePoints; if (rubber.homePoints === 4) p.stats.bonus_points += 1; });
    rubber.away.forEach((name) => { const p = playerByName[name]; if (!p) return; p.stats[homeWon ? 'losses' : 'wins'] += 1; if (!homeWon) p.stats.rubbers_won += 1; p.stats.mvp_points += rubber.awayPoints; if (rubber.awayPoints === 4) p.stats.bonus_points += 1; });
  });
});

export const LADIES_S2_STANDINGS = LADIES_S2_TEAMS.map((team) => ({ ...team.stats, id: team.id, name: team.name, logo: team.logo }))
  .sort((a,b) => b.points - a.points || b.differential - a.differential || a.name.localeCompare(b.name));

export const LADIES_S2_RANKINGS = LADIES_S2_TEAMS.flatMap((team) => team.players.map((player) => ({ ...player.stats, id: player.id, name: player.name, team: team.name, logo: team.logo })))
  .filter((player) => player.played > 0)
  .sort((a,b) => b.mvp_points - a.mvp_points || b.wins - a.wins || a.name.localeCompare(b.name));

function renderLadiesRound1Live() {
  const root = document.querySelector('.lpv2');
  if (root && !root.querySelector('[data-ladies-round1-live]')) {
    const section = document.createElement('section'); section.className = 'lpv2-section'; section.dataset.ladiesRound1Live = 'true';
    section.innerHTML = `<div class="lpv2-section-heading"><span class="lpv2-kicker">LADIES FRANCHISE LEAGUE · MATCHWEEK 1</span><h2>Season 2 is underway</h2><p class="muted">Opening-night results · 19 August 2026</p></div><div class="grid cols-2">${LADIES_S2_ROUND1_RESULTS.map(m => `<div class="card" style="padding:16px"><span class="eyebrow">${m.status} · ${m.venue}</span><div class="row spread" style="margin-top:10px"><b>${m.home}</b><strong>${m.homePoints}</strong></div><div class="row spread"><b>${m.away}</b><strong>${m.awayPoints}</strong></div></div>`).join('')}</div><p class="muted" style="font-size:11px;margin-top:8px">Lunar Lillies v Desert Roses currently reflects the two officially supplied rubbers only (3–4 running score). The franchise result will finalise when the remaining scores are received.</p>`;
    const pulse = root.querySelector('.lpv2-pulse'); if (pulse?.nextSibling) root.insertBefore(section, pulse.nextSibling); else root.appendChild(section);
  }

  if (location.pathname === '/leagues') {
    const page = document.querySelector('.leagues-page');
    const ladiesActive = page && [...page.querySelectorAll('button')].some(b => b.classList.contains('on') && b.textContent.includes('Ladies Franchise League'));
    if (ladiesActive && !page.querySelector('[data-ladies-round1-table]')) {
      const section = document.createElement('section'); section.dataset.ladiesRound1Table = 'true'; section.className = 'card'; section.style.cssText = 'padding:18px;margin:16px 0';
      section.innerHTML = `<span class="eyebrow">Season 2 · Live table</span><h2 class="display" style="margin:5px 0 12px">Standings after completed Matchweek 1 fixtures</h2>${LADIES_S2_STANDINGS.map((t,i) => `<div class="row spread" style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,.08)"><span>${i+1}. ${t.name}</span><b>${t.points} pts</b></div>`).join('')}<h3 class="display" style="margin:18px 0 8px">Player rankings</h3>${LADIES_S2_RANKINGS.slice(0,20).map((p,i) => `<div class="row spread" style="padding:7px 0"><span>${i+1}. ${p.name} <small class="muted">· ${p.team}</small></span><b>${p.mvp_points}</b></div>`).join('')}`;
      page.prepend(section);
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', renderLadiesRound1Live);
  new MutationObserver(() => requestAnimationFrame(renderLadiesRound1Live)).observe(document.documentElement, { childList: true, subtree: true });
}
