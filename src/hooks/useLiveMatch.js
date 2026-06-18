import { useEffect, useState } from 'react';
import { subscribeMatch, getLiveState } from '../lib/supabase';

/** Live engine state for a match — updates on every point. */
export function useLiveMatch(matchId) {
  const [state, setState] = useState(() => getLiveState(matchId));
  useEffect(() => subscribeMatch(matchId, setState), [matchId]);
  return state;
}
