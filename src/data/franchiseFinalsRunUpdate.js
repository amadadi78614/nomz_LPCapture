import { FIXTURES, PLAYERS, STANDINGS } from './seed';

const normalise = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const findPlayerId = (franchiseId, name, aliases = []) => {
  const candidates = [name, ...aliases].map(normalise);
  const exact = PLAYERS.find((player) => player.franchise_id === franchiseId && candidates.includes(normalise(player.name)));
  if (exact) return exact.id;
  const tokens = normalise(name);
  return PLAYERS.find((player) => player.franchise_id === franchiseId && (normalise(player.name).includes(tokens) || tokens.includes(normalise(player.name))))?.id || null;
};

const rubber = ({ slot, court, homeFranchise, awayFranchise, homeNames, awayNames, sets, games, winner }) => ({
  slot,
  court,
  home: homeNames.join(' / '),
  away: awayNames.join(' / '),
  homeIds: homeNames.map((name) => findPlayerId(homeFranchise, name)),
  awayIds: awayNames.map((name) => findPlayerId(awayFranchise, name)),
  sets,
  games,
  winner,
});

export const FINALS_RUN_FIXTURES = [
  {
    id: 'fx-w6-lions-falcons', round: 6, league: 'mens', home: 'sahara-lions', away: 'desert-falcons',
    start: '2026-08-03T18:00:00+02:00', status: 'final', court: 'Play 360',
    score: { winner: 'home', totals: [13, 7], rubberWins: [4, 2], rubbers: [
      rubber({ slot: '18:00', court: 'P1', homeFranchise: 'sahara-lions', awayFranchise: 'desert-falcons', homeNames: ['Cian Maritz', 'Yusuf Packery'], awayNames: ['Uwaiz Patel', 'Yusuf Patel'], sets: [[3,6],[6,3],[11,13]], games: [0,3], winner: 'away' }),
      rubber({ slot: '20:30', court: 'P1', homeFranchise: 'sahara-lions', awayFranchise: 'desert-falcons', homeNames: ['Pieter Badenhorst', 'Justin van Staaden'], awayNames: ['Reinhardt Trollip', 'Ahmed Ismail'], sets: [[1,6],[6,3],[10,5]], games: [3,0], winner: 'home' }),
      rubber({ slot: '19:15', court: 'P2', homeFranchise: 'sahara-lions', awayFranchise: 'desert-falcons', homeNames: ['Adil Patel', 'Suliman Patel'], awayNames: ['Rayhaan Dinath', 'Ebrahim Mungalee'], sets: [[6,2],[6,3],[10,4]], games: [4,0], winner: 'home' }),
      rubber({ slot: '20:30', court: 'P2', homeFranchise: 'sahara-lions', awayFranchise: 'desert-falcons', homeNames: ['Naeem Omar', 'Alfaiz Mamji'], awayNames: ['Warno Smit', 'Fahad Patel'], sets: [[6,2],[2,6],[10,4]], games: [3,0], winner: 'home' }),
      rubber({ slot: '18:00', court: 'P3', homeFranchise: 'sahara-lions', awayFranchise: 'desert-falcons', homeNames: ['Majid Bapu', 'Imtiaz Mohamed'], awayNames: ['Jude van den Berg', 'Danie Rautenbach'], sets: [[1,6],[1,6],[4,10]], games: [0,4], winner: 'away' }),
      rubber({ slot: '19:15', court: 'P3', homeFranchise: 'sahara-lions', awayFranchise: 'desert-falcons', homeNames: ['Drikus Prins', 'Warren Morgan'], awayNames: ['Jacques Burger', 'Zaeem Sadiq'], sets: [[6,1],[5,7],[10,7]], games: [3,0], winner: 'home' }),
    ] },
  },
  {
    id: 'fx-w6-kicksmashers-ice', round: 6, league: 'mens', home: 'samurai-kicksmashers', away: 'ice-breakers',
    start: '2026-08-03T18:00:00+02:00', status: 'final', court: 'Padel 24',
    score: { winner: 'away', totals: [4, 17], rubberWins: [1, 5], rubbers: [
      rubber({ slot: '18:00', court: 'P1', homeFranchise: 'samurai-kicksmashers', awayFranchise: 'ice-breakers', homeNames: ['Durell Pillay', 'Bryan Theron'], awayNames: ['Duhan Swart', 'Imaad Arabi'], sets: [[2,6],[6,7],[4,10]], games: [0,4], winner: 'away' }),
      rubber({ slot: '18:00', court: 'P3', homeFranchise: 'samurai-kicksmashers', awayFranchise: 'ice-breakers', homeNames: ['Imraan Khan', 'Nuaym Shaik'], awayNames: ['Waldo van Tonder', 'Shaun Caromba'], sets: [[5,7],[3,6],[10,4]], games: [0,3], winner: 'away' }),
      rubber({ slot: '19:15', court: 'P2', homeFranchise: 'samurai-kicksmashers', awayFranchise: 'ice-breakers', homeNames: ['Sikander Cassim', 'Tim Forssman'], awayNames: ['Zahid Methar', 'Chaz Taylor'], sets: [[6,4],[6,7],[9,11]], games: [0,3], winner: 'away' }),
      rubber({ slot: '19:15', court: 'P3', homeFranchise: 'samurai-kicksmashers', awayFranchise: 'ice-breakers', homeNames: ['Brent Grix', 'Riaz Ahmed Bellim'], awayNames: ['Wayne Enslin', 'Sergio Correia'], sets: [[6,3],[6,4],[10,8]], games: [4,0], winner: 'home' }),
      rubber({ slot: '20:30', court: 'P1', homeFranchise: 'samurai-kicksmashers', awayFranchise: 'ice-breakers', homeNames: ['Siraaj Shaik', 'Danyaal Nomani'], awayNames: ['Zaheer Methar', 'Maaz Randera'], sets: [[3,6],[6,4],[5,10]], games: [0,3], winner: 'away' }),
      rubber({ slot: '20:30', court: 'P3', homeFranchise: 'samurai-kicksmashers', awayFranchise: 'ice-breakers', homeNames: ['Muneer Shaik', 'Shaun Moropa'], awayNames: ['Jacques Van Zyl', 'Phil-Mar Van Rensburg'], sets: [[1,6],[3,6],[7,10]], games: [0,4], winner: 'away' }),
    ] },
  },
  {
    id: 'fx-w6-ice-lions', round: 6, league: 'mens', home: 'ice-breakers', away: 'sahara-lions',
    start: '2026-08-03T18:00:00+02:00', status: 'final', court: 'Padel 24',
    score: { winner: 'away', totals: [7, 15], rubberWins: [2, 4], rubbers: [
      rubber({ slot: '18:00', court: 'P2', homeFranchise: 'ice-breakers', awayFranchise: 'sahara-lions', homeNames: ['Jacques Van Zyl', 'Zayd Methar'], awayNames: ['Naeem Omar', 'Alfaiz Mamji'], sets: [[3,6],[6,3],[8,10]], games: [0,3], winner: 'away' }),
      rubber({ slot: '18:00', court: 'P3', homeFranchise: 'ice-breakers', awayFranchise: 'sahara-lions', homeNames: ['Irshaad Moola', 'Aadam Nomani'], awayNames: ['Majid Bapu', 'Imtiaz Mohamed'], sets: [[6,3],[7,5],[5,10]], games: [3,0], winner: 'home' }),
      rubber({ slot: '19:15', court: 'P1', homeFranchise: 'ice-breakers', awayFranchise: 'sahara-lions', homeNames: ['Maaz Randera', 'Zaheer Methar'], awayNames: ['Pieter Badenhorst', 'Justin van Staaden'], sets: [[1,6],[3,6],[4,10]], games: [0,4], winner: 'away' }),
      rubber({ slot: '19:15', court: 'P2', homeFranchise: 'ice-breakers', awayFranchise: 'sahara-lions', homeNames: ['Chaz Taylor', 'Nicky Joubert'], awayNames: ['Adil Patel', 'Soyab Patel'], sets: [[2,6],[6,7],[6,10]], games: [0,4], winner: 'away' }),
      rubber({ slot: '20:30', court: 'P1', homeFranchise: 'ice-breakers', awayFranchise: 'sahara-lions', homeNames: ['Duhan Swart', 'JD Herbst'], awayNames: ['Cian Maritz', 'Yusuf Packery'], sets: [[3,6],[4,6],[9,11]], games: [0,4], winner: 'away' }),
      rubber({ slot: '20:30', court: 'P3', homeFranchise: 'ice-breakers', awayFranchise: 'sahara-lions', homeNames: ['Wayne Enslin', 'Waldo van Tonder'], awayNames: ['Warren Morgan', 'Irfaan Mahomed'], sets: [[6,4],[7,6],[10,7]], games: [4,0], winner: 'home' }),
    ] },
  },
  {
    id: 'fx-playoff-falcons-sonics', round: 7, roundLabel: 'Final Qualifier', stage: 'qualifier', league: 'mens', home: 'desert-falcons', away: 'sonic-viboras',
    start: '2026-08-06T18:00:00+02:00', status: 'final', court: 'Padel 24',
    score: { winner: 'away', totals: [8, 15], rubberWins: [2, 4], rubbers: [
      rubber({ slot: '18:00', court: 'P2', homeFranchise: 'desert-falcons', awayFranchise: 'sonic-viboras', homeNames: ['Rayhaan Dinath', 'Ebrahim Mungalee'], awayNames: ['Marius Loock', 'Khalid Jeewa'], sets: [[5,7],[1,6],[8,10]], games: [0,4], winner: 'away' }),
      rubber({ slot: '18:00', court: 'P3', homeFranchise: 'desert-falcons', awayFranchise: 'sonic-viboras', homeNames: ['Danie Rautenbach', 'Jude van den Berg'], awayNames: ['Gerrit Smith', 'Mohamed Dadamia'], sets: [[6,2],[6,4],[10,5]], games: [4,0], winner: 'home' }),
      rubber({ slot: '19:15', court: 'P1', homeFranchise: 'desert-falcons', awayFranchise: 'sonic-viboras', homeNames: ['Reinhardt Trollip', 'Schalk Schutte'], awayNames: ['Pieter Boshoff', 'Yusuf Moola'], sets: [[6,2],[6,2],[10,7]], games: [4,0], winner: 'home' }),
      rubber({ slot: '19:15', court: 'P1', homeFranchise: 'desert-falcons', awayFranchise: 'sonic-viboras', homeNames: ['Uwaiz Patel', 'Yusuf Patel'], awayNames: ['Heinrich Coomans', 'Anton Grote'], sets: [[7,5],[3,6],[6,10]], games: [0,3], winner: 'away' }),
      rubber({ slot: '20:30', court: 'P2', homeFranchise: 'desert-falcons', awayFranchise: 'sonic-viboras', homeNames: ['Warno Smit', 'Fahad Patel'], awayNames: ['Warwick Morgan', 'Joshua Hoffman'], sets: [[4,6],[4,6],[6,10]], games: [0,4], winner: 'away' }),
      rubber({ slot: '20:30', court: 'P3', homeFranchise: 'desert-falcons', awayFranchise: 'sonic-viboras', homeNames: ['Jacques Burger', 'Reino Grobler'], awayNames: ['George du Toit', 'Dewald Meyer'], sets: [[4,6],[4,6],[5,10]], games: [0,4], winner: 'away' }),
    ] },
  },
  {
    id: 'fx-playoff-lions-falcons-semifinal', round: 8, roundLabel: 'Franchise League Semi-final', stage: 'semifinal', league: 'mens', home: 'sahara-lions', away: 'desert-falcons',
    start: '2026-08-13T18:00:00+02:00', status: 'final', court: 'Padel 24',
    score: { winner: 'away', totals: [11, 12], rubberWins: [3, 3], rubbers: [
      rubber({ slot: '18:00', court: 'P3', homeFranchise: 'sahara-lions', awayFranchise: 'desert-falcons', homeNames: ['Drikus Prins', 'Warren Morgan'], awayNames: ['Jacques Burger', 'Reino Grobler'], sets: [[6,1],[0,6],[7,10]], games: [0,3], winner: 'away' }),
      rubber({ slot: '18:00', court: 'P3', homeFranchise: 'sahara-lions', awayFranchise: 'desert-falcons', homeNames: ['Majid Bapu', 'Irfaan Mahomed'], awayNames: ['Danie Rautenbach', 'Jude van den Berg'], sets: [[3,6],[0,6],[7,10]], games: [0,4], winner: 'away' }),
      rubber({ slot: '19:15', court: 'P1', homeFranchise: 'sahara-lions', awayFranchise: 'desert-falcons', homeNames: ['Cian Maritz', 'Yusuf Packery'], awayNames: ['Uwaiz Patel', 'Yusuf Patel'], sets: [[7,6],[1,6],[12,10]], games: [3,0], winner: 'home' }),
      rubber({ slot: '19:15', court: 'P2', homeFranchise: 'sahara-lions', awayFranchise: 'desert-falcons', homeNames: ['Adil Patel', 'Soyab Patel'], awayNames: ['Fahad Patel', 'Rayhaan Dinath'], sets: [[6,1],[6,2],[11,9]], games: [4,0], winner: 'home' }),
      rubber({ slot: '20:30', court: 'P1', homeFranchise: 'sahara-lions', awayFranchise: 'desert-falcons', homeNames: ['Pieter Badenhorst', 'Justin van Staaden'], awayNames: ['Reinhardt Trollip', 'Schalk Schutte'], sets: [[1,6],[3,6],[4,10]], games: [0,4], winner: 'away' }),
      rubber({ slot: '20:30', court: 'P2', homeFranchise: 'sahara-lions', awayFranchise: 'desert-falcons', homeNames: ['Alfaiz Mamji', 'Naeem Omar'], awayNames: ['Warno Smit', 'Ryan Wicht'], sets: [[5,7],[6,3],[10,6]], games: [3,0], winner: 'home' }),
    ] },
  },
];

const matchupKey = (fixture) => `${[fixture.home, fixture.away].sort().join('|')}|${fixture.stage || 'regular'}|${fixture.round}`;
const officialKeys = new Set(FINALS_RUN_FIXTURES.map(matchupKey));
for (let index = FIXTURES.length - 1; index >= 0; index -= 1) {
  const fixture = FIXTURES[index];
  if (fixture.league !== 'mens') continue;
  if (officialKeys.has(matchupKey(fixture)) && new Date(fixture.start) >= new Date('2026-08-01T00:00:00+02:00')) FIXTURES.splice(index, 1);
}
FINALS_RUN_FIXTURES.forEach((fixture) => FIXTURES.push(fixture));
FIXTURES.sort((a, b) => new Date(a.start) - new Date(b.start));

const bonus = (games, side) => (side === 'home' ? games?.[0] === 4 : games?.[1] === 4);
const applyTableResult = (rows, fixture, result) => {
  const home = rows.find((row) => row.franchise_id === fixture.home);
  const away = rows.find((row) => row.franchise_id === fixture.away);
  if (!home || !away) return;
  home.played += 1; away.played += 1;
  if (result.winner === 'home') {
    home.won += 1; away.lost += 1; home.points += 3;
    if (bonus(result.games, 'home')) { home.bp += 1; home.points += 1; }
  } else {
    away.won += 1; home.lost += 1; away.points += 3;
    if (bonus(result.games, 'away')) { away.bp += 1; away.points += 1; }
  }
};

const updatePlayer = (id, result, side, scoreIndex) => {
  if (!id) return;
  const player = PLAYERS.find((item) => item.id === id);
  if (!player) return;
  const homeSets = result.sets.filter(([home, away]) => home > away).length;
  const awaySets = result.sets.filter(([home, away]) => away > home).length;
  const setsWon = side === 'home' ? homeSets : awaySets;
  const setsLost = side === 'home' ? awaySets : homeSets;
  player.stats.played += 1;
  player.stats.sets_won += setsWon;
  player.stats.sets_lost += setsLost;
  player.stats.games_won += result.sets.reduce((sum, setScore) => sum + (Number(setScore?.[scoreIndex]) || 0), 0);
  if (result.winner === side) {
    player.stats.wins += 1;
    player.stats.rubbers_won += 1;
    if (bonus(result.games, side)) player.stats.bonus_points += 1;
  } else {
    player.stats.losses += 1;
  }
  player.stats.mvp_points = player.stats.rubbers_won * 3 + player.stats.bonus_points;
};

FINALS_RUN_FIXTURES.forEach((fixture) => {
  fixture.score.rubbers.forEach((result) => {
    if (!fixture.stage) {
      applyTableResult(STANDINGS.mens.franchise, fixture, result);
      applyTableResult(STANDINGS.mens[result.court], fixture, result);
    }
    result.homeIds.forEach((id) => updatePlayer(id, result, 'home', 0));
    result.awayIds.forEach((id) => updatePlayer(id, result, 'away', 1));
  });
});

['franchise', 'P1', 'P2', 'P3'].forEach((tier) => {
  STANDINGS.mens[tier].sort((a, b) => b.points - a.points || b.won - a.won || b.bp - a.bp || a.lost - b.lost);
});