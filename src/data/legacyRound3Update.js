import { LEGACY_FIXTURES, LEGACY_PLAYERS, LEGACY_STANDINGS } from './seed';

// Official LP Legacy League Match Day 3 results — 1 August 2026.
// Two completed fixtures supplied by the league commissioner:
// Honey Badgers 7–4 Cheetahs and Jackals 8–4 Eagles.

const round3Fixtures = [
  {
    id: 'lg-md3-1', round: 3, league: 'legacy', league_type: 'legacy',
    home: 'lp-honey-badgers', away: 'lp-cheetahs',
    start: new Date('2026-08-01T14:00:00+02:00'), court: 'Play 360', status: 'final',
    score: {
      winner: 'home', totals: [7, 4],
      rubbers: [
        {
          slot: '14:00', winner: 'away', games: [0, 4],
          homeIds: ['Sailesh', 'Dr Seedat'], awayIds: ['Aadam Nomani', 'Mau'],
          home: 'Sailesh / Dr Seedat', away: 'Aadam / Mau',
          sets: [[4, 6], [0, 6], [0, 10]],
        },
        {
          slot: '15:00', winner: 'home', games: [4, 0],
          homeIds: ['Jude van den Berg', 'Reyyann'], awayIds: ['Mikey', 'Jogi'],
          home: 'Jude / Reyyann', away: 'Mikey / Jogi',
          sets: [[6, 3], [6, 1], [10, 7]],
        },
        {
          slot: '16:00', winner: 'home', games: [3, 0],
          homeIds: ['Jameel Valley', 'Scharl van den Berg'], awayIds: ['Shoaib Nomani', 'Mohamed Nomani'],
          home: 'Jameel / Scharl', away: 'Shoaib / Noms',
          sets: [[3, 6], [6, 3], [10, 3]],
        },
      ],
    },
  },
  {
    id: 'lg-md3-2', round: 3, league: 'legacy', league_type: 'legacy',
    home: 'lp-jackals', away: 'lp-eagles',
    start: new Date('2026-08-01T14:00:00+02:00'), court: 'Play 360', status: 'final',
    score: {
      winner: 'home', totals: [8, 4],
      rubbers: [
        {
          slot: '14:00', winner: 'home', games: [4, 0],
          homeIds: ['Zuhayr Ismail', 'Divan'], awayIds: ['Shaheen', 'Armaan Bhikhoo'],
          home: 'Zuhayr / Divan', away: 'Shaheen / Arman',
          sets: [[6, 1], [6, 4], [12, 10]],
        },
        {
          slot: '15:00', winner: 'away', games: [0, 4],
          homeIds: ['Joe', 'Stiaan'], awayIds: ['Mohamed Azhar Sujee', 'Sahal Yunus'],
          home: 'Joe / Stiaan', away: 'Sujee / Sahal',
          sets: [[1, 6], [4, 6], [7, 10]],
        },
        {
          slot: '16:00', winner: 'home', games: [4, 0],
          homeIds: ['Fahad Patel', 'Hoosein'], awayIds: ['Akmeer Amod', 'Fayaz'],
          home: 'Fahad / Hoosein', away: 'Akmeer / Fayaz',
          sets: [[6, 4], [6, 4], [10, 8]],
        },
      ],
    },
  },
];

for (const fixture of round3Fixtures) {
  const existingIndex = LEGACY_FIXTURES.findIndex((item) => item.id === fixture.id);
  if (existingIndex >= 0) LEGACY_FIXTURES[existingIndex] = fixture;
  else LEGACY_FIXTURES.push(fixture);
}

// Official table after the two completed Match Day 3 fixtures.
const standings = {
  'lp-honey-badgers': { played: 3, won: 3, lost: 0, drawn: 0, bp: 0, points: 21, mp: 21, gd: 10, adj: 0 },
  'lp-cheetahs':      { played: 3, won: 2, lost: 1, drawn: 0, bp: 0, points: 20, mp: 20, gd: 7,  adj: 0 },
  'lp-jackals':       { played: 3, won: 2, lost: 1, drawn: 0, bp: 0, points: 19, mp: 19, gd: 5,  adj: 0 },
  'lp-leopards':      { played: 2, won: 1, lost: 1, drawn: 0, bp: 0, points: 12, mp: 12, gd: -1, adj: 0 },
  'lp-eagles':        { played: 3, won: 0, lost: 3, drawn: 0, bp: 0, points: 11, mp: 11, gd: -13, adj: 0 },
  'lp-rhinos':        { played: 2, won: 0, lost: 2, drawn: 0, bp: 0, points: 7,  mp: 7,  gd: -8, adj: 0 },
};

for (const row of LEGACY_STANDINGS) Object.assign(row, standings[row.franchise_id] || {});
LEGACY_STANDINGS.sort((a, b) => b.points - a.points || b.gd - a.gd || b.won - a.won);

const normalise = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const aliases = {
  mau: ['mau', 'muhammed', 'mohamed'],
  drseedat: ['drseedat', 'seedat'],
  reyyann: ['reyyann', 'reyyan', 'rayyan'],
  mikey: ['mikey', 'mikel', 'michael'],
  jogi: ['jogi'],
  divan: ['divan', 'deevan'],
  shaheen: ['shaheen'],
  armaanbhikhoo: ['armaanbhikhoo', 'armanbhikhoo', 'armaan'],
  joe: ['joe'],
  stiaan: ['stiaan'],
  hoosein: ['hoosein', 'hussain', 'husain'],
  fayaz: ['fayaz', 'faiz'],
};

function findPlayer(name, franchiseId) {
  const key = normalise(name);
  const candidates = aliases[key] || [key];
  const inFranchise = LEGACY_PLAYERS.filter((player) => player.franchise_id === franchiseId);

  let player = inFranchise.find((item) => candidates.includes(normalise(item.name)));
  if (player) return player;

  player = inFranchise.find((item) => candidates.some((candidate) => normalise(item.name).includes(candidate) || candidate.includes(normalise(item.name))));
  if (player) return player;

  // Safe final fallback: a unique first-name or surname token within the expected franchise.
  const tokens = String(name || '').toLowerCase().split(/\s+/).map(normalise).filter((token) => token.length >= 3);
  const matches = inFranchise.filter((item) => {
    const playerKey = normalise(item.name);
    return tokens.some((token) => playerKey.includes(token));
  });
  return matches.length === 1 ? matches[0] : null;
}

for (const fixture of round3Fixtures) {
  for (const rubber of fixture.score.rubbers) {
    const homeWon = rubber.winner === 'home';
    const homeSets = rubber.sets.filter(([home, away]) => home > away).length;
    const awaySets = rubber.sets.filter(([home, away]) => away > home).length;

    for (const [side, names, franchiseId] of [
      ['home', rubber.homeIds, fixture.home],
      ['away', rubber.awayIds, fixture.away],
    ]) {
      for (const name of names) {
        const player = findPlayer(name, franchiseId);
        if (!player) {
          console.warn(`[LP Legacy] Could not match ${name} to ${franchiseId}; fixture remains visible but this player's stats were not changed.`);
          continue;
        }

        player.stats ||= {};
        for (const field of ['played', 'wins', 'losses', 'rubbers_won', 'sets_won', 'sets_lost', 'games_won', 'bonus_points', 'mvp_points']) {
          player.stats[field] = Number(player.stats[field] || 0);
        }

        const won = side === 'home' ? homeWon : !homeWon;
        const sideIndex = side === 'home' ? 0 : 1;
        const setsFor = side === 'home' ? homeSets : awaySets;
        const setsAgainst = side === 'home' ? awaySets : homeSets;

        player.stats.played += 1;
        player.stats.wins += won ? 1 : 0;
        player.stats.losses += won ? 0 : 1;
        player.stats.rubbers_won += won ? 1 : 0;
        player.stats.sets_won += setsFor;
        player.stats.sets_lost += setsAgainst;
        player.stats.games_won += rubber.sets.slice(0, 2).reduce((sum, set) => sum + Number(set[sideIndex] || 0), 0);
        player.stats.bonus_points += won && Number(rubber.games?.[sideIndex]) === 4 ? 1 : 0;
        player.stats.mvp_points = player.stats.rubbers_won * 3 + player.stats.bonus_points;
      }
    }
  }
}

export { round3Fixtures };
