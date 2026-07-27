import { FIXTURES, PLAYERS, STANDINGS } from './seed';

const findPlayerId = (franchiseId, name) =>
  PLAYERS.find((p) => p.franchise_id === franchiseId && p.name === name)?.id || null;

const rubber = ({ slot, court, home, away, homeNames, awayNames, sets, games, winner }) => ({
  slot,
  court,
  home,
  away,
  homeIds: homeNames.map((name) => findPlayerId(home.includes('Lions') ? 'sahara-lions' : home.includes('Aces') ? 'avalanche-aces' : home.includes('Ice') ? 'ice-breakers' : 'globo-boomerangs', name)),
  awayIds: awayNames.map((name) => findPlayerId(away.includes('Lions') ? 'sahara-lions' : away.includes('Aces') ? 'avalanche-aces' : away.includes('Ice') ? 'ice-breakers' : 'globo-boomerangs', name)),
  sets,
  games,
  winner,
});

const fixtures = [
  {
    id: 'fx-w5-1', round: 5, league: 'mens', home: 'globo-boomerangs', away: 'ice-breakers',
    start: '2026-07-27T18:00:00+02:00', status: 'final', court: 'Padel 24',
    score: { winner: 'home', totals: [15, 7], rubberWins: [4, 2], rubbers: [
      rubber({ slot: '18:00', court: 'P2', home: 'Globo Boomerangs', away: 'Ice Breakers', homeNames: ['Bevan Francis', 'Muhammed Shehzad Meer'], awayNames: ['Phil-Mar Van Rensburg', 'Zayd Methar'], sets: [[6,2],[6,3],[10,5]], games: [4,0], winner: 'home' }),
      rubber({ slot: '18:00', court: 'P1', home: 'Globo Boomerangs', away: 'Ice Breakers', homeNames: ['Adil Ahmed', 'Lefa Moganedi'], awayNames: ['Zaheer Methar', 'Salmaan Methar'], sets: [[7,5],[6,4],[3,10]], games: [3,0], winner: 'home' }),
      rubber({ slot: '19:15', court: 'P3', home: 'Ice Breakers', away: 'Globo Boomerangs', homeNames: ['Wayne Enslin', 'Waldo van Tonder'], awayNames: ['Stefan Erasmus', 'Suhail Patel'], sets: [[6,4],[6,2],[12,10]], games: [0,4], winner: 'away' }),
      rubber({ slot: '19:15', court: 'P2', home: 'Globo Boomerangs', away: 'Ice Breakers', homeNames: ['Diego Sebastian', 'Ryan Kennett'], awayNames: ['Zahid Methar', 'Chaz Taylor'], sets: [[6,3],[6,3],[10,6]], games: [4,0], winner: 'home' }),
      rubber({ slot: '20:30', court: 'P3', home: 'Globo Boomerangs', away: 'Ice Breakers', homeNames: ['Shaffique Jeewa', 'Farhaan Shaik'], awayNames: ['Aadam Nomani', 'Shaun Caromba'], sets: [[7,5],[7,5],[10,8]], games: [4,0], winner: 'home' }),
      rubber({ slot: '20:30', court: 'P1', home: 'Ice Breakers', away: 'Globo Boomerangs', homeNames: ['Duhan Swart', 'Maaz Randera'], awayNames: ['Yusuf Asvat', 'Ahmed Mungalee'], sets: [[7,6],[7,6],[8,10]], games: [0,3], winner: 'away' }),
    ] },
  },
  {
    id: 'fx-w5-2', round: 5, league: 'mens', home: 'sahara-lions', away: 'avalanche-aces',
    start: '2026-07-27T18:00:00+02:00', status: 'final', court: 'Padel 24',
    score: { winner: 'home', totals: [12, 10], rubberWins: [3, 3], rubbers: [
      rubber({ slot: '18:00', court: 'P1', home: 'Sahara Lions', away: 'Avalanche Aces', homeNames: ['Pieter Badenhorst', 'Justin van Staaden'], awayNames: ['Patrick Leyden', 'Steven Pinker'], sets: [[6,0],[6,1],[10,7]], games: [4,0], winner: 'home' }),
      rubber({ slot: '18:00', court: 'P2', home: 'Sahara Lions', away: 'Avalanche Aces', homeNames: ['Soyab Patel', 'Irfaan Mamji'], awayNames: ['Frik de Beer', 'Luqmaan Hoosen'], sets: [[7,5],[6,7],[15,17]], games: [0,3], winner: 'away' }),
      rubber({ slot: '19:15', court: 'P1', home: 'Sahara Lions', away: 'Avalanche Aces', homeNames: ['Cian Maritz', 'Yusuf Packery'], awayNames: ['Wiehann Mohlen', 'Hoffmann Maritz'], sets: [[7,6],[6,2],[10,4]], games: [4,0], winner: 'home' }),
      rubber({ slot: '19:15', court: 'P3', home: 'Sahara Lions', away: 'Avalanche Aces', homeNames: ['Warren Morgan', 'Aadil Asvat'], awayNames: ['Anas Mungalee', 'Gerco van Rooyen'], sets: [[0,6],[2,6],[6,10]], games: [0,4], winner: 'away' }),
      rubber({ slot: '20:30', court: 'P2', home: 'Sahara Lions', away: 'Avalanche Aces', homeNames: ['Alfaiz Mamji', 'Adil Patel'], awayNames: ['Etienne Grobler', 'Ruaan Naude'], sets: [[6,4],[6,1],[10,8]], games: [4,0], winner: 'home' }),
      rubber({ slot: '20:30', court: 'P3', home: 'Sahara Lions', away: 'Avalanche Aces', homeNames: ['Imtiaz Mohamed', 'Majid Bapu'], awayNames: ['Rishaad Shaik', 'Prashil Nagar'], sets: [[4,6],[4,6],[10,9]], games: [0,3], winner: 'away' }),
    ] },
  },
];

const fixtureExists = (id) => FIXTURES.some((fixture) => fixture.id === id);
fixtures.forEach((fixture) => { if (!fixtureExists(fixture.id)) FIXTURES.push(fixture); });

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

fixtures.forEach((fixture) => {
  fixture.score.rubbers.forEach((result) => {
    applyTableResult(STANDINGS.mens.franchise, fixture, result);
    applyTableResult(STANDINGS.mens[result.court], fixture, result);

    const homeSets = result.sets.filter(([h, a]) => h > a).length;
    const awaySets = result.sets.length - homeSets;
    [['homeIds', 'home', homeSets, awaySets, 0], ['awayIds', 'away', awaySets, homeSets, 1]].forEach(([key, side, setsWon, setsLost, scoreIndex]) => {
      result[key].filter(Boolean).forEach((id) => {
        const player = PLAYERS.find((p) => p.id === id);
        if (!player) return;
        player.stats.played += 1;
        player.stats.sets_won += setsWon;
        player.stats.sets_lost += setsLost;
        player.stats.games_won += result.sets[0][scoreIndex] + result.sets[1][scoreIndex];
        if (result.winner === side) {
          player.stats.wins += 1;
          player.stats.rubbers_won += 1;
          if (bonus(result.games, side)) player.stats.bonus_points += 1;
        } else {
          player.stats.losses += 1;
        }
        player.stats.mvp_points = player.stats.rubbers_won * 3 + player.stats.bonus_points;
      });
    });
  });
});

['franchise', 'P1', 'P2', 'P3'].forEach((tier) => {
  STANDINGS.mens[tier].sort((a, b) => b.points - a.points || b.won - a.won || b.bp - a.bp || a.lost - b.lost);
});
