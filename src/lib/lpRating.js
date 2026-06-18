// ============================================================
// LP RATING — the league's official player rating
// ------------------------------------------------------------
// Doubles-adapted Elo:
//   • Pair rating = mean of the two players' LP Ratings.
//   • Expected score E = 1 / (1 + 10^((Ropp - Rpair)/400)).
//   • K = 32, scaled by margin-of-victory:
//        straight sets ........ x1.15
//        deciding match TB .... x0.85  (closer match, smaller swing)
//   • Each player on the pair receives the full pair delta —
//     padel is won and lost as a pair.
//   • New players start at 1400 and are "provisional" for their
//     first 5 matches (K doubled) so they converge fast.
// ============================================================

export const BASE_RATING = 1400;
export const K_FACTOR = 32;
export const PROVISIONAL_MATCHES = 5;

export function pairRating(r1, r2) { return (r1 + r2) / 2; }

export function expectedScore(rPair, rOpp) {
  return 1 / (1 + Math.pow(10, (rOpp - rPair) / 400));
}

export function marginMultiplier(sets) {
  const straight = sets.length === 2;
  const decidedByMatchTb = sets.length === 3;
  if (straight) return 1.15;
  if (decidedByMatchTb) return 0.85;
  return 1;
}

/**
 * Compute rating deltas for a finished match.
 * @param {object} p - { home: [r1, r2], away: [r1, r2], sets: [[h,a],...], winner: 'home'|'away',
 *                       provisional?: { home:[bool,bool], away:[bool,bool] } }
 * @returns {{ home: number, away: number }} delta applied to each player on that side
 */
export function ratingDelta(p) {
  const rHome = pairRating(p.home[0], p.home[1]);
  const rAway = pairRating(p.away[0], p.away[1]);
  const eHome = expectedScore(rHome, rAway);
  const sHome = p.winner === 'home' ? 1 : 0;
  const mult = marginMultiplier(p.sets);
  const dHome = Math.round(K_FACTOR * mult * (sHome - eHome));
  return { home: dHome, away: -dHome };
}

export function applyProvisional(delta, matchesPlayed) {
  return matchesPlayed < PROVISIONAL_MATCHES ? delta * 2 : delta;
}

/** Rating tier badges for the UI. */
export function tier(rating) {
  if (rating >= 1700) return { label: 'Elite', color: 'var(--gold)' };
  if (rating >= 1550) return { label: 'Pro', color: 'var(--court)' };
  if (rating >= 1450) return { label: 'Advanced', color: 'var(--win)' };
  if (rating >= 1350) return { label: 'Contender', color: 'var(--muted)' };
  return { label: 'Rising', color: 'var(--muted)' };
}
