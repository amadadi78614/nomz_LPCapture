import { PLAYERS } from './seed';

// Verified Season 3 men's appearance totals.
// These run after the fixture/stat syncs so rankings and player pages stay consistent.
const VERIFIED_PLAYED = {
  'Justin van Staaden': 7,
  'Uwaiz Patel': 7,
  'Yusuf Patel': 7,
};

Object.entries(VERIFIED_PLAYED).forEach(([name, played]) => {
  const player = PLAYERS.find((item) => item.league === 'mens' && item.name === name);
  if (!player) return;

  player.stats.played = played;
  player.stats.losses = Math.max(0, played - (Number(player.stats.wins) || 0));
});
