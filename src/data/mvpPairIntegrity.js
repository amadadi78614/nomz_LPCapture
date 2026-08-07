import { FIXTURES, PLAYERS } from './seed';

const normalise = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const isUwais = (value = '') => ['uwaispatel', 'uwaizpatel'].includes(normalise(value));
const isYusuf = (value = '') => normalise(value) === 'yusufpatel';

const uwais = PLAYERS.find((player) => player.franchise_id === 'desert-falcons' && isUwais(player.name));
const yusuf = PLAYERS.find((player) => player.franchise_id === 'desert-falcons' && isYusuf(player.name));

if (uwais && yusuf) {
  const joint = {
    played: 0,
    wins: 0,
    losses: 0,
    rubbers_won: 0,
    sets_won: 0,
    sets_lost: 0,
    games_won: 0,
    bonus_points: 0,
    mvp_points: 0,
  };

  FIXTURES.filter((fixture) => fixture.league === 'mens' && fixture.status === 'final')
    .forEach((fixture) => {
      (fixture.score?.rubbers || []).forEach((rubber) => {
        const homeNames = String(rubber.home || '').split('/').map((name) => name.trim());
        const awayNames = String(rubber.away || '').split('/').map((name) => name.trim());
        const side = homeNames.some(isUwais) && homeNames.some(isYusuf)
          ? 'home'
          : awayNames.some(isUwais) && awayNames.some(isYusuf)
            ? 'away'
            : null;
        if (!side) return;

        joint.played += 1;
        const homeSets = (rubber.sets || []).filter(([home, away]) => Number(home) > Number(away)).length;
        const awaySets = (rubber.sets || []).filter(([home, away]) => Number(away) > Number(home)).length;
        const won = rubber.winner === side;
        const scoreIndex = side === 'home' ? 0 : 1;
        const gamesWon = (rubber.sets || []).reduce((sum, setScore) => sum + (Number(setScore?.[scoreIndex]) || 0), 0);

        joint.sets_won += side === 'home' ? homeSets : awaySets;
        joint.sets_lost += side === 'home' ? awaySets : homeSets;
        joint.games_won += gamesWon;
        if (won) {
          joint.wins += 1;
          joint.rubbers_won += 1;
          const cleanFour = side === 'home' ? rubber.games?.[0] === 4 : rubber.games?.[1] === 4;
          if (cleanFour) joint.bonus_points += 1;
        } else {
          joint.losses += 1;
        }
      });
    });

  joint.mvp_points = joint.rubbers_won * 3 + joint.bonus_points;
  uwais.stats = { ...uwais.stats, ...joint };
  yusuf.stats = { ...yusuf.stats, ...joint };

  const sharedRating = Math.max(Number(uwais.lp_rating) || 0, Number(yusuf.lp_rating) || 0);
  uwais.lp_rating = sharedRating;
  yusuf.lp_rating = sharedRating;
}
