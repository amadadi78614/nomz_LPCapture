import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FIXTURES, PLAYERS, NEWS, STANDINGS, POWER_RANKINGS, SPONSORS, TIER_SPONSORS, FRANCHISES,
  franchiseById, playerById, stripeVar, bestPartner, winPct,
  RIVALRIES, headToHead, DYNASTY, TV_VIDEOS, TV_LIVE, getYouTubeId, ytThumb, mvpLeader,
  ROAD_TO_360, LEGACY_FRANCHISES, matchOfTheWeek, lpAiPredict, POWER_RANKINGS_WEEKLY,
  teamForm,
} from '../data/seed';
import { communityLinks } from '../config/communityLinks';
import { useLiveMatch } from '../hooks/useLiveMatch';
import { displayPoints } from '../lib/scoringEngine';
import { tier } from '../lib/lpRating';
import {
  LiveScoreCard, ResultCard, FixtureRow, StandingsTable, SponsorRail, SectionHead, ComingSoon,
} from '../components/ui';

/* ============================ HOME ============================ */
export function Home() {
  const live = FIXTURES.filter((f) => f.status === 'live');
  const results = FIXTURES.filter((f) => f.status === 'final').slice(-3).reverse();
  const upcoming = FIXTURES.filter((f) => f.status === 'scheduled').slice(0, 2);
  const hero = NEWS[0];
  const mvp = mvpLeader('mens');
  const sFr = STANDINGS.mens.franchise;
  const leader = sFr[0];
  const power = POWER_RANKINGS.mens.slice(0, 5);
  const dynSpot = franchiseById(DYNASTY.spotlight);
  const dynRow = sFr.find((x) => x.franchise_id === DYNASTY.spotlight);
  // Rivalry of the week: prefer one whose teams have actually met, else first
  const rotw = RIVALRIES.find((r) => headToHead(r.a, r.b).played > 0) || RIVALRIES[0];
  const rA = franchiseById(rotw.a); const rB = franchiseById(rotw.b); const rH = headToHead(rotw.a, rotw.b);
  const tvFeatured = ['highlights', 'interview', 'show'].map((c) => TV_VIDEOS.find((v) => v.category === c)).filter(Boolean);

  return (
    <div className="page">
      <HomeStyles />
      {/* ============ HERO STORY ============ */}
      <div className="hero">
        <span className="eyebrow" style={{ color: 'var(--live)' }}>Season 3 · Week 2 complete · Next: Mon 22 Jun</span>
        <h1 className="display" style={{ margin: '6px 0 8px' }}>{hero.title}</h1>
        <p className="muted" style={{ maxWidth: 580 }}>{hero.body}</p>
        <div className="row mt" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Link to="/live" className="btn live">● Match Centre</Link>
          <Link to="/tv" className="btn ghost">Lowveld TV</Link>
          <Link to="/standings" className="btn ghost">Standings</Link>
        </div>
      </div>

      {/* ============ LIVE CENTRE ============ */}
      {live.length > 0 ? (
        <>
          <SectionHead title="Live now" to="/live" cta="Match Centre" />
          <div className="grid cols-2">{live.map((f) => <LiveScoreCard key={f.id} fixture={f} />)}</div>
        </>
      ) : (
        <>
          <SectionHead title="Match Centre" to="/live" cta="All results" />
          <div className="grid cols-3">
            {results.map((f) => <ResultCard key={f.id} fixture={f} />)}
            {upcoming.slice(0, 1).map((f) => <FixtureRow key={f.id} fixture={f} />)}
          </div>
        </>
      )}

      {/* ============ CURRENT LEADERS strip ============ */}
      <SectionHead title="Current leaders" to="/standings" />
      <div className="lead-strip">
        <Link to="/standings" className="lead-card stripe" style={{ '--stripe': stripeVar(leader.franchise_id) }}>
          <span className="eyebrow">League leader</span>
          <span className="row" style={{ gap: 8, marginTop: 6 }}>
            <img src={franchiseById(leader.franchise_id).logo} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} />
            <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15 }}>{franchiseById(leader.franchise_id).name}</b>
          </span>
          <span className="num gold" style={{ fontSize: 20 }}>{leader.points} pts</span>
        </Link>
        <Link to={`/player/${mvp.id}`} className="lead-card stripe" style={{ '--stripe': 'var(--gold)' }}>
          <span className="eyebrow">MVP race leader</span>
          <span className="row" style={{ gap: 8, marginTop: 6 }}>
            <span className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{mvp.name.split(' ').map((w) => w[0]).join('')}</span>
            <b style={{ fontSize: 14 }}>{mvp.name}</b>
          </span>
          <span className="num gold" style={{ fontSize: 20 }}>★ {mvp.stats.mvp_points}</span>
        </Link>
        <Link to="/rankings" className="lead-card stripe" style={{ '--stripe': 'var(--court)' }}>
          <span className="eyebrow">Top LP Rating</span>
          {(() => {
            const top = [...PLAYERS].filter((p) => p.stats.played > 0).sort((a, b) => b.lp_rating - a.lp_rating)[0];
            return (
              <>
                <span className="row" style={{ gap: 8, marginTop: 6 }}>
                  <span className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{top.name.split(' ').map((w) => w[0]).join('')}</span>
                  <b style={{ fontSize: 14 }}>{top.name}</b>
                </span>
                <span className="num" style={{ fontSize: 20, color: 'var(--court)' }}>{top.lp_rating}</span>
              </>
            );
          })()}
        </Link>
      </div>

      {/* ============ RIVALRY OF THE WEEK ============ */}
      <SectionHead title="Rivalry of the week" to="/rivalries" cta="All rivalries" />
      <Link to={`/rivalry/${rotw.id}`} className="rotw">
        <div className="rotw-side" style={{ '--c': stripeVar(rotw.a) }}><img src={rA.logo} alt="" /><b>{rA.name}</b></div>
        <div className="rotw-mid">
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>{rotw.tag}</span>
          <div className="rotw-score">{rH.played ? `${rH.aWins}–${rH.bWins}` : 'VS'}</div>
          <span className="muted" style={{ fontSize: 11 }}>{rH.played ? 'head-to-head' : 'first meeting looms'}</span>
        </div>
        <div className="rotw-side" style={{ '--c': stripeVar(rotw.b) }}><img src={rB.logo} alt="" /><b>{rB.name}</b></div>
      </Link>

      {/* ============ POWER RANKINGS ============ */}
      <SectionHead title="Power rankings" to="/rankings" cta="Full board" />
      <div className="grid">
        {power.map((fid, i) => {
          const fr = franchiseById(fid);
          return (
            <Link key={fid} to={`/franchise/${fid}`} className="card stripe row spread" style={{ '--stripe': stripeVar(fid), padding: 11 }}>
              <span className="row" style={{ gap: 10 }}>
                <b className="num" style={{ width: 24, fontSize: 18 }}>{i + 1}</b>
                <img src={fr.logo} alt="" style={{ width: 26, height: 26, objectFit: 'contain' }} />
                <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>{fr.name}</b>
              </span>
              <span className="muted" style={{ fontSize: 12 }}>{i === 0 ? '▲' : i % 2 ? '▬' : '▲'}</span>
            </Link>
          );
        })}
      </div>

      {/* ============ ROAD TO 360 ============ */}
      <Link to="/road-to-360" className="card stripe r360-home" style={{ '--stripe': 'var(--gold)', display: 'block' }}>
        <div className="row spread">
          <span className="row" style={{ gap: 12 }}>
            <span style={{ fontSize: 30 }}>🇿🇦</span>
            <span>
              <span className="eyebrow" style={{ color: 'var(--gold)' }}>Road to 360</span>
              <b style={{ display: 'block', fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16 }}>Road to the 360 Super Cup</b>
            </span>
          </span>
          <span className="muted" style={{ fontSize: 12 }}>{ROAD_TO_360.dates} →</span>
        </div>
        <p className="muted" style={{ fontSize: 13, margin: '10px 0 0' }}>Follow Lowveld's journey to national competition.</p>
      </Link>

      {/* ============ LEGACY LEAGUE ============ */}
      <SectionHead title="Legacy League" to="/legacy-league" cta="Enter" />
      <Link to="/legacy-league" className="card" style={{ display: 'block' }}>
        <p className="muted" style={{ fontStyle: 'italic', margin: 0 }}>Building Legacies. Creating Opportunities. One Match At A Time.</p>
        <div className="row" style={{ gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          {LEGACY_FRANCHISES.map((fr) => (
            <span key={fr.id} className="chip" style={{ fontSize: 10 }}>{fr.name}</span>
          ))}
        </div>
      </Link>

      {/* ============ MATCH OF THE WEEK / PREDICTION ============ */}
      {(() => {
        const fx = matchOfTheWeek();
        if (!fx) return null;
        const a = franchiseById(fx.home); const b = franchiseById(fx.away);
        return (
          <>
            <SectionHead title="Match of the Week" to="/predictor" cta="Predict" />
            <Link to="/predictor" className="card stripe" style={{ '--stripe': 'var(--live)', display: 'block' }}>
              <div className="row spread">
                <span className="row" style={{ gap: 8 }}><img src={a.logo} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} /><b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>{a.name}</b></span>
                <span className="muted">v</span>
                <span className="row" style={{ gap: 8 }}><b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>{b.name}</b><img src={b.logo} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} /></span>
              </div>
              <p className="gold" style={{ fontSize: 12, margin: '10px 0 0', textAlign: 'center' }}>Predict the result →</p>
            </Link>
          </>
        );
      })()}

      {/* ============ MVP RACE ============ */}
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

      {/* ============ DYNASTY TRACKER ============ */}
      <SectionHead title="Dynasty tracker" to="/dynasty" cta="Full tracker" />
      <Link to="/dynasty" className="card stripe" style={{ '--stripe': stripeVar(dynSpot.id), display: 'block' }}>
        <div className="row spread">
          <span className="row" style={{ gap: 12 }}>
            <img src={dynSpot.logo} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} />
            <span>
              <span className="eyebrow">Title chase</span>
              <b style={{ display: 'block', fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16 }}>{dynSpot.name}</b>
            </span>
          </span>
          {dynRow && <span className="num gold" style={{ fontSize: 18 }}>{dynRow.points} pts</span>}
        </div>
        <p className="muted" style={{ fontSize: 13, margin: '10px 0 0' }}>{DYNASTY.spotlightStory}</p>
      </Link>

      {/* ============ LOWVELD TV ============ */}
      <SectionHead title="Lowveld TV" to="/tv" cta="Watch" />
      <div className="grid cols-3">
        {tvFeatured.map((v) => {
          const id = getYouTubeId(v.youtube_url);
          const thumb = v.thumbnail || ytThumb(v.youtube_url);
          return (
            <Link key={v.id} to="/tv" className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="tvhome-thumb">
                {thumb ? <img src={thumb} alt="" /> : <img src="/brand/lp-mark.png" alt="" className="tvhome-mark" />}
                <span className="tvhome-play">{id ? '►' : '◷'}</span>
              </div>
              <div style={{ padding: '8px 10px' }}>
                <span className="kicker" style={{ color: 'var(--live)' }}>{v.category}</span>
                <p style={{ fontSize: 13, fontWeight: 600, margin: '2px 0 0', lineHeight: 1.25 }}>{v.title}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ============ TABLES ============ */}
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

      {/* ============ SPORTS HUB ============ */}
      <SectionHead title="Sports Hub" to="/sports-hub" cta="Open" />
      <Link to="/sports-hub" className="card row spread" style={{ display: 'flex' }}>
        <span><b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>Beyond the Lowveld</b><div className="muted" style={{ fontSize: 12 }}>Springboks · F1 · World Cup · Wimbledon</div></span>
        <span className="muted">→</span>
      </Link>

      {/* ============ WHATSAPP COMMUNITY ============ */}
      <Link to="/community" className="card stripe" style={{ '--stripe': '#25D366', display: 'block' }}>
        <div className="row spread">
          <span className="row" style={{ gap: 12 }}>
            <span style={{ fontSize: 24 }}>✆</span>
            <span><b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15 }}>Join the Community</b><div className="muted" style={{ fontSize: 12 }}>Match-night chat, results & banter on WhatsApp</div></span>
          </span>
          <span className="muted">→</span>
        </div>
      </Link>

      {/* ============ SPONSOR STRIP ============ */}
      <div className="mt"><SponsorRail placement="home" /></div>
    </div>
  );
}

function HomeStyles() {
  return (
    <style>{`
      .lead-strip { display:grid; grid-template-columns:1fr; gap:10px; }
      .lead-card { display:flex; flex-direction:column; gap:2px; padding-left:18px; }
      .rotw { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--line);
        border-radius:var(--r); padding:16px 10px; }
      .rotw-side { display:flex; flex-direction:column; align-items:center; gap:5px; text-align:center;
        padding:8px; border-radius:var(--r-sm); background:linear-gradient(160deg, color-mix(in srgb, var(--c) 16%, transparent), transparent); }
      .rotw-side img { width:46px; height:46px; object-fit:contain; }
      .rotw-side b { font-family:var(--display); text-transform:uppercase; font-size:13px; }
      .rotw-mid { text-align:center; }
      .rotw-score { font-family:var(--display); font-weight:800; font-size:30px; line-height:1; }
      .tvhome-thumb { position:relative; width:100%; padding-top:56.25%; background:#0a0f1c; display:flex; align-items:center; justify-content:center; }
      .tvhome-thumb img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
      .tvhome-mark { position:absolute; width:38px !important; height:38px !important; inset:auto !important; opacity:.5; object-fit:contain; }
      .tvhome-play { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:38px; height:38px; border-radius:50%;
        background:rgba(0,0,0,.55); border:1.5px solid rgba(255,255,255,.7); display:flex; align-items:center; justify-content:center; color:#fff; }
      @media (min-width:760px){ .lead-strip { grid-template-columns:repeat(3,1fr); } }
    `}</style>
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
  const [fFilter, setFFilter] = useState('all');
  const list = useMemo(() => PLAYERS
    .filter((p) => p.league === 'mens' && (league === 'all' || p.league === league) && (fFilter === 'all' || p.franchise_id === fFilter) && p.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.lp_rating - a.lp_rating), [league, q, fFilter]);
  const mensFranchises = FRANCHISES.filter((f) => f.league === 'mens');
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
      {/* franchise filter */}
      <div className="row mt" style={{ gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="muted" style={{ fontSize: 11 }}>Franchise</span>
        <button className={`chip ${fFilter === 'all' ? 'on' : ''}`} onClick={() => setFFilter('all')} style={{ cursor: 'pointer', border: 'none' }}>All</button>
        {mensFranchises.map((fr) => (
          <button key={fr.id} className={`chip ${fFilter === fr.id ? 'on' : ''}`} onClick={() => setFFilter(fr.id)}
            style={{ cursor: 'pointer', border: 'none', borderLeft: `3px solid ${stripeVar(fr.id)}` }}>
            {fr.short || fr.name}
          </button>
        ))}
      </div>
      {league === 'ladies' && <div className="mt"><ComingSoon note="Ladies League player profiles go live with the Season 3 launch." /></div>}
      <p className="muted mt" style={{ fontSize: 12 }}>{list.length} player{list.length === 1 ? '' : 's'}</p>
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
  const wpct = winPct(p.stats);
  const partner = bestPartner(p.id);
  return (
    <div className="page">
      <div className="hero" style={{ '--stripe': stripeVar(fr.id) }}>
        <div className="row" style={{ gap: 16, flexWrap: 'wrap' }}>
          <span className="avatar" style={{ width: 72, height: 72, fontSize: 26, border: `2px solid ${stripeVar(fr.id).replace('var(', '').replace(')', '') ? '' : ''}`, borderColor: 'var(--line-strong)' }}>
            {p.name.split(' ').map((w) => w[0]).join('')}
          </span>
          <div>
            <span className="eyebrow">{fr.name} · {p.tier} · {p.role === 'captain' ? 'Captain' : 'Player'}</span>
            <h1 className="display">{p.name}</h1>
            <div className="row mt" style={{ gap: 8 }}>
              <span className="lp-badge">LP {p.lp_rating}</span>
              <span className="chip" style={{ color: t.color }}>{t.label}</span>
              <span className="chip">{p.stats.wins}-{p.stats.losses}</span>
            </div>
            <a className="wa-share" target="_blank" rel="noreferrer"
              href={`https://wa.me/?text=${encodeURIComponent(`${p.name} — LP Rating ${p.lp_rating}, ${p.stats.wins}-${p.stats.losses}, ${p.stats.mvp_points} MVP pts on Lowveld Padel. ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}>
              ✆ Share to WhatsApp
            </a>
            <style>{`.wa-share{display:inline-flex;align-items:center;gap:6px;margin-top:10px;background:#25D366;color:#06270f;font-weight:700;font-size:12px;padding:5px 12px;border-radius:999px;}`}</style>
          </div>
        </div>
      </div>
      <div className="kpis mt">
        <div className="kpi"><div className="v">{p.stats.played}</div><div className="l">Matches</div></div>
        <div className="kpi"><div className="v">{wpct}%</div><div className="l">Win rate</div></div>
        <div className="kpi"><div className="v">{p.stats.rubbers_won}</div><div className="l">Rubbers won</div></div>
        <div className="kpi"><div className="v">{p.stats.bonus_points}</div><div className="l">Bonus points</div></div>
      </div>
      {partner && (
        <Link to={`/player/${partner.player.id}`} className="card stripe mt" style={{ '--stripe': stripeVar(fr.id), display: 'block' }}>
          <p className="eyebrow" style={{ marginBottom: 6 }}>Best partnership</p>
          <div className="row spread">
            <span className="row" style={{ gap: 10 }}>
              <span className="avatar" style={{ width: 32, height: 32, fontSize: 11 }}>{partner.player.name.split(' ').map((w) => w[0]).join('')}</span>
              <b>{partner.player.name}</b>
            </span>
            <span className="num"><b style={{ color: 'var(--win)' }}>{partner.won}</b><span className="muted">/{partner.played} · {Math.round(partner.pct * 100)}%</span></span>
          </div>
        </Link>
      )}
      <div className="grid cols-2 mt">
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Season form</p>
          {[['Rubbers won', p.stats.rubbers_won, 6], ['Sets won', p.stats.sets_won, 12], ['MVP points', p.stats.mvp_points, 35], ['Bonus points (4-0 wins)', p.stats.bonus_points, 4]].map(([l, v, max]) => (
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
  const form = teamForm(id);
  return (
    <div className="page">
      <div className="hero" style={{ borderLeft: `4px solid`, borderLeftColor: `var(--fr-${id})` }}>
        <div className="row" style={{ gap: 16, flexWrap: 'wrap' }}>
          <img src={fr.logo} alt="" style={{ width: 84, height: 84, objectFit: 'contain' }} />
          <div>
            <span className="eyebrow">{fr.league === 'mens' ? "Men's" : 'Ladies'} League · {fr.venue}</span>
            <h1 className="display">{fr.name}</h1>
            {fr.owner && fr.owner !== 'Franchise Owner' && (
              <p className="muted" style={{ margin: '2px 0 0', fontSize: 13 }}>
                Owner: <b style={{ color: 'var(--text)' }}>{fr.owner}</b>
                {fr.ownerBrand && <span> · {fr.ownerBrand}</span>}
              </p>
            )}
            {row && (
              <div className="row mt" style={{ gap: 8, flexWrap: 'wrap' }}>
                <span className="chip">#{pos} on the table</span>
                <span className="chip">{row.won}W – {row.lost}L</span>
                <span className="chip">{row.points} pts</span>
                {form.length > 0 && <span className="form">{form.map((f, k) => <i key={k} className={f === 'W' ? 'w' : 'l'}>{f}</i>)}</span>}
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
  const [tab, setTab] = useState('players');
  const [league, setLeague] = useState('mens');
  const [pLeague, setPLeague] = useState('mens');
  const [sortBy, setSortBy] = useState('lp');
  const [tierFilter, setTierFilter] = useState('all');
  const [courtFilter, setCourtFilter] = useState('all');
  const [franchiseFilter, setFranchiseFilter] = useState('all');
  const [minMatches, setMinMatches] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const active = PLAYERS.filter((p) => (showAll ? true : p.stats.played > 0) && p.league === pLeague);
  const sorters = {
    lp: (a, b) => b.lp_rating - a.lp_rating,
    win: (a, b) => winPct(b.stats) - winPct(a.stats) || b.stats.wins - a.stats.wins || b.lp_rating - a.lp_rating,
    mvp: (a, b) => b.stats.mvp_points - a.stats.mvp_points || b.stats.rubbers_won - a.stats.rubbers_won,
    wins: (a, b) => b.stats.wins - a.stats.wins || winPct(b.stats) - winPct(a.stats),
  };
  let players = active
    .filter((p) => franchiseFilter === 'all' || p.franchise_id === franchiseFilter)
    .filter((p) => courtFilter === 'all' || p.tier === courtFilter)
    .filter((p) => tierFilter === 'all' || tier(p.lp_rating).label === tierFilter)
    .filter((p) => (sortBy === 'win' && minMatches ? p.stats.played >= 2 : true))
    .sort(sorters[sortBy]);

  const mensFranchises = FRANCHISES.filter((f) => f.league === 'mens');

  const TIERS = ['Rising', 'Contender', 'Advanced', 'Pro', 'Elite'];

  return (
    <div className="page">
      <h1 className="display">Rankings</h1>
      <div className="tabbar mt">
        <button className={tab === 'players' ? 'on' : ''} onClick={() => setTab('players')}>Players</button>
        <button className={tab === 'power' ? 'on' : ''} onClick={() => setTab('power')}>Power Rankings</button>
      </div>

      {tab === 'players' && (
        <>
          {/* league toggle */}
          <div className="tabbar mt">
            <button className={pLeague === 'mens' ? 'on' : ''} onClick={() => setPLeague('mens')}>Men's</button>
            <button className={pLeague === 'ladies' ? 'on' : ''} onClick={() => setPLeague('ladies')}>Ladies</button>
          </div>
          {pLeague === 'ladies' ? (
            <div className="mt"><ComingSoon note="Ladies player rankings go live with the Season 3 launch." /></div>
          ) : (
          <>
          {/* sort toggle */}
          <div className="tabbar mt">
            {[['lp', 'LP Rating'], ['win', 'Win %'], ['wins', 'Wins'], ['mvp', 'MVP']].map(([k, lbl]) => (
              <button key={k} className={sortBy === k ? 'on' : ''} onClick={() => setSortBy(k)}>{lbl}</button>
            ))}
          </div>
          {/* court division filter */}
          <div className="row mt" style={{ gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="muted" style={{ fontSize: 11 }}>Court</span>
            {['all', 'P1', 'P2', 'P3'].map((c) => (
              <button key={c} className={`chip ${courtFilter === c ? 'on' : ''}`} onClick={() => setCourtFilter(c)} style={{ cursor: 'pointer', border: 'none' }}>{c === 'all' ? 'All' : c}</button>
            ))}
          </div>
          {/* franchise filter */}
          <div className="row mt" style={{ gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="muted" style={{ fontSize: 11 }}>Franchise</span>
            <button className={`chip ${franchiseFilter === 'all' ? 'on' : ''}`} onClick={() => setFranchiseFilter('all')} style={{ cursor: 'pointer', border: 'none' }}>All</button>
            {mensFranchises.map((fr) => (
              <button key={fr.id} className={`chip ${franchiseFilter === fr.id ? 'on' : ''}`} onClick={() => setFranchiseFilter(fr.id)}
                style={{ cursor: 'pointer', border: 'none', borderLeft: `3px solid ${stripeVar(fr.id)}` }}>
                {fr.short || fr.name}
              </button>
            ))}
          </div>
          {/* rating tier filter */}
          <div className="row mt" style={{ gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="muted" style={{ fontSize: 11 }}>Tier</span>
            <button className={`chip ${tierFilter === 'all' ? 'on' : ''}`} onClick={() => setTierFilter('all')} style={{ cursor: 'pointer', border: 'none' }}>All</button>
            {TIERS.map((t) => (
              <button key={t} className={`chip ${tierFilter === t ? 'on' : ''}`} onClick={() => setTierFilter(t)} style={{ cursor: 'pointer', border: 'none' }}>{t}</button>
            ))}
          </div>
          {sortBy === 'win' && (
            <label className="muted row" style={{ fontSize: 12, marginTop: 8, gap: 6, cursor: 'pointer' }}>
              <input type="checkbox" checked={minMatches} onChange={(e) => setMinMatches(e.target.checked)} />
              Require 2+ matches (fair win %)
            </label>
          )}
          <label className="muted row" style={{ fontSize: 12, marginTop: 8, gap: 6, cursor: 'pointer' }}>
            <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
            Show full roster (include players yet to play)
          </label>
          <p className="muted mt" style={{ fontSize: 12 }}>
            {sortBy === 'lp' && 'LP Rating — doubles Elo from real results; everyone starts at 1400, beating stronger pairs moves you more.'}
            {sortBy === 'win' && 'Win % — share of rubbers won.'}
            {sortBy === 'wins' && 'Total rubbers won this season.'}
            {sortBy === 'mvp' && 'MVP points — 3 per rubber won, +1 for a clean 4-0.'}
          </p>

          {players.length === 0 ? (
            <div className="card mt"><p className="muted" style={{ margin: 0 }}>No players in this tier yet.</p></div>
          ) : (
            <div className="grid mt">
              {players.map((p, i) => {
                const fr = franchiseById(p.franchise_id);
                const t = tier(p.lp_rating);
                const val = sortBy === 'win' ? `${winPct(p.stats)}%` : sortBy === 'mvp' ? `★ ${p.stats.mvp_points}` : sortBy === 'wins' ? p.stats.wins : p.lp_rating;
                return (
                  <Link key={p.id} to={`/player/${p.id}`} className="card stripe" style={{ '--stripe': stripeVar(fr.id), padding: 12 }}>
                    <div className="row spread">
                      <span className="row">
                        <b className="num muted" style={{ width: 26 }}>{i + 1}</b>
                        <span className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{p.name.split(' ').map((w) => w[0]).join('')}</span>
                        <span>
                          <b style={{ fontSize: 14 }}>{p.name} <span className="chip" style={{ padding: '0 6px', fontSize: 10 }}>{p.tier}</span></b>
                          <div className="muted" style={{ fontSize: 11 }}>{fr.name} · <span style={{ color: t.color }}>{t.label}</span></div>
                        </span>
                      </span>
                      <span className={`num ${sortBy === 'lp' ? 'gold' : ''}`} style={{ fontSize: 17 }}>{val}</span>
                    </div>
                    <div className="row" style={{ gap: 12, marginTop: 8, fontSize: 11 }}>
                      {p.stats.played === 0 ? (
                        <span className="muted">Yet to play this season</span>
                      ) : (
                        <>
                          <span className="muted">{p.stats.played} P</span>
                          <span style={{ color: 'var(--win)' }}>{p.stats.wins} W</span>
                          <span style={{ color: 'var(--loss)' }}>{p.stats.losses} L</span>
                          <span className="muted">{winPct(p.stats)}% win</span>
                          <span className="muted">{p.stats.sets_won} sets</span>
                          {p.stats.bonus_points > 0 && <span className="gold">{p.stats.bonus_points} BP</span>}
                        </>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          </>
          )}
        </>
      )}

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
    ['Road to 360', '/road-to-360'], ['Legacy League', '/legacy-league'], ['Predictor', '/predictor'], ['Lowveld TV', '/tv'],
    ['Rivalries', '/rivalries'], ['Hall of Fame', '/hall-of-fame'], ['Draft & Auction', '/draft'], ['Dynasty Tracker', '/dynasty'],
    ['Fan Zone', '/fan-zone'], ['Community', '/community'], ['Sports Hub', '/sports-hub'], ['Rankings', '/rankings'],
    ['Franchises', '/franchises'], ['News Centre', '/news'], ['Sponsors', '/sponsors'],
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
