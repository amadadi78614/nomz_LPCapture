import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ROAD_TO_360, LEGACY_FRANCHISES, legacyFranchiseById, LEGACY_STANDINGS, LEGACY_FIXTURES,
  LEGACY_PLAYERS, LEGACY_POWER, LEGACY_STATUS, LEGACY_SQUAD_NOTE, legacyPlayersByFranchise,
  PREDICTION_OPTIONS, PREDICTION_SCORING, PREDICTOR_BADGES, PREDICTION_LEADERBOARD,
  matchOfTheWeek, lpAiPredict, POWER_RANKINGS_WEEKLY, playerOfWeek,
  franchiseById, playerById, stripeVar, fanPotwCandidates,
  STANDINGS, FRANCHISES, TIER_SPONSORS, POWER_RANKINGS,
} from '../data/seed';
import { communityLinks, waShare } from '../config/communityLinks';
import { SectionHead, ComingSoon, StandingsTable, SponsorRail } from '../components/ui';

const legacyStripe = (id) => `var(--fr-${id})`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }) : 'TBC';

/* ============================================================
 * WhatsApp button — reusable, reads from central config
 * ========================================================== */
export function WaButton({ href, label = 'Join on WhatsApp', share, small }) {
  const url = share ? waShare(share) : (href || '#');
  return (
    <a className={`wa-btn ${small ? 'sm' : ''}`} href={url} target="_blank" rel="noreferrer">
      <span className="wa-ico">✆</span>{label}
      <style>{`
        .wa-btn { display:inline-flex; align-items:center; gap:8px; background:#25D366; color:#06270f; font-weight:700;
          padding:10px 16px; border-radius:999px; font-size:14px; border:0; cursor:pointer; }
        .wa-btn.sm { padding:5px 11px; font-size:12px; }
        .wa-ico { font-size:15px; }
      `}</style>
    </a>
  );
}

/* ============================================================
 * ROAD TO 360 SUPER CUP  →  /road-to-360
 * ========================================================== */
function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, done: diff === 0 };
}

export function RoadTo360() {
  const r = ROAD_TO_360;
  const cd = useCountdown(r.startDate);
  return (
    <div className="page">
      <Road360Styles />
      <div className="r360-hero">
        <span className="r360-flag">🇿🇦</span>
        <span className="eyebrow" style={{ color: 'var(--gold)' }}>National Competition</span>
        <h1 className="display" style={{ margin: '4px 0' }}>Road to the 360 Super Cup</h1>
        <p className="muted" style={{ maxWidth: 560 }}>{r.subtitle}</p>
        <p className="muted" style={{ fontSize: 13 }}>{r.location} · {r.dates}</p>
        <div className="r360-cd">
          {[['Days', cd.d], ['Hrs', cd.h], ['Min', cd.m], ['Sec', cd.s]].map(([l, v]) => (
            <div key={l} className="r360-cd-cell"><b>{String(v).padStart(2, '0')}</b><span>{l}</span></div>
          ))}
        </div>
        <div className="row mt" style={{ gap: 10, justifyContent: 'center' }}>
          <WaButton href={communityLinks.roadTo360} label="Follow the journey" />
        </div>
      </div>

      <SectionHead title="The Journey" />
      <div className="r360-timeline">
        {r.timeline.map((t) => (
          <div key={t.id} className={`r360-step ${t.status}`}>
            <span className="r360-dot">{t.status === 'done' ? '✓' : ''}</span>
            <div>
              <b>{t.label}</b>
              <div className="muted" style={{ fontSize: 12 }}>{t.date ? fmtDate(t.date) : (t.status === 'done' ? 'Confirmed' : 'TBC')}</div>
            </div>
          </div>
        ))}
      </div>

      <Sec title="Squad Announcement" empty={!r.squad.length} emptyNote="The Lowveld squad will be revealed here.">
        <div className="grid cols-2">
          {r.squad.map((s) => { const p = playerById(s.playerId); return p ? (
            <Link key={p.id} to={`/player/${p.id}`} className="card">{p.name}</Link>) : null; })}
        </div>
      </Sec>
      <Sec title="Fixtures" empty={!r.fixtures.length} emptyNote="Tournament fixtures drop closer to the event." />
      <Sec title="Results" empty={!r.results.length} emptyNote="Live results once the cup begins." />
      <Sec title="Tournament Standings" empty={!r.standings.length} emptyNote="Group standings will update live." />
      <Sec title="Match Reports" empty={!r.matchReports.length} emptyNote="Written reports after every Lowveld match." />
      <Sec title="Daily Updates" empty={!r.updates.length} emptyNote="Day-by-day updates from the road.">
        <div className="grid">
          {r.updates.map((u, i) => (
            <div key={i} className="card"><span className="muted" style={{ fontSize: 12 }}>{fmtDate(u.date)}</span><p style={{ margin: '4px 0 0' }}>{u.text}</p></div>
          ))}
        </div>
      </Sec>

      <div className="card" style={{ marginTop: 20 }}>
        <p className="eyebrow" style={{ marginBottom: 6 }}>Watch it unfold</p>
        <p className="muted" style={{ margin: 0, fontSize: 13 }}>Video from the Super Cup lands on <Link to="/tv" className="gold">Lowveld TV</Link>.</p>
      </div>
    </div>
  );
}
function Sec({ title, empty, emptyNote, children }) {
  return (
    <>
      <SectionHead title={title} />
      {empty ? <div className="card"><p className="muted" style={{ margin: 0 }}>{emptyNote}</p></div> : children}
    </>
  );
}

/* ============================================================
 * LEGACY LEAGUE  →  /legacy-league
 * ========================================================== */
export function LegacyLeague() {
  const [tab, setTab] = useState('teams');
  const ranked = [...LEGACY_STANDINGS].sort((a, b) => b.points - a.points);
  return (
    <div className="page">
      <LegacyStyles />
      <span className="eyebrow" style={{ color: 'var(--gold)' }}>Lowveld Padel · Official Competition</span>
      <h1 className="display">LP Legacy League</h1>
      <p className="muted" style={{ maxWidth: 600, fontStyle: 'italic', fontSize: 15 }}>Building Legacies. One Match At A Time.</p>
      <p className="muted" style={{ maxWidth: 620, fontSize: 13 }}>
        A competitive franchise environment for players ready to make their mark — six franchises, full stats, the same stage as the Franchise League.
      </p>

      <div className="tabbar mt">
        {[['teams', 'Franchises'], ['standings', 'Standings'], ['fixtures', 'Fixtures'], ['mvp', 'MVP Race'], ['power', 'Power Rankings'], ['draft', 'Draft Centre'], ['watch', 'Players to Watch']].map(([k, l]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {LEGACY_STATUS === 'drafted' && (
        <div className="card mt" style={{ borderColor: 'var(--gold)' }}>
          <b className="gold">Draft complete — squads confirmed</b>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>All 48 players have been drafted across the six franchises (5 adults + 3 youth each). Fixtures, standings, the MVP race and power rankings go live here the moment the first ball is struck in Season 4.</p>
        </div>
      )}
      {LEGACY_STATUS === 'pre' && (
        <div className="card mt" style={{ borderColor: 'var(--gold)' }}>
          <b className="gold">Season launching soon</b>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>{LEGACY_SQUAD_NOTE}</p>
        </div>
      )}

      {tab === 'teams' && (
        <div className="lg-grid mt">
          {LEGACY_FRANCHISES.map((fr) => (
            <Link key={fr.id} to={`/legacy-franchise/${fr.id}`} className="lg-card" style={{ '--p': fr.primary, '--s': fr.secondary, '--a': fr.accent }}>
              <div className="lg-card-logo"><img src={fr.logo} alt={fr.name} /></div>
              <div className="lg-card-body">
                <b>{fr.name}</b>
                <span className="lg-motto">{fr.motto}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === 'standings' && (
        <div className="grid mt">
          {ranked.map((row, i) => {
            const fr = legacyFranchiseById(row.franchise_id);
            return (
              <Link key={fr.id} to={`/legacy-franchise/${fr.id}`} className="card row spread lg-row" style={{ '--p': fr.primary }}>
                <span className="row" style={{ gap: 10 }}>
                  <b className="num" style={{ width: 20 }}>{i + 1}</b>
                  <img src={fr.logo} alt="" className="lg-chip-logo" />
                  <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>{fr.name}</b>
                </span>
                <span className="muted">{row.played ? `${row.won}-${row.lost}` : '—'} · {row.points} pts</span>
              </Link>
            );
          })}
        </div>
      )}
      {tab === 'fixtures' && <PreState note={LEGACY_FIXTURES.length ? '' : 'Fixtures will be published once the draft is complete and the schedule is confirmed.'} />}
      {tab === 'mvp' && <PreState note="The LP Legacy League MVP race begins with the first match night." />}
      {tab === 'power' && (
        <div className="grid mt">
          {LEGACY_POWER.map((fid, i) => {
            const fr = legacyFranchiseById(fid);
            return (
              <div key={fid} className="card row spread lg-row" style={{ '--p': fr.primary }}>
                <span className="row" style={{ gap: 10 }}><b className="num" style={{ width: 20 }}>{i + 1}</b><img src={fr.logo} alt="" className="lg-chip-logo" /><b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>{fr.name}</b></span>
                <span className="muted">▬</span>
              </div>
            );
          })}
          <p className="muted" style={{ fontSize: 12 }}>Power rankings update weekly once results are in.</p>
        </div>
      )}
      {tab === 'draft' && (
        <div className="card mt">
          <p className="eyebrow" style={{ marginBottom: 6 }}>LP Legacy League Draft Centre</p>
          <p className="gold" style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>🏆 Draft Complete — all 48 players assigned</p>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: 12 }}>6 teams · 5 adults + 3 youth each · Season 4</p>
          <div className="lg-grid mt">
            {LEGACY_FRANCHISES.map((fr) => {
              const sq = legacyPlayersByFranchise(fr.id);
              return (
                <div key={fr.id} className="lg-card" style={{ '--p': fr.primary, '--s': fr.secondary, '--a': fr.accent }}>
                  <div className="lg-card-logo"><img src={fr.logo} alt={fr.name} /></div>
                  <div className="lg-card-body" style={{ textAlign: 'left' }}>
                    <b style={{ textAlign: 'center', display: 'block' }}>{fr.name}</b>
                    <div style={{ marginTop: 8 }}>
                      <span className="eyebrow" style={{ fontSize: 9 }}>Adults</span>
                      {sq.filter((p) => p.kind === 'adult').map((p) => (
                        <div key={p.id} style={{ fontSize: 12, padding: '1px 0' }}>{p.name}</div>
                      ))}
                      <span className="eyebrow" style={{ fontSize: 9, display: 'block', marginTop: 6 }}>Youth</span>
                      {sq.filter((p) => p.kind === 'youth').map((p) => (
                        <div key={p.id} className="row spread" style={{ fontSize: 12, padding: '1px 0' }}>
                          <span>{p.name}</span>
                          {p.draftRound && <span className="muted" style={{ fontSize: 10 }}>R{p.draftRound}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {tab === 'watch' && <PreState note="Players to Watch will be highlighted once squads are confirmed." />}

    </div>
  );
}
function PreState({ note }) {
  if (!note) return null;
  return <div className="card mt"><p className="muted" style={{ margin: 0 }}>{note}</p></div>;
}

export function LegacyFranchise() {
  const id = window.location.pathname.split('/').pop();
  const fr = legacyFranchiseById(id);
  if (!fr) return <div className="page"><h1 className="display">Not found</h1><Link to="/legacy-league" className="gold">← LP Legacy League</Link></div>;
  const squad = LEGACY_PLAYERS.filter((p) => p.franchise_id === id);
  return (
    <div className="page">
      <LegacyStyles />
      <Link to="/legacy-league" className="muted" style={{ fontSize: 13 }}>← LP Legacy League</Link>
      <div className="lg-hero" style={{ '--p': fr.primary, '--s': fr.secondary, '--a': fr.accent }}>
        <img src={fr.logo} alt={fr.name} className="lg-hero-logo" />
        <div>
          <span className="eyebrow" style={{ color: fr.accent }}>LP Legacy League</span>
          <h1 className="display" style={{ margin: '2px 0' }}>{fr.name}</h1>
          <p className="lg-hero-motto">{fr.motto}</p>
        </div>
      </div>

      <div className="grid cols-2 mt">
        <div className="card"><span className="eyebrow">Owner</span><b className="lg-meta">To be announced</b></div>
        <div className="card"><span className="eyebrow">Captain</span><b className="lg-meta">To be announced</b></div>
        <div className="card"><span className="eyebrow">Vice Captain</span><b className="lg-meta">To be announced</b></div>
        <div className="card"><span className="eyebrow">Ambassador</span><b className="lg-meta">To be announced</b></div>
      </div>

      <SectionHead title="Squad" />
      {squad.length ? (
        <>
          <p className="eyebrow" style={{ margin: '0 0 8px' }}>Adults</p>
          <div className="grid cols-2">
            {squad.filter((p) => p.kind === 'adult').map((p) => (
              <div key={p.id} className="card row spread"><b style={{ fontSize: 14 }}>{p.name}</b><span className="chip" style={{ fontSize: 10 }}>Adult</span></div>
            ))}
          </div>
          <p className="eyebrow" style={{ margin: '14px 0 8px' }}>Youth</p>
          <div className="grid cols-2">
            {squad.filter((p) => p.kind === 'youth').map((p) => (
              <div key={p.id} className="card row spread"><b style={{ fontSize: 14 }}>{p.name}</b>{p.draftRound && <span className="chip" style={{ fontSize: 10 }}>Pick R{p.draftRound}</span>}</div>
            ))}
          </div>
        </>
      ) : (
        <div className="card" style={{ borderColor: fr.primary }}>
          <p className="muted" style={{ margin: 0 }}>{LEGACY_SQUAD_NOTE}</p>
        </div>
      )}

      <SectionHead title="Fixtures & Results" />
      <div className="card"><p className="muted" style={{ margin: 0 }}>Published once the season schedule is confirmed.</p></div>

      <div className="mt"><WaButton href={communityLinks.legacyLeague} label="Follow the League" /></div>
    </div>
  );
}

function LegacyStyles() {
  return (
    <style>{`
      .lg-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
      .lg-card { display:flex; flex-direction:column; border-radius:var(--r); overflow:hidden; border:1px solid var(--line);
        background:linear-gradient(165deg, color-mix(in srgb, var(--p) 22%, #0a0f1c), #0a0f1c 70%); }
      .lg-card-logo { display:flex; align-items:center; justify-content:center; padding:22px 8px 6px; background:transparent; }
      .lg-card-logo img { width:90px; height:90px; object-fit:contain; mix-blend-mode:screen; filter:drop-shadow(0 2px 8px rgba(0,0,0,.4)); }
      .lg-card-body { padding:6px 12px 14px; text-align:center; }
      .lg-card-body b { font-family:var(--display); text-transform:uppercase; font-size:15px; display:block; }
      .lg-motto { font-size:11px; color:var(--muted); font-style:italic; }
      .lg-row { border-left:3px solid var(--p); }
      .lg-chip-logo { width:26px; height:26px; object-fit:contain; mix-blend-mode:screen; }
      .lg-hero { display:flex; align-items:center; gap:16px; margin-top:10px; padding:18px 16px; border-radius:var(--r); border:1px solid var(--line);
        background:linear-gradient(135deg, color-mix(in srgb, var(--p) 30%, #0a0f1c), #0a0f1c 75%); border-left:4px solid var(--p); }
      .lg-hero-logo { width:88px; height:88px; object-fit:contain; filter:drop-shadow(0 4px 12px rgba(0,0,0,.6)); }
      .lg-hero-motto { font-style:italic; color:var(--muted); margin:0; font-size:13px; }
      .lg-meta { display:block; margin-top:4px; font-size:14px; }
      @media (min-width:760px){ .lg-grid { grid-template-columns:repeat(3,1fr); } }
    `}</style>
  );
}

/* ============================================================
 * PREDICTOR  +  LP AI  →  /predictor
 * ========================================================== */
export function Predictor() {
  const fx = matchOfTheWeek();
  const [pick, setPick] = useState(null);
  const [showAi, setShowAi] = useState(false);
  if (!fx) return <div className="page"><h1 className="display">Predictor</h1><div className="card"><p className="muted" style={{ margin: 0 }}>No upcoming match to predict right now.</p></div></div>;
  const a = franchiseById(fx.home); const b = franchiseById(fx.away);
  const ai = lpAiPredict(fx);
  const aiFr = franchiseById(ai.winner);
  // seeded community split (deterministic, replace with real votes later)
  const split = { a40: 18, a31: 27, draw: 10, b31: 30, b40: 15 };

  return (
    <div className="page">
      <span className="eyebrow" style={{ color: 'var(--live)' }}>Community Prediction League</span>
      <h1 className="display">Predictor</h1>

      <div className="card mt stripe" style={{ '--stripe': 'var(--live)', paddingLeft: 18 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Match of the Week</p>
        <div className="row spread">
          <span className="row" style={{ gap: 8 }}><img src={a.logo} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} /><b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>{a.name}</b></span>
          <span className="muted">v</span>
          <span className="row" style={{ gap: 8 }}><b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>{b.name}</b><img src={b.logo} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} /></span>
        </div>
        <p className="muted" style={{ fontSize: 12, margin: '8px 0 0' }}>Prediction closes at first serve · {new Date(fx.start).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
      </div>

      <SectionHead title="Your Prediction" />
      <div className="pred-grid">
        {PREDICTION_OPTIONS.map((o) => {
          const sel = pick === o.key;
          const label = o.side === 'draw' ? 'Draw 2-2' : `${o.side === 'a' ? a.short || a.name : b.short || b.name} ${o.label}`;
          return (
            <button key={o.key} onClick={() => setPick(o.key)} className={`pred-opt ${sel ? 'on' : ''}`}>
              <b>{o.label}</b><span>{o.side === 'draw' ? 'Draw' : (o.side === 'a' ? a.name : b.name)}</span>
            </button>
          );
        })}
      </div>
      {pick && <p className="gold mt" style={{ fontSize: 13 }}>✓ Prediction locked. Good luck!</p>}

      <SectionHead title="Community Predictions" />
      <div className="card">
        {PREDICTION_OPTIONS.map((o) => (
          <div key={o.key} style={{ marginBottom: 8 }}>
            <div className="row spread" style={{ fontSize: 12 }}>
              <span>{o.side === 'draw' ? 'Draw 2-2' : `${o.side === 'a' ? a.name : b.name} ${o.label}`}</span>
              <b>{split[o.key]}%</b>
            </div>
            <div className="bar"><i style={{ width: `${split[o.key]}%` }} /></div>
          </div>
        ))}
        <p className="muted" style={{ fontSize: 11, margin: '4px 0 0' }}>Live community split — sample data until votes accumulate.</p>
      </div>

      <SectionHead title="LP AI Prediction" />
      <button className="card stripe" style={{ '--stripe': 'var(--court)', width: '100%', textAlign: 'left', cursor: 'pointer', paddingLeft: 18 }} onClick={() => setShowAi(true)}>
        {showAi ? (
          <>
            <div className="row spread">
              <span className="row" style={{ gap: 8 }}><img src={aiFr.logo} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} /><b>{aiFr.name} {ai.margin}</b></span>
              <span className="num" style={{ color: 'var(--court)' }}>{ai.confidence}%</span>
            </div>
            <div className="bar mt"><i style={{ width: `${ai.confidence}%`, background: 'var(--court)' }} /></div>
            <p className="muted" style={{ fontSize: 12, margin: '8px 0 0' }}>Modelled on form, standings, LP Ratings and head-to-head.</p>
          </>
        ) : <b className="row" style={{ gap: 8 }}><span style={{ color: 'var(--court)' }}>◆</span> Reveal the LP AI prediction</b>}
      </button>

      <SectionHead title="How scoring works" />
      <div className="card">
        <div className="row spread" style={{ fontSize: 13 }}><span>Exact result</span><b>{PREDICTION_SCORING.exact} pts</b></div>
        <div className="row spread" style={{ fontSize: 13 }}><span>Correct draw</span><b>{PREDICTION_SCORING.correctDraw} pts</b></div>
        <div className="row spread" style={{ fontSize: 13 }}><span>Correct winner</span><b>{PREDICTION_SCORING.correctWinner} pts</b></div>
        <div className="row spread" style={{ fontSize: 13 }}><span>Incorrect</span><b>{PREDICTION_SCORING.wrong} pts</b></div>
        <div className="row mt" style={{ gap: 6, flexWrap: 'wrap' }}>
          {PREDICTOR_BADGES.map((bd) => <span key={bd.name} className="chip">{bd.name} · {bd.min}+</span>)}
        </div>
      </div>

      <SectionHead title="Prediction Leaderboard" />
      <div className="card"><p className="muted" style={{ margin: 0 }}>{PREDICTION_LEADERBOARD.length ? '' : 'The leaderboard fills as the community plays. Make your first prediction above to get on the board.'}</p></div>

      <div className="mt"><WaButton href={communityLinks.matchdayChat} label="Share your shout — Matchday Chat" /></div>

      <style>{`
        .pred-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; }
        .pred-opt { display:flex; flex-direction:column; align-items:center; gap:2px; padding:12px 4px; border-radius:var(--r-sm);
          border:1px solid var(--line); background:var(--surface); cursor:pointer; color:var(--text); }
        .pred-opt b { font-family:var(--data); font-size:16px; } .pred-opt span { font-size:9px; color:var(--muted); text-align:center; line-height:1.1; }
        .pred-opt.on { border-color:var(--win); background:color-mix(in srgb, var(--win) 14%, transparent); }
        @media (max-width:520px){ .pred-opt b { font-size:14px; } }
      `}</style>
    </div>
  );
}

/* ============================================================
 * COMMUNITY  →  /community
 * ========================================================== */
export function Community() {
  const groups = [
    { key: 'leagueCommunity', title: 'League Community', note: 'The main hub for all Lowveld Padel news.' },
    { key: 'matchdayChat', title: 'Matchday Chat', note: 'Live banter and scores on match nights.' },
    { key: 'legacyLeague', title: 'Legacy League Community', note: 'Everything Legacy League.' },
    { key: 'roadTo360', title: 'Road to 360 Updates', note: "Follow Lowveld's national journey." },
  ];
  return (
    <div className="page">
      <span className="eyebrow" style={{ color: '#25D366' }}>Community</span>
      <h1 className="display">Join the Lowveld Community</h1>
      <p className="muted" style={{ maxWidth: 580 }}>The league lives on WhatsApp. Pick your groups and never miss a result, a fixture or a moment.</p>
      <div className="grid cols-2 mt">
        {groups.map((g) => (
          <div key={g.key} className="card">
            <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>{g.title}</b>
            <p className="muted" style={{ fontSize: 13, margin: '4px 0 12px' }}>{g.note}</p>
            <WaButton href={communityLinks[g.key]} label="Join group" small />
          </div>
        ))}
      </div>
      <SectionHead title="Back Your Franchise" />
      <div className="grid cols-2">
        {[['acesSupporters', 'Aces Supporters'], ['viborasNation', 'Viboras Nation'], ['falconsFans', 'Falcons Fans'], ['kicksmashersSupporters', 'Kick Smashers Supporters']].map(([k, l]) => (
          <div key={k} className="card row spread">
            <b style={{ fontSize: 14 }}>{l}</b>
            <WaButton href={communityLinks[k]} label="Join" small />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * SPORTS HUB  →  /sports-hub  (real data, graceful fail)
 * ========================================================== */
export function SportsHub() {
  return (
    <div className="page">
      <span className="eyebrow" style={{ color: 'var(--court)' }}>Sports Hub</span>
      <h1 className="display">Sports Hub</h1>
      <p className="muted" style={{ maxWidth: 580 }}>The big fixtures beyond the Lowveld — rugby, F1, football, tennis. A quick glance, then back to the padel.</p>
      <div className="grid cols-2 mt">
        {['Springboks', 'Rugby Championship', 'FIFA World Cup', 'Formula 1', 'Wimbledon', 'Major Events'].map((s) => (
          <div key={s} className="card">
            <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15 }}>{s}</b>
            <p className="muted" style={{ fontSize: 13, margin: '6px 0 0' }}>Sports data temporarily unavailable.</p>
          </div>
        ))}
      </div>
      <p className="muted mt" style={{ fontSize: 12 }}>Lowveld Padel remains the main event — the Sports Hub is a light add-on. Live feeds connect here when available.</p>
    </div>
  );
}

/* shared styles */
function Road360Styles() {
  return (
    <style>{`
      .r360-hero { text-align:center; padding:24px 14px; background:radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--gold) 16%, transparent), transparent 60%), var(--surface);
        border:1px solid var(--line); border-radius:var(--r); }
      .r360-flag { font-size:34px; }
      .r360-cd { display:flex; justify-content:center; gap:10px; margin-top:16px; }
      .r360-cd-cell { background:var(--ink); border:1px solid var(--line-strong); border-radius:var(--r-sm); padding:10px 14px; min-width:60px; }
      .r360-cd-cell b { display:block; font-family:var(--data); font-size:26px; line-height:1; }
      .r360-cd-cell span { font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; }
      .r360-timeline { display:flex; flex-direction:column; gap:0; }
      .r360-step { display:flex; align-items:center; gap:14px; padding:12px 0; border-left:2px solid var(--line); margin-left:14px; padding-left:18px; position:relative; }
      .r360-step.done { border-color:var(--gold); }
      .r360-dot { position:absolute; left:-9px; width:16px; height:16px; border-radius:50%; background:var(--ink); border:2px solid var(--line-strong);
        display:flex; align-items:center; justify-content:center; font-size:9px; color:var(--gold); }
      .r360-step.done .r360-dot { border-color:var(--gold); background:var(--gold); color:#000; }
    `}</style>
  );
}

/* ══════════════════════════════════════════════
   LEAGUES PAGE (Men's + Ladies hub)
══════════════════════════════════════════════ */

/* ── helpers ── */
function PlaceholderSeason({ season, league }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
      <div style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 20, marginBottom: 8 }}>
        {league} · {season}
      </div>
      <p className="muted" style={{ margin: '0 0 14px', fontSize: 13 }}>
        Historical data for {season} will be published here.
      </p>
      <span className="chip">Coming Soon</span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MEN'S FRANCHISE LEAGUE
══════════════════════════════════════════════ */
function MensLeague() {
  const [season, setSeason] = useState('s3');
  const [subTab, setSubTab] = useState('standings');
  const [tier2, setTier2] = useState('franchise');

  const mensFranchises = FRANCHISES.filter((f) => f.league === 'mens');

  return (
    <>
      {/* Season selector */}
      <div className="tabbar mt">
        {[['s1', 'Season 1'], ['s2', 'Season 2'], ['s3', 'Season 3']].map(([k, lbl]) => (
          <button key={k} className={season === k ? 'on' : ''} onClick={() => { setSeason(k); setSubTab('standings'); setTier2('franchise'); }}>{lbl}</button>
        ))}
      </div>

      {/* S1 / S2 placeholders */}
      {season === 's1' && <div className="mt"><PlaceholderSeason season="Season 1" league="Men's Franchise League" /></div>}
      {season === 's2' && (() => {
        const MENS_S2_PREMIER = [
  { rank: 1, name: 'Yusuf Packery', team: 'Desert Falcons', played: 6, won: 6, lost: 0, setsWon: 17, gamesWon: 128 },
  { rank: 2, name: 'Heinrich Coomans', team: 'Sonic Viboras', played: 7, won: 5, lost: 2, setsWon: 16, gamesWon: 141 },
  { rank: 3, name: 'Uwaiz Patel', team: 'Desert Falcons', played: 7, won: 5, lost: 2, setsWon: 15, gamesWon: 140 },
  { rank: 4, name: 'Yusuf Patel', team: 'Desert Falcons', played: 6, won: 5, lost: 1, setsWon: 14, gamesWon: 126 },
  { rank: 5, name: 'Salmaan Methar', team: 'Desert Falcons', played: 6, won: 5, lost: 1, setsWon: 14, gamesWon: 119 },
  { rank: 6, name: 'Ahmed Ismail', team: 'Ice Breakers', played: 6, won: 5, lost: 1, setsWon: 13, gamesWon: 127 },
  { rank: 7, name: 'Maaz Randera', team: 'Ice Breakers', played: 7, won: 5, lost: 1, setsWon: 13, gamesWon: 119 },
  { rank: 8, name: 'Anton Grote', team: 'Rulo Apaches', played: 6, won: 4, lost: 2, setsWon: 12, gamesWon: 122 },
  { rank: 9, name: 'Wiehann Mohlen', team: 'Rulo Apaches', played: 6, won: 4, lost: 2, setsWon: 12, gamesWon: 121 },
  { rank: 10, name: 'Duhan Swart', team: 'Ice Breakers', played: 8, won: 4, lost: 3, setsWon: 11, gamesWon: 118 },
  { rank: 11, name: 'Rafiq Mohamed', team: 'Avalanche Aces', played: 6, won: 4, lost: 2, setsWon: 11, gamesWon: 111 },
  { rank: 12, name: 'Bryan Theron', team: 'Samurai Kicksmashers', played: 6, won: 4, lost: 2, setsWon: 11, gamesWon: 106 },
  { rank: 13, name: 'Ryan Tate', team: 'Avalanche Aces', played: 5, won: 4, lost: 1, setsWon: 9, gamesWon: 85 },
  { rank: 14, name: 'Greg Beyers', team: 'Avalanche Aces', played: 4, won: 4, lost: 0, setsWon: 9, gamesWon: 76 },
  { rank: 15, name: 'Yusuf Asvat', team: 'Baltic Blades', played: 5, won: 4, lost: 1, setsWon: 8, gamesWon: 72 },
  { rank: 16, name: 'Peet Welthagen', team: 'Desert Falcons', played: 5, won: 3, lost: 2, setsWon: 10, gamesWon: 100 },
  { rank: 17, name: 'Muhammad Azhar Sujee', team: 'Sonic Viboras', played: 5, won: 3, lost: 2, setsWon: 10, gamesWon: 97 },
  { rank: 18, name: 'JD Herbst', team: 'Samurai Kicksmashers', played: 6, won: 3, lost: 3, setsWon: 9, gamesWon: 101 },
  { rank: 19, name: 'Zaheer Methar', team: 'Ice Breakers', played: 5, won: 3, lost: 2, setsWon: 9, gamesWon: 97 },
  { rank: 20, name: 'Bevan Francis', team: 'Samurai Kicksmashers', played: 5, won: 3, lost: 2, setsWon: 9, gamesWon: 90 },
  { rank: 21, name: 'Ryan Kennett', team: 'Desert Falcons', played: 5, won: 3, lost: 1, setsWon: 9, gamesWon: 79 },
  { rank: 22, name: 'Cian Maritz', team: 'Samurai Kicksmashers', played: 3, won: 3, lost: 0, setsWon: 9, gamesWon: 66 },
  { rank: 23, name: 'Driaan Odendaal', team: 'Avalanche Aces', played: 6, won: 3, lost: 3, setsWon: 8, gamesWon: 88 },
  { rank: 24, name: 'Armand Esterhuizen', team: 'Sonic Viboras', played: 5, won: 3, lost: 2, setsWon: 8, gamesWon: 85 },
  { rank: 25, name: 'Cameron Jacobsz', team: 'Desert Falcons', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 82 },
  { rank: 26, name: 'Warwick Morgan', team: 'Sonic Viboras', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 74 },
  { rank: 27, name: 'Muhammed Jina', team: 'Ice Breakers', played: 5, won: 3, lost: 2, setsWon: 7, gamesWon: 82 },
  { rank: 28, name: 'Muhammed Shehzad Meer', team: 'Globo Boomerangs', played: 5, won: 3, lost: 2, setsWon: 7, gamesWon: 81 },
  { rank: 29, name: 'Ryan Wicht', team: 'Desert Falcons', played: 4, won: 3, lost: 1, setsWon: 7, gamesWon: 60 },
  { rank: 30, name: 'Hoffmann Maritz', team: 'Avalanche Aces', played: 6, won: 3, lost: 3, setsWon: 6, gamesWon: 89 },
  { rank: 31, name: 'Patrick Leyden', team: 'Avalanche Aces', played: 6, won: 3, lost: 3, setsWon: 6, gamesWon: 88 },
  { rank: 32, name: 'Zaheer Naby', team: 'Baltic Blades', played: 6, won: 3, lost: 3, setsWon: 6, gamesWon: 77 },
  { rank: 33, name: 'Zayd Methar', team: 'Desert Falcons', played: 4, won: 3, lost: 1, setsWon: 5, gamesWon: 55 },
  { rank: 34, name: 'Ahmed Mungalee', team: 'Globo Boomerangs', played: 6, won: 2, lost: 4, setsWon: 8, gamesWon: 96 },
  { rank: 35, name: 'Faeez Sebastian', team: 'Globo Boomerangs', played: 5, won: 2, lost: 3, setsWon: 8, gamesWon: 86 },
  { rank: 36, name: 'Pieter Badenhorst', team: 'Sonic Viboras', played: 4, won: 2, lost: 2, setsWon: 8, gamesWon: 78 },
  { rank: 37, name: 'Lefa Moganedi', team: 'Sonic Viboras', played: 4, won: 2, lost: 2, setsWon: 8, gamesWon: 76 },
  { rank: 38, name: 'Pieter Boshoff', team: 'Globo Boomerangs', played: 5, won: 2, lost: 3, setsWon: 7, gamesWon: 84 },
  { rank: 39, name: 'Yusuf Moola', team: 'Sonic Viboras', played: 6, won: 2, lost: 3, setsWon: 7, gamesWon: 82 },
  { rank: 40, name: 'Fiaz Bhikhoo', team: 'Ice Breakers', played: 4, won: 2, lost: 2, setsWon: 7, gamesWon: 71 },
  { rank: 41, name: 'Burger Bester', team: 'Rulo Apaches', played: 4, won: 2, lost: 2, setsWon: 7, gamesWon: 69 },
  { rank: 42, name: 'Suhayl Packery', team: 'Rulo Apaches', played: 5, won: 2, lost: 2, setsWon: 7, gamesWon: 69 },
  { rank: 43, name: 'Alexander Combrinck', team: 'Sonic Viboras', played: 4, won: 2, lost: 2, setsWon: 7, gamesWon: 69 },
  { rank: 44, name: 'Joseph Van der merwe', team: 'Sonic Viboras', played: 5, won: 2, lost: 2, setsWon: 7, gamesWon: 69 },
  { rank: 45, name: 'Ridhwaan Sujee', team: 'Sonic Viboras', played: 4, won: 2, lost: 1, setsWon: 7, gamesWon: 58 },
  { rank: 46, name: 'Cassim Vawda', team: 'Globo Boomerangs', played: 5, won: 2, lost: 3, setsWon: 6, gamesWon: 84 },
  { rank: 47, name: 'Faheem Nomani', team: 'Samurai Kicksmashers', played: 5, won: 2, lost: 3, setsWon: 6, gamesWon: 80 },
  { rank: 48, name: 'Donavan Taylor', team: 'Baltic Blades', played: 5, won: 2, lost: 3, setsWon: 6, gamesWon: 74 },
  { rank: 49, name: 'Morne Steenekamp', team: 'Samurai Kicksmashers', played: 4, won: 2, lost: 2, setsWon: 6, gamesWon: 72 },
  { rank: 50, name: 'Adil Ahmed', team: 'Sonic Viboras', played: 4, won: 2, lost: 2, setsWon: 6, gamesWon: 71 },
  { rank: 51, name: 'Sabelo Mathebula', team: 'Avalanche Aces', played: 4, won: 2, lost: 2, setsWon: 6, gamesWon: 70 },
  { rank: 52, name: 'Danyaal Nomani', team: 'Samurai Kicksmashers', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 59 },
  { rank: 53, name: 'Shakir Suleman', team: 'Samurai Kicksmashers', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 55 },
  { rank: 54, name: 'Erlo Olivier', team: 'Ice Breakers', played: 6, won: 2, lost: 4, setsWon: 5, gamesWon: 74 },
  { rank: 55, name: 'Nabeel Meer', team: 'Globo Boomerangs', played: 4, won: 2, lost: 2, setsWon: 5, gamesWon: 63 },
  { rank: 56, name: 'George du Toit', team: 'Avalanche Aces', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 52 },
  { rank: 57, name: 'Liam Morgan', team: 'Baltic Blades', played: 2, won: 2, lost: 0, setsWon: 5, gamesWon: 44 },
  { rank: 58, name: 'Fanus Wilkens', team: 'Rulo Apaches', played: 3, won: 2, lost: 1, setsWon: 4, gamesWon: 51 },
  { rank: 59, name: 'Jacques Hopkins', team: 'Rulo Apaches', played: 3, won: 2, lost: 1, setsWon: 4, gamesWon: 51 },
  { rank: 60, name: 'Joshua Hoffman', team: 'Sonic Viboras', played: 4, won: 2, lost: 1, setsWon: 4, gamesWon: 48 },
  { rank: 61, name: 'Chris Triegaardt', team: 'Ice Breakers', played: 3, won: 2, lost: 1, setsWon: 4, gamesWon: 46 },
  { rank: 62, name: 'Etienne Swart', team: 'Rulo Apaches', played: 3, won: 2, lost: 0, setsWon: 4, gamesWon: 39 },
  { rank: 63, name: 'Jacques Burger', team: 'Avalanche Aces', played: 4, won: 1, lost: 3, setsWon: 5, gamesWon: 69 },
  { rank: 64, name: 'Justin van Staden', team: 'Rulo Apaches', played: 4, won: 1, lost: 2, setsWon: 5, gamesWon: 57 },
  { rank: 65, name: 'Warren Morgan', team: 'Globo Boomerangs', played: 3, won: 1, lost: 2, setsWon: 5, gamesWon: 57 },
  { rank: 66, name: 'Siraaj Shaik', team: 'Samurai Kicksmashers', played: 4, won: 1, lost: 3, setsWon: 4, gamesWon: 68 },
  { rank: 67, name: 'Ebrahim Ismail', team: 'Ice Breakers', played: 4, won: 1, lost: 3, setsWon: 4, gamesWon: 63 },
  { rank: 68, name: 'Andries van Niekerk', team: 'Desert Falcons', played: 4, won: 1, lost: 3, setsWon: 4, gamesWon: 61 },
  { rank: 69, name: 'Yusuf Ismail', team: 'Rulo Apaches', played: 4, won: 1, lost: 3, setsWon: 4, gamesWon: 59 },
  { rank: 70, name: 'Anas Mungalee', team: 'Globo Boomerangs', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 53 },
  { rank: 71, name: 'Phil-Mar Van Rensburg', team: 'Avalanche Aces', played: 4, won: 1, lost: 3, setsWon: 4, gamesWon: 50 },
  { rank: 72, name: 'Jacques Van Zyl', team: 'Desert Falcons', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 50 },
  { rank: 73, name: 'Luan Walters', team: 'Globo Boomerangs', played: 5, won: 1, lost: 4, setsWon: 3, gamesWon: 75 },
  { rank: 74, name: 'Ozayr Shaik', team: 'Baltic Blades', played: 6, won: 1, lost: 5, setsWon: 3, gamesWon: 72 },
  { rank: 75, name: 'Hendrik Tryhou', team: 'Rulo Apaches', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 56 },
  { rank: 76, name: 'Frik De Beer', team: 'Avalanche Aces', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 48 },
  { rank: 77, name: 'Marius Loock', team: 'Baltic Blades', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 46 },
  { rank: 78, name: 'Naeem Omar', team: 'Samurai Kicksmashers', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 45 },
  { rank: 79, name: 'Muhammad Khalid Jeewa', team: 'Globo Boomerangs', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 45 },
  { rank: 80, name: 'Muhammad Fakir', team: 'Samurai Kicksmashers', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 42 },
  { rank: 81, name: 'Ebrahim Mungalee', team: 'Globo Boomerangs', played: 1, won: 1, lost: 0, setsWon: 3, gamesWon: 22 },
  { rank: 82, name: 'Rayhaan Dinath', team: 'Ice Breakers', played: 4, won: 1, lost: 3, setsWon: 2, gamesWon: 56 },
  { rank: 83, name: 'Bilal Cassim', team: 'Baltic Blades', played: 4, won: 1, lost: 3, setsWon: 2, gamesWon: 38 },
  { rank: 84, name: 'Wayne Enslin', team: 'Rulo Apaches', played: 2, won: 1, lost: 1, setsWon: 2, gamesWon: 28 },
  { rank: 85, name: 'Marvin Naidoo', team: 'Ice Breakers', played: 4, won: 0, lost: 4, setsWon: 3, gamesWon: 63 },
  { rank: 86, name: 'Uzair Ismail', team: 'Rulo Apaches', played: 4, won: 0, lost: 3, setsWon: 2, gamesWon: 44 },
  { rank: 87, name: 'Mohamed Nomani', team: 'Samurai Kicksmashers', played: 3, won: 0, lost: 3, setsWon: 2, gamesWon: 44 },
  { rank: 88, name: 'Dewald Meyer', team: 'Baltic Blades', played: 3, won: 0, lost: 3, setsWon: 2, gamesWon: 41 },
  { rank: 89, name: 'Feroz Guman', team: 'Baltic Blades', played: 4, won: 0, lost: 4, setsWon: 1, gamesWon: 40 },
  { rank: 90, name: 'Imran Omar', team: 'Globo Boomerangs', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 40 },
  { rank: 91, name: 'Tim Kaden', team: 'Baltic Blades', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 34 },
  { rank: 92, name: 'Niel Pienaar', team: 'Baltic Blades', played: 2, won: 0, lost: 2, setsWon: 1, gamesWon: 27 },
  { rank: 93, name: 'Kiran Hansraj', team: 'Desert Falcons', played: 2, won: 0, lost: 1, setsWon: 1, gamesWon: 14 },
  { rank: 94, name: 'Ruaan Naude', team: 'Avalanche Aces', played: 4, won: 0, lost: 4, setsWon: 0, gamesWon: 40 },
  { rank: 95, name: 'Sikander Cassim', team: 'Baltic Blades', played: 4, won: 0, lost: 4, setsWon: 0, gamesWon: 27 },
];
        const MENS_S2_CHAMP = [
  { rank: 1, name: 'Felix Lombard', team: 'Avalanche Aces', played: 7, won: 6, lost: 1, setsWon: 16, gamesWon: 140 },
  { rank: 2, name: 'Irshaad Mahomed', team: 'Sonic Viboras', played: 7, won: 6, lost: 1, setsWon: 16, gamesWon: 132 },
  { rank: 3, name: 'Etienne Grobler', team: 'Desert Falcons', played: 7, won: 6, lost: 1, setsWon: 15, gamesWon: 137 },
  { rank: 4, name: 'Alfaiz Mamji', team: 'Globo Boomerangs', played: 6, won: 5, lost: 1, setsWon: 15, gamesWon: 120 },
  { rank: 5, name: 'Taahir Mungalee', team: 'Sonic Viboras', played: 7, won: 5, lost: 2, setsWon: 14, gamesWon: 122 },
  { rank: 6, name: 'Fahad Patel', team: 'Globo Boomerangs', played: 7, won: 4, lost: 2, setsWon: 14, gamesWon: 128 },
  { rank: 7, name: 'Irfaan Mahomed', team: 'Globo Boomerangs', played: 6, won: 4, lost: 2, setsWon: 13, gamesWon: 119 },
  { rank: 8, name: 'Zahid Methar', team: 'Sonic Viboras', played: 6, won: 4, lost: 2, setsWon: 12, gamesWon: 106 },
  { rank: 9, name: 'Reino Grobler', team: 'Desert Falcons', played: 5, won: 4, lost: 1, setsWon: 12, gamesWon: 104 },
  { rank: 10, name: 'Uwais Guman', team: 'Ice Breakers', played: 6, won: 4, lost: 1, setsWon: 12, gamesWon: 103 },
  { rank: 11, name: 'Irshaad Moola', team: 'Ice Breakers', played: 6, won: 4, lost: 1, setsWon: 11, gamesWon: 104 },
  { rank: 12, name: 'Brent Grix', team: 'Sonic Viboras', played: 5, won: 4, lost: 1, setsWon: 11, gamesWon: 101 },
  { rank: 13, name: 'Gerco van Rooyen', team: 'Avalanche Aces', played: 6, won: 4, lost: 2, setsWon: 11, gamesWon: 96 },
  { rank: 14, name: 'Suliman Patel', team: 'Desert Falcons', played: 6, won: 4, lost: 1, setsWon: 10, gamesWon: 100 },
  { rank: 15, name: 'Zainul Choohan', team: 'Baltic Blades', played: 6, won: 3, lost: 3, setsWon: 10, gamesWon: 107 },
  { rank: 16, name: 'Kobus van Rensburg', team: 'Avalanche Aces', played: 4, won: 3, lost: 0, setsWon: 10, gamesWon: 78 },
  { rank: 17, name: 'Gavin Moffett', team: 'Rulo Apaches', played: 6, won: 3, lost: 3, setsWon: 9, gamesWon: 97 },
  { rank: 18, name: 'Stefan De Villiers', team: 'Rulo Apaches', played: 6, won: 3, lost: 2, setsWon: 9, gamesWon: 94 },
  { rank: 19, name: 'Muhammed Minty', team: 'Ice Breakers', played: 4, won: 3, lost: 1, setsWon: 9, gamesWon: 83 },
  { rank: 20, name: 'Drew Packman', team: 'Desert Falcons', played: 4, won: 3, lost: 1, setsWon: 9, gamesWon: 78 },
  { rank: 21, name: 'Stefan Erasmus', team: 'Desert Falcons', played: 4, won: 3, lost: 1, setsWon: 9, gamesWon: 78 },
  { rank: 22, name: 'Nicky Joubert', team: 'Avalanche Aces', played: 5, won: 3, lost: 1, setsWon: 8, gamesWon: 87 },
  { rank: 23, name: 'Danie Rautenbach', team: 'Sonic Viboras', played: 5, won: 3, lost: 2, setsWon: 8, gamesWon: 82 },
  { rank: 24, name: 'Mickal Bakker', team: 'Rulo Apaches', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 78 },
  { rank: 25, name: 'Soyab maxi Patel', team: 'Globo Boomerangs', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 69 },
  { rank: 26, name: 'Muhammed Shaffique Jeewa', team: 'Globo Boomerangs', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 69 },
  { rank: 27, name: 'Pierre De Villiers', team: 'Avalanche Aces', played: 4, won: 3, lost: 1, setsWon: 7, gamesWon: 62 },
  { rank: 28, name: 'Zaeem Sadiq', team: 'Avalanche Aces', played: 3, won: 3, lost: 0, setsWon: 7, gamesWon: 60 },
  { rank: 29, name: 'Shaun Moropa', team: 'Samurai Kicksmashers', played: 7, won: 2, lost: 4, setsWon: 8, gamesWon: 95 },
  { rank: 30, name: 'Dillon Francis', team: 'Baltic Blades', played: 6, won: 2, lost: 4, setsWon: 8, gamesWon: 95 },
  { rank: 31, name: 'Tim Forssman', team: 'Samurai Kicksmashers', played: 6, won: 2, lost: 3, setsWon: 8, gamesWon: 83 },
  { rank: 32, name: 'Waldo van Tonder', team: 'Rulo Apaches', played: 5, won: 2, lost: 3, setsWon: 7, gamesWon: 85 },
  { rank: 33, name: 'Aadil Asvat', team: 'Globo Boomerangs', played: 5, won: 2, lost: 2, setsWon: 7, gamesWon: 70 },
  { rank: 34, name: 'Muhammed Cachalia', team: 'Rulo Apaches', played: 3, won: 2, lost: 1, setsWon: 7, gamesWon: 59 },
  { rank: 35, name: 'Ismail Karodia', team: 'Rulo Apaches', played: 5, won: 2, lost: 2, setsWon: 6, gamesWon: 76 },
  { rank: 36, name: 'Drikus Prins', team: 'Rulo Apaches', played: 4, won: 2, lost: 2, setsWon: 6, gamesWon: 70 },
  { rank: 37, name: 'Ian Roberts', team: 'Ice Breakers', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 60 },
  { rank: 38, name: 'Devlin Grix', team: 'Desert Falcons', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 56 },
  { rank: 39, name: 'Duran Greaver', team: 'Globo Boomerangs', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 56 },
  { rank: 40, name: 'Ismail Fakir', team: 'Globo Boomerangs', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 56 },
  { rank: 41, name: 'Nathan Treherne', team: 'Desert Falcons', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 54 },
  { rank: 42, name: 'Zahraan Jassat', team: 'Baltic Blades', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 45 },
  { rank: 43, name: 'Adil Patel', team: 'Baltic Blades', played: 5, won: 2, lost: 3, setsWon: 5, gamesWon: 77 },
  { rank: 44, name: 'Ali Choohan', team: 'Baltic Blades', played: 4, won: 2, lost: 2, setsWon: 5, gamesWon: 69 },
  { rank: 45, name: 'Irfan Mamji', team: 'Baltic Blades', played: 4, won: 2, lost: 2, setsWon: 5, gamesWon: 65 },
  { rank: 46, name: 'Imtiaz Mohamed', team: 'Desert Falcons', played: 4, won: 2, lost: 1, setsWon: 5, gamesWon: 64 },
  { rank: 47, name: 'Mohammed Patel', team: 'Desert Falcons', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 58 },
  { rank: 48, name: 'Rishad Shaik', team: 'Desert Falcons', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 53 },
  { rank: 49, name: 'Mohammed Seedat', team: 'Avalanche Aces', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 51 },
  { rank: 50, name: 'Mohamed Dadamia', team: 'Baltic Blades', played: 5, won: 1, lost: 4, setsWon: 5, gamesWon: 77 },
  { rank: 51, name: 'Zunaid Ganchi', team: 'Avalanche Aces', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 49 },
  { rank: 52, name: 'Mohammed Mungalee', team: 'Rulo Apaches', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 47 },
  { rank: 53, name: 'Suhail Patel', team: 'Ice Breakers', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 46 },
  { rank: 54, name: 'Muhammed Suliman', team: 'Samurai Kicksmashers', played: 5, won: 1, lost: 4, setsWon: 3, gamesWon: 60 },
  { rank: 55, name: 'Jaco Nel', team: 'Ice Breakers', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 57 },
  { rank: 56, name: 'Shoaib Nomani', team: 'Samurai Kicksmashers', played: 5, won: 1, lost: 4, setsWon: 3, gamesWon: 55 },
  { rank: 57, name: 'Dc Francis', team: 'Baltic Blades', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 49 },
  { rank: 58, name: 'Adnaan Abderoof', team: 'Baltic Blades', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 48 },
  { rank: 59, name: 'Mohammed Malek', team: 'Avalanche Aces', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 45 },
  { rank: 60, name: 'Imraan Khan', team: 'Globo Boomerangs', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 36 },
  { rank: 61, name: 'Umar Yunus', team: 'Sonic Viboras', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 27 },
  { rank: 62, name: 'Estiaan Maritz', team: 'Ice Breakers', played: 4, won: 1, lost: 3, setsWon: 2, gamesWon: 47 },
  { rank: 63, name: 'Francois Eloff', team: 'Sonic Viboras', played: 4, won: 1, lost: 3, setsWon: 2, gamesWon: 37 },
  { rank: 64, name: 'Luqman Hoosen', team: 'Ice Breakers', played: 4, won: 0, lost: 4, setsWon: 3, gamesWon: 59 },
  { rank: 65, name: 'Saliem Mahomed', team: 'Ice Breakers', played: 4, won: 0, lost: 4, setsWon: 2, gamesWon: 51 },
  { rank: 66, name: 'Martin Swart', team: 'Samurai Kicksmashers', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 41 },
  { rank: 67, name: 'Sailesh Nagar', team: 'Samurai Kicksmashers', played: 4, won: 0, lost: 4, setsWon: 1, gamesWon: 35 },
  { rank: 68, name: 'Dian Erasmus', team: 'Avalanche Aces', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 32 },
  { rank: 69, name: 'Muhammad Zakariyya Akoojee', team: 'Rulo Apaches', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 31 },
  { rank: 70, name: 'Sandeep Daya', team: 'Rulo Apaches', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 29 },
  { rank: 71, name: 'Sergio Correia', team: 'Samurai Kicksmashers', played: 4, won: 0, lost: 4, setsWon: 0, gamesWon: 44 },
  { rank: 72, name: 'Muhammad Mangerah', team: 'Ice Breakers', played: 4, won: 0, lost: 4, setsWon: 0, gamesWon: 38 },
  { rank: 73, name: 'Akmeer Amod', team: 'Samurai Kicksmashers', played: 3, won: 0, lost: 3, setsWon: 0, gamesWon: 31 },
  { rank: 74, name: 'Rayman Vinesh', team: 'Samurai Kicksmashers', played: 4, won: 0, lost: 4, setsWon: 0, gamesWon: 26 },
  { rank: 75, name: 'Safeer Jamadar', team: 'Baltic Blades', played: 3, won: 0, lost: 3, setsWon: 0, gamesWon: 26 },
  { rank: 76, name: 'Mohammed Mayet', team: 'Sonic Viboras', played: 2, won: 0, lost: 2, setsWon: 0, gamesWon: 13 },
  { rank: 77, name: 'Heinrich van Staden', team: 'Sonic Viboras', played: 3, won: 0, lost: 3, setsWon: 0, gamesWon: 8 },
  { rank: 78, name: 'Jay Nagar', team: 'Globo Boomerangs', played: 1, won: 0, lost: 1, setsWon: 0, gamesWon: 7 },
  { rank: 79, name: 'Noah Snell', team: 'Samurai Kicksmashers', played: 1, won: 0, lost: 1, setsWon: 0, gamesWon: 0 },
];
        const [s2div, setS2div] = useState('premier');
        return (
          <>
            <div className="tabbar mt">
              {[['standings','Standings'],['franchises','Franchises'],['rankings','Rankings']].map(([k,lbl]) => (
                <button key={k} className={subTab === k ? 'on' : ''} onClick={() => setSubTab(k)}>{lbl}</button>
              ))}
            </div>
            {(subTab === 'standings' || subTab === 'franchises') && (
              <div className="mt"><PlaceholderSeason season="Season 2" league="Men's Franchise League" /></div>
            )}
            {subTab === 'rankings' && (
              <div className="mt" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="tabbar">
                  <button className={s2div === 'premier' ? 'on' : ''} onClick={() => setS2div('premier')}>Premier Division</button>
                  <button className={s2div === 'champ' ? 'on' : ''} onClick={() => setS2div('champ')}>Championship Division</button>
                </div>
                {s2div === 'premier' && (
                  <>
                    <div className="card" style={{ borderLeft: '3px solid var(--gold)', paddingLeft: 14 }}>
                      <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>Premier Division · Season 2</b>
                      <p className="muted" style={{ margin: '4px 0 0', fontSize: 12 }}>95 players</p>
                    </div>
                    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                      <table className="tbl">
                        <thead><tr><th>#</th><th>Player</th><th>Team</th><th className="num">P</th><th className="num">W</th><th className="num">L</th><th className="num">Sets</th><th className="num">Games</th></tr></thead>
                        <tbody>
                          {MENS_S2_PREMIER.map((p) => (
                            <tr key={p.rank}>
                              <td><span className="pos-badge">{p.rank}</span></td>
                              <td><b style={{ fontSize: 13 }}>{p.name}</b></td>
                              <td className="muted" style={{ fontSize: 11 }}>{p.team}</td>
                              <td className="num">{p.played}</td>
                              <td className="num" style={{ color: 'var(--win)' }}>{p.won}</td>
                              <td className="num" style={{ color: 'var(--loss)' }}>{p.lost}</td>
                              <td className="num">{p.setsWon}</td>
                              <td className="num">{p.gamesWon}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
                {s2div === 'champ' && (
                  <>
                    <div className="card" style={{ borderLeft: '3px solid var(--court)', paddingLeft: 14 }}>
                      <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>Championship Division · Season 2</b>
                      <p className="muted" style={{ margin: '4px 0 0', fontSize: 12 }}>79 players</p>
                    </div>
                    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                      <table className="tbl">
                        <thead><tr><th>#</th><th>Player</th><th>Team</th><th className="num">P</th><th className="num">W</th><th className="num">L</th><th className="num">Sets</th><th className="num">Games</th></tr></thead>
                        <tbody>
                          {MENS_S2_CHAMP.map((p) => (
                            <tr key={p.rank}>
                              <td><span className="pos-badge">{p.rank}</span></td>
                              <td><b style={{ fontSize: 13 }}>{p.name}</b></td>
                              <td className="muted" style={{ fontSize: 11 }}>{p.team}</td>
                              <td className="num">{p.played}</td>
                              <td className="num" style={{ color: 'var(--win)' }}>{p.won}</td>
                              <td className="num" style={{ color: 'var(--loss)' }}>{p.lost}</td>
                              <td className="num">{p.setsWon}</td>
                              <td className="num">{p.gamesWon}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        );
      })()}

      {/* S3 live */}
      {season === 's3' && (
        <>
          <div className="tabbar mt">
            {[['standings', 'Standings'], ['franchises', 'Franchises'], ['rankings', 'Rankings']].map(([k, lbl]) => (
              <button key={k} className={subTab === k ? 'on' : ''} onClick={() => setSubTab(k)}>{lbl}</button>
            ))}
          </div>

          {/* STANDINGS */}
          {subTab === 'standings' && (
            <div className="mt">
              <p className="muted" style={{ fontSize: 13 }}>Rubber win = 3 pts · draw = 1 pt · bonus point for a 4-0 win.</p>
              <div className="tabbar mt">
                {[['franchise', 'Franchise'], ['P1', 'P1'], ['P2', 'P2'], ['P3', 'P3']].map(([t, lbl]) => (
                  <button key={t} className={tier2 === t ? 'on' : ''} onClick={() => setTier2(t)}>{lbl}</button>
                ))}
              </div>
              {tier2 !== 'franchise' && (
                <div className="row mt" style={{ gap: 10, alignItems: 'center' }}>
                  <img src={TIER_SPONSORS[tier2].logo} alt={TIER_SPONSORS[tier2].name} style={{ height: 26, borderRadius: 4 }} />
                  <span className="muted" style={{ fontSize: 12 }}>{tier2} Log · presented by {TIER_SPONSORS[tier2].name}</span>
                </div>
              )}
              <div className="mt"><StandingsTable league="mens" tier={tier2} /></div>
              {tier2 === 'franchise' && <p className="muted mt" style={{ fontSize: 12 }}>Top 4 qualify for Finals Night.</p>}
            </div>
          )}

          {/* FRANCHISES */}
          {subTab === 'franchises' && (
            <div className="grid cols-2 mt">
              {STANDINGS.mens.franchise.map((r, i) => {
                const fr = franchiseById(r.franchise_id);
                return (
                  <Link key={fr.id} to={`/franchise/${fr.id}`} className="card stripe row spread" style={{ '--stripe': stripeVar(fr.id) }}>
                    <div className="row">
                      <img src={fr.logo} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} />
                      <div>
                        <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16 }}>{fr.name}</b>
                        <div className="muted" style={{ fontSize: 12 }}>P{r.played} · W{r.won} · {r.points} pts</div>
                        <div className="muted" style={{ fontSize: 11 }}>Owner: {fr.owner}</div>
                      </div>
                    </div>
                    <span className={`pos-badge ${i < 4 ? 'q' : ''}`} style={{ width: 30, height: 30, fontSize: 14 }}>{i + 1}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* RANKINGS */}
          {subTab === 'rankings' && (
            <div className="mt">
              <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>Power rankings — results, strength of schedule and momentum.</p>
              <div className="grid">
                {POWER_RANKINGS.mens.map((fid, i) => {
                  const fr = franchiseById(fid);
                  const row = STANDINGS.mens.franchise.find((r) => r.franchise_id === fid);
                  return (
                    <Link key={fid} to={`/franchise/${fid}`} className="card stripe row spread" style={{ '--stripe': stripeVar(fid) }}>
                      <span className="row" style={{ gap: 10 }}>
                        <b className="num" style={{ fontSize: 22, width: 30 }}>{i + 1}</b>
                        <img src={fr.logo} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                        <span>
                          <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15 }}>{fr.name}</b>
                          {row && <div className="muted" style={{ fontSize: 11 }}>{row.points} pts · {row.won}W–{row.lost}L</div>}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════
   LADIES FRANCHISE LEAGUE
══════════════════════════════════════════════ */
function LadiesLeague() {
  const [season, setSeason] = useState('s2');
  const [subTab, setSubTab] = useState('overview');
  const ladiesFranchises = FRANCHISES.filter((f) => f.league === 'ladies');

  const LADIES_S1_PLAYERS = [
  { rank: 1, name: 'Jeanetha Boshoff', team: 'Lunar Lillies', played: 5, won: 5, lost: 0, setsWon: 15, gamesWon: 111 },
  { rank: 2, name: 'Imaan Packery', team: 'Lunar Lillies', played: 5, won: 4, lost: 1, setsWon: 13, gamesWon: 101 },
  { rank: 3, name: 'Sunel Grote', team: 'Backhand Blossoms', played: 5, won: 4, lost: 1, setsWon: 11, gamesWon: 88 },
  { rank: 4, name: 'Heleen Van Der Mescht', team: 'Lunar Lillies', played: 3, won: 3, lost: 0, setsWon: 9, gamesWon: 66 },
  { rank: 5, name: 'Lia Odendaal', team: 'Desert Roses', played: 5, won: 3, lost: 2, setsWon: 8, gamesWon: 78 },
  { rank: 6, name: 'Michelle Du preez', team: 'Desert Roses', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 74 },
  { rank: 7, name: 'Marise Schutte', team: 'Desert Roses', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 68 },
  { rank: 8, name: 'Berna Claassens', team: 'Phoenix Flames', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 68 },
  { rank: 9, name: 'Anneri Duvenage', team: 'Lunar Lillies', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 66 },
  { rank: 10, name: 'Tanija de Villiers', team: 'Net Novas', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 66 },
  { rank: 11, name: 'Ayesha Jogi', team: 'Desert Roses', played: 3, won: 3, lost: 0, setsWon: 8, gamesWon: 57 },
  { rank: 12, name: 'Hunaynah Mungalee', team: 'Arctic Angels', played: 4, won: 3, lost: 1, setsWon: 7, gamesWon: 64 },
  { rank: 13, name: 'Dalene Minnaar', team: 'Phoenix Flames', played: 3, won: 3, lost: 0, setsWon: 7, gamesWon: 64 },
  { rank: 14, name: 'Karlien Janse van Rensburg', team: 'Phoenix Flames', played: 4, won: 3, lost: 1, setsWon: 5, gamesWon: 66 },
  { rank: 15, name: 'Khadija Badat', team: 'Arctic Angels', played: 5, won: 2, lost: 3, setsWon: 7, gamesWon: 80 },
  { rank: 16, name: 'Samantha de Araujo', team: 'Backhand Blossoms', played: 4, won: 2, lost: 1, setsWon: 7, gamesWon: 56 },
  { rank: 17, name: 'Mieke Swart', team: 'Net Novas', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 60 },
  { rank: 18, name: 'Carien Vos', team: 'Net Novas', played: 4, won: 2, lost: 2, setsWon: 6, gamesWon: 54 },
  { rank: 19, name: 'Mufeedah Hoosen', team: 'Desert Roses', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 51 },
  { rank: 20, name: 'Faeeza Patel', team: 'Desert Roses', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 51 },
  { rank: 21, name: 'Zantelle Hopkins', team: 'Arctic Angels', played: 4, won: 2, lost: 2, setsWon: 5, gamesWon: 61 },
  { rank: 22, name: 'Firdaus Hoosen', team: 'Desert Roses', played: 4, won: 2, lost: 2, setsWon: 5, gamesWon: 61 },
  { rank: 23, name: 'Dhiya Ismail', team: 'Net Novas', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 55 },
  { rank: 24, name: 'Dirkie Coomans', team: 'Backhand Blossoms', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 54 },
  { rank: 25, name: 'Muneera Jina', team: 'Backhand Blossoms', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 52 },
  { rank: 26, name: 'Diyaana Nomani', team: 'Arctic Angels', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 48 },
  { rank: 27, name: 'Teresa Kempen', team: 'Lunar Lillies', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 47 },
  { rank: 28, name: 'Aletia van Rooyen', team: 'Lunar Lillies', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 44 },
  { rank: 29, name: 'Amani M Nomani', team: 'Phoenix Flames', played: 4, won: 1, lost: 3, setsWon: 5, gamesWon: 74 },
  { rank: 30, name: 'Noerien Moolla', team: 'Arctic Angels', played: 5, won: 1, lost: 4, setsWon: 4, gamesWon: 68 },
  { rank: 31, name: 'Suhana Mohamed', team: 'Phoenix Flames', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 50 },
  { rank: 32, name: 'Zahra Jogi', team: 'Phoenix Flames', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 48 },
  { rank: 33, name: 'Martinette Meyer', team: 'Phoenix Flames', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 43 },
  { rank: 34, name: 'Anita Smith', team: 'Phoenix Flames', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 41 },
  { rank: 35, name: 'Liz Bartie', team: 'Net Novas', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 53 },
  { rank: 36, name: 'Marz Asvat', team: 'Arctic Angels', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 42 },
  { rank: 37, name: 'Lana Nel', team: 'Backhand Blossoms', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 41 },
  { rank: 38, name: 'Nasreen Omar', team: 'Arctic Angels', played: 2, won: 1, lost: 1, setsWon: 3, gamesWon: 38 },
  { rank: 39, name: 'Erica Van Jaarsveld', team: 'Net Novas', played: 2, won: 1, lost: 1, setsWon: 3, gamesWon: 36 },
  { rank: 40, name: 'Simone Maritz', team: 'Net Novas', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 36 },
  { rank: 41, name: 'Farzahna Nomani', team: 'Lunar Lillies', played: 3, won: 1, lost: 2, setsWon: 2, gamesWon: 30 },
  { rank: 42, name: 'Fazila Hafesji', team: 'Backhand Blossoms', played: 3, won: 1, lost: 2, setsWon: 2, gamesWon: 25 },
  { rank: 43, name: 'Stephanie Steenekamp', team: 'Desert Roses', played: 3, won: 0, lost: 3, setsWon: 2, gamesWon: 44 },
  { rank: 44, name: 'Nasreen Methar', team: 'Backhand Blossoms', played: 3, won: 0, lost: 3, setsWon: 2, gamesWon: 31 },
  { rank: 45, name: 'Sabena Omar', team: 'Arctic Angels', played: 3, won: 0, lost: 2, setsWon: 1, gamesWon: 37 },
  { rank: 46, name: 'Icem Wilken', team: 'Lunar Lillies', played: 4, won: 0, lost: 4, setsWon: 1, gamesWon: 31 },
  { rank: 47, name: 'Imaan Shaik', team: 'Backhand Blossoms', played: 3, won: 0, lost: 2, setsWon: 1, gamesWon: 25 },
  { rank: 48, name: 'Tasneem Sheikh', team: 'Phoenix Flames', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 24 },
  { rank: 49, name: 'Simonne Herbst', team: 'Desert Roses', played: 1, won: 0, lost: 1, setsWon: 1, gamesWon: 16 },
  { rank: 50, name: 'Tasneem Moolla', team: 'Arctic Angels', played: 1, won: 0, lost: 0, setsWon: 1, gamesWon: 12 },
  { rank: 51, name: 'Joshna Nagar', team: 'Net Novas', played: 3, won: 0, lost: 3, setsWon: 0, gamesWon: 36 },
  { rank: 52, name: 'Radhia Mungalee', team: 'Net Novas', played: 3, won: 0, lost: 3, setsWon: 0, gamesWon: 34 },
  { rank: 53, name: 'Shaheda Sujee', team: 'Backhand Blossoms', played: 3, won: 0, lost: 3, setsWon: 0, gamesWon: 14 },
];


  return (
    <>
      <div className="tabbar mt">
        {[['s1', 'Season 1'], ['s2', 'Season 2']].map(([k, lbl]) => (
          <button key={k} className={season === k ? 'on' : ''} onClick={() => { setSeason(k); setSubTab(k === 's1' ? 'rankings' : 'overview'); }}>{lbl}</button>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="tabbar mt">
        {season === 's1' && [['standings','Standings'],['franchises','Franchises'],['rankings','Rankings']].map(([k,lbl]) => (
          <button key={k} className={subTab === k ? 'on' : ''} onClick={() => setSubTab(k)}>{lbl}</button>
        ))}
        {season === 's2' && [['overview','Overview'],['franchises','Franchises'],['standings','Standings'],['rankings','Rankings']].map(([k,lbl]) => (
          <button key={k} className={subTab === k ? 'on' : ''} onClick={() => setSubTab(k)}>{lbl}</button>
        ))}
      </div>

      {season === 's1' && (
        <>
          {(subTab === 'standings' || subTab === 'franchises') && (
            <div className="mt"><PlaceholderSeason season="Season 1" league="Ladies Franchise League" /></div>
          )}
          {subTab === 'rankings' && (
            <div className="mt" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ borderLeft: '3px solid #db2777', paddingLeft: 14 }}>
                <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15 }}>Season 1 — Final Rankings</b>
                <p className="muted" style={{ margin: '4px 0 0', fontSize: 12 }}>53 players · Lowveld Padel Franchise Ladies League</p>
              </div>
              <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>#</th><th>Player</th><th>Team</th>
                      <th className="num">P</th><th className="num">W</th><th className="num">L</th>
                      <th className="num">Sets</th><th className="num">Games</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LADIES_S1_PLAYERS.map((p) => (
                      <tr key={p.rank}>
                        <td><span className="pos-badge">{p.rank}</span></td>
                        <td><b style={{ fontSize: 13 }}>{p.name}</b></td>
                        <td className="muted" style={{ fontSize: 11 }}>{p.team}</td>
                        <td className="num">{p.played}</td>
                        <td className="num" style={{ color: 'var(--win)' }}>{p.won}</td>
                        <td className="num" style={{ color: 'var(--loss)' }}>{p.lost}</td>
                        <td className="num">{p.setsWon}</td>
                        <td className="num">{p.gamesWon}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {season === 's2' && (
        <>
          {(subTab === 'standings' || subTab === 'rankings') && (
            <div className="mt"><PlaceholderSeason season="Season 2" league="Ladies Franchise League" /></div>
          )}
          {(subTab === 'overview' || subTab === 'franchises') && (
        <div className="mt" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Poster */}
          <div style={{ borderRadius: 'var(--r)', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.6)' }}>
            <img src="/ladies-league-s2.png" alt="Ladies Franchise League Season 2" style={{ width: '100%', display: 'block' }} />
          </div>

          {/* Registration CTA */}
          <Link to="/register" style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(220,38,38,.15), rgba(220,38,38,.05))',
              border: '2px solid var(--live)', borderRadius: 'var(--r)',
              padding: '16px 18px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: 12,
            }}>
              <div>
                <div style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 17, marginBottom: 3 }}>
                  Registration Open
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                  Registration closes 18 July 2026 — secure your spot now.
                </div>
              </div>
              <div style={{
                background: 'var(--live)', color: '#fff', fontWeight: 800,
                fontSize: 13, padding: '10px 16px', borderRadius: 8,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>Register →</div>
            </div>
          </Link>

          {/* Franchises */}
          <div>
            <p className="eyebrow" style={{ marginBottom: 10 }}>6 Franchises · One Movement</p>
            <div className="grid cols-2">
              {ladiesFranchises.map((fr) => (
                <div key={fr.id} className="card row" style={{ gap: 12 }}>
                  <img src={fr.logo} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} />
                  <div>
                    <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15 }}>{fr.name}</b>
                    <div className="muted" style={{ fontSize: 11 }}>Ladies Franchise League</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tagline */}
          <div className="card" style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, rgba(219,39,119,.08), rgba(219,39,119,.02))', border: '1px solid rgba(219,39,119,.2)' }}>
            <p style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 18, color: '#db2777', margin: '0 0 6px' }}>Empower. Compete. Inspire.</p>
            <p className="muted" style={{ margin: 0, fontSize: 13, fontStyle: 'italic' }}>Your Talent. Your Team. Your Time. Let's Make History!</p>
          </div>
        </div>
          )}
        </>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════
   LP LEGACY LEAGUE TAB
══════════════════════════════════════════════ */
function LegacyLeagueTab() {
  const [subTab, setSubTab] = useState('franchises');

  return (
    <>
      <div className="tabbar mt">
        {[['franchises','Franchises'],['standings','Standings'],['players','Players']].map(([k,lbl]) => (
          <button key={k} className={subTab === k ? 'on' : ''} onClick={() => setSubTab(k)}>{lbl}</button>
        ))}
      </div>

      {subTab === 'franchises' && (
        <div className="grid cols-2 mt">
          {LEGACY_FRANCHISES.map((fr) => {
            const row = LEGACY_STANDINGS.find((r) => r.franchise_id === fr.id);
            return (
              <Link key={fr.id} to={`/legacy-franchise/${fr.id}`} className="card row spread" style={{ borderLeft: `3px solid ${fr.primary}`, paddingLeft: 14 }}>
                <div className="row">
                  <img src={fr.logo} alt="" style={{ width: 44, height: 44, objectFit: 'contain', mixBlendMode: 'screen' }} />
                  <div>
                    <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15 }}>{fr.name}</b>
                    <div className="muted" style={{ fontSize: 11, fontStyle: 'italic' }}>{fr.motto}</div>
                    {row && row.played > 0 && (
                      <div className="muted" style={{ fontSize: 11 }}>P{row.played} · W{row.won} · {row.points} pts</div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {subTab === 'standings' && (
        <div className="grid mt">
          {[...LEGACY_STANDINGS].sort((a,b) => b.points - a.points).length === 0 || LEGACY_STANDINGS.every(r => r.played === 0) ? (
            <div className="card" style={{ textAlign: 'center', padding: '28px' }}>
              <p className="muted" style={{ margin: 0 }}>Standings go live once the first match is played.</p>
            </div>
          ) : [...LEGACY_STANDINGS].sort((a,b) => b.points - a.points).map((row, i) => {
            const fr = legacyFranchiseById(row.franchise_id);
            if (!fr) return null;
            return (
              <Link key={fr.id} to={`/legacy-franchise/${fr.id}`} className="card row spread" style={{ borderLeft: `3px solid ${fr.primary}`, paddingLeft: 14 }}>
                <span className="row" style={{ gap: 10 }}>
                  <b className="num muted" style={{ width: 22 }}>{i + 1}</b>
                  <img src={fr.logo} alt="" style={{ width: 28, height: 28, objectFit: 'contain', mixBlendMode: 'screen' }} />
                  <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>{fr.name}</b>
                </span>
                <span className="muted" style={{ fontSize: 13 }}>
                  {row.played ? `${row.won}W–${row.lost}L` : '—'} · <b style={{ color: 'var(--text)' }}>{row.points} pts</b>
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {subTab === 'players' && (
        <div className="grid mt">
          {LEGACY_PLAYERS.sort((a,b) => a.name.localeCompare(b.name)).map((p) => {
            const fr = legacyFranchiseById(p.franchise_id);
            if (!fr) return null;
            return (
              <Link key={p.id} to={`/legacy-franchise/${p.franchise_id}`} className="card row spread" style={{ borderLeft: `3px solid ${fr.primary}`, paddingLeft: 14 }}>
                <div className="row">
                  <span className="avatar" style={{ background: fr.primary + '33', color: fr.primary, width: 34, height: 34, fontSize: 12 }}>
                    {p.name.split(' ').map(w => w[0]).join('')}
                  </span>
                  <div>
                    <b style={{ fontSize: 14 }}>{p.name}</b>
                    <div className="muted" style={{ fontSize: 11 }}>{fr.name} · <span style={{ color: 'var(--gold)' }}>{p.kind === 'youth' ? 'Youth' : 'Adult'}</span></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════ */
export function Leagues() {
  const [league, setLeague] = useState('mens');

  return (
    <div className="page">
      <h1 className="display">Leagues</h1>

      <div className="tabbar mt">
        <button className={league === 'mens' ? 'on' : ''} onClick={() => setLeague('mens')}>
          Men's Franchise League
        </button>
        <button className={league === 'ladies' ? 'on' : ''} onClick={() => setLeague('ladies')}>
          Ladies Franchise League
        </button>
        <button className={league === 'legacy' ? 'on' : ''} onClick={() => setLeague('legacy')}>
          LP Legacy League
        </button>
      </div>

      {league === 'mens' && <MensLeague />}
      {league === 'ladies' && <LadiesLeague />}
      {league === 'legacy' && <LegacyLeagueTab />}

      <div className="mt"><SponsorRail placement="leagues" /></div>
    </div>
  );
}
