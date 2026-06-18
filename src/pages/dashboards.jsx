import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FIXTURES, PLAYERS, STANDINGS, SPONSORS, franchiseById, stripeVar } from '../data/seed';
import { useLiveMatch } from '../hooks/useLiveMatch';
import { recordPoint } from '../lib/supabase';
import { displayPoints } from '../lib/scoringEngine';
import { ratingDelta } from '../lib/lpRating';

/* ==========================================================
   UMPIRE / ADMIN CONSOLE
   Big-button, one-thumb scoring. Every tap = one point event
   → engine reducer → realtime broadcast to every viewer.
   ========================================================== */
export function AdminDashboard() {
  const liveFixtures = FIXTURES.filter((f) => f.status === 'live');
  const [sel, setSel] = useState(liveFixtures[0]?.id);
  return (
    <div className="page">
      <span className="eyebrow">Admin · Umpire console</span>
      <h1 className="display">Live Scoring</h1>
      <div className="tabbar mt">
        {liveFixtures.map((f) => (
          <button key={f.id} className={sel === f.id ? 'on' : ''} onClick={() => setSel(f.id)}>
            {f.court}: {franchiseById(f.home).name.split(' ')[0]} v {franchiseById(f.away).name.split(' ')[0]}
          </button>
        ))}
      </div>
      {sel && <ScoringConsole fixtureId={sel} />}
      <div className="card mt">
        <p className="eyebrow" style={{ marginBottom: 8 }}>Console rules (LP format)</p>
        <p className="muted" style={{ fontSize: 13 }}>
          Sets 1–2: first to 6 games; 7-point tiebreak at 6–6 (win by 2). The third set is always a 10-point match tiebreaker, win by 2 — the console switches automatically. Golden point applies at deuce. Every tap is logged to the event stream, so Undo replays the match minus the last point.
        </p>
      </div>
    </div>
  );
}

function ScoringConsole({ fixtureId }) {
  const fixture = FIXTURES.find((f) => f.id === fixtureId);
  const st = useLiveMatch(fixtureId);
  const pts = displayPoints(st);
  const home = franchiseById(fixture.home);
  const away = franchiseById(fixture.away);
  const score = async (side) => { await recordPoint(fixtureId, side, st); };
  return (
    <div className="card stripe mt" style={{ '--stripe': 'var(--live)' }}>
      <div className="row spread">
        <span className="row" style={{ gap: 8 }}>
          <span className="live-tag">LIVE</span>
          <b>{fixture.court}</b>
        </span>
        {st.isMatchTiebreak && !st.winner && <span className="chip" style={{ color: 'var(--gold)' }}>Match TB → 10</span>}
        {st.inTiebreak && !st.isMatchTiebreak && <span className="chip" style={{ color: 'var(--gold)' }}>TB → 7</span>}
      </div>

      <div className="scoreboard mt">
        {[['home', home], ['away', away]].map(([side, fr]) => (
          <ConsoleRow key={side} side={side} fr={fr} st={st} pts={pts} />
        ))}
      </div>

      {st.winner ? (
        <p className="mt win-txt" style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontWeight: 800, fontSize: 20 }}>
          Final — {(st.winner === 'home' ? home : away).name}. Result posted, standings & LP Ratings updating.
        </p>
      ) : (
        <div className="console-row">
          <button className="btn" style={{ background: 'var(--court)' }} onClick={() => score('home')}>+ {home.name}</button>
          <button className="btn live" onClick={() => score('away')}>+ {away.name}</button>
        </div>
      )}
      <div className="console-row">
        <button className="btn ghost" disabled title="Replays event log minus last point (Supabase RPC)">↶ Undo last point</button>
        <button className="btn ghost" disabled>⏸ Suspend</button>
        <button className="btn ghost" disabled>✕ Retire / W.O.</button>
      </div>
    </div>
  );
}
function ConsoleRow({ side, fr, st, pts }) {
  const opp = side === 'home' ? 'away' : 'home';
  return (
    <>
      <div className="sb-team">
        <img src={fr.logo} alt="" />
        <span className="name">{fr.name}</span>
        {st.server === side && !st.winner && <span style={{ color: 'var(--gold)' }}>●</span>}
      </div>
      <div className="sb-sets">
        {st.sets.map((s, i) => <span key={i} className={`sb-cell ${s[side] > s[opp] ? 'won' : ''}`}>{s[side]}</span>)}
        {!st.winner && !st.isMatchTiebreak && <span className="sb-cell">{st.games[side]}</span>}
        {!st.winner && <span className="sb-cell pts">{pts[side]}</span>}
      </div>
    </>
  );
}

/* ==========================================================
   CAPTAIN DASHBOARD — squad, pair selection, availability
   ========================================================== */
export function CaptainDashboard() {
  const myFranchise = 'samurai-kicksmashers'; // production: derived from auth role
  const fr = franchiseById(myFranchise);
  const squad = PLAYERS.filter((p) => p.franchise_id === myFranchise);
  const next = FIXTURES.find((f) => (f.home === myFranchise || f.away === myFranchise) && f.status === 'scheduled');
  const [pair, setPair] = useState(squad.slice(0, 2).map((p) => p.id));
  const [avail, setAvail] = useState(() => Object.fromEntries(squad.map((p) => [p.id, true])));
  const togglePair = (id) => setPair((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]);
  const pairObjs = pair.map((id) => PLAYERS.find((p) => p.id === id)).filter(Boolean);
  const pairAvg = pairObjs.length === 2 ? Math.round((pairObjs[0].lp_rating + pairObjs[1].lp_rating) / 2) : null;
  return (
    <div className="page">
      <span className="eyebrow">Captain · {fr.name}</span>
      <h1 className="display">Team Sheet</h1>

      {next && (
        <div className="card stripe mt" style={{ '--stripe': stripeVar(myFranchise) }}>
          <p className="eyebrow">Next tie</p>
          <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 18 }}>
            {franchiseById(next.home).name} v {franchiseById(next.away).name}
          </b>
          <div className="muted" style={{ fontSize: 13 }}>
            {new Date(next.start).toLocaleString('en-ZA', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {next.court}
          </div>
        </div>
      )}

      <div className="grid cols-2 mt">
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Select pair for next tie ({pair.length}/2)</p>
          {squad.map((p) => (
            <button
              key={p.id} onClick={() => togglePair(p.id)}
              className="row spread" style={{
                width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 10, marginBottom: 6,
                background: pair.includes(p.id) ? 'rgba(47,125,246,0.18)' : 'var(--surface-2)',
                border: pair.includes(p.id) ? '1px solid var(--court)' : '1px solid transparent',
                opacity: avail[p.id] ? 1 : 0.4,
              }}>
              <span><b style={{ fontSize: 14 }}>{p.name}</b> {p.role === 'captain' && <span className="gold">©</span>}</span>
              <span className="num gold">{p.lp_rating}</span>
            </button>
          ))}
          {pairAvg && <p className="mt" style={{ fontSize: 13 }}>Pair rating: <b className="gold num">{pairAvg}</b></p>}
          <button className="btn mt" style={{ width: '100%', justifyContent: 'center' }} disabled={pair.length !== 2}>
            Submit team sheet
          </button>
        </div>
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Availability — Round {next?.round ?? '–'}</p>
          {squad.map((p) => (
            <div key={p.id} className="row spread" style={{ padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontSize: 14 }}>{p.name}</span>
              <button className={`chip`} style={{ color: avail[p.id] ? 'var(--win)' : 'var(--loss)' }}
                onClick={() => setAvail((a) => ({ ...a, [p.id]: !a[p.id] }))}>
                {avail[p.id] ? 'Available' : 'Out'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   COMMISSIONER DASHBOARD — league ops control room
   ========================================================== */
export function CommissionerDashboard() {
  const liveCount = FIXTURES.filter((f) => f.status === 'live').length;
  const played = FIXTURES.filter((f) => f.status === 'final').length;
  const scheduled = FIXTURES.filter((f) => f.status === 'scheduled').length;
  const sampleDelta = useMemo(() => ratingDelta({
    home: [1520, 1480], away: [1450, 1430], sets: [[6, 4], [3, 6], [10, 7]], winner: 'home',
  }), []);
  return (
    <div className="page">
      <span className="eyebrow">Commissioner · Season 3</span>
      <h1 className="display">League Control Room</h1>
      <div className="kpis mt">
        <div className="kpi"><div className="v" style={{ color: 'var(--live)' }}>{liveCount}</div><div className="l">Matches live now</div></div>
        <div className="kpi"><div className="v">{played}</div><div className="l">Ties completed</div></div>
        <div className="kpi"><div className="v">{scheduled}</div><div className="l">Ties scheduled</div></div>
        <div className="kpi"><div className="v">{PLAYERS.length}</div><div className="l">Registered players</div></div>
      </div>

      <div className="grid cols-2 mt">
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Season operations</p>
          {['Publish Round 6 fixtures', 'Approve Round 5 results', 'Review power rankings draft', 'Open Season 4 auction registration', 'Export standings for sponsors'].map((t, i) => (
            <div key={t} className="row spread" style={{ padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontSize: 14 }}>{t}</span>
              <button className="btn ghost" style={{ padding: '6px 12px', fontSize: 12 }} disabled={i > 1}>{i <= 1 ? 'Action' : 'Queued'}</button>
            </div>
          ))}
        </div>
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Format & rating governance</p>
          <p className="muted" style={{ fontSize: 13 }}>
            League format locked for Season 3: 6-game sets with a 7-point tiebreak at 6–6, third set as a 10-point match tiebreaker (win by 2), golden point at deuce.
          </p>
          <div className="divider" />
          <p style={{ fontSize: 13 }}>
            LP Rating check — sample 3-set upset swings the winning pair <b className="win-txt num">+{sampleDelta.home}</b> and the losing pair <b className="num" style={{ color: 'var(--loss)' }}>{sampleDelta.away}</b> per player.
          </p>
          <div className="divider" />
          <div className="chiprow">
            <Link to="/admin" className="chip">Umpire console →</Link>
            <Link to="/sponsor-analytics" className="chip">Sponsor analytics →</Link>
            <Link to="/standings" className="chip">Live standings →</Link>
          </div>
        </div>
      </div>

      <div className="card mt">
        <p className="eyebrow" style={{ marginBottom: 10 }}>Result approvals — Round 5</p>
        <table className="tbl">
          <thead><tr><th>Tie</th><th>Score</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {FIXTURES.filter((f) => f.status === 'final').slice(-3).map((f) => (
              <tr key={f.id}>
                <td>{franchiseById(f.home).name} v {franchiseById(f.away).name}</td>
                <td className="num">{f.score?.totals ? f.score.totals.join('\u2013') : 'TBC'}</td>
                <td><span className="chip win-txt">Verified</span></td>
                <td><button className="btn ghost" style={{ padding: '5px 10px', fontSize: 12 }}>Audit log</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==========================================================
   SPONSOR ANALYTICS DASHBOARD — measured exposure
   ========================================================== */
export function SponsorAnalytics() {
  const [sponsor, setSponsor] = useState(SPONSORS[1].id);
  const sp = SPONSORS.find((s) => s.id === sponsor);
  // Production: aggregates from sponsor_impressions / sponsor_clicks.
  const seed = sponsor.charCodeAt(2) || 5;
  const days = Array.from({ length: 14 }, (_, i) => ({
    d: i, imp: Math.round(420 + Math.sin(i / 2 + seed) * 160 + (i % 7 === 4 ? 380 : 0)),
  }));
  const totalImp = days.reduce((a, b) => a + b.imp, 0);
  const clicks = Math.round(totalImp * 0.031);
  const max = Math.max(...days.map((x) => x.imp));
  return (
    <div className="page">
      <span className="eyebrow">Partner analytics</span>
      <h1 className="display">Exposure Report</h1>
      <div className="tabbar mt">
        {SPONSORS.filter((s) => s.tier !== 'title').map((s) => (
          <button key={s.id} className={sponsor === s.id ? 'on' : ''} onClick={() => setSponsor(s.id)}>{s.name}</button>
        ))}
      </div>
      <div className="kpis mt">
        <div className="kpi"><div className="v">{totalImp.toLocaleString('en-ZA')}</div><div className="l">Impressions · 14 days</div></div>
        <div className="kpi"><div className="v">{clicks}</div><div className="l">Click-throughs</div></div>
        <div className="kpi"><div className="v">{(clicks / totalImp * 100).toFixed(1)}%</div><div className="l">CTR</div></div>
        <div className="kpi"><div className="v gold" style={{ textTransform: 'capitalize' }}>{sp.tier}</div><div className="l">Tier</div></div>
      </div>
      <div className="card mt">
        <p className="eyebrow" style={{ marginBottom: 12 }}>Daily impressions — matchnights spike</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 130 }}>
          {days.map((x) => (
            <div key={x.d} title={`${x.imp} impressions`} style={{
              flex: 1, borderRadius: '4px 4px 0 0', height: `${(x.imp / max) * 100}%`,
              background: x.imp > 600 ? 'var(--live)' : 'var(--court)', minWidth: 8,
            }} />
          ))}
        </div>
        <p className="muted mt" style={{ fontSize: 12 }}>Red bars = live matchnights. Live scoring is the audience engine — partners ride every refresh.</p>
      </div>
      <div className="grid cols-2 mt">
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Placement breakdown</p>
          {[['Home sponsor rail', 46], ['Live Match Centre', 31], ['Standings page', 14], ['News Centre', 9]].map(([l, v]) => (
            <div className="statline" key={l}>
              <span style={{ fontSize: 13 }}>{l}</span><b className="num">{v}%</b>
              <div className="bar"><i style={{ width: `${v}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Monthly partner report</p>
          <p className="muted" style={{ fontSize: 13 }}>Auto-generated PDF with impressions, CTR, matchnight reach and placement mix — branded and board-ready.</p>
          <button className="btn gold mt">Download Season-to-date report</button>
        </div>
      </div>
    </div>
  );
}
