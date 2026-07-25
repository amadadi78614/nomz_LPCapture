import { LEGACY_FIXTURES, LEGACY_PLAYERS, LEGACY_STANDINGS } from './seed';

// Official LP Legacy League Match Day 2 results — 25 July 2026.
// This module patches the local seed data without duplicating the full seed file.

const round2Fixtures = [
  {
    id: 'lg-md2-1', round: 2, league: 'legacy', league_type: 'legacy',
    home: 'lp-honey-badgers', away: 'lp-leopards',
    start: new Date('2026-07-25T14:00:00+02:00'), court: 'Play 360', status: 'final',
    score: {
      winner: 'home', totals: [7, 4],
      rubbers: [
        { slot: '14:00', winner: 'home', games: [3, 0], homeIds: ['Scharl van den Berg', 'Jameel Valley'], awayIds: ['Ozayr Shaik', 'Ebrahim Mangerah'], sets: [[7,5],[3,6],[10,5]] },
        { slot: '15:00', winner: 'home', games: [4, 0], homeIds: ['Jude van den Berg', 'Seth van den Berg'], awayIds: ['Huzaifah Sujee', 'Muhammed Ruhaan Shaik'], sets: [[6,0],[6,1],[10,6]], youth: true },
        { slot: '16:00', winner: 'away', games: [0, 4], homeIds: ['Zandre de Kok', 'Faheem Seedat'], awayIds: ['Ridhwaan Sujee', 'Adil Amod'], sets: [[2,6],[4,6],[5,10]] },
      ],
    },
  },
  {
    id: 'lg-md2-2', round: 2, league: 'legacy', league_type: 'legacy',
    home: 'lp-jackals', away: 'lp-rhinos',
    start: new Date('2026-07-25T14:00:00+02:00'), court: 'Play 360', status: 'final',
    score: {
      winner: 'home', totals: [7, 4],
      rubbers: [
        { slot: '14:00', winner: 'home', games: [3, 0], homeIds: ['Fahad Patel', 'Hussain'], awayIds: ['Christiaan van Aardt', 'Zinidine Morgan'], sets: [[6,3],[4,6],[10,6]] },
        { slot: '15:00', winner: 'away', games: [0, 4], homeIds: ['Joe', 'Zunaid Ganchi'], awayIds: ['Rafiq Mohamed', 'Yusuf Amod'], sets: [[2,6],[1,6],[5,10]] },
        { slot: '16:00', winner: 'home', games: [4, 0], homeIds: ['Hussain', 'Zuhayr Ismail'], awayIds: ['Eesa Moola', 'Muhammed Moola'], sets: [[6,3],[6,4],[10,6]], youth: true },
      ],
    },
  },
  {
    id: 'lg-md2-3', round: 2, league: 'legacy', league_type: 'legacy',
    home: 'lp-cheetahs', away: 'lp-eagles',
    start: new Date('2026-07-25T17:00:00+02:00'), court: 'Play 360', status: 'final',
    score: {
      winner: 'home', totals: [8, 3],
      rubbers: [
        { slot: '17:00', winner: 'home', games: [4, 0], homeIds: ['Sandeep Daya', 'Michael Smit'], awayIds: ['Dian Erasmus', 'Akmeer Amod'], sets: [[6,0],[6,1],[10,2]] },
        { slot: '17:00', winner: 'home', games: [4, 0], homeIds: ['Aadam Nomani', 'Mikel Pillay'], awayIds: ['Armaan Bhikhoo', 'Yahya Sujee'], sets: [[6,1],[6,2],[10,6]], youth: true, featured: true },
        { slot: '18:00', winner: 'away', games: [0, 3], homeIds: ['Mohamed Nomani', 'Shoaib Nomani'], awayIds: ['Mohamed Azhar Sujee', 'Sahal Yunus'], sets: [[3,6],[6,4],[3,10]] },
      ],
    },
  },
];

for (const fixture of round2Fixtures) {
  if (!LEGACY_FIXTURES.some((f) => f.id === fixture.id)) LEGACY_FIXTURES.push(fixture);
}

const standings = {
  'lp-cheetahs':      { played: 2, won: 2, lost: 0, drawn: 0, bp: 0, points: 16, mp: 16, gd: 10, adj: 0 },
  'lp-honey-badgers': { played: 2, won: 2, lost: 0, drawn: 0, bp: 0, points: 14, mp: 14, gd: 7,  adj: 0 },
  'lp-leopards':      { played: 2, won: 1, lost: 1, drawn: 0, bp: 0, points: 12, mp: 12, gd: -1, adj: 0 },
  'lp-jackals':       { played: 2, won: 1, lost: 1, drawn: 0, bp: 0, points: 11, mp: 11, gd: 1,  adj: 0 },
  'lp-rhinos':        { played: 2, won: 0, lost: 2, drawn: 0, bp: 0, points: 7,  mp: 7,  gd: -8, adj: 0 },
  'lp-eagles':        { played: 2, won: 0, lost: 2, drawn: 0, bp: 0, points: 7,  mp: 7,  gd: -9, adj: 0 },
};

for (const row of LEGACY_STANDINGS) Object.assign(row, standings[row.franchise_id] || {});
LEGACY_STANDINGS.sort((a, b) => b.points - a.points || b.gd - a.gd);

const normalise = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const aliases = {
  michealsmit: 'michaelsmit',
  noms: 'mohamednomani',
  sujee: 'mohamedazharsujee',
  raf: 'rafiqmohamed',
  muhamedmoola: 'muhammedmoola',
};
const findPlayer = (name) => {
  const key = aliases[normalise(name)] || normalise(name);
  return LEGACY_PLAYERS.find((p) => normalise(p.name) === key);
};

for (const fixture of round2Fixtures) {
  for (const rubber of fixture.score.rubbers) {
    const homeWon = rubber.winner === 'home';
    const homeSets = rubber.sets.filter(([h, a]) => h > a).length;
    const awaySets = rubber.sets.filter(([h, a]) => a > h).length;
    for (const [side, names] of [['home', rubber.homeIds], ['away', rubber.awayIds]]) {
      for (const name of names) {
        const player = findPlayer(name);
        if (!player) continue;
        const won = side === 'home' ? homeWon : !homeWon;
        player.stats.played += 1;
        player.stats.wins += won ? 1 : 0;
        player.stats.losses += won ? 0 : 1;
        player.stats.rubbers_won += won ? 1 : 0;
        player.stats.sets_won += side === 'home' ? homeSets : awaySets;
        player.stats.sets_lost += side === 'home' ? awaySets : homeSets;
        player.stats.bonus_points += won && (rubber.games?.[side === 'home' ? 0 : 1] === 4) ? 1 : 0;
      }
    }
  }
}
