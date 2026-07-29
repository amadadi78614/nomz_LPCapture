import { FIXTURES, PLAYERS, STANDINGS } from './seed';

const findPlayerId = (franchiseId, name) =>
  PLAYERS.find((p) => p.franchise_id === franchiseId && p.name === name)?.id || null;

const rubber = ({ slot, court, homeFranchise, awayFranchise, homeNames, awayNames, sets, games, winner, playedOn }) => ({
  slot,
  court,
  playedOn,
  home: homeNames.join(' / '),
  away: awayNames.join(' / '),
  homeIds: homeNames.map((name) => findPlayerId(homeFranchise, name)),
  awayIds: awayNames.map((name) => findPlayerId(awayFranchise, name)),
  sets,
  games,
  winner,
});

export const ROUND5_FIXTURES = [
  {
    id: 'fx-w5-1', round: 5, league: 'mens', home: 'globo-boomerangs', away: 'ice-breakers',
    start: '2026-07-27T18:00:00+02:00', status: 'final', court: 'Padel 24',
    score: { winner: 'home', totals: [15, 7], rubberWins: [4, 2], rubbers: [
      rubber({ slot: '18:00', court: 'P2', homeFranchise: 'globo-boomerangs', awayFranchise: 'ice-breakers', homeNames: ['Bevan Francis', 'Muhammed Shehzad Meer'], awayNames: ['Phil-Mar Van Rensburg', 'Zayd Methar'], sets: [[6,2],[6,3],[10,5]], games: [4,0], winner: 'home' }),
      rubber({ slot: '18:00', court: 'P1', homeFranchise: 'globo-boomerangs', awayFranchise: 'ice-breakers', homeNames: ['Adil Ahmed', 'Lefa Moganedi'], awayNames: ['Zaheer Methar', 'Salmaan Methar'], sets: [[7,5],[6,4],[3,10]], games: [3,0], winner: 'home' }),
      rubber({ slot: '19:15', court: 'P3', homeFranchise: 'globo-boomerangs', awayFranchise: 'ice-breakers', homeNames: ['Stefan Erasmus', 'Suhail Patel'], awayNames: ['Wayne Enslin', 'Waldo van Tonder'], sets: [[4,6],[2,6],[10,12]], games: [0,4], winner: 'away' }),
      rubber({ slot: '19:15', court: 'P2', homeFranchise: 'globo-boomerangs', awayFranchise: 'ice-breakers', homeNames: ['Diego Sebastian', 'Ryan Kennett'], awayNames: ['Zahid Methar', 'Chaz Taylor'], sets: [[6,3],[6,3],[10,6]], games: [4,0], winner: 'home' }),
      rubber({ slot: '20:30', court: 'P3', homeFranchise: 'globo-boomerangs', awayFranchise: 'ice-breakers', homeNames: ['Shaffique Jeewa', 'Farhaan Shaik'], awayNames: ['Aadam Nomani', 'Shaun Caromba'], sets: [[7,5],[7,5],[10,8]], games: [4,0], winner: 'home' }),
      rubber({ slot: '20:30', court: 'P1', homeFranchise: 'globo-boomerangs', awayFranchise: 'ice-breakers', homeNames: ['Yusuf Asvat', 'Ahmed Mungalee'], awayNames: ['Duhan Swart', 'Maaz Randera'], sets: [[6,7],[6,7],[10,8]], games: [0,3], winner: 'away' }),
    ] },
  },
  {
    id: 'fx-w5-2', round: 5, league: 'mens', home: 'sahara-lions', away: 'avalanche-aces',
    start: '2026-07-27T18:00:00+02:00', status: 'final', court: 'Padel 24',
    score: { winner: 'home', totals: [12, 10], rubberWins: [3, 3], rubbers: [
      rubber({ slot: '18:00', court: 'P1', homeFranchise: 'sahara-lions', awayFranchise: 'avalanche-aces', homeNames: ['Pieter Badenhorst', 'Justin van Staaden'], awayNames: ['Patrick Leyden', 'Steven Pinker'], sets: [[6,0],[6,1],[10,7]], games: [4,0], winner: 'home' }),
      rubber({ slot: '18:00', court: 'P2', homeFranchise: 'sahara-lions', awayFranchise: 'avalanche-aces', homeNames: ['Soyab Patel', 'Irfaan Mamji'], awayNames: ['Frik de Beer', 'Luqmaan Hoosen'], sets: [[7,5],[6,7],[15,17]], games: [0,3], winner: 'away' }),
      rubber({ slot: '19:15', court: 'P1', homeFranchise: 'sahara-lions', awayFranchise: 'avalanche-aces', homeNames: ['Cian Maritz', 'Yusuf Packery'], awayNames: ['Wiehann Mohlen', 'Hoffmann Maritz'], sets: [[7,6],[6,2],[10,4]], games: [4,0], winner: 'home' }),
      rubber({ slot: '19:15', court: 'P3', homeFranchise: 'sahara-lions', awayFranchise: 'avalanche-aces', homeNames: ['Warren Morgan', 'Aadil Asvat'], awayNames: ['Anas Mungalee', 'Gerco van Rooyen'], sets: [[0,6],[2,6],[6,10]], games: [0,4], winner: 'away' }),
      rubber({ slot: '20:30', court: 'P2', homeFranchise: 'sahara-lions', awayFranchise: 'avalanche-aces', homeNames: ['Alfaiz Mamji', 'Adil Patel'], awayNames: ['Etienne Grobler', 'Ruaan Naude'], sets: [[6,4],[6,1],[10,8]], games: [4,0], winner: 'home' }),
      rubber({ slot: '20:30', court: 'P3', homeFranchise: 'sahara-lions', awayFranchise: 'avalanche-aces', homeNames: ['Imtiaz Mohamed', 'Majid Bapu'], awayNames: ['Rishaad Shaik', 'Prashil Nagar'], sets: [[4,6],[4,6],[10,9]], games: [0,3], winner: 'away' }),
    ] },
  },
  {
    id: 'fx-w5-3', round: 5, league: 'mens', home: 'sahara-lions', away: 'samurai-kicksmashers',
    start: '2026-07-29T17:30:00+02:00', status: 'final', court: 'Padel 24',
    score: { winner: 'home', totals: [18, 3], rubberWins: [5, 1], rubbers: [
      rubber({ slot: '17:30', court: 'P1', homeFranchise: 'sahara-lions', awayFranchise: 'samurai-kicksmashers', homeNames: ['Cian Maritz', 'Yusuf Packery'], awayNames: ['Bryan Theron', 'Burger Bester'], sets: [[6,4],[6,2],[11,9]], games: [4,0], winner: 'home' }),
      rubber({ slot: '18:00', court: 'P2', homeFranchise: 'sahara-lions', awayFranchise: 'samurai-kicksmashers', homeNames: ['Naeem Omar', 'Alfaiz Mamji'], awayNames: ['Armand Esterhuizen', 'Muneer Shaik'], sets: [[6,3],[6,4],[10,5]], games: [4,0], winner: 'home' }),
      rubber({ slot: '19:15', court: 'P1', homeFranchise: 'sahara-lions', awayFranchise: 'samurai-kicksmashers', homeNames: ['Suhayl Packery', 'Justin van Staaden'], awayNames: ['Siraaj Shaik', 'Muhammad Azhar Sujee'], sets: [[6,3],[5,7],[10,3]], games: [3,0], winner: 'home' }),
      rubber({ slot: '19:15', court: 'P3', homeFranchise: 'sahara-lions', awayFranchise: 'samurai-kicksmashers', homeNames: ['Imtiaz Mohamed', 'Majid Bapu'], awayNames: ['Ismail Karodia', 'Nuaym Shaik'], sets: [[6,4],[7,6],[7,10]], games: [3,0], winner: 'home' }),
      rubber({ slot: '20:30', court: 'P2', homeFranchise: 'sahara-lions', awayFranchise: 'samurai-kicksmashers', homeNames: ['Soyab Patel', 'Adil Patel'], awayNames: ['Sikander Cassim', 'Shaun Moropa'], sets: [[6,1],[6,1],[10,8]], games: [4,0], winner: 'home' }),
      rubber({ slot: '20:30', court: 'P3', homeFranchise: 'sahara-lions', awayFranchise: 'samurai-kicksmashers', homeNames: ['Warren Morgan', 'Irfaan Mahomed'], awayNames: ['Riaz Ahmed Bellim', 'Dillon Francis'], sets: [[4,6],[6,4],[7,10]], games: [0,3], winner: 'away' }),
    ] },
  },
  {
    id: 'fx-w5-4', round: 5, league: 'mens', home: 'desert-falcons', away: 'sonic-viboras',
    start: '2026-07-29T18:00:00+02:00', status: 'final', court: 'Padel 24',
    score: { winner: 'home', totals: [15, 6], rubberWins: [4, 2], rubbers: [
      rubber({ slot: '19:30', court: 'P1', playedOn: '2026-07-28', homeFranchise: 'desert-falcons', awayFranchise: 'sonic-viboras', homeNames: ['Schalk Schutte', 'Faheem Nomani'], awayNames: ['Ridhwaan Sujee', 'Erlo Olivier'], sets: [[6,3],[6,4],[10,3]], games: [4,0], winner: 'home' }),
      rubber({ slot: '18:00', court: 'P3', playedOn: '2026-07-29', homeFranchise: 'desert-falcons', awayFranchise: 'sonic-viboras', homeNames: ['Reino Grobler', 'Muhammad Mangerah'], awayNames: ['George du Toit', 'Dewald Meyer'], sets: [[7,6],[1,6],[9,11]], games: [0,3], winner: 'away' }),
      rubber({ slot: '19:15', court: 'P1', playedOn: '2026-07-29', homeFranchise: 'desert-falcons', awayFranchise: 'sonic-viboras', homeNames: ['Yusuf Patel', 'Uwaiz Patel'], awayNames: ['Heinrich Coomans', 'Pieter Boshoff'], sets: [[6,4],[6,3],[10,7]], games: [4,0], winner: 'home' }),
      rubber({ slot: '19:15', court: 'P2', playedOn: '2026-07-29', homeFranchise: 'desert-falcons', awayFranchise: 'sonic-viboras', homeNames: ['Fahad Patel', 'Ebrahim Mungalee'], awayNames: ['Marius Loock', 'Khalid Jeewa'], sets: [[6,7],[4,6],[10,4]], games: [0,3], winner: 'away' }),
      rubber({ slot: '20:30', court: 'P2', playedOn: '2026-07-29', homeFranchise: 'desert-falcons', awayFranchise: 'sonic-viboras', homeNames: ['Warno Smit', 'Morne Steenekamp'], awayNames: ['Warwick Morgan', 'Joshua Hoffman'], sets: [[6,3],[7,5],[10,8]], games: [4,0], winner: 'home' }),
      rubber({ slot: '20:30', court: 'P3', playedOn: '2026-07-29', homeFranchise: 'desert-falcons', awayFranchise: 'sonic-viboras', homeNames: ['Zaeem Sadiq', 'Jude van den Berg'], awayNames: ['Gerrit Smith', 'Stefan de Villiers'], sets: [[7,6],[7,5],[4,10]], games: [3,0], winner: 'home' }),
    ] },
  },
];

const existingIds = new Set(FIXTURES.map((fixture) => fixture.id));
ROUND5_FIXTURES.filter((fixture) => !existingIds.has(fixture.id)).forEach((fixture) => FIXTURES.push(fixture));

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

// The seed fixture list already contains presentation copies of some Round 5 fixtures.
// Standings and player statistics must nevertheless process every official Round 5 result exactly once.
ROUND5_FIXTURES.forEach((fixture) => {
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