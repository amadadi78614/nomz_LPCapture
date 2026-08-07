import { FIXTURES, STANDINGS } from './seed';

// The Men's Franchise League regular season consists of six fixtures per team.
// Ice Breakers v Sahara Lions was a post-season eliminator and must appear in
// Match Centre/player stats without changing the regular-season tables.
const fixture = FIXTURES.find((item) => item.id === 'fx-w6-ice-lions');

if (fixture && fixture.stage !== 'eliminator') {
  fixture.stage = 'eliminator';
  fixture.roundLabel = 'Playoff Eliminator';

  const bonus = (games, side) => (side === 'home' ? games?.[0] === 4 : games?.[1] === 4);

  const reverseResult = (rows, result) => {
    const home = rows.find((row) => row.franchise_id === fixture.home);
    const away = rows.find((row) => row.franchise_id === fixture.away);
    if (!home || !away) return;

    home.played -= 1;
    away.played -= 1;

    if (result.winner === 'home') {
      home.won -= 1;
      away.lost -= 1;
      home.points -= 3;
      if (bonus(result.games, 'home')) {
        home.bp -= 1;
        home.points -= 1;
      }
    } else {
      away.won -= 1;
      home.lost -= 1;
      away.points -= 3;
      if (bonus(result.games, 'away')) {
        away.bp -= 1;
        away.points -= 1;
      }
    }
  };

  fixture.score?.rubbers?.forEach((result) => {
    reverseResult(STANDINGS.mens.franchise, result);
    reverseResult(STANDINGS.mens[result.court], result);
  });

  ['franchise', 'P1', 'P2', 'P3'].forEach((tier) => {
    STANDINGS.mens[tier].sort(
      (a, b) => b.points - a.points || b.won - a.won || b.bp - a.bp || a.lost - b.lost,
    );
  });
}
