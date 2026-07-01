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
      {season === 's2' && <div className="mt"><PlaceholderSeason season="Season 2" league="Men's Franchise League" /></div>}

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
  const ladiesFranchises = FRANCHISES.filter((f) => f.league === 'ladies');

  return (
    <>
      <div className="tabbar mt">
        {[['s1', 'Season 1'], ['s2', 'Season 2']].map(([k, lbl]) => (
          <button key={k} className={season === k ? 'on' : ''} onClick={() => setSeason(k)}>{lbl}</button>
        ))}
      </div>

      {season === 's1' && <div className="mt"><PlaceholderSeason season="Season 1" league="Ladies Franchise League" /></div>}

      {season === 's2' && (
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
      </div>

      {league === 'mens' && <MensLeague />}
      {league === 'ladies' && <LadiesLeague />}

      <div className="mt"><SponsorRail placement="leagues" /></div>
    </div>
  );
}
