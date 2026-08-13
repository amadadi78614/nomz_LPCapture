import { PLAYERS } from './seed';

// Official Season 3 ranking corrections supplied by the competition record.
// Runs after fixture/stat syncs so every ranking surface and player profile uses the same values.
const VERIFIED_RECORDS = {
  'Justin van Staaden': { played: 8 },
  'Uwaiz Patel': { played: 9, wins: 7, losses: 2, displayName: 'Uwais Patel' },
  'Yusuf Patel': { played: 9, wins: 7, losses: 2 },
};

Object.entries(VERIFIED_RECORDS).forEach(([sourceName, record]) => {
  const player = PLAYERS.find((item) => item.league === 'mens' && item.name === sourceName);
  if (!player) return;

  if (record.displayName) player.name = record.displayName;
  if (Number.isFinite(record.played)) player.stats.played = record.played;
  if (Number.isFinite(record.wins)) player.stats.wins = record.wins;
  if (Number.isFinite(record.losses)) player.stats.losses = record.losses;
  else player.stats.losses = Math.max(0, player.stats.played - (Number(player.stats.wins) || 0));

  player.stats.rubbers_won = player.stats.wins;
  player.stats.mvp_points = (Number(player.stats.rubbers_won) || 0) * 3 + (Number(player.stats.bonus_points) || 0);
});
