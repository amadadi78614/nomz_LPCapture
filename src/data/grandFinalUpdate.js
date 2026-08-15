import { FIXTURES, PLAYERS } from './seed';

const findPlayer = (franchiseId, names) => {
  const wanted = (Array.isArray(names) ? names : [names]).map((name) => name.toLowerCase().replace(/[^a-z0-9]/g, ''));
  return PLAYERS.find((player) => {
    if (player.franchise_id !== franchiseId) return false;
    const key = player.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return wanted.includes(key);
  });
};

const ids = (franchiseId, ...names) => names.map((name) => findPlayer(franchiseId, name)?.id || null);

const GRAND_FINAL = {
  id: 'fx-playoff-grand-final-2026',
  round: 9,
  roundLabel: 'Franchise League Grand Final',
  stage: 'final',
  league: 'mens',
  home: 'desert-falcons',
  away: 'sonic-viboras',
  start: '2026-08-14T18:00:00+02:00',
  status: 'final',
  court: 'Padel 24',
  score: {
    winner: 'home',
    totals: [14, 8],
    rubberWins: [4, 2],
    rubbers: [
      { slot: '18:00', court: 'P3', home: 'Jude van den Berg / Danie Rautenbach', away: 'Gerrit Smith / Stefan de Villiers', homeIds: ids('desert-falcons', 'Jude van den Berg', 'Danie Rautenbach'), awayIds: ids('sonic-viboras', 'Gerrit Smith', 'Stefan de Villiers'), sets: [[6,4],[6,2],[10,7]], games: [4,0], winner: 'home' },
      { slot: '18:00', court: 'P3', home: 'Jacques Burger / Reino Grobler', away: 'George du Toit / Dewald Meyer', homeIds: ids('desert-falcons', 'Jacques Burger', 'Reino Grobler'), awayIds: ids('sonic-viboras', 'George du Toit', 'Dewald Meyer'), sets: [[3,6],[4,6],[7,10]], games: [0,4], winner: 'away' },
      { slot: '18:00', court: 'P2', home: 'Ebrahim Mungalee / Fahad Patel', away: 'Marius Loock / Khalid Jeewa', homeIds: ids('desert-falcons', 'Ebrahim Mungalee', 'Fahad Patel'), awayIds: ids('sonic-viboras', 'Marius Loock', 'Khalid Jeewa'), sets: [[1,6],[3,6],[2,10]], games: [0,4], winner: 'away' },
      { slot: '19:15', court: 'P1', home: 'Uwais Patel / Yusuf Patel', away: 'Heinrich Coomans / Anton Grote', homeIds: ids('desert-falcons', ['Uwais Patel','Uwaiz Patel'], 'Yusuf Patel'), awayIds: ids('sonic-viboras', 'Heinrich Coomans', 'Anton Grote'), sets: [[6,3],[3,6],[10,7]], games: [3,0], winner: 'home' },
      { slot: '19:15', court: 'P1', home: 'Reinhardt Trollip / Schalk Schutte', away: 'Pieter Boshoff / Yusuf Moola', homeIds: ids('desert-falcons', 'Reinhardt Trollip', 'Schalk Schutte'), awayIds: ids('sonic-viboras', 'Pieter Boshoff', 'Yusuf Moola'), sets: [[6,4],[6,4],[10,8]], games: [4,0], winner: 'home' },
      { slot: '19:15', court: 'P2', home: 'Warno Smit / Ryan Wicht', away: 'Joshua Hoffman / Warwick Morgan', homeIds: ids('desert-falcons', 'Warno Smit', 'Ryan Wicht'), awayIds: ids('sonic-viboras', 'Joshua Hoffman', 'Warwick Morgan'), sets: [[5,7],[6,3],[10,5]], games: [3,0], winner: 'home' },
    ],
  },
};

if (!FIXTURES.some((fixture) => fixture.id === GRAND_FINAL.id)) FIXTURES.push(GRAND_FINAL);

const isBonus = (rubber, side) => side === 'home' ? rubber.games?.[0] === 4 && rubber.games?.[1] === 0 : rubber.games?.[1] === 4 && rubber.games?.[0] === 0;

GRAND_FINAL.score.rubbers.forEach((rubber) => {
  [['homeIds','home',0],['awayIds','away',1]].forEach(([key, side, scoreIndex]) => {
    (rubber[key] || []).filter(Boolean).forEach((playerId) => {
      const player = PLAYERS.find((item) => item.id === playerId);
      if (!player) return;
      player.stats.played += 1;
      if (rubber.winner === side) {
        player.stats.wins += 1;
        player.stats.rubbers_won += 1;
        if (isBonus(rubber, side)) player.stats.bonus_points += 1;
      } else {
        player.stats.losses += 1;
      }
      if (Array.isArray(rubber.sets)) {
        rubber.sets.forEach(([home, away], index) => {
          const won = scoreIndex === 0 ? home > away : away > home;
          if (won) player.stats.sets_won += 1;
          else player.stats.sets_lost += 1;
          if (index < 2) player.stats.games_won += scoreIndex === 0 ? home : away;
        });
      }
      player.stats.mvp_points = player.stats.rubbers_won * 3 + player.stats.bonus_points;
    });
  });
});

export { GRAND_FINAL };
