import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  STANDINGS, FRANCHISES,
  franchiseById, stripeVar, TIER_SPONSORS,
  POWER_RANKINGS,
} from '../data/seed';
import { ComingSoon, SponsorRail } from '../components/ui';
import '../styles/leagues-standings-fix.css';

function roundsPlayed(row, tier = 'franchise') {
  const rubbersPerRound = tier === 'franchise' ? 6 : 2;
  return Math.floor((row?.played || 0) / rubbersPerRound);
}

function LeagueStandingsTable({ tier = 'franchise' }) {
  const rows = STANDINGS.mens?.[tier] || [];
  const hasAdjustment = rows.some((row) => row.adj);

  return (
    <div className="league-standings-shell">
      <table className="tbl league-standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Franchise</th>
            <th className="num" title="Completed fixture rounds">R</th>
            <th className="num" title="Rubbers played">P</th>
            <th className="num">W</th>
            <th className="num">L</th>
            <th className="num">D</th>
            <th className="num">BP</th>
            <th className="num">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const franchise = franchiseById(row.franchise_id);
            return (
              <tr key={row.franchise_id}>
                <td><span className={`pos-badge ${tier === 'franchise' && index < 4 ? 'q' : ''}`}>{index + 1}</span></td>
                <td className="league-team-cell">
                  <Link to={`/franchise/${franchise.id}`} className="row">
                    <span className="league-team-stripe" style={{ background: stripeVar(franchise.id) }} />
                    <img src={franchise.logo} alt="" />
                    <b>{franchise.name}{row.adj ? ' *' : ''}</b>
                  </Link>
                </td>
                <td className="num league-rounds"><b>{roundsPlayed(row, tier)}</b></td>
                <td className="num">{row.played}</td>
                <td className="num">{row.won}</td>
                <td className="num">{row.lost}</td>
                <td className="num">{row.drawn}</td>
                <td className="num">{row.bp}</td>
                <td className="num league-points"><b>{row.points}</b></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="league-standings-key muted">
        R = completed fixture rounds · P = rubbers played{hasAdjustment ? ' · * includes a league points adjustment' : ''}.
      </div>
    </div>
  );
}

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

function MensLeague() {
  const [season, setSeason] = useState('s3');
  const [subTab, setSubTab] = useState('standings');
  const [tier2, setTier2] = useState('franchise');

  return (
    <>
      <div className="tabbar mt league-tabs">
        {[["s1", 'Season 1'], ["s2", 'Season 2'], ["s3", 'Season 3']].map(([key, label]) => (
          <button key={key} className={season === key ? 'on' : ''} onClick={() => { setSeason(key); setSubTab('standings'); setTier2('franchise'); }}>{label}</button>
        ))}
      </div>

      {season === 's1' && <div className="mt"><PlaceholderSeason season="Season 1" league="Men's Franchise League" /></div>}
      {season === 's2' && <div className="mt"><PlaceholderSeason season="Season 2" league="Men's Franchise League" /></div>}

      {season === 's3' && (
        <>
          <div className="tabbar mt league-tabs">
            {[["standings", 'Standings'], ["franchises", 'Franchises'], ["rankings", 'Rankings']].map(([key, label]) => (
              <button key={key} className={subTab === key ? 'on' : ''} onClick={() => setSubTab(key)}>{label}</button>
            ))}
          </div>

          {subTab === 'standings' && (
            <div className="mt">
              <p className="muted league-rules">Rubber win = 3 pts · draw = 1 pt · bonus point for a 4–0 win. Rounds and rubbers are shown separately.</p>
              <div className="tabbar mt league-tabs league-tier-tabs">
                {[["franchise", 'Franchise'], ["P1", 'P1'], ["P2", 'P2'], ["P3", 'P3']].map(([value, label]) => (
                  <button key={value} className={tier2 === value ? 'on' : ''} onClick={() => setTier2(value)}>{label}</button>
                ))}
              </div>
              {tier2 !== 'franchise' && TIER_SPONSORS[tier2] && (
                <div className="row mt league-sponsor" style={{ gap: 10, alignItems: 'center' }}>
                  <img src={TIER_SPONSORS[tier2].logo} alt={TIER_SPONSORS[tier2].name} />
                  <span className="muted">{tier2} Log · presented by {TIER_SPONSORS[tier2].name}</span>
                </div>
              )}
              <div className="mt"><LeagueStandingsTable tier={tier2} /></div>
              {tier2 === 'franchise' && <p className="muted mt" style={{ fontSize: 12 }}>Top 4 qualify for Finals Night.</p>}
            </div>
          )}

          {subTab === 'franchises' && (
            <div className="grid cols-2 mt">
              {STANDINGS.mens.franchise.map((row, index) => {
                const franchise = franchiseById(row.franchise_id);
                return (
                  <Link key={franchise.id} to={`/franchise/${franchise.id}`} className="card stripe row spread" style={{ '--stripe': stripeVar(franchise.id) }}>
                    <div className="row">
                      <img src={franchise.logo} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} />
                      <div>
                        <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16 }}>{franchise.name}</b>
                        <div className="muted" style={{ fontSize: 12 }}>R{roundsPlayed(row)} · P{row.played} · W{row.won} · {row.points} pts</div>
                        <div className="muted" style={{ fontSize: 11 }}>Owner: {franchise.owner}</div>
                      </div>
                    </div>
                    <span className={`pos-badge ${index < 4 ? 'q' : ''}`} style={{ width: 30, height: 30, fontSize: 14 }}>{index + 1}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {subTab === 'rankings' && (
            <div className="mt">
              <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>Power rankings — results, strength of schedule and momentum.</p>
              <div className="grid">
                {POWER_RANKINGS.mens.map((franchiseId, index) => {
                  const franchise = franchiseById(franchiseId);
                  const row = STANDINGS.mens.franchise.find((item) => item.franchise_id === franchiseId);
                  return (
                    <Link key={franchiseId} to={`/franchise/${franchiseId}`} className="card stripe row spread" style={{ '--stripe': stripeVar(franchiseId) }}>
                      <span className="row" style={{ gap: 10 }}>
                        <b className="num" style={{ fontSize: 22, width: 30 }}>{index + 1}</b>
                        <img src={franchise.logo} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                        <span>
                          <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15 }}>{franchise.name}</b>
                          {row && <div className="muted" style={{ fontSize: 11 }}>R{roundsPlayed(row)} · {row.points} pts · {row.won}W–{row.lost}L</div>}
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

function LadiesLeague() {
  const [season, setSeason] = useState('s2');
  const ladiesFranchises = FRANCHISES.filter((franchise) => franchise.league === 'ladies');

  return (
    <>
      <div className="tabbar mt league-tabs">
        {[["s1", 'Season 1'], ["s2", 'Season 2']].map(([key, label]) => (
          <button key={key} className={season === key ? 'on' : ''} onClick={() => setSeason(key)}>{label}</button>
        ))}
      </div>

      {season === 's1' && <div className="mt"><PlaceholderSeason season="Season 1" league="Ladies Franchise League" /></div>}

      {season === 's2' && (
        <div className="mt" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ borderRadius: 'var(--r)', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.6)' }}>
            <img src="/ladies-league-s2.png" alt="Ladies Franchise League Season 2" style={{ width: '100%', display: 'block' }} />
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: 10 }}>6 Franchises · One Movement</p>
            <div className="grid cols-2">
              {ladiesFranchises.map((franchise) => (
                <div key={franchise.id} className="card row" style={{ gap: 12 }}>
                  <img src={franchise.logo} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} />
                  <div>
                    <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15 }}>{franchise.name}</b>
                    <div className="muted" style={{ fontSize: 11 }}>Ladies Franchise League</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, rgba(219,39,119,.08), rgba(219,39,119,.02))', border: '1px solid rgba(219,39,119,.2)' }}>
            <p style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 18, color: '#db2777', margin: '0 0 6px' }}>Empower. Compete. Inspire.</p>
            <p className="muted" style={{ margin: 0, fontSize: 13, fontStyle: 'italic' }}>Your Talent. Your Team. Your Time. Let's Make History!</p>
          </div>
        </div>
      )}
    </>
  );
}

export function Leagues() {
  const [league, setLeague] = useState('mens');

  return (
    <div className="page leagues-page">
      <h1 className="display">Leagues</h1>
      <div className="tabbar mt league-tabs league-main-tabs">
        <button className={league === 'mens' ? 'on' : ''} onClick={() => setLeague('mens')}>Men's Franchise League</button>
        <button className={league === 'ladies' ? 'on' : ''} onClick={() => setLeague('ladies')}>Ladies Franchise League</button>
      </div>
      {league === 'mens' && <MensLeague />}
      {league === 'ladies' && <LadiesLeague />}
      <div className="mt"><SponsorRail placement="leagues" /></div>
    </div>
  );
}
