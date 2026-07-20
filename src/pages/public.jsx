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
  const live = FIXTURES.filter((f) => f.status === 'live');
  const results = FIXTURES.filter((f) => f.status === 'final').slice(-3).reverse();
  const upcoming = FIXTURES.filter((f) => f.status === 'scheduled').slice(0, 3);
  const mvp = mvpLeader('mens');
  const sFr = STANDINGS.mens.franchise;
  const leader = sFr[0];
  const power = POWER_RANKINGS_WEEKLY.mens.slice(0, 5);
  const rotw = RIVALRIES.find((r) => headToHead(r.a, r.b).played > 0) || RIVALRIES[0];
  const rA = franchiseById(rotw.a); const rB = franchiseById(rotw.b); const rH = headToHead(rotw.a, rotw.b);
  const motw = matchOfTheWeek();
  const potwId = playerOfWeek.current;
  const potw = potwId ? playerById(potwId) : null;
  const topRated = [...PLAYERS].filter((p) => p.stats.played > 0).sort((a, b) => b.lp_rating - a.lp_rating)[0];

  return (
    <div className="page">
      <HomeStyles />

      {/* ── 1. HERO ── */}
      <div className="home-hero">
        <span className="eyebrow" style={{ color: 'var(--live)', fontSize: 11 }}>Season 3 · Short break · MD7 coming Tuesday · Legacy League launched! 🔥</span>
        <h1 className="display" style={{ fontSize: 'clamp(22px,5vw,32px)', margin: '6px 0 4px', lineHeight: 1.1 }}>
          Legacy League is LIVE. Season 3 title race on a knife edge. Ladies — last few spots remaining!
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', margin: '0 0 4px' }}>
          Legacy League launched in spectacular fashion 🏆 · Ladies registration closes soon ·{' '}
          <Link to="/unity-cup" style={{ color: 'var(--gold)', fontWeight: 700, fontStyle: 'normal' }}>Unity Cup update</Link>
        </p>
        <div className="home-hero-stats">
          <div className="home-hero-stat"><span className="num" style={{ color: 'var(--gold)' }}>{leader.points}</span><span className="muted">pts lead</span></div>
          <div className="home-hero-stat-div" />
          <div className="home-hero-stat"><span className="num" style={{ color: 'var(--win)' }}>{mvp ? mvp.stats.mvp_points : '—'}</span><span className="muted">MVP pts</span></div>
          <div className="home-hero-stat-div" />
          <div className="home-hero-stat"><span className="num" style={{ color: 'var(--court)' }}>7</span><span className="muted">of 9 MDs</span></div>
        </div>
        <div className="row mt" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Link to="/live" className="btn live" style={{ fontSize: 13 }}>● Match Centre</Link>
          <Link to="/leagues" className="btn ghost" style={{ fontSize: 13 }}>Leagues</Link>
          <Link to="/register" className="btn ghost" style={{ fontSize: 13, borderColor: '#db2777', color: '#db2777' }}>Ladies Register</Link>
        </div>
      </div>

      {/* ── 2. LIVE / LATEST RESULT / NEXT FIXTURE ── */}
      <div className="home-section">
        {live.length > 0 ? (
          <>
            <SectionHead title="Live now" to="/live" cta="Match Centre" />
            <div className="grid cols-2">{live.map((f) => <LiveScoreCard key={f.id} fixture={f} />)}</div>
          </>
        ) : (
          <>
            <SectionHead title="Match Centre" to="/live" cta="All results →" />
            <div className="home-match-grid">
              {/* Latest results */}
              <div>
                <p className="eyebrow" style={{ marginBottom: 8 }}>Latest Results</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {results.slice(0, 2).map((f) => <ResultCard key={f.id} fixture={f} />)}
                </div>
              </div>
              {/* Next fixtures */}
              <div>
                <p className="eyebrow" style={{ marginBottom: 8 }}>Next Fixtures</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {upcoming.slice(0, 2).map((f) => <FixtureRow key={f.id} fixture={f} />)}
                  {upcoming.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)', fontSize: 13 }}>
                      Schedule to be announced
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── 3. LEAGUE TABLE (top 4 only) ── */}
      <div className="home-section">
        <SectionHead title="League Table" to="/leagues" cta="Full table →" />
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th><th>Franchise</th>
                <th className="num">P</th><th className="num">W</th><th className="num">L</th>
                <th className="num">BP</th><th className="num">Pts</th>
                <th className="num" style={{ minWidth: 60 }}>Form</th>
              </tr>
            </thead>
            <tbody>
              {sFr.slice(0, 7).map((r, i) => {
                const fr = franchiseById(r.franchise_id);
                const form = teamForm(r.franchise_id, 5);
                return (
                  <tr key={r.franchise_id} style={{ borderLeft: i === 3 ? '2px solid var(--line)' : 'none' }}>
                    <td><span className={`pos-badge ${i < 4 ? 'q' : ''}`}>{i + 1}</span></td>
                    <td>
                      <Link to={`/franchise/${fr.id}`} className="row" style={{ gap: 8 }}>
                        <img src={fr.logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                        <b style={{ fontSize: 13 }}>{fr.name}</b>
                      </Link>
                    </td>
                    <td className="num">{r.played}</td>
                    <td className="num">{r.won}</td>
                    <td className="num">{r.lost}</td>
                    <td className="num">{r.bp}</td>
                    <td className="num"><b style={{ color: 'var(--gold)' }}>{r.points}</b></td>
                    <td className="num">
                      <span className="form-row">
                        {form.map((res, fi) => (
                          <span key={fi} className={`form-dot ${res}`} title={res === 'W' ? 'Win' : res === 'L' ? 'Loss' : 'Draw'} />
                        ))}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="muted" style={{ padding: '6px 12px', fontSize: 11, borderTop: '1px solid var(--line)' }}>
            🟢 Top 4 qualify for Finals Night
          </div>
        </div>
      </div>

      {/* ── 4. MVP RACE ── */}
      {mvp && (
        <div className="home-section">
          <SectionHead title="MVP Race" to="/rankings" cta="Leaderboard →" />
          <Link to={`/player/${mvp.id}`} className="card stripe row spread" style={{ '--stripe': 'var(--gold)' }}>
            <div className="row" style={{ gap: 12 }}>
              <span className="avatar" style={{ width: 40, height: 40, fontSize: 13 }}>{mvp.name.split(' ').map((w) => w[0]).join('')}</span>
              <div>
                <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16 }}>{mvp.name}</b>
                <div className="muted" style={{ fontSize: 12 }}>{franchiseById(mvp.franchise_id).name} · {mvp.tier}</div>
                <div style={{ fontSize: 12, marginTop: 2 }}>
                  <span style={{ color: 'var(--win)' }}>{mvp.stats.wins}W</span>
                  <span className="muted"> · </span>
                  <span>{mvp.stats.rubbers_won} rubbers</span>
                  <span className="muted"> · </span>
                  <span style={{ color: 'var(--gold)' }}>{mvp.stats.bonus_points} BP</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 28, color: 'var(--gold)', lineHeight: 1 }}>★ {mvp.stats.mvp_points}</div>
              <div className="muted" style={{ fontSize: 11 }}>MVP pts</div>
            </div>
          </Link>
          {/* Top 5 quick view */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {[...PLAYERS].filter((p) => p.stats.played > 0).sort((a, b) => b.stats.mvp_points - a.stats.mvp_points).slice(1, 5).map((p, i) => (
              <Link key={p.id} to={`/player/${p.id}`} className="card row spread" style={{ padding: '8px 12px' }}>
                <span className="row" style={{ gap: 10 }}>
                  <b className="muted" style={{ width: 16, fontSize: 12 }}>{i + 2}</b>
                  <span style={{ fontSize: 13 }}>{p.name}</span>
                  <span className="muted" style={{ fontSize: 11 }}>{franchiseById(p.franchise_id).name}</span>
                </span>
                <b style={{ color: 'var(--gold)', fontSize: 13 }}>★ {p.stats.mvp_points}</b>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. POWER RANKINGS ── */}
      <div className="home-section">
        <SectionHead title="Power Rankings" to="/rankings" cta="Full board →" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {power.map((entry, i) => {
            const fr = franchiseById(entry.franchise);
            const row = sFr.find((r) => r.franchise_id === entry.franchise);
            const moveColor = entry.move === 'up' ? 'var(--win)' : entry.move === 'down' ? 'var(--loss)' : 'var(--muted)';
            const moveIcon = entry.move === 'up' ? '▲' : entry.move === 'down' ? '▼' : '▬';
            return (
              <Link key={entry.franchise} to={`/franchise/${entry.franchise}`} className="card stripe row spread" style={{ '--stripe': stripeVar(entry.franchise), padding: '10px 12px' }}>
                <span className="row" style={{ gap: 10 }}>
                  <b style={{ width: 20, fontSize: 18, fontFamily: 'var(--display)' }}>{i + 1}</b>
                  <img src={fr.logo} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                  <span>
                    <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14, display: 'block' }}>{fr.name}</b>
                    <span className="muted" style={{ fontSize: 11 }}>{entry.note}</span>
                  </span>
                </span>
                <span className="row" style={{ gap: 8 }}>
                  {row && <span className="muted" style={{ fontSize: 12 }}>{row.points} pts</span>}
                  <b style={{ color: moveColor, fontSize: 12 }}>{moveIcon}</b>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── 6. PLAYER OF THE WEEK ── */}
      {potw ? (
        <div className="home-section">
          <SectionHead title="Player of the Week" to={`/player/${potw.id}`} />
          <Link to={`/player/${potw.id}`} className="card stripe row spread" style={{ '--stripe': stripeVar(potw.franchise_id) }}>
            <div className="row" style={{ gap: 12 }}>
              <span className="avatar" style={{ width: 44, height: 44, fontSize: 14, background: stripeVar(potw.franchise_id) + '33' }}>
                {potw.name.split(' ').map((w) => w[0]).join('')}
              </span>
              <div>
                <span className="eyebrow">Player of the Week</span>
                <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 18, display: 'block' }}>{potw.name}</b>
                <div className="muted" style={{ fontSize: 12 }}>{franchiseById(potw.franchise_id).name} · {potw.tier}</div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>🏅</div>
            </div>
          </Link>
        </div>
      ) : topRated && (
        <div className="home-section">
          <SectionHead title="Top LP Rating" to="/rankings" cta="Full rankings →" />
          <Link to={`/player/${topRated.id}`} className="card stripe row spread" style={{ '--stripe': stripeVar(topRated.franchise_id) }}>
            <div className="row" style={{ gap: 12 }}>
              <span className="avatar" style={{ width: 40, height: 40, fontSize: 13 }}>{topRated.name.split(' ').map((w) => w[0]).join('')}</span>
              <div>
                <span className="eyebrow">Top LP Rating</span>
                <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16, display: 'block' }}>{topRated.name}</b>
                <div className="muted" style={{ fontSize: 12 }}>{franchiseById(topRated.franchise_id).name}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 28, color: 'var(--court)', lineHeight: 1 }}>{topRated.lp_rating}</div>
              <div className="muted" style={{ fontSize: 11 }}>LP Rating</div>
            </div>
          </Link>
        </div>
      )}

      {/* ── 7. ROAD TO 360 ── */}
      <div className="home-section">
        <Link to="/road-to-360" className="card" style={{ display: 'block', background: 'linear-gradient(135deg, rgba(199,154,62,.12), rgba(199,154,62,.03))', border: '1px solid rgba(199,154,62,.3)' }}>
          <div className="row spread">
            <div className="row" style={{ gap: 12 }}>
              <span style={{ fontSize: 28 }}>🇿🇦</span>
              <div>
                <span className="eyebrow" style={{ color: 'var(--gold)' }}>Road to 360</span>
                <b style={{ display: 'block', fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15 }}>Road to the 360 Super Cup</b>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{ROAD_TO_360.location} · {ROAD_TO_360.dates}</div>
              </div>
            </div>
            <span className="chip" style={{ color: 'var(--gold)', borderColor: 'var(--gold)' }}>Johannesburg</span>
          </div>
        </Link>
      </div>

      {/* ── 8. LP LEGACY LEAGUE ── */}
      <div className="home-section">
        <SectionHead title="LP Legacy League" to="/legacy-league" cta="Full standings →" />
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(199,154,62,.08), transparent)', border: '1px solid rgba(199,154,62,.2)', marginBottom: 8 }}>
          <div className="row spread" style={{ marginBottom: 10 }}>
            <div>
              <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15 }}>Inaugural Season · Match Day 1 Complete</b>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Phenomenal support — families packed Play 360 🔥</div>
            </div>
            <span className="chip" style={{ color: 'var(--win)', borderColor: 'var(--win)' }}>● Live</span>
          </div>
          {/* Mini standings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {LEGACY_STANDINGS.slice(0, 6).map((row, i) => {
              const fr = legacyFranchiseById(row.franchise_id);
              if (!fr) return null;
              return (
                <Link key={fr.id} to={`/legacy-franchise/${fr.id}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < 5 ? '1px solid var(--line)' : 'none', textDecoration: 'none' }}>
                  <b style={{ width: 16, fontSize: 12, color: 'var(--muted)' }}>{i + 1}</b>
                  <img src={fr.logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain', mixBlendMode: 'screen' }} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{fr.name}</span>
                  <span className="muted" style={{ fontSize: 11 }}>{row.played}P {row.won}W</span>
                  <b style={{ color: 'var(--gold)', fontSize: 13, minWidth: 24, textAlign: 'right' }}>{row.points}</b>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 9. UNITY CUP ── */}
      <div className="home-section">
        <Link to="/unity-cup" className="card" style={{ display: 'block', background: 'linear-gradient(135deg, rgba(154,168,35,.06), transparent)', border: '1px solid rgba(154,168,35,.15)' }}>
          <div className="row spread">
            <div>
              <span className="eyebrow" style={{ color: '#9aa823' }}>★ International Nations Cup</span>
              <b style={{ display: 'block', fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16, marginTop: 4 }}>Unity Cup</b>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>🇿🇦 South Africa vs 🇸🇿 Eswatini · New date to be confirmed</div>
            </div>
            <span className="chip" style={{ color: 'var(--muted)', flexShrink: 0 }}>On Hold</span>
          </div>
        </Link>
      </div>

      {/* ── 10. LADIES LEAGUE ── */}
      <div className="home-section">
        <SectionHead title="Ladies Franchise League" to="/leagues" cta="Season 2 →" />
        <Link to="/register" style={{ display: 'block', textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(219,39,119,.12), rgba(219,39,119,.02))', border: '2px solid #db2777', borderRadius: 'var(--r)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16, color: '#db2777', marginBottom: 2 }}>Season 2 — Registration Open</div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>Registration closes 18 July 2026 · Secure your spot now</div>
            </div>
            <div style={{ background: '#db2777', color: '#fff', fontWeight: 800, fontSize: 12, padding: '8px 14px', borderRadius: 8, whiteSpace: 'nowrap', flexShrink: 0 }}>Register →</div>
          </div>
        </Link>
      </div>

      {/* ── 11. MATCH OF THE WEEK / PREDICTION ── */}
      {motw && (() => {
        const a = franchiseById(motw.home); const b = franchiseById(motw.away);
        return (
          <div className="home-section">
            <SectionHead title="Match of the Week" to="/predictor" cta="Predict →" />
            <Link to="/predictor" className="card stripe" style={{ '--stripe': 'var(--live)', display: 'block' }}>
              <span className="eyebrow" style={{ color: 'var(--live)' }}>Can you predict the result?</span>
              <div className="row spread" style={{ marginTop: 12 }}>
                <div className="row" style={{ gap: 8 }}><img src={a.logo} alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} /><b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>{a.name}</b></div>
                <b className="muted" style={{ fontSize: 18 }}>v</b>
                <div className="row" style={{ gap: 8 }}><b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>{b.name}</b><img src={b.logo} alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} /></div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'var(--live)' }}>Tap to predict →</div>
            </Link>
          </div>
        );
      })()}

      {/* ── 12. LATEST NEWS ── */}
      <div className="home-section">
        <SectionHead title="Latest News" to="/news" cta="All news →" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NEWS.slice(0, 3).map((n) => (
            <Link key={n.id} to="/news" className="card row spread" style={{ gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <span className="kicker" style={{ color: n.tag === 'mens' ? 'var(--court)' : n.tag === 'ladies' ? '#db2777' : 'var(--gold)' }}>{n.kicker}</span>
                <p style={{ margin: '3px 0 0', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{n.title}</p>
                <span className="muted" style={{ fontSize: 11 }}>{new Date(n.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 13. LOWVELD TV ── */}
      {TV_VIDEOS.length > 0 && (
        <div className="home-section">
          <SectionHead title="Lowveld TV" to="/tv" cta="Watch →" />
          <div className="grid cols-3">
            {TV_VIDEOS.slice(0, 3).map((v) => {
              const thumb = v.thumbnail || ytThumb(v.youtube_url);
              return (
                <Link key={v.id} to="/tv" className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#0a0f1c' }}>
                    {thumb ? <img src={thumb} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src="/brand/lp-mark.png" alt="" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 38, opacity: .4 }} />}
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,.6)', border: '1.5px solid rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>►</span>
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <span className="kicker" style={{ color: 'var(--live)', fontSize: 10 }}>{v.category}</span>
                    <p style={{ fontSize: 12, fontWeight: 600, margin: '2px 0 0', lineHeight: 1.25 }}>{v.title}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 14. SPONSORS ── */}
      <div className="home-section">
        <SponsorRail placement="home" />
      </div>

      {/* ── 15. COMMUNITY ── */}
      <div className="home-section">
        <Link to="/community" className="card" style={{ display: 'block', borderLeft: '3px solid #25D366', paddingLeft: 16 }}>
          <div className="row spread">
            <div>
              <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>Join the Community</b>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Match-night chat, results & banter on WhatsApp</div>
            </div>
            <span style={{ fontSize: 22, color: '#25D366' }}>✆</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

function HomeStyles() {
  return (
    <style>{`
      .home-hero { padding: 4px 0 16px; }
      .home-hero-stats { display: flex; align-items: center; gap: 0; margin: 12px 0 14px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; }
      .home-hero-stat { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 10px 8px; gap: 2px; }
      .home-hero-stat .num { font-family: var(--display); font-size: 22px; line-height: 1; }
      .home-hero-stat .muted { font-size: 10px; letter-spacing: .06em; text-transform: uppercase; }
      .home-hero-stat-div { width: 1px; align-self: stretch; background: var(--line); margin: 8px 0; }
      .home-section { margin-top: 24px; }
      .home-match-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
      .form-row { display: flex; gap: 3px; justify-content: flex-end; }
      .form-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--line); }
      .form-dot.W { background: var(--win); }
      .form-dot.L { background: var(--loss); }
      .form-dot.D { background: var(--gold); }
      @media (min-width: 600px) { .home-match-grid { grid-template-columns: 1fr 1fr; } }
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
