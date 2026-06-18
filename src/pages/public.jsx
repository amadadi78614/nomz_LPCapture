import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FIXTURES, PLAYERS, NEWS, STANDINGS, POWER_RANKINGS, SPONSORS, TIER_SPONSORS,
  franchiseById, playerById, stripeVar,
} from '../data/seed';
import { useLiveMatch } from '../hooks/useLiveMatch';
import { displayPoints } from '../lib/scoringEngine';
import { tier } from '../lib/lpRating';
import {
  LiveScoreCard, ResultCard, FixtureRow, StandingsTable, SponsorRail, SectionHead, ComingSoon,
} from '../components/ui';

/* ============================ HOME ============================ */
export function Home() {
  const live = FIXTURES.filter((f) => f.status === 'live');
  const results = FIXTURES.filter((f) => f.status === 'final').slice(-2).reverse();
  const upcoming = FIXTURES.filter((f) => f.status === 'scheduled').slice(0, 3);
  const hero = NEWS[0];
  const mvp = [...PLAYERS].filter((p) => p.stats.played > 0).sort((a, b) => b.stats.mvp_points - a.stats.mvp_points || b.stats.rubbers_won - a.stats.rubbers_won)[0];
  return (
    <div className="page">
      <div className="hero">
        <span className="eyebrow" style={{ color: 'var(--live)' }}>Season 3 · Week 2 complete · Next: Mon 22 Jun</span>
        <h1 className="display" style={{ margin: '6px 0 8px' }}>Every point. Live from the Lowveld.</h1>
        <p className="muted" style={{ maxWidth: 560 }}>
          Rubber-by-rubber scoring from Padel 24 and Play 360, live aggregate standings, the LP Rating and the race for MVP — the franchise league, broadcast-style.
        </p>
        <div className="row mt" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Link to="/live" className="btn live">● Watch Match Centre</Link>
          <Link to="/standings" className="btn ghost">Standings</Link>
          <Link to="/rankings" className="btn ghost">Power Rankings</Link>
        </div>
      </div>

      {live.length > 0 && (
        <>
          <SectionHead title="Live now" to="/live" cta="Match Centre" />
          <div className="grid cols-2">
            {live.map((f) => <LiveScoreCard key={f.id} fixture={f} />)}
          </div>
        </>
      )}

      <SectionHead title="Latest" to="/news" />
      <div className="grid cols-2">
        <Link to="/news" className="card news-card stripe" style={{ '--stripe': 'var(--live)' }}>
          <span className="kicker">{hero.kicker}</span>
          <h3>{hero.title}</h3>
          <p className="muted" style={{ fontSize: 13.5 }}>{hero.body}</p>
        </Link>
        <div className="grid" style={{ gap: 10 }}>
          {NEWS.slice(1, 4).map((n) => (
            <Link key={n.id} to="/news" className="card news-card" style={{ padding: 12 }}>
              <span className="kicker" style={{ color: 'var(--court)' }}>{n.kicker}</span>
              <h3 style={{ fontSize: 16 }}>{n.title}</h3>
            </Link>
          ))}
        </div>
      </div>

      <SectionHead title="Tables" to="/standings" />
      <div className="grid cols-2">
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Men's franchise league</p>
          <StandingsTable league="mens" limit={4} />
        </div>
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Ladies franchise league</p>
          <StandingsTable league="ladies" limit={4} />
        </div>
      </div>

      <SectionHead title="Results & fixtures" to="/live" cta="Full schedule" />
      <div className="grid cols-3">
        {results.map((f) => <ResultCard key={f.id} fixture={f} />)}
        {upcoming.slice(0, 1).map((f) => <FixtureRow key={f.id} fixture={f} />)}
      </div>

      <SectionHead title="MVP race" to="/rankings" cta="Leaderboard" />
      <Link to={`/player/${mvp.id}`} className="card stripe row spread" style={{ '--stripe': 'var(--gold)' }}>
        <div className="row">
          <span className="avatar">{mvp.name.split(' ').map((w) => w[0]).join('')}</span>
          <div>
            <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 17 }}>{mvp.name}</b>
            <div className="muted" style={{ fontSize: 12 }}>{franchiseById(mvp.franchise_id).name}</div>
          </div>
        </div>
        <span className="lp-badge">★ {mvp.stats.mvp_points} MVP pts</span>
      </Link>

      <div className="mt"><SponsorRail placement="home" /></div>
    </div>
  );
}

/* ====================== MATCH CENTRE (hub) ===================== */
export function MatchCentre() {
  const [tab, setTab] = useState('live');
  const groups = {
    live: FIXTURES.filter((f) => f.status === 'live'),
    fixtures: FIXTURES.filter((f) => f.status === 'scheduled'),
    results: FIXTURES.filter((f) => f.status === 'final').slice().reverse(),
  };
  return (
    <div className="page">
      <h1 className="display">Match Centre</h1>
      <div className="tabbar mt">
        {['live', 'fixtures', 'results'].map((t) => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
            {t === 'live' ? '● Live' : t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid cols-2 mt">
        {tab === 'live' && groups.live.map((f) => <LiveScoreCard key={f.id} fixture={f} />)}
        {tab === 'fixtures' && groups.fixtures.map((f) => <FixtureRow key={f.id} fixture={f} />)}
        {tab === 'results' && groups.results.map((f) => <ResultCard key={f.id} fixture={f} />)}
        {tab === 'live' && groups.live.length === 0 && <p className="muted">No matches in play. Next matchnight is in the fixtures tab.</p>}
      </div>
    </div>
  );
}

/* ====================== SINGLE MATCH PAGE ====================== */
export function MatchPage() {
  const { id } = useParams();
  const fixture = FIXTURES.find((f) => f.id === id);
  const st = useLiveMatch(id);
  if (!fixture) return <div className="page"><p className="muted">Match not found.</p></div>;
  const home = franchiseById(fixture.home);
  const away = franchiseById(fixture.away);

  // ---- Final fixtures: aggregate + rubber breakdown ----
  if (fixture.status === 'final') {
    const sc = fixture.score;
    const slots = sc?.rubbers ? [...new Set(sc.rubbers.map((r) => r.slot))] : [];
    return (
      <div className="page">
        <span className="row" style={{ gap: 8 }}>
          <span className="chip">Final</span>
          <span className="muted" style={{ fontSize: 13 }}>{fixture.court} · Week {fixture.round} · {fixture.league === 'mens' ? "Men's" : 'Ladies'} League</span>
        </span>
        <h1 className="display" style={{ margin: '8px 0 16px' }}>{home.name} <span className="muted">v</span> {away.name}</h1>
        {!sc ? (
          <div className="card"><p className="muted" style={{ margin: 0 }}>Result to be confirmed.</p></div>
        ) : (
          <>
            <div className="card stripe" style={{ '--stripe': stripeVar(sc.winner === 'home' ? fixture.home : fixture.away) }}>
              <div className="row spread">
                {[['home', home], ['away', away]].map(([side, fr]) => {
                  const won = sc.winner === side;
                  const idx = side === 'home' ? 0 : 1;
                  return (
                    <div key={side} className="row" style={{ gap: 10, opacity: won ? 1 : 0.7 }}>
                      <img src={fr.logo} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                      <div>
                        <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16 }}>{fr.name}</b>
                        <div className="num" style={{ fontSize: 34, lineHeight: 1, color: won ? 'var(--win)' : 'var(--muted)' }}>{sc.totals ? sc.totals[idx] : sc.rubberWins[idx]}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>{sc.totals ? 'Aggregate games across six rubbers' : 'Rubbers won · game scores to be confirmed'}</div>
            </div>
            {slots.map((slot) => (
              <div key={slot}>
                <SectionHead title={slot} />
                <div className="grid">
                  {sc.rubbers.filter((r) => r.slot === slot).map((r, i) => {
                    const hw2 = r.winner === 'home';
                    const bp = r.games && ((hw2 && r.games[0] === 4 && r.games[1] === 0) || (!hw2 && r.games[1] === 4 && r.games[0] === 0));
                    return (
                      <div key={i} className="card">
                        <div className="row spread">
                          <span style={{ opacity: hw2 ? 1 : 0.65 }}><b className="chip" style={{ marginRight: 8 }}>{r.court}</b>{r.home}</span>
                          <b className="num" style={{ whiteSpace: 'nowrap' }}>
                            {r.games ? (
                              <>
                                <span style={{ color: hw2 ? 'var(--win)' : 'var(--muted)' }}>{r.games[0]}</span>
                                <span className="muted"> – </span>
                                <span style={{ color: !hw2 ? 'var(--win)' : 'var(--muted)' }}>{r.games[1]}</span>
                              </>
                            ) : (
                              <span className="muted" style={{ fontSize: 12 }}>{hw2 ? 'W – L' : 'L – W'}</span>
                            )}
                            {bp && <span className="chip" style={{ marginLeft: 8, color: 'var(--gold)' }}>BP</span>}
                          </b>
                          <span style={{ opacity: !hw2 ? 1 : 0.65, textAlign: 'right' }}>{r.away}</span>
                        </div>
                        {r.sets && (
                          <div className="row" style={{ gap: 8, marginTop: 6, justifyContent: 'center', fontFamily: 'var(--data)' }}>
                            {r.sets.map((st, j) => (
                              <span key={j} className="muted" style={{ fontSize: 12 }}>
                                {st[0]}-{st[1]}{j < r.sets.length - 1 ? ' ·' : ''}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  // ---- Scheduled fixtures: show announced pairings if present ----
  if (fixture.status === 'scheduled') {
    const slots = fixture.pairs?.slots || [];
    return (
      <div className="page">
        <span className="row" style={{ gap: 8 }}>
          <span className="chip">Upcoming</span>
          <span className="muted" style={{ fontSize: 13 }}>
            {new Date(fixture.start).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })} · {fixture.court} · Week {fixture.round}
          </span>
        </span>
        <h1 className="display" style={{ margin: '8px 0 16px' }}>{home.name} <span className="muted">v</span> {away.name}</h1>
        {slots.length === 0 ? (
          <div className="card"><p className="muted" style={{ margin: 0 }}>Line-ups to be announced.</p></div>
        ) : (
          <>
            <div className="card stripe" style={{ '--stripe': stripeVar(fixture.home) }}>
              <div className="row spread">
                <span className="row" style={{ gap: 10 }}><img src={home.logo} alt="" style={{ width: 34, height: 34, objectFit: 'contain' }} /><b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>{home.name}</b></span>
                <span className="muted">v</span>
                <span className="row" style={{ gap: 10 }}><b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>{away.name}</b><img src={away.logo} alt="" style={{ width: 34, height: 34, objectFit: 'contain' }} /></span>
              </div>
            </div>
            {slots.map((sl) => (
              <div key={sl.slot}>
                <SectionHead title={sl.slot} />
                <div className="grid">
                  {sl.rubbers.map(([court, h, a], i) => (
                    <div key={i} className="card row spread">
                      <span><b className="chip" style={{ marginRight: 8 }}>{court}</b>{h}</span>
                      <span className="muted">v</span>
                      <span style={{ textAlign: 'right' }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  const pts = displayPoints(st);
  const momentumPct = st.momentum.length
    ? Math.round((st.momentum.filter((m) => m === 'home').length / st.momentum.length) * 100) : 50;
  const pairs = fixture.pairs || { home: [], away: [] };
  return (
    <div className="page">
      <span className="row" style={{ gap: 8 }}>
        {fixture.status === 'live' && !st.winner ? <span className="live-tag">LIVE</span> : <span className="chip">Final</span>}
        <span className="muted" style={{ fontSize: 13 }}>{fixture.court} · Round {fixture.round} · {fixture.league === 'mens' ? "Men's" : 'Ladies'} League</span>
      </span>
      <h1 className="display" style={{ margin: '8px 0 16px' }}>{home.name} <span className="muted">v</span> {away.name}</h1>

      <div className="card stripe" style={{ '--stripe': 'var(--live)' }}>
        <div className="scoreboard">
          {[['home', home], ['away', away]].map(([side, fr]) => (
            <FragmentRow key={side} side={side} fr={fr} st={st} pts={pts} />
          ))}
        </div>
        {st.isMatchTiebreak && !st.winner && (
          <p className="mt" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 13 }}>
            Deciding set — 10-point match tiebreaker, win by 2.
          </p>
        )}
        {st.winner && (
          <p className="mt win-txt" style={{ fontWeight: 800, fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 18 }}>
            {(st.winner === 'home' ? home : away).name} win the tie
          </p>
        )}
      </div>

      <div className="grid cols-2 mt">
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Momentum — last {st.momentum.length} points</p>
          <div className="statline">
            <div className="row spread" style={{ width: '100%' }}>
              <b style={{ color: 'var(--court)' }}>{home.name} {momentumPct}%</b>
              <b style={{ color: 'var(--live)' }}>{100 - momentumPct}% {away.name}</b>
            </div>
            <span />
            <div className="bar"><i style={{ width: `${momentumPct}%` }} /></div>
          </div>
          <div className="row mt" style={{ gap: 4 }}>
            {st.momentum.map((m, i) => (
              <i key={i} style={{ width: 12, height: 18, borderRadius: 2, background: m === 'home' ? 'var(--court)' : 'var(--live)' }} />
            ))}
          </div>
        </div>
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>On court</p>
          {[['home', home], ['away', away]].map(([side, fr]) => (
            <div key={side} style={{ marginBottom: 10 }}>
              <b style={{ fontSize: 13, color: 'var(--muted)' }}>{fr.name}</b>
              <div className="row" style={{ gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                {(pairs[side] || []).map((pidd) => {
                  const p = playerById(pidd);
                  return p ? (
                    <Link key={p.id} to={`/player/${p.id}`} className="chip">
                      {p.name} <span className="gold num">{p.lp_rating}</span>
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt"><SponsorRail placement="match" /></div>
    </div>
  );
}
function FragmentRow({ side, fr, st, pts }) {
  return (
    <>
      <div className="sb-team">
        <img src={fr.logo} alt="" />
        <span className="name">{fr.name}</span>
        {st.server === side && !st.winner && <span style={{ color: 'var(--gold)' }} title="Serving">●</span>}
      </div>
      <div className="sb-sets">
        {st.sets.map((s, i) => (
          <span key={i} className={`sb-cell ${s[side] > s[side === 'home' ? 'away' : 'home'] ? 'won' : ''}`}>{s[side]}</span>
        ))}
        {!st.winner && !st.isMatchTiebreak && <span className="sb-cell">{st.games[side]}</span>}
        {!st.winner && <span className="sb-cell pts">{pts[side]}</span>}
      </div>
    </>
  );
}

/* ========================= STANDINGS ========================== */
export function Standings() {
  const [league, setLeague] = useState('mens');
  const [tier, setTier] = useState('franchise');
  return (
    <div className="page">
      <h1 className="display">Log Tables</h1>
      <p className="muted" style={{ fontSize: 13 }}>Rubber win = 3 pts · draw = 1 pt · bonus point for a 4-0 win. Franchise log counts every rubber; P1–P3 logs track each court tier.</p>
      <div className="tabbar mt">
        <button className={league === 'mens' ? 'on' : ''} onClick={() => setLeague('mens')}>Men's League</button>
        <button className={league === 'ladies' ? 'on' : ''} onClick={() => setLeague('ladies')}>Ladies League</button>
      </div>
      {league === 'mens' && (
        <div className="tabbar mt">
          {[['franchise', 'Franchise'], ['P1', 'P1'], ['P2', 'P2'], ['P3', 'P3']].map(([t, lbl]) => (
            <button key={t} className={tier === t ? 'on' : ''} onClick={() => setTier(t)}>{lbl}</button>
          ))}
        </div>
      )}
      {league === 'mens' && tier !== 'franchise' && (
        <div className="row mt" style={{ gap: 10, alignItems: 'center' }}>
          <img src={TIER_SPONSORS[tier].logo} alt={TIER_SPONSORS[tier].name} style={{ height: 26, borderRadius: 4 }} />
          <span className="muted" style={{ fontSize: 12 }}>{tier} Log Table · presented by {TIER_SPONSORS[tier].name}</span>
        </div>
      )}
      <div className="mt"><StandingsTable league={league} tier={tier} /></div>
      {league === 'mens' && tier === 'franchise' && <p className="muted mt" style={{ fontSize: 12 }}>Top 4 qualify for Finals Night.</p>}
    </div>
  );
}

/* ========================== PLAYERS =========================== */
export function Players() {
  const [league, setLeague] = useState('all');
  const [q, setQ] = useState('');
  const list = useMemo(() => PLAYERS
    .filter((p) => p.league === 'mens' && (league === 'all' || p.league === league) && p.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.lp_rating - a.lp_rating), [league, q]);
  return (
    <div className="page">
      <h1 className="display">Players</h1>
      <div className="tabbar mt">
        {['all', 'mens', 'ladies'].map((l) => (
          <button key={l} className={league === l ? 'on' : ''} onClick={() => setLeague(l)}>
            {l === 'all' ? 'All' : l === 'mens' ? "Men's" : 'Ladies'}
          </button>
        ))}
      </div>
      <input
        value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search players"
        style={{ width: '100%', marginTop: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', font: 'inherit' }}
      />
      {league === 'ladies' && <div className="mt"><ComingSoon note="Ladies League player profiles go live with the Season 3 launch." /></div>}
      <div className="grid cols-3 mt">
        {list.map((p, i) => {
          const fr = franchiseById(p.franchise_id);
          const t = tier(p.lp_rating);
          return (
            <Link key={p.id} to={`/player/${p.id}`} className="card stripe row spread" style={{ '--stripe': stripeVar(fr.id) }}>
              <div className="row">
                <span className="avatar">{p.name.split(' ').map((w) => w[0]).join('')}</span>
                <div>
                  <b>{p.name}</b> <span className="chip" style={{ padding: '1px 7px', fontSize: 10 }}>{p.tier}</span>{p.role === 'captain' && <span className="chip" style={{ padding: '1px 7px', fontSize: 10, marginLeft: 4 }}>C</span>}
                  <div className="muted" style={{ fontSize: 12 }}>{fr.name}</div>
                </div>
              </div>
              <div className="center">
                <div className="num" style={{ fontSize: 18 }}>{p.lp_rating}</div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: t.color, textTransform: 'uppercase' }}>{t.label}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ======================= PLAYER PROFILE ======================== */
export function PlayerProfile() {
  const { id } = useParams();
  const p = playerById(id);
  if (!p) return <div className="page"><p className="muted">Player not found.</p></div>;
  const fr = franchiseById(p.franchise_id);
  const t = tier(p.lp_rating);
  const winPct = Math.round((p.stats.wins / p.stats.played) * 100);
  return (
    <div className="page">
      <div className="hero" style={{ '--stripe': stripeVar(fr.id) }}>
        <div className="row" style={{ gap: 16, flexWrap: 'wrap' }}>
          <span className="avatar" style={{ width: 72, height: 72, fontSize: 26, border: `2px solid ${stripeVar(fr.id).replace('var(', '').replace(')', '') ? '' : ''}`, borderColor: 'var(--line-strong)' }}>
            {p.name.split(' ').map((w) => w[0]).join('')}
          </span>
          <div>
            <span className="eyebrow">{fr.name} · {p.role === 'captain' ? 'Captain' : 'Player'}</span>
            <h1 className="display">{p.name}</h1>
            <div className="row mt" style={{ gap: 8 }}>
              <span className="lp-badge">LP {p.lp_rating}</span>
              <span className="chip" style={{ color: t.color }}>{t.label}</span>
              <span className="chip">Auction R{p.auction_price.toLocaleString('en-ZA')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="kpis mt">
        <div className="kpi"><div className="v">{p.stats.played}</div><div className="l">Matches</div></div>
        <div className="kpi"><div className="v">{winPct}%</div><div className="l">Win rate</div></div>
        <div className="kpi"><div className="v">{p.stats.rubbers_won}</div><div className="l">Rubbers won</div></div>
        <div className="kpi"><div className="v">{p.stats.bonus_points}</div><div className="l">Bonus points</div></div>
      </div>
      <div className="grid cols-2 mt">
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Season form</p>
          {[['Games won', p.stats.games_won, 25], ['MVP points', p.stats.mvp_points, 35], ['Rubbers won', p.stats.rubbers_won, 6]].map(([l, v, max]) => (
            <div className="statline" key={l}>
              <span style={{ fontSize: 13 }}>{l}</span><b className="num">{v}</b>
              <div className="bar"><i style={{ width: `${Math.min(100, (v / max) * 100)}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Franchise</p>
          <Link to={`/franchise/${fr.id}`} className="row">
            <img src={fr.logo} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} />
            <div>
              <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 17 }}>{fr.name}</b>
              <div className="muted" style={{ fontSize: 12 }}>{fr.league === 'mens' ? "Men's" : 'Ladies'} League · {fr.venue}</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ========================= FRANCHISES ========================== */
export function Franchises() {
  const [league, setLeague] = useState('mens');
  const list = league === 'ladies' ? [] : STANDINGS[league].franchise;
  return (
    <div className="page">
      <h1 className="display">Franchises</h1>
      <div className="tabbar mt">
        <button className={league === 'mens' ? 'on' : ''} onClick={() => setLeague('mens')}>Men's</button>
        <button className={league === 'ladies' ? 'on' : ''} onClick={() => setLeague('ladies')}>Ladies</button>
      </div>
      {league === 'ladies' && <div className="mt"><ComingSoon note="Ladies franchise hubs launch with the Season 3 announcement." /></div>}
      <div className="grid cols-2 mt">
        {list.map((r, i) => {
          const fr = franchiseById(r.franchise_id);
          return (
            <Link key={fr.id} to={`/franchise/${fr.id}`} className="card stripe row spread" style={{ '--stripe': stripeVar(fr.id) }}>
              <div className="row">
                <img src={fr.logo} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} />
                <div>
                  <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 17 }}>{fr.name}</b>
                  <div className="muted" style={{ fontSize: 12 }}>P{r.played} · W{r.won} · {r.points} pts</div>
                </div>
              </div>
              <span className={`pos-badge ${i < 4 ? 'q' : ''}`} style={{ width: 30, height: 30, fontSize: 14 }}>{i + 1}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ======================== FRANCHISE HUB ======================== */
export function FranchiseHub() {
  const { id } = useParams();
  const fr = franchiseById(id);
  const squad = PLAYERS.filter((p) => p.franchise_id === id).sort((a, b) => a.tier.localeCompare(b.tier) || b.lp_rating - a.lp_rating);
  const row = STANDINGS[fr.league]?.franchise?.find((r) => r.franchise_id === id);
  const pos = (STANDINGS[fr.league]?.franchise?.findIndex((r) => r.franchise_id === id) ?? -1) + 1;
  const fixtures = FIXTURES.filter((f) => f.home === id || f.away === id);
  return (
    <div className="page">
      <div className="hero" style={{ borderLeft: `4px solid`, borderLeftColor: `var(--fr-${id})` }}>
        <div className="row" style={{ gap: 16, flexWrap: 'wrap' }}>
          <img src={fr.logo} alt="" style={{ width: 84, height: 84, objectFit: 'contain' }} />
          <div>
            <span className="eyebrow">{fr.league === 'mens' ? "Men's" : 'Ladies'} League · {fr.venue}</span>
            <h1 className="display">{fr.name}</h1>
            {row && (
              <div className="row mt" style={{ gap: 8, flexWrap: 'wrap' }}>
                <span className="chip">#{pos} on the table</span>
                <span className="chip">{row.won}W – {row.lost}L</span>
                <span className="chip">{row.points} pts</span>
                <span className="form">{row.form.map((f, k) => <i key={k} className={f === 'W' ? 'w' : 'l'}>{f}</i>)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <SectionHead title="Squad" />
      <div className="grid cols-3">
        {squad.map((p) => (
          <Link key={p.id} to={`/player/${p.id}`} className="card row spread" style={{ padding: 12 }}>
            <span className="row">
              <span className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{p.name.split(' ').map((w) => w[0]).join('')}</span>
              <span>
                <b style={{ fontSize: 14 }}>{p.name}</b> <span className="chip" style={{ padding: '1px 6px', fontSize: 10 }}>{p.tier}</span> {p.role === 'captain' && <span className="gold">©</span>}
              </span>
            </span>
            <span className="num gold">{p.lp_rating}</span>
          </Link>
        ))}
      </div>

      <SectionHead title="Schedule & results" />
      <div className="grid cols-2">
        {fixtures.map((f) => f.status === 'final'
          ? <ResultCard key={f.id} fixture={f} />
          : f.status === 'live'
            ? <LiveScoreCard key={f.id} fixture={f} compact />
            : <FixtureRow key={f.id} fixture={f} />)}
      </div>
    </div>
  );
}

/* ====================== RANKINGS / MVP / LP ===================== */
export function Rankings() {
  const [tab, setTab] = useState('power');
  const [league, setLeague] = useState('mens');
  const mvps = [...PLAYERS].filter((p) => p.stats.played > 0).sort((a, b) => b.stats.mvp_points - a.stats.mvp_points || b.stats.rubbers_won - a.stats.rubbers_won || b.stats.games_won - a.stats.games_won).slice(0, 20);
  const lp = [...PLAYERS].sort((a, b) => b.lp_rating - a.lp_rating).slice(0, 15);
  return (
    <div className="page">
      <h1 className="display">Rankings</h1>
      <div className="tabbar mt">
        <button className={tab === 'power' ? 'on' : ''} onClick={() => setTab('power')}>Power Rankings</button>
        <button className={tab === 'mvp' ? 'on' : ''} onClick={() => setTab('mvp')}>MVP Leaderboard</button>
        <button className={tab === 'lp' ? 'on' : ''} onClick={() => setTab('lp')}>LP Rating</button>
      </div>

      {tab === 'power' && (
        <>
          <div className="tabbar mt">
            <button className={league === 'mens' ? 'on' : ''} onClick={() => setLeague('mens')}>Men's</button>
            <button className={league === 'ladies' ? 'on' : ''} onClick={() => setLeague('ladies')}>Ladies</button>
          </div>
          <p className="muted mt" style={{ fontSize: 13 }}>The committee's weekly board — results, strength of schedule and momentum, not just the table.</p>
          {league === 'ladies' && <div className="mt"><ComingSoon note="The ladies power rankings begin once Season 3 is underway." /></div>}
          <div className="grid mt">
            {(league === 'ladies' ? [] : POWER_RANKINGS[league]).map((fid, i) => {
              const fr = franchiseById(fid);
              const move = i % 3 === 0 ? '▲' : i % 3 === 1 ? '▬' : '▼';
              return (
                <Link key={fid} to={`/franchise/${fid}`} className="card stripe row spread" style={{ '--stripe': stripeVar(fid) }}>
                  <span className="row">
                    <b className="num" style={{ fontSize: 22, width: 30 }}>{i + 1}</b>
                    <img src={fr.logo} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} />
                    <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16 }}>{fr.name}</b>
                  </span>
                  <span style={{ color: move === '▲' ? 'var(--win)' : move === '▼' ? 'var(--loss)' : 'var(--muted)' }}>{move}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {tab === 'mvp' && (
        <>
          <p className="muted mt" style={{ fontSize: 13 }}>MVP points: 3 per rubber won, +1 bonus for a 4-0 rubber. Updated as each match night finishes.</p>
          <Board list={mvps} value={(p) => `★ ${p.stats.mvp_points}`} />
        </>
      )}

      {tab === 'lp' && (
        <>
          <p className="muted mt" style={{ fontSize: 13 }}>
            The LP Rating is a doubles Elo. Pairs are rated as a unit, the swing scales with set margin, and every player starts at 1400. Win as underdogs and your number jumps.
          </p>
          <Board list={lp} value={(p) => p.lp_rating} gold />
        </>
      )}
    </div>
  );
}
function Board({ list, value, gold }) {
  return (
    <div className="grid mt">
      {list.map((p, i) => {
        const fr = franchiseById(p.franchise_id);
        return (
          <Link key={p.id} to={`/player/${p.id}`} className="card stripe row spread" style={{ '--stripe': stripeVar(fr.id), padding: 12 }}>
            <span className="row">
              <b className="num muted" style={{ width: 26 }}>{i + 1}</b>
              <span className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{p.name.split(' ').map((w) => w[0]).join('')}</span>
              <span>
                <b style={{ fontSize: 14 }}>{p.name}</b>
                <div className="muted" style={{ fontSize: 11 }}>{fr.name}</div>
              </span>
            </span>
            <span className={`num ${gold ? 'gold' : ''}`} style={{ fontSize: 17 }}>{value(p)}</span>
          </Link>
        );
      })}
    </div>
  );
}

/* =========================== NEWS ============================= */
export function NewsCentre() {
  const [tag, setTag] = useState('all');
  const list = NEWS.filter((n) => tag === 'all' || n.tag === tag);
  return (
    <div className="page">
      <h1 className="display">News Centre</h1>
      <div className="tabbar mt">
        {['all', 'mens', 'ladies', 'league', 'analysis'].map((t) => (
          <button key={t} className={tag === t ? 'on' : ''} onClick={() => setTag(t)}>{t[0].toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      <div className="grid cols-2 mt">
        {list.map((n) => (
          <article key={n.id} className="card news-card stripe" style={{ '--stripe': 'var(--court)' }}>
            <span className="kicker">{n.kicker}</span>
            <h3>{n.title}</h3>
            <p className="muted" style={{ fontSize: 13.5 }}>{n.body}</p>
            <span className="meta">{new Date(n.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long' })}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ========================= SPONSOR CENTRE ====================== */
export function SponsorCentre() {
  const tiers = [
    { tier: 'Title Partner', price: 'POA', perks: ['League naming rights', 'Logo on every scoreboard & live graphic', 'Hero placement on app home', 'Finals Night presenting rights', 'Monthly exposure analytics'] },
    { tier: 'Gold', price: 'R25 000 / season', perks: ['Sponsor rail on home & match pages', 'Franchise-of-the-week features', 'Click-through analytics dashboard', 'Courtside branding'] },
    { tier: 'Silver', price: 'R12 500 / season', perks: ['Sponsor rail placement', 'News Centre features', 'Quarterly analytics report'] },
    { tier: 'Community', price: 'R5 000 / season', perks: ['Sponsor rail placement', 'Matchnight shout-outs'] },
  ];
  return (
    <div className="page">
      <h1 className="display">Partner with Lowveld Padel</h1>
      <p className="muted" style={{ maxWidth: 620 }}>
        A daily-visit audience of players, families and fans across Mbombela and the Lowveld — with measured, reported exposure: impressions, clicks and matchnight reach per partner.
      </p>
      <div className="grid cols-2 mt">
        {tiers.map((t) => (
          <div key={t.tier} className="card stripe" style={{ '--stripe': 'var(--gold)' }}>
            <div className="row spread">
              <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 19 }}>{t.tier}</b>
              <span className="lp-badge">{t.price}</span>
            </div>
            <ul style={{ margin: '10px 0 0 18px', color: 'var(--muted)', fontSize: 13.5 }}>
              {t.perks.map((p) => <li key={p} style={{ marginBottom: 4 }}>{p}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <SectionHead title="Current partners" />
      <div className="grid cols-3">
        {SPONSORS.map((sp) => (
          <div key={sp.id} className="card">
            <span className="tier" style={{ color: 'var(--gold)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 800 }}>{sp.tier}</span>
            {sp.logo && <img src={sp.logo} alt={sp.name} style={{ maxHeight: 36, maxWidth: '80%', objectFit: 'contain', borderRadius: 4, marginTop: 6 }} />}
            <b style={{ display: 'block', marginTop: 4 }}>{sp.name}</b>
            <p className="muted" style={{ fontSize: 13 }}>{sp.blurb}</p>
          </div>
        ))}
      </div>
      <div className="card mt center" style={{ padding: 28 }}>
        <h2 className="display">Become a partner</h2>
        <p className="muted" style={{ margin: '6px 0 14px' }}>Get the Season 3 commercial deck and live audience numbers.</p>
        <a className="btn gold" href="mailto:partners@lowveldpadel.co.za">Request the partner pack</a>
      </div>
    </div>
  );
}

/* =========================== MORE ============================= */
export function More() {
  const items = [
    ['Rankings', '/rankings'], ['Franchises', '/franchises'], ['News Centre', '/news'], ['Sponsors', '/sponsors'],
    ['Captain Dashboard', '/captain'], ['Commissioner', '/commissioner'], ['Umpire Console', '/admin'], ['Sponsor Analytics', '/sponsor-analytics'],
  ];
  return (
    <div className="page">
      <h1 className="display">More</h1>
      <div className="grid cols-2 mt">
        {items.map(([l, to]) => (
          <Link key={to} to={to} className="card row spread"><b>{l}</b><span className="muted">→</span></Link>
        ))}
      </div>
    </div>
  );
}
