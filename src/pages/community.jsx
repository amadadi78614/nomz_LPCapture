import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  RIVALRIES, rivalryById, headToHead, topPlayers,
  HALL_OF_FAME, AUCTION, auctionBoard, auctionSteals, auctionTopSpends,
  DYNASTY, fanPotwCandidates, fanPredictionFixtures, FAN_POLLS,
  FRANCHISES, franchiseById, playerById, stripeVar, STANDINGS, mvpLeader, SEASON,
} from '../data/seed';
import { SectionHead, ComingSoon } from '../components/ui';

const rand = (s) => `R${Number(s).toLocaleString('en-ZA')}`;
const fmtDate = (d) => new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

/* ============================================================
 * SHARED little bits
 * ========================================================== */
function FranchiseChip({ id, size = 26 }) {
  const fr = franchiseById(id);
  return (
    <span className="row" style={{ gap: 8 }}>
      <img src={fr.logo} alt="" style={{ width: size, height: size, objectFit: 'contain' }} />
      <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>{fr.name}</b>
    </span>
  );
}

/* ============================================================
 * RIVALRIES  →  /rivalries  and  /rivalry/:id
 * ========================================================== */
export function Rivalries() {
  return (
    <div className="page">
      <span className="eyebrow" style={{ color: 'var(--live)' }}>Rivalries</span>
      <h1 className="display">Lowveld Rivalries</h1>
      <p className="muted" style={{ maxWidth: 600 }}>The grudge matches that give the league its edge. Head-to-head records update live with every result.</p>
      <div className="grid mt">
        {RIVALRIES.map((r) => {
          const a = franchiseById(r.a); const b = franchiseById(r.b);
          const h2h = headToHead(r.a, r.b);
          return (
            <Link key={r.id} to={`/rivalry/${r.id}`} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="rv-banner">
                <span className="rv-side" style={{ background: `linear-gradient(135deg, ${stripeVar(r.a)}, transparent)` }}>
                  <img src={a.logo} alt="" />
                </span>
                <span className="rv-vs">VS</span>
                <span className="rv-side rv-side-r" style={{ background: `linear-gradient(225deg, ${stripeVar(r.b)}, transparent)` }}>
                  <img src={b.logo} alt="" />
                </span>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <span className="eyebrow" style={{ color: 'var(--gold)' }}>{r.tag}</span>
                <p style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontWeight: 700, margin: '4px 0' }}>
                  {a.name} <span className="muted">v</span> {b.name}
                </p>
                <p className="muted" style={{ fontSize: 12, margin: 0 }}>
                  {h2h.played ? `${h2h.aWins}-${h2h.bWins} all-time · ${h2h.played} met` : 'First meeting still to come'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <RivalryStyles />
    </div>
  );
}

export function RivalryPage() {
  const { id } = useParams();
  const r = rivalryById(id);
  if (!r) return <div className="page"><h1 className="display">Rivalry not found</h1><Link to="/rivalries" className="gold">← All rivalries</Link></div>;
  const a = franchiseById(r.a); const b = franchiseById(r.b);
  const h2h = headToHead(r.a, r.b);
  const aKey = topPlayers(r.a, 2); const bKey = topPlayers(r.b, 2);
  const sFr = STANDINGS.mens.franchise;
  const aRow = sFr.find((x) => x.franchise_id === r.a); const bRow = sFr.find((x) => x.franchise_id === r.b);

  return (
    <div className="page">
      <RivalryStyles />
      <Link to="/rivalries" className="muted" style={{ fontSize: 13 }}>← All rivalries</Link>
      <div className="rv-hero mt">
        <div className="rv-hero-side" style={{ '--c': stripeVar(r.a) }}>
          <img src={a.logo} alt="" />
          <b>{a.name}</b>
          {aRow && <span className="muted">{aRow.points} pts · #{sFr.indexOf(aRow) + 1}</span>}
        </div>
        <div className="rv-hero-mid">
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>{r.tag}</span>
          <div className="rv-score">{h2h.aWins}<span className="muted">–</span>{h2h.bWins}</div>
          <span className="muted" style={{ fontSize: 12 }}>head-to-head</span>
        </div>
        <div className="rv-hero-side" style={{ '--c': stripeVar(r.b) }}>
          <img src={b.logo} alt="" />
          <b>{b.name}</b>
          {bRow && <span className="muted">{bRow.points} pts · #{sFr.indexOf(bRow) + 1}</span>}
        </div>
      </div>

      <div className="card mt">
        <p className="eyebrow" style={{ marginBottom: 6 }}>The story</p>
        <p style={{ margin: 0, lineHeight: 1.5 }}>{r.story}</p>
      </div>

      <div className="grid cols-2 mt">
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 8 }}>Last meeting</p>
          {h2h.last ? (
            <Link to={`/match/${h2h.last.id}`} className="row spread" style={{ display: 'flex' }}>
              <span>{fmtDate(h2h.last.date)}</span>
              <b className="num">{h2h.last.aPts}–{h2h.last.bPts}</b>
            </Link>
          ) : <p className="muted" style={{ margin: 0 }}>These two haven't met yet this season — when they do, it lands here.</p>}
        </div>
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 8 }}>Biggest win</p>
          {h2h.biggest ? (
            <div className="row spread">
              <span>{fmtDate(h2h.biggest.date)}</span>
              <b className="num">{h2h.biggest.aPts}–{h2h.biggest.bPts}</b>
            </div>
          ) : <p className="muted" style={{ margin: 0 }}>To be written.</p>}
        </div>
      </div>

      <SectionHead title="Key players" />
      <div className="grid cols-2">
        {[[a, aKey], [b, bKey]].map(([fr, ks]) => (
          <div key={fr.id} className="card stripe" style={{ '--stripe': stripeVar(fr.id) }}>
            <p className="eyebrow" style={{ marginBottom: 8 }}>{fr.name}</p>
            {ks.length ? ks.map((p) => (
              <Link key={p.id} to={`/player/${p.id}`} className="row spread" style={{ padding: '6px 0' }}>
                <span className="row" style={{ gap: 8 }}>
                  <span className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{p.name.split(' ').map((w) => w[0]).join('')}</span>
                  <b style={{ fontSize: 14 }}>{p.name}</b>
                </span>
                <span className="num gold">★ {p.stats.mvp_points}</span>
              </Link>
            )) : <p className="muted" style={{ margin: 0, fontSize: 13 }}>Awaiting first results.</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * HALL OF FAME  →  /hall-of-fame
 * ========================================================== */
export function HallOfFame() {
  const liveChamp = STANDINGS.mens.franchise[0];
  const liveMvp = mvpLeader('mens');
  return (
    <div className="page">
      <span className="eyebrow" style={{ color: 'var(--gold)' }}>Hall of Fame</span>
      <h1 className="display">Lowveld Hall of Fame</h1>
      <p className="muted" style={{ maxWidth: 600 }}>The honours board — champions, MVPs, and the moments that built the league.</p>

      <SectionHead title="Season Champions" />
      <div className="grid">
        {HALL_OF_FAME.seasonChampions.map((s) => {
          const live = s.year === SEASON.year;
          const fr = s.franchise ? franchiseById(s.franchise) : (live ? franchiseById(liveChamp.franchise_id) : null);
          return (
            <div key={s.season} className="card stripe row spread" style={{ '--stripe': fr ? stripeVar(fr.id) : 'var(--gold)' }}>
              <span className="row" style={{ gap: 12 }}>
                <span className="hof-medal">{live ? '◷' : '🏆'}</span>
                <span>
                  <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>{s.season}</b>
                  <div className="muted" style={{ fontSize: 12 }}>{live ? `Leading: ${fr.name} (${liveChamp.points} pts)` : (fr ? fr.name : s.note)}</div>
                </span>
              </span>
              <span className="muted" style={{ fontSize: 12 }}>{s.year}</span>
            </div>
          );
        })}
      </div>

      <SectionHead title="MVP Winners" />
      <div className="grid">
        {HALL_OF_FAME.mvps.map((s) => {
          const live = s.year === SEASON.year;
          const pl = s.playerId ? playerById(s.playerId) : (live ? liveMvp : null);
          return (
            <div key={s.season} className="card row spread">
              <span className="row" style={{ gap: 12 }}>
                <span className="hof-medal" style={{ color: 'var(--gold)' }}>★</span>
                <span>
                  <b>{s.season}</b>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {pl ? <Link to={`/player/${pl.id}`} className="gold">{pl.name}</Link> : s.note}
                    {live && pl ? ` · ${pl.stats.mvp_points} pts (live)` : ''}
                  </div>
                </span>
              </span>
              <span className="muted" style={{ fontSize: 12 }}>{s.year}</span>
            </div>
          );
        })}
      </div>

      <SectionHead title="Biggest Moments" />
      <div className="grid">
        {HALL_OF_FAME.biggestMoments.map((mo, i) => (
          <div key={i} className="card stripe" style={{ '--stripe': 'var(--gold)' }}>
            <div className="row spread">
              <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>{mo.title}</b>
              <span className="muted" style={{ fontSize: 12 }}>{fmtDate(mo.date)}</span>
            </div>
            <p className="muted" style={{ margin: '6px 0 0', fontSize: 13 }}>{mo.blurb}</p>
          </div>
        ))}
      </div>

      <SectionHead title="All-Time Greats" />
      <div className="grid cols-2">
        {HALL_OF_FAME.allTimeGreats.map((g, i) => (
          <div key={i} className="card hof-empty">
            <span className="hof-medal" style={{ opacity: .5 }}>☆</span>
            <b>{g.name || 'To be inducted'}</b>
            <p className="muted" style={{ fontSize: 12, margin: '4px 0 0' }}>{g.blurb}</p>
          </div>
        ))}
      </div>

      <SectionHead title="Best Captains" />
      <div className="grid cols-2">
        {HALL_OF_FAME.bestCaptains.map((c, i) => (
          <div key={i} className="card hof-empty">
            <span className="hof-medal" style={{ opacity: .5 }}>©</span>
            <b>{c.name || 'To be named'}</b>
            <p className="muted" style={{ fontSize: 12, margin: '4px 0 0' }}>{c.blurb}</p>
          </div>
        ))}
      </div>
      <style>{`
        .hof-medal { font-size:22px; }
        .hof-empty { text-align:center; display:flex; flex-direction:column; align-items:center; gap:2px; border-style:dashed; }
      `}</style>
    </div>
  );
}

/* ============================================================
 * DRAFT / AUCTION HISTORY  →  /draft
 * ========================================================== */
export function DraftHistory() {
  const [tab, setTab] = useState('board');
  const board = auctionBoard();
  const spends = auctionTopSpends(6);
  const steals = auctionSteals(6);
  return (
    <div className="page">
      <span className="eyebrow" style={{ color: 'var(--gold)' }}>{AUCTION.season} Auction</span>
      <h1 className="display">Draft &amp; Auction History</h1>
      <div className="card mt">
        <div className="row spread">
          <span><b style={{ fontSize: 22, fontFamily: 'var(--display)' }}>{AUCTION.totalSpendLabel}</b><div className="muted" style={{ fontSize: 12 }}>total spend</div></span>
          <span style={{ textAlign: 'right' }}><b style={{ fontSize: 22, fontFamily: 'var(--display)' }}>{board.length}</b><div className="muted" style={{ fontSize: 12 }}>players drafted</div></span>
        </div>
        <p className="muted" style={{ margin: '10px 0 0', fontSize: 13, lineHeight: 1.5 }}>{AUCTION.story}</p>
      </div>

      <div className="tabbar mt">
        <button className={tab === 'board' ? 'on' : ''} onClick={() => setTab('board')}>Draft Board</button>
        <button className={tab === 'spends' ? 'on' : ''} onClick={() => setTab('spends')}>Most Expensive</button>
        <button className={tab === 'steals' ? 'on' : ''} onClick={() => setTab('steals')}>Biggest Steals</button>
      </div>

      {tab === 'board' && (
        <div className="grid mt">
          {board.map((p, i) => {
            const fr = franchiseById(p.franchise_id);
            return (
              <Link key={p.id} to={`/player/${p.id}`} className="card stripe row spread" style={{ '--stripe': stripeVar(fr.id), padding: 11 }}>
                <span className="row" style={{ gap: 10 }}>
                  <b className="num muted" style={{ width: 26 }}>{i + 1}</b>
                  <span>
                    <b style={{ fontSize: 14 }}>{p.name} <span className="chip" style={{ fontSize: 10, padding: '1px 6px' }}>{p.tier}</span></b>
                    <div className="muted" style={{ fontSize: 11 }}>{fr.name}</div>
                  </span>
                </span>
                <b className="num gold">{rand(p.auction_price)}</b>
              </Link>
            );
          })}
        </div>
      )}

      {tab === 'spends' && (
        <div className="grid mt">
          {spends.map((p, i) => {
            const fr = franchiseById(p.franchise_id);
            return (
              <Link key={p.id} to={`/player/${p.id}`} className="card stripe row spread" style={{ '--stripe': stripeVar(fr.id) }}>
                <span className="row" style={{ gap: 10 }}>
                  <b className="num" style={{ width: 26, color: 'var(--gold)' }}>{i + 1}</b>
                  <span><b>{p.name}</b><div className="muted" style={{ fontSize: 11 }}>{fr.name} · {p.tier}</div></span>
                </span>
                <b className="num gold" style={{ fontSize: 17 }}>{rand(p.auction_price)}</b>
              </Link>
            );
          })}
        </div>
      )}

      {tab === 'steals' && (
        <>
          <p className="muted mt" style={{ fontSize: 12 }}>Best return on investment — MVP points earned per R1,000 spent (players who've featured).</p>
          <div className="grid">
            {steals.map((p, i) => {
              const fr = franchiseById(p.franchise_id);
              return (
                <Link key={p.id} to={`/player/${p.id}`} className="card stripe row spread" style={{ '--stripe': stripeVar(fr.id) }}>
                  <span className="row" style={{ gap: 10 }}>
                    <b className="num" style={{ width: 26, color: 'var(--win)' }}>{i + 1}</b>
                    <span><b>{p.name}</b><div className="muted" style={{ fontSize: 11 }}>{fr.name} · ★{p.stats.mvp_points} for {rand(p.auction_price)}</div></span>
                  </span>
                  <span className="chip" style={{ color: 'var(--win)' }}>STEAL</span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
 * DYNASTY TRACKER  →  /dynasty
 * ========================================================== */
export function Dynasty() {
  const spot = franchiseById(DYNASTY.spotlight);
  const sFr = STANDINGS.mens.franchise;
  const spotRow = sFr.find((x) => x.franchise_id === DYNASTY.spotlight);
  return (
    <div className="page">
      <span className="eyebrow" style={{ color: 'var(--court)' }}>Dynasty Tracker</span>
      <h1 className="display">Dynasty Tracker</h1>

      <div className="card stripe mt" style={{ '--stripe': stripeVar(spot.id), padding: 0, overflow: 'hidden' }}>
        <div className="dyn-hero" style={{ background: `linear-gradient(135deg, ${stripeVar(spot.id)}, transparent 70%)` }}>
          <img src={spot.logo} alt="" />
          <div>
            <span className="eyebrow">Title chase</span>
            <h2 style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', margin: '2px 0' }}>{spot.name}</h2>
            {spotRow && <span className="muted">{spotRow.points} pts · #{sFr.indexOf(spotRow) + 1} · {spotRow.won}-{spotRow.lost}</span>}
          </div>
        </div>
        <p style={{ padding: '12px 14px', margin: 0, lineHeight: 1.5 }}>{DYNASTY.spotlightStory}</p>
      </div>

      <SectionHead title="Franchise Legacy" />
      <div className="grid cols-2">
        {DYNASTY.legacy.map((l) => {
          const fr = franchiseById(l.franchise);
          const row = sFr.find((x) => x.franchise_id === l.franchise);
          return (
            <Link key={l.franchise} to={`/franchise/${l.franchise}`} className="card stripe" style={{ '--stripe': stripeVar(fr.id) }}>
              <FranchiseChip id={l.franchise} />
              <div className="row" style={{ gap: 16, marginTop: 10 }}>
                <span><b className="num" style={{ fontSize: 20 }}>{l.titles}</b><div className="muted" style={{ fontSize: 11 }}>Titles</div></span>
                <span><b className="num" style={{ fontSize: 20 }}>{l.finals}</b><div className="muted" style={{ fontSize: 11 }}>Finals</div></span>
                {row && <span><b className="num" style={{ fontSize: 20 }}>{row.points}</b><div className="muted" style={{ fontSize: 11 }}>S3 pts</div></span>}
              </div>
              <p className="muted" style={{ fontSize: 12, margin: '8px 0 0' }}>{l.note}</p>
            </Link>
          );
        })}
      </div>
      <p className="muted mt" style={{ fontSize: 12 }}>Title &amp; finals counts start at zero — they'll fill as Lowveld Padel crowns its champions.</p>
      <style>{`.dyn-hero { display:flex; align-items:center; gap:16px; padding:18px 16px; } .dyn-hero img { width:64px; height:64px; object-fit:contain; }`}</style>
    </div>
  );
}

/* ============================================================
 * FAN ZONE  →  /fan-zone   (client-side only, session state)
 * ========================================================== */
export function FanZone() {
  const potw = fanPotwCandidates(4);
  const [vote, setVote] = useState(null);
  const fixtures = fanPredictionFixtures();
  const [preds, setPreds] = useState({});
  const [pollPick, setPollPick] = useState({});

  return (
    <div className="page">
      <span className="eyebrow" style={{ color: 'var(--live)' }}>Fan Zone</span>
      <h1 className="display">Fan Zone</h1>
      <p className="muted" style={{ maxWidth: 600 }}>Your league, your shout. Vote, predict and back your franchise. (Votes are just for fun and live in your browser for now.)</p>

      {/* Player of the Week */}
      <SectionHead title="Player of the Week" />
      <div className="grid cols-2">
        {potw.map((p) => {
          const fr = franchiseById(p.franchise_id);
          const picked = vote === p.id;
          return (
            <button key={p.id} onClick={() => setVote(p.id)} className="card stripe" style={{ '--stripe': stripeVar(fr.id), textAlign: 'left', cursor: 'pointer', border: picked ? '1px solid var(--win)' : undefined }}>
              <div className="row spread">
                <span className="row" style={{ gap: 10 }}>
                  <span className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{p.name.split(' ').map((w) => w[0]).join('')}</span>
                  <span><b style={{ fontSize: 14 }}>{p.name}</b><div className="muted" style={{ fontSize: 11 }}>{fr.name}</div></span>
                </span>
                <span className={picked ? 'gold' : 'muted'} style={{ fontSize: 20 }}>{picked ? '●' : '○'}</span>
              </div>
            </button>
          );
        })}
      </div>
      {vote && <p className="gold mt" style={{ fontSize: 13 }}>✓ You backed {playerById(vote)?.name} for Player of the Week.</p>}

      {/* Match Predictions */}
      <SectionHead title="Match Predictions" />
      {fixtures.length ? (
        <div className="grid">
          {fixtures.map((f) => {
            const a = franchiseById(f.home); const b = franchiseById(f.away);
            const pick = preds[f.id];
            return (
              <div key={f.id} className="card">
                <p className="muted" style={{ fontSize: 11, margin: '0 0 8px' }}>{new Date(f.start).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })} · {f.court}</p>
                <div className="row" style={{ gap: 8 }}>
                  {[[f.home, a], [f.away, b]].map(([fid, fr]) => (
                    <button key={fid} onClick={() => setPreds((s) => ({ ...s, [f.id]: fid }))}
                      className="card stripe" style={{ '--stripe': stripeVar(fid), flex: 1, cursor: 'pointer', textAlign: 'center', padding: 10, border: pick === fid ? '1px solid var(--win)' : undefined }}>
                      <img src={fr.logo} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} />
                      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{fr.name}</div>
                    </button>
                  ))}
                </div>
                {pick && <p className="gold" style={{ fontSize: 12, margin: '8px 0 0' }}>You're backing {franchiseById(pick).name}.</p>}
              </div>
            );
          })}
        </div>
      ) : <div className="card"><p className="muted" style={{ margin: 0 }}>No upcoming fixtures to predict right now — check back when the next round is scheduled.</p></div>}

      {/* Polls */}
      <SectionHead title="Polls" />
      <div className="grid">
        {FAN_POLLS.map((poll) => {
          const pick = pollPick[poll.id];
          return (
            <div key={poll.id} className="card">
              <b>{poll.q}</b>
              <div className="grid mt" style={{ gap: 8 }}>
                {poll.options.map((fid) => {
                  const fr = franchiseById(fid);
                  const sel = pick === fid;
                  return (
                    <button key={fid} onClick={() => setPollPick((s) => ({ ...s, [poll.id]: fid }))}
                      className="row spread" style={{ background: sel ? 'var(--surface)' : 'transparent', border: `1px solid ${sel ? 'var(--win)' : 'var(--line)'}`, borderRadius: 'var(--r-sm)', padding: '8px 10px', cursor: 'pointer' }}>
                      <FranchiseChip id={fid} size={22} />
                      <span className={sel ? 'gold' : 'muted'}>{sel ? '●' : '○'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Support CTA */}
      <SectionHead title="Back Your Franchise" />
      <div className="fan-cta">
        {FRANCHISES.filter((f) => f.league === 'mens').map((fr) => (
          <Link key={fr.id} to={`/franchise/${fr.id}`} className="fan-cta-tile" style={{ '--c': stripeVar(fr.id) }}>
            <img src={fr.logo} alt={fr.name} />
            <span>{fr.name}</span>
          </Link>
        ))}
      </div>
      <style>{`
        .fan-cta { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-top:8px; }
        .fan-cta-tile { display:flex; flex-direction:column; align-items:center; gap:6px; padding:16px 8px; border-radius:var(--r); border:1px solid var(--line);
          background:linear-gradient(160deg, color-mix(in srgb, var(--c) 18%, transparent), transparent); text-align:center; }
        .fan-cta-tile img { width:42px; height:42px; object-fit:contain; }
        .fan-cta-tile span { font-family:var(--display); text-transform:uppercase; font-size:12px; font-weight:700; }
        @media (min-width:760px){ .fan-cta { grid-template-columns:repeat(4,1fr); } }
      `}</style>
    </div>
  );
}

/* shared rivalry styles */
function RivalryStyles() {
  return (
    <style>{`
      .rv-banner { display:flex; align-items:center; justify-content:center; gap:0; height:96px; position:relative; background:#0a0f1c; }
      .rv-side { flex:1; height:100%; display:flex; align-items:center; justify-content:center; }
      .rv-side img { width:54px; height:54px; object-fit:contain; }
      .rv-side-r { justify-content:center; }
      .rv-vs { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); font-family:var(--display); font-weight:800; font-size:20px;
        background:var(--ink); width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1px solid var(--line-strong); }
      .rv-hero { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:10px; background:var(--surface); border:1px solid var(--line); border-radius:var(--r); padding:18px 12px; }
      .rv-hero-side { display:flex; flex-direction:column; align-items:center; gap:4px; text-align:center; }
      .rv-hero-side img { width:56px; height:56px; object-fit:contain; }
      .rv-hero-side b { font-family:var(--display); text-transform:uppercase; font-size:14px; }
      .rv-hero-side .muted { font-size:11px; }
      .rv-hero-mid { text-align:center; }
      .rv-score { font-family:var(--display); font-weight:800; font-size:38px; line-height:1; }
    `}</style>
  );
}
