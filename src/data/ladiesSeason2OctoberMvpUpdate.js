import './ladiesSeason2Matchweek3Update';
import './ladiesSeason2Matchweek4Update';
import './ladiesSeason2Matchweek5Update';
import './ladiesSeason2Matchweek5FinalUpdate';
import { LADIES_S2_TEAMS } from './ladiesSeason2Data';
import { LADIES_S2_RANKINGS } from './ladiesSeason2Round1Update';
import { LADIES_S2_OCTOBER_RESULTS } from './ladiesSeason2OctoberResults';

// Post-season player credit is independent of the completed regular-season log.
// Use the same result objects as the visible match cards; each match is applied once.
const applied = new Set();
export function applyOctoberPlayerResults() {
  const players = new Map(LADIES_S2_TEAMS.flatMap(team =>
    team.players.map(player => [`${team.name}:${player.name}`, player])));
  for (const match of LADIES_S2_OCTOBER_RESULTS) {
    if (match.status !== 'FT' || applied.has(match.id)) continue;
    const rubbers = match.rubbers.filter(rubber => !rubber.admin);
    // Validate all participants before changing any statistics for the fixture.
    for (const rubber of rubbers) {
      for (const side of ['home', 'away']) {
        for (const name of rubber[side]) {
          if (!players.has(`${match[side]}:${name}`)) throw new Error(`Unknown Ladies player: ${name}`);
        }
      }
    }
    for (const rubber of rubbers) {
      for (const side of ['home', 'away']) {
        const other = side === 'home' ? 'away' : 'home';
        const won = rubber[`${side}Points`] > rubber[`${other}Points`];
        const bonus = won && rubber[`${side}Points`] === 4 ? 1 : 0;
        const sets = rubber.sets.map(score => score.split('-').map(Number));
        const setsWon = sets.filter(([h, a]) => side === 'home' ? h > a : a > h).length;
        for (const name of rubber[side]) {
          const stats = players.get(`${match[side]}:${name}`).stats;
          stats.played++;
          stats.wins += won ? 1 : 0;
          stats.losses += won ? 0 : 1;
          stats.rubbers_won += won ? 1 : 0;
          stats.bonus_points += bonus;
          stats.mvp_points += won ? 3 + bonus : 0;
          stats.sets_won += setsWon;
          stats.sets_lost += sets.length - setsWon;
        }
      }
    }
    applied.add(match.id);
  }
  const ranked = LADIES_S2_TEAMS.flatMap(team => team.players.map(player => ({
    ...player.stats, id: player.id, name: player.name, seed: player.seed, team: team.name, logo: team.logo,
  }))).sort((a, b) =>
    b.mvp_points - a.mvp_points || b.wins - a.wins || b.sets_won - a.sets_won || a.name.localeCompare(b.name));
  LADIES_S2_RANKINGS.splice(0, LADIES_S2_RANKINGS.length, ...ranked);
}
applyOctoberPlayerResults();
