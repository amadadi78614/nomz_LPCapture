import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  STANDINGS, FIXTURES, FRANCHISES, PLAYERS,
  franchiseById, stripeVar, winPct, TIER_SPONSORS,
  LEGACY_FRANCHISES, LEGACY_STANDINGS, legacyFranchiseById,
  POWER_RANKINGS,
} from '../data/seed';
import { StandingsTable, ComingSoon, SectionHead, SponsorRail } from '../components/ui';
import { tier } from '../lib/lpRating';

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
