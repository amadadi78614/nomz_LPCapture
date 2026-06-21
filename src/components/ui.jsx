import { NavLink, Link } from 'react-router-dom';
import { FIXTURES, STANDINGS, franchiseById, stripeVar, SPONSORS } from '../data/seed';
import { useLiveMatch } from '../hooks/useLiveMatch';
import { displayPoints, scoreSummary } from '../lib/scoringEngine';

/* ---------------- Live ticker (signature spine) ---------------- */
function TickerItems() {
  const live = FIXTURES.filter((f) => f.status === 'live');
  const finals = FIXTURES.filter((f) => f.status === 'final').slice(-3);
  const upcoming = FIXTURES.filter((f) => f.status === 'scheduled').slice(0, 3);
  return (
    <>
      {live.map((f) => <LiveTickerItem key={f.id} fixture={f} />)}
      {finals.map((f) => (
        <span className="ticker-item" key={f.id}>
          <b>FT</b> {franchiseById(f.home).name} {(f.score?.totals || f.score?.rubberWins || ['', '']).join('\u2013')} {franchiseById(f.away).name}
        </span>
      ))}
      {upcoming.map((f) => (
        <span className="ticker-item" key={f.id}>
          {new Date(f.start).toLocaleDateString('en-ZA', { weekday: 'short' })} {franchiseById(f.home).name} v {franchiseById(f.away).name}
        </span>
      ))}
    </>
  );
}
function LiveTickerItem({ fixture }) {
  const st = useLiveMatch(fixture.id);
  return (
    <Link to={`/match/${fixture.id}`} className="ticker-item">
      <span className="live-dot" />
      <b>{franchiseById(fixture.home).name}</b> {scoreSummary(st)} <b>{franchiseById(fixture.away).name}</b>
    </Link>
  );
}
export function LiveTicker() {
  return (
    <div className="ticker" role="marquee" aria-label="Live scores">
      <div className="ticker-track">
        <TickerItems />
        <TickerItems />
      </div>
    </div>
  );
}

/* ---------------- Top bar + bottom nav ---------------- */
const NAV = [
  { to: '/', label: 'Home', ico: '⌂' },
  { to: '/live', label: 'Matches', ico: '●' },
  { to: '/standings', label: 'Tables', ico: '≡' },
  { to: '/players', label: 'Players', ico: '✦' },
  { to: '/more', label: 'More', ico: '⋯' },
];
export function TopBar() {
  return (
    <header style={{ background: '#070a13', borderBottom: '1px solid var(--line)' }}>
      <div className="topbar">
        <Link to="/" className="row" style={{ gap: 10 }}>
          <img src="/brand/lp-mark.png" alt="Lowveld Padel" style={{ borderRadius: '50%' }} />
          <span className="wordmark">Lowveld Padel</span>
        </Link>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/live">Match Centre</NavLink>
          <NavLink to="/standings">Standings</NavLink>
          <NavLink to="/rankings">Rankings</NavLink>
          <NavLink to="/tv">Lowveld TV</NavLink>
          <NavLink to="/legacy-league">Legacy</NavLink>
          <NavLink to="/road-to-360">Road to 360</NavLink>
          <NavLink to="/players">Players</NavLink>
          <NavLink to="/franchises">Franchises</NavLink>
          <NavLink to="/news">News</NavLink>
          <NavLink to="/sponsors">Sponsors</NavLink>
        </nav>
      </div>
    </header>
  );
}
export function BottomNav() {
  return (
    <nav className="bottomnav" aria-label="Primary">
      {NAV.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.to === '/'}>
          <span className="ico">{n.ico}</span>
          {n.label}
        </NavLink>
      ))}
    </nav>
  );
}

/* ---------------- Live scoreboard card ---------------- */
export function LiveScoreCard({ fixture, compact = false }) {
  const st = useLiveMatch(fixture.id);
  const pts = displayPoints(st);
  const home = franchiseById(fixture.home);
  const away = franchiseById(fixture.away);
  const setsRow = (side) => (
    <div className="sb-sets">
      {st.sets.map((s, i) => (
        <span key={i} className={`sb-cell ${s[side === 'home' ? 'home' : 'away'] > s[side === 'home' ? 'away' : 'home'] ? 'won' : ''}`}>
          {side === 'home' ? s.home : s.away}
        </span>
      ))}
      {!st.winner && !st.isMatchTiebreak && <span className="sb-cell">{st.games[side]}</span>}
      {!st.winner && <span className="sb-cell pts">{pts[side]}</span>}
    </div>
  );
  return (
    <Link to={`/match/${fixture.id}`} className="card stripe" style={{ '--stripe': 'var(--live)', display: 'block' }}>
      <div className="row spread mb" style={{ marginBottom: 10 }}>
        <span className="row" style={{ gap: 8 }}>
          <span className="live-tag">LIVE</span>
          <span className="muted" style={{ fontSize: 12 }}>{fixture.court} · R{fixture.round} · {fixture.league === 'mens' ? "Men's" : 'Ladies'}</span>
        </span>
        {st.isMatchTiebreak && !st.winner && <span className="chip" style={{ color: 'var(--gold)' }}>Match tiebreak — first to 10</span>}
        {st.inTiebreak && !st.isMatchTiebreak && <span className="chip" style={{ color: 'var(--gold)' }}>Tiebreak</span>}
      </div>
      <div className="scoreboard">
        <div className="sb-team">
          <img src={home.logo} alt="" />
          <span className="name">{home.name}</span>
          {st.server === 'home' && !st.winner && <span title="Serving" style={{ color: 'var(--gold)' }}>●</span>}
        </div>
        {setsRow('home')}
        <div className="sb-team">
          <img src={away.logo} alt="" />
          <span className="name">{away.name}</span>
          {st.server === 'away' && !st.winner && <span title="Serving" style={{ color: 'var(--gold)' }}>●</span>}
        </div>
        {setsRow('away')}
      </div>
      {!compact && (
        <div className="row mt" style={{ gap: 4 }}>
          <span className="muted" style={{ fontSize: 11, marginRight: 6 }}>MOMENTUM</span>
          {st.momentum.map((m, i) => (
            <i key={i} style={{ width: 10, height: 14, borderRadius: 2, background: m === 'home' ? 'var(--court)' : 'var(--live)' }} />
          ))}
        </div>
      )}
    </Link>
  );
}

/* ---------------- Result / fixture cards ---------------- */
export function ResultCard({ fixture }) {
  const home = franchiseById(fixture.home);
  const away = franchiseById(fixture.away);
  if (!fixture.score) {
    return (
      <Link to={`/match/${fixture.id}`} className="card stripe" style={{ '--stripe': 'var(--line)', display: 'block' }}>
        <div className="row spread" style={{ marginBottom: 8 }}>
          <span className="eyebrow">Final \u00b7 W{fixture.round}</span>
          <span className="muted" style={{ fontSize: 12 }}>{new Date(fixture.start).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
        </div>
        <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15 }}>{home.name} v {away.name}</b>
        <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Result to be confirmed</div>
      </Link>
    );
  }
  const hw = fixture.score.winner === 'home';
  return (
    <Link to={`/match/${fixture.id}`} className="card stripe" style={{ '--stripe': stripeVar(hw ? fixture.home : fixture.away), display: 'block' }}>
      <div className="row spread" style={{ marginBottom: 8 }}>
        <span className="eyebrow">Final · W{fixture.round} · {fixture.score.totals ? 'Aggregate' : 'Rubbers'}</span>
        <span className="muted" style={{ fontSize: 12 }}>{new Date(fixture.start).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
      </div>
      {[['home', home, hw], ['away', away, !hw]].map(([side, fr, won]) => (
        <div className="row spread" key={side} style={{ padding: '4px 0' }}>
          <span className="row" style={{ gap: 8, opacity: won ? 1 : 0.65 }}>
            <img src={fr.logo} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
            <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15 }}>{fr.name}</b>
          </span>
          <span className="num" style={{ color: won ? 'var(--win)' : 'var(--muted)' }}>
            {(fixture.score.totals || fixture.score.rubberWins)[side === 'home' ? 0 : 1]}
          </span>
        </div>
      ))}
    </Link>
  );
}
export function FixtureRow({ fixture }) {
  const home = franchiseById(fixture.home);
  const away = franchiseById(fixture.away);
  const hasLineups = !!fixture.pairs?.slots?.length;
  return (
    <Link to={`/match/${fixture.id}`} className="card row spread" style={{ display: 'flex' }}>
      <div>
        <div style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontWeight: 700 }}>
          {home.name} <span className="muted">v</span> {away.name}
        </div>
        <div className="muted" style={{ fontSize: 12 }}>
          {new Date(fixture.start).toLocaleString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {fixture.court}
          {hasLineups && <span className="gold"> · line-ups out</span>}
        </div>
      </div>
      <span className="chip">W{fixture.round}</span>
    </Link>
  );
}

/* ---------------- Standings table ---------------- */
export function ComingSoon({ title = 'Ladies League', note = 'Season 3 has not started — launch date and fixtures will be announced here first.' }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '28px 18px' }}>
      <div style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '.06em', fontSize: 20 }}>{title}</div>
      <div className="muted mt" style={{ fontSize: 13, maxWidth: 420, margin: '8px auto 0' }}>{note}</div>
      <span className="chip mt" style={{ marginTop: 12, display: 'inline-block' }}>Coming soon</span>
    </div>
  );
}

export function StandingsTable({ league, tier = 'franchise', limit }) {
  const rows = (STANDINGS[league]?.[tier] || []).slice(0, limit || 99);
  if (league === 'ladies') return <ComingSoon />;
  const hasAdj = rows.some((r) => r.adj);
  return (
    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th><th>Franchise</th><th className="num">P</th><th className="num">W</th><th className="num">L</th>
            <th className="num">D</th><th className="num">BP</th><th className="num">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const fr = franchiseById(r.franchise_id);
            return (
              <tr key={r.franchise_id}>
                <td><span className={`pos-badge ${tier === 'franchise' && i < 4 ? 'q' : ''}`}>{i + 1}</span></td>
                <td>
                  <Link to={`/franchise/${fr.id}`} className="row" style={{ gap: 8 }}>
                    <span style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: stripeVar(fr.id) }} />
                    <img src={fr.logo} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                    <b>{fr.name}{r.adj ? ' *' : ''}</b>
                  </Link>
                </td>
                <td className="num">{r.played}</td>
                <td className="num">{r.won}</td>
                <td className="num">{r.lost}</td>
                <td className="num">{r.drawn}</td>
                <td className="num">{r.bp}</td>
                <td className="num"><b style={{ color: r.points < 0 ? 'var(--loss)' : 'inherit' }}>{r.points}</b></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {hasAdj && (
        <div className="muted" style={{ padding: '8px 14px', fontSize: 11, borderTop: '1px solid rgba(255,255,255,.06)' }}>
          * Includes a league points adjustment.
        </div>
      )}
    </div>
  );
}

/* ---------------- Sponsor rail (tracked exposure) ---------------- */
export function SponsorRail({ placement = 'home' }) {
  const trackClick = (sp) => {
    // Production: insert into sponsor_clicks (sponsor_id, placement, ts)
    if (window?.lpTrack) window.lpTrack('sponsor_click', { sponsor: sp.id, placement });
  };
  return (
    <div>
      <div className="section-head">
        <span className="eyebrow">League partners</span>
        <Link to="/sponsors">Partner with LP →</Link>
      </div>
      <div className="sponsor-rail">
        {SPONSORS.map((sp) => (
          <a key={sp.id} className="sponsor-tile" href={sp.url} onClick={() => trackClick(sp)}>
            <span className="tier">{sp.tier}</span>
            {sp.logo
              ? <img src={sp.logo} alt={sp.name} style={{ maxWidth: '100%', maxHeight: 34, objectFit: 'contain', borderRadius: 4 }} />
              : <span className="name">{sp.name}</span>}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Section header ---------------- */
export function SectionHead({ title, to, cta = 'See all' }) {
  return (
    <div className="section-head">
      <h2 className="display">{title}</h2>
      {to && <Link to={to}>{cta} →</Link>}
    </div>
  );
}
