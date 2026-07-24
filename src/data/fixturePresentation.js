import { FIXTURES, playerById } from './seed';

const namesFromIds = (playerIds = []) => {
  const names = playerIds
    .map((id) => playerById(id)?.name)
    .filter(Boolean);

  return names.length ? names.join(' / ') : 'Players to be confirmed';
};

// Presentation compatibility layer:
// newer fixture records store canonical player IDs, while some older UI code
// still expects readable `home` and `away` strings on each rubber.
FIXTURES.forEach((fixture) => {
  fixture.score?.rubbers?.forEach((rubber) => {
    if (!rubber.home && Array.isArray(rubber.homeIds)) {
      rubber.home = namesFromIds(rubber.homeIds);
    }

    if (!rubber.away && Array.isArray(rubber.awayIds)) {
      rubber.away = namesFromIds(rubber.awayIds);
    }
  });
});
