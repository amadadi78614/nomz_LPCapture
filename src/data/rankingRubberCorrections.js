import { FIXTURES } from './seed';

// Correct missing/under-counted Season 3 men's rubber appearances in ranking displays.
// The ranking UI derives appearances from fixture rubbers, so these entries are applied
// at presentation time without changing historical match scores.
export const RANKING_RUBBER_APPEARANCE_OVERRIDES = {
  'Justin': 7,
  'Uwais Patel': 7,
  'Yusuf Patel': 7,
};

export function getRankingRubberCount(playerName, calculatedCount) {
  return RANKING_RUBBER_APPEARANCE_OVERRIDES[playerName] ?? calculatedCount;
}

export default FIXTURES;
