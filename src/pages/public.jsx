import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FIXTURES, PLAYERS, NEWS, STANDINGS, POWER_RANKINGS, SPONSORS, TIER_SPONSORS, FRANCHISES,
  franchiseById, playerById, stripeVar, bestPartner, winPct,
  RIVALRIES, headToHead, DYNASTY, TV_VIDEOS, TV_LIVE, getYouTubeId, ytThumb, mvpLeader,
  ROAD_TO_360, LEGACY_FRANCHISES, LEGACY_STANDINGS, LEGACY_PLAYERS, LEGACY_POWER,
  legacyFranchiseById, matchOfTheWeek, lpAiPredict, POWER_RANKINGS_WEEKLY,
  teamForm, playerOfWeek,
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
  const [standTab, setStandTab] = useState('mens');
  const live = FIXTURES.filter((f) => f.status === 'live');
  const results = FIXTURES.filter((f) => f.status === 'final').slice(-3).reverse();
  const upcoming = FIXTURES.filter((f) => f.status === 'scheduled').slice(0, 3);
  const mvp = mvpLeader('mens');
  const sFr = STANDINGS.mens.franchise;
  const leader = sFr[0];
  const power = POWER_RANKINGS_WEEKLY.mens.slice(0, 5);
  const motw = matchOfTheWeek();
  const potwId = playerOfWeek.current;
  const potw = potwId ? playerById(potwId) : null;
  const topRated = [...PLAYERS].filter((p) => p.stats.played > 0).sort((a, b) => b.lp_rating - a.lp_rating)[0];
  const topMvpPlayers = [...PLAYERS].filter((p) => p.stats.played > 0).sort((a, b) => b.stats.mvp_points - a.stats.mvp_points).slice(0, 5);

  // Countdown to next fixture
  const nextFx = upcoming[0];
  const msUntil = nextFx ? new Date(nextFx.start) - new Date() : null;
  const daysUntil = msUntil ? Math.floor(msUntil / 86400000) : null;
  const hoursUntil = msUntil ? Math.floor((msUntil % 86400000) / 3600000) : null;

  return (
    <div className="hp-root">
      <HomeStyles />

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="hp-hero">
        <div className="hp-hero-glow" />
        <div className="hp-hero-noise" />
        <div className="hp-hero-layout">
          {/* LEFT — text content */}
          <div className="hp-hero-content">
            <div className="hp-hero-eye">
              {live.length > 0
                ? <span className="hp-live-pill"><span className="hp-live-dot" />LIVE NOW · {live.length} MATCH{live.length > 1 ? 'ES' : ''}</span>
                : <span className="hp-season-pill">SEASON 3 · MATCH DAY 7 · TITLE RACE</span>}
            </div>

            <h1 className="hp-hero-h1">
              <span className="hp-hero-word1">LOWVELD</span>
              <span className="hp-hero-word2">PADEL</span>
            </h1>
            <p className="hp-hero-sub">The Home of Competitive Padel in Mpumalanga</p>

            <div className="hp-hero-ctas">
              <Link to="/live" className="hp-btn-primary">
                {live.length > 0 ? '● Watch Live' : '● Match Centre'}
              </Link>
              <Link to="/leagues" className="hp-btn-secondary">Standings</Link>
              <Link to="/leagues" className="hp-btn-secondary">Fixtures</Link>
            </div>
          </div>

          {/* RIGHT — LP mark + stats */}
          <div className="hp-hero-right">
            <div className="hp-hero-emblem">
              <img src="/brand/lp-mark.png" alt="Lowveld Padel" className="hp-hero-mark" />
              <div className="hp-hero-emblem-glow" />
            </div>
          </div>
        </div>

        {/* Stats strip — full width below */}
        <div className="hp-hero-strip">
          {leader && (
            <div className="hp-strip-item">
              <span className="hp-strip-label">LEAGUE LEADER</span>
              <div className="hp-strip-val-row">
                <img src={franchiseById(leader.franchise_id).logo} alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                <span className="hp-strip-val" style={{ color: 'var(--gold)' }}>{franchiseById(leader.franchise_id).name}</span>
              </div>
              <span className="hp-strip-sub">{leader.points} pts</span>
            </div>
          )}
          <div className="hp-strip-div" />
          {mvp && (
            <div className="hp-strip-item">
              <span className="hp-strip-label">MVP LEADER</span>
              <span className="hp-strip-val" style={{ color: 'var(--win)' }}>{mvp.name.split(' ').slice(-1)[0]}</span>
              <span className="hp-strip-sub">★ {mvp.stats.mvp_points} pts</span>
            </div>
          )}
          <div className="hp-strip-div" />
          {nextFx ? (
            <div className="hp-strip-item">
              <span className="hp-strip-label">NEXT FIXTURE</span>
              <span className="hp-strip-val" style={{ color: 'var(--court)', fontSize: 'clamp(11px,2.5vw,15px)' }}>
                {franchiseById(nextFx.home).short || franchiseById(nextFx.home).name.split(' ')[0]} v {franchiseById(nextFx.away).short || franchiseById(nextFx.away).name.split(' ')[0]}
              </span>
              <span className="hp-strip-sub">
                {daysUntil > 0 ? `in ${daysUntil}d ${hoursUntil}h` : hoursUntil > 0 ? `in ${hoursUntil}h` : 'Today'} · {nextFx.court}
              </span>
            </div>
          ) : (
            <div className="hp-strip-item">
              <span className="hp-strip-label">SEASON PROGRESS</span>
              <span className="hp-strip-val" style={{ color: 'var(--court)' }}>MD 7 of 9</span>
              <span className="hp-strip-sub">Title race on</span>
            </div>
          )}
          <div className="hp-strip-div" />
          <div className="hp-strip-item">
            <span className="hp-strip-label">LP LEGACY</span>
            <span className="hp-strip-val" style={{ color: 'var(--gold)' }}>● Live</span>
            <span className="hp-strip-sub">MD 1 Complete</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BREAKING NEWS
      ════════════════════════════════════════ */}
      {NEWS.length > 0 && (
        <section className="hp-section">
          <div className="hp-section-head">
            <h2 className="hp-section-title">Breaking News</h2>
            <Link to="/news" className="hp-section-link">All news →</Link>
          </div>
          <div className="hp-news-grid">
            {/* Hero story */}
            <Link to="/news" className="hp-news-hero">
              <div className="hp-news-hero-bg" />
              <div className="hp-news-hero-content">
                <span className="hp-news-kicker" style={{ color: NEWS[0].tag === 'legacy' ? 'var(--gold)' : NEWS[0].tag === 'ladies' ? '#f0abcc' : 'var(--live)' }}>
                  {NEWS[0].kicker}
                </span>
                <h3 className="hp-news-hero-title">{NEWS[0].title}</h3>
                <p className="hp-news-body">{NEWS[0].body?.slice(0, 120)}...</p>
                <span className="hp-news-date">{new Date(NEWS[0].date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </Link>
            {/* Side stories */}
            <div className="hp-news-side">
              {NEWS.slice(1, 4).map((n) => (
                <Link key={n.id} to="/news" className="hp-news-card">
                  <span className="hp-news-kicker" style={{ color: n.tag === 'legacy' ? 'var(--gold)' : n.tag === 'ladies' ? '#f0abcc' : 'var(--live)', fontSize: 10 }}>{n.kicker}</span>
                  <p className="hp-news-card-title">{n.title}</p>
                  <span className="hp-news-date">{new Date(n.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════
          LIVE CENTRE / RESULTS / FIXTURES
      ════════════════════════════════════════ */}
      <section className="hp-section">
        <div className="hp-section-head">
          <h2 className="hp-section-title">{live.length > 0 ? '● Live Now' : 'Match Centre'}</h2>
          <Link to="/live" className="hp-section-link">Full centre →</Link>
        </div>
        {live.length > 0 ? (
          <div className="hp-match-grid">
            {live.map((f) => <LiveScoreCard key={f.id} fixture={f} />)}
          </div>
        ) : (
          <div className="hp-match-split">
            <div>
              <p className="hp-sub-label">Latest Results</p>
              <div className="hp-match-col">
                {results.slice(0, 2).map((f) => <ResultCard key={f.id} fixture={f} />)}
              </div>
            </div>
            <div>
              <p className="hp-sub-label">Next Fixtures</p>
              <div className="hp-match-col">
                {upcoming.length > 0
                  ? upcoming.slice(0, 2).map((f) => <FixtureRow key={f.id} fixture={f} />)
                  : <div className="hp-empty">Schedule to be announced</div>}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════
          LEAGUE STANDINGS — tabbed
      ════════════════════════════════════════ */}
      {(() => {
        const legacySorted = [...LEGACY_STANDINGS].sort((a,b) => b.points - a.points || (b.gd||0) - (a.gd||0));
        return (
          <section className="hp-section">
            <div className="hp-section-head">
              <h2 className="hp-section-title">Standings</h2>
              <Link to="/leagues" className="hp-section-link">Full tables →</Link>
            </div>

            {/* League tabs */}
            <div className="hp-stand-tabs">
              {[
                ['mens', "Men's League"],
                ['legacy', 'LP Legacy'],
                ['ladies', 'Ladies'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={`hp-stand-tab ${standTab === key ? 'hp-stand-tab-on' : ''}`}
                  onClick={() => setStandTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* MEN'S */}
            {standTab === 'mens' && (
              <div className="hp-table-wrap">
                <table className="hp-standings-tbl">
                  <thead>
                    <tr><th>#</th><th>Franchise</th><th>P</th><th>W</th><th>L</th><th>Pts</th><th className="hp-col-form">Form</th></tr>
                  </thead>
                  <tbody>
                    {sFr.slice(0, 7).map((r, i) => {
                      const fr = franchiseById(r.franchise_id);
                      const form = teamForm(r.franchise_id, 5);
                      const isTop4 = i < 4;
                      return (
                        <tr key={r.franchise_id} className={`hp-standing-row ${isTop4 ? 'hp-row-qualify' : ''}`}>
                          <td className="hp-pos-cell"><span className={`hp-pos ${isTop4 ? 'hp-pos-q' : ''}`}>{i + 1}</span></td>
                          <td>
                            <Link to={`/franchise/${fr.id}`} className="hp-team-cell">
                              <span className="hp-team-stripe" style={{ background: `var(--fr-${fr.id})` }} />
                              <img src={fr.logo} alt={fr.name} className="hp-team-logo" />
                              <span className="hp-team-name">{fr.name}</span>
                            </Link>
                          </td>
                          <td className="hp-num">{r.played}</td>
                          <td className="hp-num hp-col-w">{r.won}</td>
                          <td className="hp-num">{r.lost}</td>
                          <td className="hp-num hp-col-pts"><b style={{ color: isTop4 ? 'var(--gold)' : 'var(--text)' }}>{r.points}</b></td>
                          <td className="hp-col-form">
                            <span className="hp-form-pills">
                              {form.map((res, fi) => <span key={fi} className={`hp-form-pill hp-fp-${res}`}>{res}</span>)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="hp-table-foot"><span className="hp-qualify-dot" /> Top 4 qualify for Finals Night</div>
              </div>
            )}

            {/* LEGACY */}
            {standTab === 'legacy' && (
              <div className="hp-table-wrap">
                <table className="hp-standings-tbl">
                  <thead>
                    <tr><th>#</th><th>Franchise</th><th>P</th><th>W</th><th>L</th><th>MP</th><th>GD</th></tr>
                  </thead>
                  <tbody>
                    {legacySorted.map((row, i) => {
                      const fr = legacyFranchiseById(row.franchise_id);
                      if (!fr) return null;
                      const gd = row.gd || 0;
                      return (
                        <tr key={fr.id} className="hp-standing-row">
                          <td className="hp-pos-cell"><span className="hp-pos">{i + 1}</span></td>
                          <td>
                            <Link to={`/legacy-franchise/${fr.id}`} className="hp-team-cell">
                              <span className="hp-team-stripe" style={{ background: fr.primary }} />
                              <img src={fr.logo} alt={fr.name} className="hp-team-logo" style={{ mixBlendMode: 'screen' }} />
                              <span className="hp-team-name">{fr.name}</span>
                            </Link>
                          </td>
                          <td className="hp-num">{row.played}</td>
                          <td className="hp-num hp-col-w">{row.won}</td>
                          <td className="hp-num">{row.lost}</td>
                          <td className="hp-num hp-col-pts"><b style={{ color: 'var(--gold)' }}>{row.points}</b></td>
                          <td className="hp-num" style={{ color: gd > 0 ? 'var(--win)' : gd < 0 ? 'var(--loss)' : 'var(--muted)' }}>
                            {gd > 0 ? '+' : ''}{gd}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="hp-table-foot">MP = Match Points · GD = Game Difference · After MD 1</div>
              </div>
            )}

            {/* LADIES */}
            {standTab === 'ladies' && (
              <div className="hp-table-wrap" style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16, color: '#db2777', marginBottom: 8 }}>
                  Ladies Franchise League
                </div>
                <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>
                  Season 2 is upcoming — standings will appear once play begins.
                </p>
                <Link to="/register" className="hp-btn-primary" style={{ background: '#db2777', display: 'inline-flex', fontSize: 13 }}>
                  Register for Season 2 →
                </Link>
              </div>
            )}
          </section>
        );
      })()}

      {/* ════════════════════════════════════════
          UPCOMING EVENTS
      ════════════════════════════════════════ */}
      <section className="hp-section">
        <div className="hp-section-head">
          <h2 className="hp-section-title">Upcoming Events</h2>
        </div>
        <div className="hp-events-grid">
          <Link to="/leagues" className="hp-event-card hp-event-mens">
            <span className="hp-event-badge">Active</span>
            <span className="hp-event-name">Men's Franchise League</span>
            <span className="hp-event-meta">Season 3 · 2 Match Days Remaining</span>
            <span className="hp-event-venue">Play 360 & Padel 24</span>
          </Link>
          <Link to="/leagues" className="hp-event-card hp-event-legacy">
            <span className="hp-event-badge">● Live</span>
            <span className="hp-event-name">LP Legacy League</span>
            <span className="hp-event-meta">Match Day 1 Complete</span>
            <span className="hp-event-venue">Play 360 · Nelspruit</span>
          </Link>
          <Link to="/leagues" className="hp-event-card hp-event-ladies">
            <span className="hp-event-badge">Registration Open</span>
            <span className="hp-event-name">Ladies Franchise League</span>
            <span className="hp-event-meta">Season 2 · Last Few Spots</span>
            <span className="hp-event-venue">Register Now</span>
          </Link>
          <Link to="/360-super-cup" className="hp-event-card hp-event-360">
            <span className="hp-event-badge">Official Invite</span>
            <span className="hp-event-name">360 Super Cup</span>
            <span className="hp-event-meta">28–30 August 2026</span>
            <span className="hp-event-venue">Johannesburg</span>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MVP RACE + POWER RANKINGS (side by side on desktop)
      ════════════════════════════════════════ */}
      <section className="hp-section">
        <div className="hp-two-col">
          {/* MVP Race */}
          <div>
            <div className="hp-section-head">
              <h2 className="hp-section-title">MVP Race</h2>
              <Link to="/rankings" className="hp-section-link">Full board →</Link>
            </div>
            <div className="hp-mvp-list">
              {topMvpPlayers.map((p, i) => {
                const fr = franchiseById(p.franchise_id);
                return (
                  <Link key={p.id} to={`/player/${p.id}`} className={`hp-mvp-row ${i === 0 ? 'hp-mvp-leader' : ''}`}>
                    <span className="hp-mvp-rank" style={{ color: i === 0 ? 'var(--gold)' : 'var(--muted)' }}>{i + 1}</span>
                    <span className="hp-avatar-sm" style={{ background: `var(--fr-${fr.id})22`, border: `1px solid var(--fr-${fr.id})` }}>
                      {p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                    </span>
                    <span className="hp-mvp-info">
                      <b className="hp-mvp-name">{p.name}</b>
                      <span className="hp-mvp-sub">{fr.name} · {p.tier}</span>
                    </span>
                    <span className="hp-mvp-pts" style={{ color: i === 0 ? 'var(--gold)' : 'var(--text)' }}>★ {p.stats.mvp_points}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Power Rankings */}
          <div>
            <div className="hp-section-head">
              <h2 className="hp-section-title">Power Rankings</h2>
            </div>
            <div className="hp-power-list">
              {power.map((entry, i) => {
                const fr = franchiseById(entry.franchise);
                const row = sFr.find((r) => r.franchise_id === entry.franchise);
                return (
                  <Link key={entry.franchise} to={`/franchise/${entry.franchise}`} className="hp-power-row">
                    <span className="hp-power-rank">{i + 1}</span>
                    <img src={fr.logo} alt={fr.name} className="hp-power-logo" />
                    <span className="hp-power-info">
                      <b className="hp-power-name">{fr.name}</b>
                      <span className="hp-power-note">{entry.note}</span>
                    </span>
                    <span className={`hp-move hp-move-${entry.move}`}>
                      {entry.move === 'up' ? '▲' : entry.move === 'down' ? '▼' : '▬'}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PLAYER OF THE WEEK / TOP RATED
      ════════════════════════════════════════ */}
      {(potw || topRated) && (
        <section className="hp-section">
          <div className="hp-section-head">
            <h2 className="hp-section-title">{potw ? 'Player of the Week' : 'Top LP Rating'}</h2>
            <Link to="/rankings" className="hp-section-link">All players →</Link>
          </div>
          {(() => {
            const p = potw || topRated;
            const fr = franchiseById(p.franchise_id);
            return (
              <Link to={`/player/${p.id}`} className="hp-potw-card" style={{ borderLeft: `4px solid var(--fr-${fr.id})` }}>
                <span className="hp-potw-avatar" style={{ background: `var(--fr-${fr.id})22`, border: `2px solid var(--fr-${fr.id})` }}>
                  {p.name.split(' ').map((w) => w[0]).join('')}
                </span>
                <div className="hp-potw-info">
                  {potw && <span className="hp-potw-label">🏅 Player of the Week</span>}
                  <b className="hp-potw-name">{p.name}</b>
                  <span className="hp-potw-franchise">{fr.name} · {p.tier}</span>
                </div>
                <div className="hp-potw-stats">
                  <div className="hp-potw-stat"><span>{p.lp_rating}</span><small>LP Rating</small></div>
                  <div className="hp-potw-stat"><span style={{ color: 'var(--win)' }}>{p.stats.wins}W</span><small>Wins</small></div>
                  <div className="hp-potw-stat"><span style={{ color: 'var(--gold)' }}>★{p.stats.mvp_points}</span><small>MVP</small></div>
                </div>
              </Link>
            );
          })()}
        </section>
      )}

      {/* ════════════════════════════════════════
          LEGACY LEAGUE
      ════════════════════════════════════════ */}
      <section className="hp-section">
        <div className="hp-section-head">
          <h2 className="hp-section-title">LP Legacy League</h2>
          <Link to="/legacy-league" className="hp-section-link">Full standings →</Link>
        </div>
        <div className="hp-legacy-card">
          <div className="hp-legacy-header">
            <div>
              <b className="hp-legacy-title">Inaugural Season · Match Day 1 Complete</b>
              <p className="hp-legacy-sub">Phenomenal support — families packed Play 360 on launch day 🔥</p>
            </div>
            <span className="hp-live-chip">● Live</span>
          </div>
          <div className="hp-legacy-table">
            {LEGACY_STANDINGS.slice(0, 6).map((row, i) => {
              const fr = legacyFranchiseById(row.franchise_id);
              if (!fr) return null;
              return (
                <Link key={fr.id} to={`/legacy-franchise/${fr.id}`} className="hp-legacy-row">
                  <span className="hp-legacy-pos">{i + 1}</span>
                  <img src={fr.logo} alt={fr.name} style={{ width: 22, height: 22, objectFit: 'contain', mixBlendMode: 'screen' }} />
                  <span className="hp-legacy-name">{fr.name}</span>
                  <span className="hp-legacy-record">{row.played}P {row.won}W {row.lost}L</span>
                  <b className="hp-legacy-pts">{row.points}</b>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          UNITY CUP — ON HOLD
      ════════════════════════════════════════ */}
      <section className="hp-section">
        <Link to="/unity-cup" className="hp-unity-banner">
          <div className="hp-unity-flags">🇿🇦 <span style={{ color: 'var(--muted)', fontSize: 16 }}>vs</span> 🇸🇿</div>
          <div className="hp-supercup-info">
            <span className="hp-supercup-eye" style={{ color: 'rgba(154,168,35,.8)' }}>★ INTERNATIONAL NATIONS CUP</span>
            <b className="hp-supercup-title">Unity Cup</b>
            <span className="hp-supercup-loc">South Africa vs Eswatini · New date to be confirmed</span>
          </div>
          <span className="chip" style={{ color: 'var(--muted)', borderColor: 'var(--line)', flexShrink: 0 }}>On Hold</span>
        </Link>
      </section>

      {/* ════════════════════════════════════════
          360 SUPER CUP INVITATION
      ════════════════════════════════════════ */}
      <section className="hp-section">
        <Link to="/360-super-cup" className="hp-supercup-banner">
          <div className="hp-supercup-flag">🇿🇦</div>
          <div className="hp-supercup-info">
            <span className="hp-supercup-eye">OFFICIAL INVITATION · 28–30 AUGUST 2026</span>
            <b className="hp-supercup-title">Lowveld Padel at the 360 Super Cup</b>
            <span className="hp-supercup-loc">Johannesburg · Representing Mpumalanga on the National Stage</span>
          </div>
          <span className="hp-supercup-arrow">→</span>
        </Link>
      </section>

      {/* ════════════════════════════════════════
          MATCH OF THE WEEK
      ════════════════════════════════════════ */}
      {motw && (() => {
        const a = franchiseById(motw.home);
        const b = franchiseById(motw.away);
        return (
          <section className="hp-section">
            <div className="hp-section-head">
              <h2 className="hp-section-title">Match of the Week</h2>
              <Link to="/predictor" className="hp-section-link">Predict →</Link>
            </div>
            <Link to="/predictor" className="hp-motw-card">
              <span className="hp-motw-label">Can you predict the result?</span>
              <div className="hp-motw-matchup">
                <div className="hp-motw-team">
                  <img src={a.logo} alt={a.name} />
                  <b>{a.name}</b>
                </div>
                <span className="hp-motw-vs">VS</span>
                <div className="hp-motw-team">
                  <img src={b.logo} alt={b.name} />
                  <b>{b.name}</b>
                </div>
              </div>
              <span className="hp-motw-cta">Tap to predict →</span>
            </Link>
          </section>
        );
      })()}

      {/* ════════════════════════════════════════
          LOWVELD TV
      ════════════════════════════════════════ */}
      {TV_VIDEOS.length > 0 && (
        <section className="hp-section">
          <div className="hp-section-head">
            <h2 className="hp-section-title">Lowveld TV</h2>
            <Link to="/tv" className="hp-section-link">Watch all →</Link>
          </div>
          <div className="hp-tv-grid">
            {TV_VIDEOS.slice(0, 3).map((v) => {
              const thumb = v.thumbnail || ytThumb(v.youtube_url);
              return (
                <Link key={v.id} to="/tv" className="hp-tv-card">
                  <div className="hp-tv-thumb">
                    {thumb
                      ? <img src={thumb} alt={v.title} />
                      : <div className="hp-tv-placeholder"><img src="/brand/lp-mark.png" alt="" /></div>}
                    <span className="hp-tv-play">▶</span>
                    {v.live && <span className="hp-tv-live-tag">LIVE</span>}
                  </div>
                  <div className="hp-tv-meta">
                    <span className="hp-tv-cat">{v.category}</span>
                    <p className="hp-tv-title">{v.title}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════
          SPONSORS
      ════════════════════════════════════════ */}
      <section className="hp-section">
        <SponsorRail placement="home" />
      </section>

      {/* ════════════════════════════════════════
          COMMUNITY
      ════════════════════════════════════════ */}
      <section className="hp-section hp-community">
        <h2 className="hp-section-title" style={{ marginBottom: 12 }}>Community</h2>
        <div className="hp-community-grid">
          {communityLinks.leagueCommunity ? (
            <a href={communityLinks.leagueCommunity} target="_blank" rel="noreferrer" className="hp-community-card hp-wa-card">
              <span className="hp-community-icon">✆</span>
              <b>WhatsApp</b>
              <span>Join the league community</span>
            </a>
          ) : (
            <div className="hp-community-card hp-wa-card hp-coming-soon">
              <span className="hp-community-icon">✆</span>
              <b>WhatsApp</b>
              <span>Group links coming soon</span>
            </div>
          )}
          <a href="https://www.instagram.com/lowveldpadel" target="_blank" rel="noreferrer" className="hp-community-card hp-ig-card">
            <span className="hp-community-icon">◈</span>
            <b>Instagram</b>
            <span>@LowveldPadel</span>
          </a>
          <Link to="/tv" className="hp-community-card hp-tv-card">
            <span className="hp-community-icon">▶</span>
            <b>Lowveld TV</b>
            <span>Highlights & replays</span>
          </Link>
        </div>
      </section>

    </div>
  );
}

function HomeStyles() {
  return (
    <style>{`
      /* ── root ── */
      .hp-root { width: 100%; max-width: var(--maxw); margin: 0 auto; padding-bottom: calc(var(--nav-h) + 32px); }

      /* ── hero ── */
      .hp-hero {
        position: relative; overflow: hidden;
        background: linear-gradient(160deg, #0d1428 0%, #0b0f1c 55%, #10152a 100%);
        border-radius: 0; padding: clamp(24px,4vw,48px) var(--pad) 0;
        margin: 0 calc(-1 * var(--pad));
      }
      @media (min-width: 700px) { .hp-hero { border-radius: 20px; margin: 0; } }
      /* two-col layout on desktop */
      .hp-hero-layout {
        display: flex; align-items: center; gap: 24px;
      }
      .hp-hero-content { flex: 1; padding-bottom: clamp(20px,3vw,36px); }
      .hp-hero-right {
        display: none; flex-shrink: 0;
        width: clamp(140px,20vw,220px); align-items: center; justify-content: center;
        padding-bottom: clamp(20px,3vw,36px);
      }
      @media (min-width: 700px) { .hp-hero-right { display: flex; } }
      .hp-hero-emblem { position: relative; display: flex; align-items: center; justify-content: center; }
      .hp-hero-mark {
        width: clamp(120px,18vw,200px); height: auto; object-fit: contain;
        filter: drop-shadow(0 0 40px rgba(232,184,75,.35)) drop-shadow(0 0 80px rgba(232,184,75,.15));
        animation: emblem-float 4s ease-in-out infinite;
      }
      @keyframes emblem-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      .hp-hero-emblem-glow {
        position: absolute; inset: -20%; border-radius: 50%;
        background: radial-gradient(ellipse at center, rgba(232,184,75,.12), transparent 70%);
        pointer-events: none;
      }
      .hp-hero-glow {
        position: absolute; inset: 0; pointer-events: none;
        background:
          radial-gradient(ellipse 70% 50% at 80% -10%, rgba(255,77,46,.18), transparent 60%),
          radial-gradient(ellipse 60% 40% at 0% 100%, rgba(47,125,246,.14), transparent 60%),
          radial-gradient(ellipse 40% 60% at 50% 50%, rgba(232,184,75,.06), transparent 70%);
      }
      .hp-hero-noise {
        position: absolute; inset: 0; pointer-events: none; opacity: .025;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      }
      .hp-hero-content { position: relative; z-index: 1; }
      .hp-hero-eye { margin-bottom: 12px; }
      .hp-live-pill {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(255,77,46,.15); border: 1px solid rgba(255,77,46,.4);
        color: var(--live); font-size: 11px; font-weight: 800; letter-spacing: .1em;
        padding: 4px 10px; border-radius: 999px;
      }
      .hp-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--live); animation: pulse 1.2s infinite; }
      .hp-season-pill {
        display: inline-block;
        background: rgba(232,184,75,.1); border: 1px solid rgba(232,184,75,.3);
        color: var(--gold); font-size: 11px; font-weight: 800; letter-spacing: .1em;
        padding: 4px 10px; border-radius: 999px;
      }
      .hp-hero-h1 {
        font-family: var(--display); font-weight: 900; line-height: .88;
        font-size: clamp(44px, 11vw, 88px); margin-bottom: 10px;
        display: flex; flex-direction: column;
      }
      .hp-hero-word1 { color: var(--text); }
      .hp-hero-word2 { color: var(--gold); -webkit-text-stroke: 1px var(--gold); }
      .hp-hero-sub { color: var(--muted); font-size: clamp(13px,2.5vw,16px); margin-bottom: 20px; }
      .hp-hero-ctas { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; }
      .hp-btn-primary {
        display: inline-flex; align-items: center; gap: 6px;
        background: var(--live); color: #fff; font-weight: 800; font-size: 14px;
        padding: 11px 22px; border-radius: 10px; letter-spacing: .02em;
        transition: filter .15s; text-decoration: none;
      }
      .hp-btn-primary:hover { filter: brightness(1.1); }
      .hp-btn-secondary {
        display: inline-flex; align-items: center;
        background: var(--surface-2); color: var(--text); font-weight: 700; font-size: 14px;
        padding: 11px 18px; border-radius: 10px; border: 1px solid var(--line-strong);
        transition: background .15s; text-decoration: none;
      }
      .hp-btn-secondary:hover { background: #253050; }
      .hp-hero-strip {
        display: flex; gap: 0; background: rgba(255,255,255,.05);
        border: 1px solid var(--line); border-radius: 12px; overflow: hidden;
        backdrop-filter: blur(8px);
      }
      .hp-strip-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 12px 8px; gap: 2px; }
      .hp-strip-label { font-size: 9px; font-weight: 800; letter-spacing: .1em; color: var(--faint); text-transform: uppercase; }
      .hp-strip-val { font-family: var(--display); font-size: clamp(13px,3vw,18px); font-weight: 800; line-height: 1.1; text-align: center; }
      .hp-strip-val-row { display: flex; align-items: center; gap: 5px; justify-content: center; }
      .hp-strip-sub { font-size: 10px; color: var(--muted); text-align: center; }
      .hp-strip-div { width: 1px; background: var(--line); align-self: stretch; margin: 10px 0; }

      /* ── sections ── */
      .hp-section { padding: 0 var(--pad); margin-top: 32px; }
      @media (min-width: 700px) { .hp-section { padding: 0; } }
      .hp-section-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
      .hp-section-title { font-family: var(--display); font-weight: 800; font-size: clamp(16px,4vw,22px); text-transform: uppercase; letter-spacing: .01em; }
      .hp-section-link { font-size: 13px; font-weight: 600; color: var(--court); white-space: nowrap; }
      .hp-sub-label { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }

      /* ── news ── */
      .hp-news-grid { display: grid; gap: 12px; }
      @media (min-width: 700px) { .hp-news-grid { grid-template-columns: 1fr 1fr; } }
      .hp-news-hero {
        position: relative; display: block; border-radius: var(--r); overflow: hidden;
        min-height: 220px; background: var(--surface-2); text-decoration: none;
        transition: transform .2s;
      }
      .hp-news-hero:hover { transform: translateY(-2px); }
      .hp-news-hero-bg {
        position: absolute; inset: 0;
        background: linear-gradient(160deg, rgba(255,77,46,.12), rgba(47,125,246,.08));
      }
      .hp-news-hero-content { position: relative; z-index: 1; padding: 20px 18px; }
      .hp-news-kicker { display: block; font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 6px; }
      .hp-news-hero-title { font-family: var(--display); font-size: clamp(16px,3.5vw,22px); font-weight: 800; text-transform: uppercase; line-height: 1.1; margin-bottom: 8px; }
      .hp-news-body { font-size: 13px; color: var(--muted); line-height: 1.5; margin-bottom: 10px; }
      .hp-news-date { font-size: 11px; color: var(--faint); }
      .hp-news-side { display: flex; flex-direction: column; gap: 8px; }
      .hp-news-card { display: block; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-sm); padding: 12px 14px; text-decoration: none; transition: background .15s; }
      .hp-news-card:hover { background: var(--surface-2); }
      .hp-news-card-title { font-size: 13px; font-weight: 700; line-height: 1.35; margin: 3px 0 4px; color: var(--text); }

      /* ── match centre ── */
      .hp-match-split { display: grid; gap: 16px; }
      @media (min-width: 600px) { .hp-match-split { grid-template-columns: 1fr 1fr; } }
      .hp-match-col { display: flex; flex-direction: column; gap: 8px; }
      .hp-match-grid { display: grid; gap: 10px; }
      @media (min-width: 600px) { .hp-match-grid { grid-template-columns: 1fr 1fr; } }
      .hp-empty { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 20px; text-align: center; color: var(--muted); font-size: 13px; }

      /* ── standings ── */
      .hp-table-wrap { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; }
      .hp-standings-tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
      .hp-standings-tbl thead tr { border-bottom: 1px solid var(--line-strong); }
      .hp-standings-tbl th { padding: 10px 8px; text-align: center; font-size: 10px; font-weight: 700; letter-spacing: .06em; color: var(--muted); text-transform: uppercase; }
      .hp-standings-tbl th:nth-child(2) { text-align: left; }
      .hp-standing-row { border-bottom: 1px solid var(--line); transition: background .12s; }
      .hp-standing-row:last-child { border-bottom: none; }
      .hp-standing-row:hover { background: var(--surface-2); }
      .hp-row-qualify { border-left: 2px solid var(--win); }
      .hp-pos-cell { padding: 10px 10px; text-align: center; }
      .hp-pos { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 6px; font-size: 12px; font-weight: 800; background: var(--surface-2); color: var(--muted); }
      .hp-pos-q { background: rgba(46,204,143,.15); color: var(--win); }
      .hp-team-cell { display: flex; align-items: center; gap: 8px; padding: 10px 8px; text-decoration: none; }
      .hp-team-stripe { width: 3px; height: 20px; border-radius: 2px; flex-shrink: 0; }
      .hp-team-logo { width: 22px; height: 22px; object-fit: contain; flex-shrink: 0; }
      .hp-team-name { font-weight: 700; font-size: 13px; color: var(--text); white-space: nowrap; }
      .hp-num { text-align: center; padding: 10px 6px; font-family: var(--data); font-weight: 600; color: var(--muted); }
      .hp-col-w { color: var(--text) !important; }
      .hp-col-pts { color: var(--gold); }
      .hp-col-form { text-align: right; padding-right: 12px; }
      .hp-form-pills { display: flex; gap: 3px; justify-content: flex-end; }
      .hp-form-pill { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 4px; font-size: 9px; font-weight: 800; }
      .hp-fp-W { background: rgba(46,204,143,.2); color: var(--win); }
      .hp-fp-L { background: rgba(255,93,108,.15); color: var(--loss); }
      .hp-fp-D { background: rgba(232,184,75,.15); color: var(--gold); }
      .hp-table-foot { padding: 8px 14px; font-size: 11px; color: var(--muted); border-top: 1px solid var(--line); display: flex; align-items: center; gap: 6px; }
      .hp-qualify-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--win); flex-shrink: 0; }
      @media (max-width: 500px) { .hp-col-form { display: none; } }

      /* ── events ── */
      .hp-events-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      @media (min-width: 700px) { .hp-events-grid { grid-template-columns: repeat(4, 1fr); } }
      .hp-event-card {
        display: flex; flex-direction: column; gap: 4px; padding: 16px 14px;
        border-radius: var(--r); border: 1px solid var(--line);
        background: var(--surface); text-decoration: none;
        transition: transform .15s, background .15s;
      }
      .hp-event-card:hover { transform: translateY(-2px); background: var(--surface-2); }
      .hp-event-badge { font-size: 9px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 4px; }
      .hp-event-name { font-family: var(--display); font-size: 14px; font-weight: 800; text-transform: uppercase; color: var(--text); line-height: 1.1; }
      .hp-event-meta { font-size: 11px; color: var(--muted); margin-top: 2px; }
      .hp-event-venue { font-size: 10px; color: var(--faint); }
      .hp-event-mens .hp-event-badge { color: var(--court); }
      .hp-event-legacy .hp-event-badge { color: var(--gold); }
      .hp-event-ladies .hp-event-badge { color: #f0abcc; }
      .hp-event-360 .hp-event-badge { color: var(--gold); }

      /* ── two col ── */
      .hp-two-col { display: grid; gap: 24px; }
      @media (min-width: 800px) { .hp-two-col { grid-template-columns: 1fr 1fr; } }

      /* ── mvp ── */
      .hp-mvp-list { display: flex; flex-direction: column; gap: 4px; }
      .hp-mvp-row {
        display: flex; align-items: center; gap: 10px; padding: 10px 12px;
        background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-sm);
        text-decoration: none; transition: background .12s;
      }
      .hp-mvp-row:hover { background: var(--surface-2); }
      .hp-mvp-leader { border-color: rgba(232,184,75,.3); background: rgba(232,184,75,.06); }
      .hp-mvp-rank { font-family: var(--display); font-size: 16px; font-weight: 900; width: 20px; flex-shrink: 0; }
      .hp-avatar-sm { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; }
      .hp-mvp-info { flex: 1; min-width: 0; }
      .hp-mvp-name { display: block; font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .hp-mvp-sub { font-size: 11px; color: var(--muted); }
      .hp-mvp-pts { font-family: var(--display); font-size: 16px; font-weight: 800; flex-shrink: 0; }

      /* ── power ── */
      .hp-power-list { display: flex; flex-direction: column; gap: 4px; }
      .hp-power-row {
        display: flex; align-items: center; gap: 10px; padding: 10px 12px;
        background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-sm);
        text-decoration: none; transition: background .12s;
      }
      .hp-power-row:hover { background: var(--surface-2); }
      .hp-power-rank { font-family: var(--display); font-size: 18px; font-weight: 900; width: 22px; flex-shrink: 0; color: var(--muted); }
      .hp-power-logo { width: 26px; height: 26px; object-fit: contain; flex-shrink: 0; }
      .hp-power-info { flex: 1; min-width: 0; }
      .hp-power-name { display: block; font-family: var(--display); font-size: 13px; font-weight: 800; text-transform: uppercase; }
      .hp-power-note { font-size: 10px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
      .hp-move { font-size: 12px; font-weight: 800; flex-shrink: 0; }
      .hp-move-up { color: var(--win); }
      .hp-move-down { color: var(--loss); }
      .hp-move-same { color: var(--muted); }

      /* ── player of week ── */
      .hp-potw-card {
        display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
        background: var(--surface); border: 1px solid var(--line); border-radius: var(--r);
        padding: 16px; text-decoration: none; transition: background .15s;
      }
      .hp-potw-card:hover { background: var(--surface-2); }
      .hp-potw-avatar { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-family: var(--display); font-size: 18px; font-weight: 900; flex-shrink: 0; }
      .hp-potw-info { flex: 1; min-width: 120px; }
      .hp-potw-label { display: block; font-size: 10px; font-weight: 800; letter-spacing: .08em; color: var(--gold); text-transform: uppercase; margin-bottom: 3px; }
      .hp-potw-name { display: block; font-family: var(--display); font-size: 20px; font-weight: 900; text-transform: uppercase; }
      .hp-potw-franchise { font-size: 12px; color: var(--muted); }
      .hp-potw-stats { display: flex; gap: 0; margin-left: auto; }
      .hp-potw-stat { display: flex; flex-direction: column; align-items: center; padding: 8px 14px; border-left: 1px solid var(--line); }
      .hp-potw-stat span { font-family: var(--display); font-size: 20px; font-weight: 900; line-height: 1; }
      .hp-potw-stat small { font-size: 10px; color: var(--muted); letter-spacing: .06em; text-transform: uppercase; margin-top: 2px; }

      /* ── legacy ── */
      .hp-legacy-card { background: linear-gradient(135deg, rgba(232,184,75,.08), var(--surface)); border: 1px solid rgba(232,184,75,.2); border-radius: var(--r); overflow: hidden; }
      .hp-legacy-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 14px 16px 12px; border-bottom: 1px solid var(--line); }
      .hp-legacy-title { display: block; font-family: var(--display); font-size: 15px; font-weight: 800; text-transform: uppercase; }
      .hp-legacy-sub { font-size: 12px; color: var(--muted); margin-top: 3px; }
      .hp-live-chip { background: rgba(46,204,143,.12); border: 1px solid rgba(46,204,143,.3); color: var(--win); font-size: 11px; font-weight: 800; padding: 3px 9px; border-radius: 999px; white-space: nowrap; flex-shrink: 0; }
      .hp-legacy-table { padding: 4px 0; }
      .hp-legacy-row { display: flex; align-items: center; gap: 9px; padding: 7px 16px; text-decoration: none; border-bottom: 1px solid var(--line); transition: background .12s; }
      .hp-legacy-row:last-child { border-bottom: none; }
      .hp-legacy-row:hover { background: rgba(255,255,255,.03); }
      .hp-legacy-pos { font-size: 12px; font-weight: 800; color: var(--muted); width: 16px; flex-shrink: 0; }
      .hp-legacy-name { flex: 1; font-size: 13px; font-weight: 700; color: var(--text); }
      .hp-legacy-record { font-size: 11px; color: var(--muted); }
      .hp-legacy-pts { font-family: var(--display); font-size: 15px; font-weight: 900; color: var(--gold); min-width: 22px; text-align: right; }

      /* ── super cup banner ── */
      .hp-supercup-banner {
        display: flex; align-items: center; gap: 14px;
        background: linear-gradient(135deg, rgba(232,184,75,.12), rgba(232,184,75,.04));
        border: 1px solid rgba(232,184,75,.3); border-radius: var(--r);
        padding: 16px 18px; text-decoration: none; transition: background .15s;
      }
      .hp-supercup-banner:hover { background: linear-gradient(135deg, rgba(232,184,75,.18), rgba(232,184,75,.08)); }
      .hp-supercup-flag { font-size: 36px; flex-shrink: 0; }
      .hp-supercup-info { flex: 1; }
      .hp-supercup-eye { display: block; font-size: 10px; font-weight: 800; letter-spacing: .1em; color: var(--gold); text-transform: uppercase; margin-bottom: 4px; }
      .hp-supercup-title { display: block; font-family: var(--display); font-size: 18px; font-weight: 900; text-transform: uppercase; color: var(--text); }
      .hp-supercup-loc { font-size: 12px; color: var(--muted); }
      .hp-supercup-arrow { font-size: 20px; color: var(--gold); flex-shrink: 0; }

      /* ── motw ── */
      .hp-motw-card {
        background: var(--surface); border: 1px solid var(--line); border-radius: var(--r);
        padding: 16px; text-decoration: none; display: block; transition: background .15s;
      }
      .hp-motw-card:hover { background: var(--surface-2); }
      .hp-motw-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: .06em; color: var(--live); text-transform: uppercase; margin-bottom: 12px; }
      .hp-motw-matchup { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
      .hp-motw-team { display: flex; flex-direction: column; align-items: center; gap: 6px; }
      .hp-motw-team img { width: 44px; height: 44px; object-fit: contain; }
      .hp-motw-team b { font-family: var(--display); font-size: 12px; font-weight: 800; text-transform: uppercase; text-align: center; }
      .hp-motw-vs { font-family: var(--display); font-size: 24px; font-weight: 900; color: var(--muted); }
      .hp-motw-cta { display: block; text-align: center; font-size: 12px; color: var(--court); margin-top: 12px; }

      /* ── tv ── */
      .hp-tv-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
      @media (min-width: 500px) { .hp-tv-grid { grid-template-columns: repeat(3, 1fr); } }
      .hp-tv-card { display: block; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; text-decoration: none; transition: transform .15s; }
      .hp-tv-card:hover { transform: translateY(-2px); }
      .hp-tv-thumb { position: relative; padding-top: 56.25%; background: var(--surface-2); overflow: hidden; }
      .hp-tv-thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .hp-tv-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
      .hp-tv-placeholder img { width: 36px; opacity: .3; }
      .hp-tv-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,.65); border: 1.5px solid rgba(255,255,255,.7); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #fff; }
      .hp-tv-live-tag { position: absolute; top: 8px; left: 8px; background: var(--live); color: #fff; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 3px; letter-spacing: .08em; }
      .hp-tv-meta { padding: 8px 10px; }
      .hp-tv-cat { font-size: 9px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--live); }
      .hp-tv-title { font-size: 12px; font-weight: 700; color: var(--text); margin: 2px 0 0; line-height: 1.3; }

      /* ── community ── */
      .hp-community { }
      .hp-community-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
      .hp-community-card { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 18px 12px; border-radius: var(--r); border: 1px solid var(--line); background: var(--surface); text-decoration: none; text-align: center; transition: background .15s; }
      .hp-community-card:hover { background: var(--surface-2); }
      .hp-community-icon { font-size: 24px; }
      .hp-community-card b { font-size: 13px; font-weight: 800; color: var(--text); }
      .hp-community-card span { font-size: 11px; color: var(--muted); }
      .hp-wa-card .hp-community-icon { color: #25D366; }
      .hp-ig-card .hp-community-icon { color: #e4405f; }
      .hp-tv-card .hp-community-icon { color: var(--live); }
      .hp-coming-soon { opacity: 0.55; cursor: default; }
      /* standings tabs */
      .hp-stand-tabs { display: flex; gap: 4px; margin-bottom: 12px; background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 4px; }
      .hp-stand-tab { flex: 1; padding: 8px 10px; border-radius: 7px; font-size: 13px; font-weight: 600; color: var(--muted); transition: all .15s; border: none; background: none; cursor: pointer; white-space: nowrap; }
      .hp-stand-tab-on { background: var(--surface-2); color: var(--text); font-weight: 700; }
      .hp-unity-banner {
        display: flex; align-items: center; gap: 14px;
        background: rgba(154,168,35,.06); border: 1px solid rgba(154,168,35,.2);
        border-radius: var(--r); padding: 14px 16px; text-decoration: none;
        transition: background .15s; opacity: 0.75;
      }
      .hp-unity-banner:hover { background: rgba(154,168,35,.1); }
      .hp-unity-flags { font-size: 24px; flex-shrink: 0; display: flex; align-items: center; gap: 6px; }
    `}</style>
  );
}

/* ====================== MATCH CENTRE (hub) ===================== */
export function MatchCentre() {
  const [tab, setTab] = useState('results');
  const [mdFilter, setMdFilter] = useState('all');
  const live = FIXTURES.filter((f) => f.status === 'live');
  const allResults = FIXTURES.filter((f) => f.status === 'final').slice().reverse();
  const allFixtures = FIXTURES.filter((f) => f.status === 'scheduled');
  const rounds = [...new Set(FIXTURES.map((f) => f.round))].sort((a, b) => a - b);

  const filterByMd = (list) => mdFilter === 'all' ? list : list.filter((f) => f.round === Number(mdFilter));

  const results = filterByMd(allResults);
  const fixtures = filterByMd(allFixtures);

  return (
    <div className="page">
      <div className="row spread" style={{ marginBottom: 4 }}>
        <h1 className="display" style={{ margin: 0 }}>Match Centre</h1>
        {live.length > 0 && <span className="chip" style={{ color: 'var(--live)', borderColor: 'var(--live)', animation: 'tvpulse 2s infinite' }}>● {live.length} Live</span>}
      </div>

      {/* Tabs */}
      <div className="tabbar mt">
        {live.length > 0 && <button className={tab === 'live' ? 'on' : ''} onClick={() => setTab('live')}>● Live</button>}
        <button className={tab === 'results' ? 'on' : ''} onClick={() => setTab('results')}>Results</button>
        <button className={tab === 'fixtures' ? 'on' : ''} onClick={() => setTab('fixtures')}>Fixtures</button>
      </div>

      {/* Match Day filter */}
      {(tab === 'results' || tab === 'fixtures') && (
        <div className="row" style={{ gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          <button className={`chip ${mdFilter === 'all' ? 'on' : ''}`} style={{ cursor: 'pointer', fontWeight: mdFilter === 'all' ? 700 : 400 }} onClick={() => setMdFilter('all')}>All</button>
          {rounds.map((r) => (
            <button key={r} className={`chip ${mdFilter === String(r) ? 'on' : ''}`} style={{ cursor: 'pointer', fontWeight: mdFilter === String(r) ? 700 : 400 }} onClick={() => setMdFilter(String(r))}>MD{r}</button>
          ))}
        </div>
      )}

      <div className="mt">
        {tab === 'live' && (
          <div className="grid cols-2">
            {live.length === 0
              ? <p className="muted">No matches live right now.</p>
              : live.map((f) => <LiveScoreCard key={f.id} fixture={f} />)}
          </div>
        )}

        {tab === 'results' && (
          <>
            {results.length === 0
              ? <p className="muted">No results for this match day.</p>
              : rounds.filter((r) => mdFilter === 'all' || r === Number(mdFilter)).map((r) => {
                  const mdResults = results.filter((f) => f.round === r);
                  if (mdResults.length === 0) return null;
                  return (
                    <div key={r} style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span className="eyebrow" style={{ fontSize: 11 }}>Match Day {r}</span>
                        <span className="muted" style={{ fontSize: 11 }}>{new Date(mdResults[0].start).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      </div>
                      <div className="grid cols-2">
                        {mdResults.map((f) => <ResultCard key={f.id} fixture={f} />)}
                      </div>
                    </div>
                  );
                })
            }
          </>
        )}

        {tab === 'fixtures' && (
          <>
            {fixtures.length === 0
              ? <div className="card" style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>No upcoming fixtures scheduled.</div>
              : rounds.filter((r) => mdFilter === 'all' || r === Number(mdFilter)).map((r) => {
                  const mdFixtures = fixtures.filter((f) => f.round === r);
                  if (mdFixtures.length === 0) return null;
                  return (
                    <div key={r} style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span className="eyebrow" style={{ fontSize: 11 }}>Match Day {r}</span>
                        <span className="muted" style={{ fontSize: 11 }}>{new Date(mdFixtures[0].start).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {mdFixtures.map((f) => <FixtureRow key={f.id} fixture={f} />)}
                      </div>
                    </div>
                  );
                })
            }
          </>
        )}
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
  const ranked = [...LEGACY_STANDINGS].sort((a, b) => b.points - a.points);
  return (
    <div className="page">
      <h1 className="display">Log Tables</h1>
      <p className="muted" style={{ fontSize: 13 }}>Rubber win = 3 pts · draw = 1 pt · bonus point for a 4-0 win. Franchise log counts every rubber; P1–P3 logs track each court tier.</p>
      <div className="tabbar mt">
        <button className={league === 'mens' ? 'on' : ''} onClick={() => { setLeague('mens'); setTier('franchise'); }}>Men's</button>
        <button className={league === 'ladies' ? 'on' : ''} onClick={() => { setLeague('ladies'); setTier('franchise'); }}>Ladies</button>
        <button className={league === 'legacy' ? 'on' : ''} onClick={() => setLeague('legacy')}>LP Legacy</button>
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
      {league !== 'legacy' && <div className="mt"><StandingsTable league={league} tier={tier} /></div>}
      {league === 'mens' && tier === 'franchise' && <p className="muted mt" style={{ fontSize: 12 }}>Top 4 qualify for Finals Night.</p>}
      {league === 'legacy' && (
        <div className="grid mt">
          {ranked.length === 0 ? (
            <div className="card"><p className="muted" style={{ margin: 0 }}>Standings go live once the first match is played.</p></div>
          ) : ranked.map((row, i) => {
            const fr = legacyFranchiseById(row.franchise_id);
            if (!fr) return null;
            return (
              <Link key={fr.id} to={`/legacy-franchise/${fr.id}`} className="card row spread" style={{ borderLeft: `3px solid ${fr.primary}`, paddingLeft: 14 }}>
                <span className="row" style={{ gap: 10 }}>
                  <b className="num muted" style={{ width: 22 }}>{i + 1}</b>
                  <img src={fr.logo} alt="" style={{ width: 28, height: 28, objectFit: 'contain', mixBlendMode: 'screen' }} />
                  <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>{fr.name}</b>
                </span>
                <span className="muted" style={{ fontSize: 13 }}>{row.played ? `${row.won}W–${row.lost}L` : '—'} · <b style={{ color: 'var(--text)' }}>{row.points} pts</b></span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ========================== PLAYERS =========================== */
export function Players() {
  const [league, setLeague] = useState('mens');
  const [q, setQ] = useState('');
  const [fFilter, setFFilter] = useState('all');
  const list = useMemo(() => PLAYERS
    .filter((p) => p.league === 'mens' && (fFilter === 'all' || p.franchise_id === fFilter) && p.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.lp_rating - a.lp_rating), [q, fFilter]);
  const legacyList = useMemo(() => LEGACY_PLAYERS
    .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name)), [q]);
  const mensFranchises = FRANCHISES.filter((f) => f.league === 'mens');
  return (
    <div className="page">
      <h1 className="display">Players</h1>
      <div className="tabbar mt">
        <button className={league === 'mens' ? 'on' : ''} onClick={() => { setLeague('mens'); setFFilter('all'); }}>Men's</button>
        <button className={league === 'ladies' ? 'on' : ''} onClick={() => setLeague('ladies')}>Ladies</button>
        <button className={league === 'legacy' ? 'on' : ''} onClick={() => { setLeague('legacy'); setFFilter('all'); }}>LP Legacy</button>
      </div>
      <input
        value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search players"
        style={{ width: '100%', marginTop: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', font: 'inherit' }}
      />
      {/* franchise filter — mens only */}
      {league === 'mens' && (
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
      )}
      {/* legacy franchise filter */}
      {league === 'legacy' && (
        <div className="row mt" style={{ gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="muted" style={{ fontSize: 11 }}>Franchise</span>
          <button className={`chip ${fFilter === 'all' ? 'on' : ''}`} onClick={() => setFFilter('all')} style={{ cursor: 'pointer', border: 'none' }}>All</button>
          {LEGACY_FRANCHISES.map((fr) => (
            <button key={fr.id} className={`chip ${fFilter === fr.id ? 'on' : ''}`} onClick={() => setFFilter(fr.id)}
              style={{ cursor: 'pointer', border: 'none', borderLeft: `3px solid ${fr.primary}` }}>
              {fr.short || fr.name}
            </button>
          ))}
        </div>
      )}
      {league === 'ladies' && <div className="mt"><ComingSoon note="Ladies League player profiles go live with the Season 3 launch." /></div>}
      {league === 'mens' && (
        <>
          <p className="muted mt" style={{ fontSize: 12 }}>{list.length} player{list.length === 1 ? '' : 's'}</p>
          <div className="grid cols-3 mt">
            {list.map((p) => {
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
        </>
      )}
      {league === 'legacy' && (() => {
        const filtered = fFilter === 'all' ? legacyList : legacyList.filter((p) => p.franchise_id === fFilter);
        return (
          <>
            <p className="muted mt" style={{ fontSize: 12 }}>{filtered.length} player{filtered.length === 1 ? '' : 's'}</p>
            <div className="grid cols-3 mt">
              {filtered.map((p) => {
                const fr = legacyFranchiseById(p.franchise_id);
                if (!fr) return null;
                return (
                  <Link key={p.id} to={`/legacy-franchise/${p.franchise_id}`} className="card row spread" style={{ borderLeft: `3px solid ${fr.primary}`, paddingLeft: 14 }}>
                    <div className="row">
                      <span className="avatar" style={{ background: fr.primary + '33', color: fr.primary }}>{p.name.split(' ').map((w) => w[0]).join('')}</span>
                      <div>
                        <b style={{ fontSize: 14 }}>{p.name}</b>
                        <div className="muted" style={{ fontSize: 11 }}>{fr.name} · <span style={{ color: 'var(--gold)' }}>{p.kind === 'youth' ? 'Youth' : 'Adult'}</span></div>
                      </div>
                    </div>
                    
                  </Link>
                );
              })}
            </div>
          </>
        );
      })()}
    </div>
  );
}


/* ======================= PLAYER PROFILE ======================== */
export function PlayerProfile() {
  const { id } = useParams();
  const p = playerById(id);
  if (!p) return <div className="page"><p className="muted">Player not found.</p><Link to="/players" className="btn ghost mt">← All Players</Link></div>;
  const fr = franchiseById(p.franchise_id);
  const t = tier(p.lp_rating);
  const wpct = winPct(p.stats);
  const partner = bestPartner(p.id);

  // Form guide — last 6 rubbers this player was involved in
  const playerRubbers = FIXTURES
    .filter((f) => f.status === 'final' && f.score?.rubbers)
    .flatMap((f) => f.score.rubbers
      .filter((r) => r.homeIds?.includes(p.id) || r.awayIds?.includes(p.id))
      .map((r) => {
        const isHome = r.homeIds?.includes(p.id);
        return { result: r.winner === (isHome ? 'home' : 'away') ? 'W' : 'L', fixture: f };
      })
    ).slice(-6).reverse();

  // All-time stats summary
  const setWinPct = p.stats.sets_won + p.stats.sets_lost > 0
    ? Math.round((p.stats.sets_won / (p.stats.sets_won + p.stats.sets_lost)) * 100)
    : 0;

  // Matches played
  const matchesPlayed = FIXTURES.filter((f) => f.status === 'final' && f.score?.rubbers &&
    f.score.rubbers.some((r) => r.homeIds?.includes(p.id) || r.awayIds?.includes(p.id)));

  return (
    <div className="page">
      {/* ── HERO ── */}
      <div style={{ borderLeft: `4px solid var(--fr-${fr.id})`, paddingLeft: 16, marginBottom: 20 }}>
        <Link to={`/franchise/${fr.id}`} className="muted" style={{ fontSize: 12 }}>← {fr.name}</Link>
        <div className="row" style={{ gap: 16, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="avatar" style={{ width: 72, height: 72, fontSize: 26, background: `var(--fr-${fr.id})22`, border: `2px solid var(--fr-${fr.id})` }}>
            {p.name.split(' ').map((w) => w[0]).join('')}
          </span>
          <div>
            <div className="row" style={{ gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
              <span className="chip" style={{ fontSize: 10 }}>{p.tier}</span>
              {p.role === 'captain' && <span className="chip" style={{ color: 'var(--gold)', borderColor: 'var(--gold)', fontSize: 10 }}>© Captain</span>}
              <span className="chip" style={{ color: t.color, fontSize: 10 }}>{t.label}</span>
            </div>
            <h1 className="display" style={{ margin: '2px 0 6px', fontSize: 'clamp(20px,5vw,28px)' }}>{p.name}</h1>
            <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--display)', fontSize: 22, color: 'var(--gold)' }}>LP {p.lp_rating}</span>
              <span className="muted" style={{ fontSize: 13 }}>{p.stats.wins}W – {p.stats.losses}L</span>
              <span style={{ color: 'var(--gold)', fontSize: 13 }}>★ {p.stats.mvp_points} MVP</span>
            </div>
          </div>
        </div>
        <a className="wa-share" target="_blank" rel="noreferrer"
          href={`https://wa.me/?text=${encodeURIComponent(`${p.name} — LP ${p.lp_rating} · ${p.stats.wins}W-${p.stats.losses}L · ★${p.stats.mvp_points} MVP pts | lowveldpadel.co.za`)}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, background: '#25D366', color: '#06270f', fontWeight: 700, fontSize: 12, padding: '6px 14px', borderRadius: 999, textDecoration: 'none' }}>
          ✆ Share to WhatsApp
        </a>
      </div>

      {/* ── STAT BAR ── */}
      <div className="kpis" style={{ marginBottom: 16 }}>
        <div className="kpi"><div className="v">{p.stats.played}</div><div className="l">Matches</div></div>
        <div className="kpi"><div className="v" style={{ color: wpct >= 60 ? 'var(--win)' : 'var(--text)' }}>{wpct}%</div><div className="l">Win rate</div></div>
        <div className="kpi"><div className="v">{p.stats.rubbers_won}</div><div className="l">Rubbers</div></div>
        <div className="kpi"><div className="v" style={{ color: 'var(--gold)' }}>{p.stats.bonus_points}</div><div className="l">Bonus pts</div></div>
      </div>

      {/* ── RECENT FORM ── */}
      {playerRubbers.length > 0 && (
        <div className="card" style={{ marginBottom: 12 }}>
          <p className="eyebrow" style={{ marginBottom: 10 }}>Recent Form</p>
          <div className="row" style={{ gap: 6 }}>
            {playerRubbers.map((r, i) => (
              <Link key={i} to={`/match/${r.fixture.id}`}
                style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, textDecoration: 'none',
                  background: r.result === 'W' ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)',
                  border: `1px solid ${r.result === 'W' ? 'var(--win)' : 'var(--loss)'}`,
                  color: r.result === 'W' ? 'var(--win)' : 'var(--loss)' }}>
                {r.result}
              </Link>
            ))}
            <span className="muted" style={{ fontSize: 11, alignSelf: 'center', marginLeft: 4 }}>← most recent</span>
          </div>
        </div>
      )}

      {/* ── STATS GRID ── */}
      <div className="grid cols-2" style={{ gap: 10, marginBottom: 12 }}>
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Season Stats</p>
          {[
            ['Matches played', p.stats.played],
            ['Rubbers won', p.stats.rubbers_won],
            ['Sets won', p.stats.sets_won],
            ['Games won', p.stats.games_won],
            ['Bonus points', p.stats.bonus_points],
            ['MVP points', p.stats.mvp_points],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--line)', fontSize: 13 }}>
              <span className="muted">{label}</span>
              <b>{val}</b>
            </div>
          ))}
        </div>
        <div className="card">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Performance</p>
          {[
            ['Win rate', `${wpct}%`, wpct, 100],
            ['Set win rate', `${setWinPct}%`, setWinPct, 100],
            ['LP Rating', p.lp_rating, p.lp_rating - 1200, 400],
          ].map(([label, display, val, max]) => (
            <div key={label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span className="muted">{label}</span>
                <b style={{ color: 'var(--gold)' }}>{display}</b>
              </div>
              <div style={{ height: 4, background: 'var(--line)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, (val / max) * 100))}%`, background: 'var(--gold)', borderRadius: 2, transition: 'width .4s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BEST PARTNERSHIP ── */}
      {partner && (
        <Link to={`/player/${partner.player.id}`} className="card stripe" style={{ '--stripe': stripeVar(fr.id), display: 'block', marginBottom: 12 }}>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Best Partnership</p>
          <div className="row spread">
            <div className="row" style={{ gap: 10 }}>
              <span className="avatar" style={{ width: 36, height: 36, fontSize: 12 }}>{partner.player.name.split(' ').map((w) => w[0]).join('')}</span>
              <div>
                <b style={{ fontSize: 14 }}>{partner.player.name}</b>
                <div className="muted" style={{ fontSize: 12 }}>{franchiseById(partner.player.franchise_id).name}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <b style={{ color: 'var(--win)', fontSize: 16 }}>{partner.won}/{partner.played}</b>
              <div className="muted" style={{ fontSize: 11 }}>{Math.round(partner.pct * 100)}% win rate</div>
            </div>
          </div>
        </Link>
      )}

      {/* ── FRANCHISE ── */}
      <div className="card" style={{ marginBottom: 12 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Franchise</p>
        <Link to={`/franchise/${fr.id}`} className="row" style={{ gap: 12 }}>
          <img src={fr.logo} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
          <div>
            <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16 }}>{fr.name}</b>
            <div className="muted" style={{ fontSize: 12 }}>Owner: {fr.owner}</div>
            <div className="muted" style={{ fontSize: 12 }}>Venue: {fr.venue}</div>
          </div>
        </Link>
      </div>

      {/* ── MATCH HISTORY ── */}
      {matchesPlayed.length > 0 && (
        <div>
          <SectionHead title="Match History" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {matchesPlayed.slice(0, 5).map((f) => <ResultCard key={f.id} fixture={f} />)}
          </div>
          {matchesPlayed.length > 5 && (
            <Link to="/live" className="btn ghost" style={{ marginTop: 10, display: 'block', textAlign: 'center' }}>View all results →</Link>
          )}
        </div>
      )}
    </div>
  );
}

/* ========================= FRANCHISES ========================== */
export function Franchises() {
  const [league, setLeague] = useState('mens');
  const list = league === 'ladies' ? [] : league === 'mens' ? STANDINGS.mens.franchise : [];
  return (
    <div className="page">
      <h1 className="display">Franchises</h1>
      <div className="tabbar mt">
        <button className={league === 'mens' ? 'on' : ''} onClick={() => setLeague('mens')}>Men's</button>
        <button className={league === 'ladies' ? 'on' : ''} onClick={() => setLeague('ladies')}>Ladies</button>
        <button className={league === 'legacy' ? 'on' : ''} onClick={() => setLeague('legacy')}>LP Legacy</button>
      </div>
      {league === 'ladies' && (
        <div className="grid cols-2 mt">
          {FRANCHISES.filter((f) => f.league === 'ladies').map((fr) => (
            <div key={fr.id} className="card row spread">
              <div className="row">
                <img src={fr.logo} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} />
                <div>
                  <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 17 }}>{fr.name}</b>
                  <div className="muted" style={{ fontSize: 12 }}>Ladies League · Season 2</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {league === 'mens' && (
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
      )}
      {league === 'legacy' && (
        <div className="grid cols-2 mt">
          {LEGACY_FRANCHISES.map((fr) => {
            const row = LEGACY_STANDINGS.find((r) => r.franchise_id === fr.id);
            return (
              <Link key={fr.id} to={`/legacy-franchise/${fr.id}`} className="card row spread" style={{ borderLeft: `3px solid ${fr.primary}`, paddingLeft: 14 }}>
                <div className="row">
                  <img src={fr.logo} alt="" style={{ width: 44, height: 44, objectFit: 'contain', mixBlendMode: 'screen' }} />
                  <div>
                    <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 17 }}>{fr.name}</b>
                    <div className="muted" style={{ fontSize: 12, fontStyle: 'italic' }}>{fr.motto}</div>
                    {row && row.played > 0 && (
                      <div className="muted" style={{ fontSize: 12 }}>P{row.played} · W{row.won} · {row.points} pts</div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ======================== FRANCHISE HUB ======================== */
export function FranchiseHub() {
  const { id } = useParams();
  const fr = franchiseById(id);
  const [tab, setTab] = useState('squad');
  const squad = PLAYERS.filter((p) => p.franchise_id === id).sort((a, b) => a.tier.localeCompare(b.tier) || b.lp_rating - a.lp_rating);
  const captain = squad.find((p) => p.role === 'captain');
  const row = STANDINGS[fr.league]?.franchise?.find((r) => r.franchise_id === id);
  const pos = (STANDINGS[fr.league]?.franchise?.findIndex((r) => r.franchise_id === id) ?? -1) + 1;
  const fixtures = FIXTURES.filter((f) => (f.home === id || f.away === id));
  const results = fixtures.filter((f) => f.status === 'final').slice().reverse();
  const upcoming = fixtures.filter((f) => f.status === 'scheduled');
  const form = teamForm(id, 6);

  const topPlayers = [...squad].filter((p) => p.stats.played > 0).sort((a, b) => b.stats.mvp_points - a.stats.mvp_points).slice(0, 3);

  return (
    <div className="page">
      {/* ── HERO ── */}
      <div style={{ borderLeft: `4px solid var(--fr-${id})`, paddingLeft: 16, paddingBottom: 4, marginBottom: 16 }}>
        <div className="row" style={{ gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <img src={fr.logo} alt="" style={{ width: 80, height: 80, objectFit: 'contain' }} />
          <div style={{ flex: 1 }}>
            <span className="eyebrow">{fr.league === 'mens' ? "Men's" : 'Ladies'} Franchise League · {fr.venue}</span>
            <h1 className="display" style={{ margin: '4px 0 6px', fontSize: 'clamp(20px,5vw,30px)' }}>{fr.name}</h1>
            {fr.owner && fr.owner !== 'Franchise Owner' && (
              <p className="muted" style={{ margin: '0 0 8px', fontSize: 13 }}>
                Owner: <b style={{ color: 'var(--text)' }}>{fr.owner}</b>
                {fr.ownerBrand && <span> · {fr.ownerBrand}</span>}
              </p>
            )}
            {row && (
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                <span className="chip" style={{ color: pos <= 4 ? 'var(--win)' : 'var(--muted)' }}>#{pos} {pos <= 4 ? '· Finals spot' : ''}</span>
                <span className="chip">{row.played}P · {row.won}W · {row.lost}L</span>
                <span className="chip" style={{ color: 'var(--gold)' }}>{row.points} pts</span>
                {row.bp > 0 && <span className="chip">{row.bp} bonus pts</span>}
              </div>
            )}
          </div>
        </div>

        {/* Form guide */}
        {form.length > 0 && (
          <div className="row" style={{ gap: 5, marginTop: 12 }}>
            <span className="muted" style={{ fontSize: 11, marginRight: 4 }}>Form:</span>
            {form.map((r, i) => (
              <span key={i} style={{ width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12,
                background: r === 'W' ? 'rgba(34,197,94,.15)' : r === 'L' ? 'rgba(239,68,68,.15)' : 'rgba(199,154,62,.15)',
                border: `1px solid ${r === 'W' ? 'var(--win)' : r === 'L' ? 'var(--loss)' : 'var(--gold)'}`,
                color: r === 'W' ? 'var(--win)' : r === 'L' ? 'var(--loss)' : 'var(--gold)' }}>
                {r}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── QUICK STATS ── */}
      {row && (
        <div className="kpis" style={{ marginBottom: 16 }}>
          <div className="kpi"><div className="v" style={{ color: 'var(--gold)' }}>{row.points}</div><div className="l">Points</div></div>
          <div className="kpi"><div className="v" style={{ color: 'var(--win)' }}>{row.won}</div><div className="l">Wins</div></div>
          <div className="kpi"><div className="v" style={{ color: 'var(--loss)' }}>{row.lost}</div><div className="l">Losses</div></div>
          <div className="kpi"><div className="v">{row.bp}</div><div className="l">Bonus pts</div></div>
        </div>
      )}

      {/* ── TABS ── */}
      <div className="tabbar" style={{ marginBottom: 16 }}>
        {[['squad','Squad'],['results','Results'],['fixtures','Fixtures']].map(([k,lbl]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{lbl}</button>
        ))}
      </div>

      {/* ── SQUAD ── */}
      {tab === 'squad' && (
        <>
          {captain && (
            <Link to={`/player/${captain.id}`} className="card stripe" style={{ '--stripe': stripeVar(id), display: 'block', marginBottom: 12 }}>
              <span className="eyebrow">Captain</span>
              <div className="row" style={{ gap: 12, marginTop: 6 }}>
                <span className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>{captain.name.split(' ').map((w) => w[0]).join('')}</span>
                <div>
                  <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16 }}>{captain.name}</b>
                  <div className="muted" style={{ fontSize: 12 }}>{captain.tier} · LP {captain.lp_rating}</div>
                </div>
              </div>
            </Link>
          )}

          {['P1','P2','P3'].map((tier) => {
            const tierPlayers = squad.filter((p) => p.tier === tier);
            if (tierPlayers.length === 0) return null;
            return (
              <div key={tier} style={{ marginBottom: 16 }}>
                <p className="eyebrow" style={{ marginBottom: 8 }}>{tier} · {['Padel 24','Play 360','Play 360'][['P1','P2','P3'].indexOf(tier)]}</p>
                <div className="grid cols-2">
                  {tierPlayers.map((p) => (
                    <Link key={p.id} to={`/player/${p.id}`} className="card row spread" style={{ padding: 12, gap: 10 }}>
                      <div className="row" style={{ gap: 8 }}>
                        <span className="avatar" style={{ width: 32, height: 32, fontSize: 11 }}>{p.name.split(' ').map((w) => w[0]).join('')}</span>
                        <div>
                          <b style={{ fontSize: 13, display: 'block' }}>{p.name}</b>
                          <span className="muted" style={{ fontSize: 11 }}>
                            {p.stats.played > 0 ? `${p.stats.wins}W-${p.stats.losses}L · ★${p.stats.mvp_points}` : 'No matches yet'}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <b style={{ color: 'var(--gold)', fontSize: 14 }}>{p.lp_rating}</b>
                        <div className="muted" style={{ fontSize: 10 }}>LP Rating</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {topPlayers.length > 0 && (
            <div className="card" style={{ marginTop: 8 }}>
              <p className="eyebrow" style={{ marginBottom: 10 }}>Top Performers</p>
              {topPlayers.map((p, i) => (
                <Link key={p.id} to={`/player/${p.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < topPlayers.length - 1 ? '1px solid var(--line)' : 'none', textDecoration: 'none' }}>
                  <span className="row" style={{ gap: 8 }}>
                    <b className="muted" style={{ width: 16, fontSize: 12 }}>{i + 1}</b>
                    <span style={{ fontSize: 13 }}>{p.name}</span>
                    <span className="muted" style={{ fontSize: 11 }}>{p.tier}</span>
                  </span>
                  <span style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 700 }}>★ {p.stats.mvp_points}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── RESULTS ── */}
      {tab === 'results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {results.length === 0
            ? <p className="muted">No results yet.</p>
            : results.map((f) => <ResultCard key={f.id} fixture={f} />)}
        </div>
      )}

      {/* ── FIXTURES ── */}
      {tab === 'fixtures' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {upcoming.length === 0
            ? <p className="muted">No upcoming fixtures.</p>
            : upcoming.map((f) => <FixtureRow key={f.id} fixture={f} />)}
        </div>
      )}
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
  const legacyPowerRanked = [...LEGACY_STANDINGS].sort((a, b) => b.points - a.points).map((r) => r.franchise_id);

  return (
    <div className="page">
      <h1 className="display">Rankings</h1>
      <div className="tabbar mt">
        <button className={tab === 'players' ? 'on' : ''} onClick={() => setTab('players')}>Players</button>
        <button className={tab === 'power' ? 'on' : ''} onClick={() => setTab('power')}>Power Rankings</button>
      </div>

      {tab === 'players' && (
        <>
          <div className="tabbar mt">
            <button className={pLeague === 'mens' ? 'on' : ''} onClick={() => setPLeague('mens')}>Men's</button>
            <button className={pLeague === 'ladies' ? 'on' : ''} onClick={() => setPLeague('ladies')}>Ladies</button>
            <button className={pLeague === 'legacy' ? 'on' : ''} onClick={() => setPLeague('legacy')}>LP Legacy</button>
          </div>
          {pLeague === 'ladies' && <div className="mt"><ComingSoon note="Ladies player rankings go live with the Season 3 launch." /></div>}
          {pLeague === 'legacy' && (
            <div className="grid mt">
              {LEGACY_PLAYERS.sort((a, b) => a.name.localeCompare(b.name)).map((p, i) => {
                const fr = legacyFranchiseById(p.franchise_id);
                if (!fr) return null;
                return (
                  <Link key={p.id} to={`/legacy-franchise/${p.franchise_id}`} className="card row spread" style={{ borderLeft: `3px solid ${fr.primary}`, paddingLeft: 14 }}>
                    <span className="row">
                      <b className="num muted" style={{ width: 26 }}>{i + 1}</b>
                      <span className="avatar" style={{ width: 34, height: 34, fontSize: 12, background: fr.primary + '33', color: fr.primary }}>{p.name.split(' ').map((w) => w[0]).join('')}</span>
                      <span>
                        <b style={{ fontSize: 14 }}>{p.name}</b>
                        <div className="muted" style={{ fontSize: 11 }}>{fr.name} · <span style={{ color: 'var(--gold)' }}>{p.kind === 'youth' ? 'Youth' : 'Adult'}</span></div>
                      </span>
                    </span>
                    
                  </Link>
                );
              })}
            </div>
          )}
          {pLeague === 'mens' && (
          <>
          <div className="tabbar mt">
            {[['lp', 'LP Rating'], ['win', 'Win %'], ['wins', 'Wins'], ['mvp', 'MVP']].map(([k, lbl]) => (
              <button key={k} className={sortBy === k ? 'on' : ''} onClick={() => setSortBy(k)}>{lbl}</button>
            ))}
          </div>
          <div className="row mt" style={{ gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="muted" style={{ fontSize: 11 }}>Court</span>
            {['all', 'P1', 'P2', 'P3'].map((c) => (
              <button key={c} className={`chip ${courtFilter === c ? 'on' : ''}`} onClick={() => setCourtFilter(c)} style={{ cursor: 'pointer', border: 'none' }}>{c === 'all' ? 'All' : c}</button>
            ))}
          </div>
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
            <button className={league === 'legacy' ? 'on' : ''} onClick={() => setLeague('legacy')}>LP Legacy</button>
          </div>
          <p className="muted mt" style={{ fontSize: 13 }}>The committee's weekly board — results, strength of schedule and momentum, not just the table.</p>
          {league === 'ladies' && <div className="mt"><ComingSoon note="The ladies power rankings begin once Season 3 is underway." /></div>}
          {league === 'legacy' && (
            <div className="grid mt">
              {legacyPowerRanked.length === 0 ? (
                <div className="card"><p className="muted" style={{ margin: 0 }}>Power rankings go live once matches are played.</p></div>
              ) : legacyPowerRanked.map((fid, i) => {
                const fr = legacyFranchiseById(fid);
                if (!fr) return null;
                return (
                  <Link key={fid} to={`/legacy-franchise/${fid}`} className="card row spread" style={{ borderLeft: `3px solid ${fr.primary}`, paddingLeft: 14 }}>
                    <span className="row">
                      <b className="num" style={{ fontSize: 22, width: 30 }}>{i + 1}</b>
                      <img src={fr.logo} alt="" style={{ width: 30, height: 30, objectFit: 'contain', mixBlendMode: 'screen' }} />
                      <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16 }}>{fr.name}</b>
                    </span>
                    <span className="muted">▬</span>
                  </Link>
                );
              })}
            </div>
          )}
          {(league === 'mens') && (
            <div className="grid mt">
              {POWER_RANKINGS[league].map((fid, i) => {
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
          )}
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
    ['360 Super Cup', '/360-super-cup'], ['Legacy League', '/legacy-league'], ['Predictor', '/predictor'], ['Lowveld TV', '/tv'],
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

export function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontFamily: 'var(--display)', fontSize: 72, color: 'var(--gold)', lineHeight: 1, opacity: .4 }}>404</div>
      <h1 className="display" style={{ margin: '12px 0 8px', fontSize: 24 }}>Page Not Found</h1>
      <p className="muted" style={{ marginBottom: 24, maxWidth: 300, margin: '8px auto 24px' }}>This page doesn't exist or may have moved.</p>
      <Link to="/" className="btn gold">← Back to Home</Link>
    </div>
  );
}
