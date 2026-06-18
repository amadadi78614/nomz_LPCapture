// ============================================================
// LP SCORING ENGINE — official Lowveld Padel format
// ------------------------------------------------------------
// Format (league rules):
//   • Best of 3 sets.
//   • Sets 1 & 2: first to 6 games; at 6-6 play a 7-point
//     tiebreak, win by 2.
//   • Set 3 is ALWAYS a 10-point match tiebreaker, win by 2
//     (so 9-9 continues until a 2-point lead).
//   • Game scoring 0/15/30/40 with golden point at deuce
//     (configurable via opts.goldenPoint).
//
// The engine is a pure reducer: state + event -> state.
// The same module runs in the umpire console (writes events to
// Supabase) and in every viewer (replays events / applies the
// denormalised live_state). Determinism = perfect sync.
// ============================================================

export const POINT_LABELS = ['0', '15', '30', '40'];

export function newMatch(opts = {}) {
  return {
    config: { goldenPoint: opts.goldenPoint !== false, setsToWin: 2 },
    status: 'live',
    sets: [],                 // completed sets: [{home, away, tb:[h,a]|null}]
    games: { home: 0, away: 0 }, // games in current set
    points: { home: 0, away: 0 },// point index in current game (0..3 = 0/15/30/40, or raw in TB)
    inTiebreak: false,
    tbTarget: 7,               // 7 in sets 1-2; 10 in the match TB (set 3)
    isMatchTiebreak: false,
    server: 'home',
    winner: null,
    momentum: [],              // last 10 point winners for the momentum strip
  };
}

const other = (s) => (s === 'home' ? 'away' : 'home');

function setNumber(state) { return state.sets.length + 1; }

function startSet(state) {
  state.games = { home: 0, away: 0 };
  state.points = { home: 0, away: 0 };
  if (setNumber(state) === 3) {
    // Set 3 is always the 10-point match tiebreaker.
    state.inTiebreak = true;
    state.isMatchTiebreak = true;
    state.tbTarget = 10;
  } else {
    state.inTiebreak = false;
    state.isMatchTiebreak = false;
    state.tbTarget = 7;
  }
}

function setsWon(state, side) {
  return state.sets.filter((s) => (side === 'home' ? s.home > s.away : s.away > s.home)).length;
}

function finishSet(state, winnerSide, tbScore = null) {
  if (state.isMatchTiebreak) {
    // Record the match TB as a set line, e.g. 10-8.
    state.sets.push({ home: state.points.home, away: state.points.away, tb: null, matchTb: true });
  } else {
    state.sets.push({ home: state.games.home, away: state.games.away, tb: tbScore });
  }
  if (setsWon(state, 'home') === state.config.setsToWin) state.winner = 'home';
  else if (setsWon(state, 'away') === state.config.setsToWin) state.winner = 'away';
  if (state.winner) { state.status = 'final'; return; }
  startSet(state);
}

function winGame(state, side) {
  state.games[side] += 1;
  state.points = { home: 0, away: 0 };
  state.server = other(state.server);
  const g = state.games;
  const lead = Math.abs(g.home - g.away);
  const max = Math.max(g.home, g.away);
  if (max >= 6 && lead >= 2) {
    finishSet(state, g.home > g.away ? 'home' : 'away');
  } else if (g.home === 6 && g.away === 6) {
    state.inTiebreak = true; // 7-point tiebreak, win by 2
    state.points = { home: 0, away: 0 };
  }
}

/**
 * Apply a single point event. ev = { winner: 'home'|'away', type?: string }
 * Returns a NEW state object (immutable for React).
 */
export function applyPoint(prev, ev) {
  if (prev.winner) return prev;
  const state = structuredClone(prev);
  const side = ev.winner;
  state.momentum = [...state.momentum, side].slice(-12);

  if (state.inTiebreak) {
    state.points[side] += 1;
    const { home, away } = state.points;
    if ((home + away) % 2 === 1) state.server = other(state.server); // TB serve rotation
    const max = Math.max(home, away);
    const lead = Math.abs(home - away);
    if (max >= state.tbTarget && lead >= 2) {
      if (state.isMatchTiebreak) {
        finishSet(state, home > away ? 'home' : 'away');
      } else {
        const winnerSide = home > away ? 'home' : 'away';
        state.games[winnerSide] += 1; // 7-6
        const tb = [home, away];
        state.inTiebreak = false;
        finishSet(state, winnerSide, tb);
      }
    }
    return state;
  }

  // Normal game scoring
  const me = state.points[side];
  const op = state.points[other(side)];
  if (me === 3 && op === 3) {
    // Deuce: golden point decides (default), else advantage logic
    if (state.config.goldenPoint) { winGame(state, side); return state; }
  }
  if (me === 3 && op < 3) { winGame(state, side); return state; }
  if (me === 4) { winGame(state, side); return state; } // advantage converted
  if (!state.config.goldenPoint && me === 3 && op === 4) { state.points[other(side)] = 3; return state; } // back to deuce
  state.points[side] = me + 1;
  return state;
}

/** Undo support: replay all events minus the last one. */
export function replay(events, opts) {
  return events.reduce((s, ev) => applyPoint(s, ev), newMatch(opts));
}

export function displayPoints(state) {
  if (state.inTiebreak) return { home: String(state.points.home), away: String(state.points.away) };
  const fmt = (mine, theirs) => {
    if (mine === 4) return 'AD';
    return POINT_LABELS[mine] ?? '40';
  };
  return { home: fmt(state.points.home, state.points.away), away: fmt(state.points.away, state.points.home) };
}

export function scoreSummary(state) {
  const sets = state.sets.map((s) => `${s.home}-${s.away}${s.tb ? `(${Math.min(...s.tb)})` : ''}`);
  if (state.status === 'live') sets.push(`${state.games.home}-${state.games.away}`);
  return sets.join(' ');
}
