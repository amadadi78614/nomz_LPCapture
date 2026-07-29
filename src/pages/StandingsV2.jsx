import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  STANDINGS,
  TIER_SPONSORS,
  LEGACY_STANDINGS,
  franchiseById,
  legacyFranchiseById,
  stripeVar,
} from '../data/seed';
import { ComingSoon } from '../components/ui';
import '../styles/standings-v2.css';

function roundsPlayed(row, tier = 'franchise') {
  const rubbersPerRound = tier === 'franchise' ? 6 : 2;
  return Math.floor((row?.played || 0) / rubbersPerRound);
}

function LeagueTable({ league, tier }) {
  const rows = STANDINGS[league]?.[tier] || [];
  const hasAdjustment = rows.some((row) => row.adj);

  if (league === 'ladies') {
    return (
      <ComingSoon
        title="Ladies League"
        note="The biggest Ladies League yet launches with 60 ladies across 6 franchises. Auction: 29 July 2026."
      />
    );
  }

  return (
    <div className="standings-shell">
      <table className="tbl standings-table standings-mobile-cards">
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
                <td data-label="Position"><span className={`pos-badge ${tier === 'franchise' && index < 4 ? 'q' : ''}`}>{index + 1}</span></td>
                <td data-label="Franchise" className="standings-team-cell">
                  <Link to={`/franchise/${franchise.id}`} className="row" style={{ gap: 8 }}>
                    <span className="standings-stripe" style={{ background: stripeVar(franchise.id) }} />
                    <img src={franchise.logo} alt="" />
                    <b>{franchise.name}{row.adj ? ' *' : ''}</b>
                  </Link>
                </td>
                <td data-label="Rounds" className="num"><b className="standings-rounds">{roundsPlayed(row, tier)}</b></td>
                <td data-label="Played" className="num">{row.played}</td>
                <td data-label="Won" className="num">{row.won}</td>
                <td data-label="Lost" className="num">{row.lost}</td>
                <td data-label="Drawn" className="num">{row.drawn}</td>
                <td data-label="Bonus" className="num">{row.bp}</td>
                <td data-label="Points" className="num"><b className="standings-points" style={{ color: row.points < 0 ? 'var(--loss)' : undefined }}>{row.points}</b></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="standings-key muted">
        R = completed fixture rounds · P = rubbers played{hasAdjustment ? ' · * includes a league points adjustment' : ''}.
      </div>
    </div>
  );
}

export default function StandingsV2() {
  const [league, setLeague] = useState('mens');
  const [tier, setTier] = useState('franchise');
  const legacyRows = [...LEGACY_STANDINGS].sort((a, b) => b.points - a.points || (b.gd || 0) - (a.gd || 0));

  return (
    <div className="page standings-page">
      <h1 className="display">Log Tables</h1>
      <p className="muted standings-intro">
        Rounds and played are shown separately: R tracks completed fixture rounds, while P tracks rubbers played.
      </p>

      <div className="tabbar mt standings-tabs">
        <button className={league === 'mens' ? 'on' : ''} onClick={() => { setLeague('mens'); setTier('franchise'); }}>Men's</button>
        <button className={league === 'ladies' ? 'on' : ''} onClick={() => { setLeague('ladies'); setTier('franchise'); }}>Ladies</button>
        <button className={league === 'legacy' ? 'on' : ''} onClick={() => setLeague('legacy')}>LP Legacy</button>
      </div>

      {league === 'mens' && (
        <div className="tabbar mt standings-tabs standings-tier-tabs">
          {[["franchise", 'Franchise'], ["P1", 'P1'], ["P2", 'P2'], ["P3", 'P3']].map(([value, label]) => (
            <button key={value} className={tier === value ? 'on' : ''} onClick={() => setTier(value)}>{label}</button>
          ))}
        </div>
      )}

      {league === 'mens' && tier !== 'franchise' && TIER_SPONSORS[tier] && (
        <div className="row mt standings-sponsor" style={{ gap: 10, alignItems: 'center' }}>
          <img src={TIER_SPONSORS[tier].logo} alt={TIER_SPONSORS[tier].name} />
          <span className="muted">{tier} Log Table · presented by {TIER_SPONSORS[tier].name}</span>
        </div>
      )}

      {league !== 'legacy' && <div className="mt"><LeagueTable league={league} tier={tier} /></div>}
      {league === 'mens' && tier === 'franchise' && <p className="muted mt standings-note">Top 4 qualify for Finals Night.</p>}

      {league === 'legacy' && (
        <div className="standings-shell mt">
          <table className="tbl standings-table standings-mobile-cards legacy-standings-table">
            <thead><tr><th>#</th><th>Franchise</th><th className="num">R</th><th className="num">P</th><th className="num">W</th><th className="num">L</th><th className="num">Pts</th></tr></thead>
            <tbody>
              {legacyRows.map((row, index) => {
                const franchise = legacyFranchiseById(row.franchise_id);
                if (!franchise) return null;
                return (
                  <tr key={row.franchise_id}>
                    <td data-label="Position"><span className="pos-badge">{index + 1}</span></td>
                    <td data-label="Franchise" className="standings-team-cell">
                      <Link to={`/legacy-franchise/${franchise.id}`} className="row" style={{ gap: 8 }}>
                        <img src={franchise.logo} alt="" />
                        <b>{franchise.name}</b>
                      </Link>
                    </td>
                    <td data-label="Rounds" className="num"><b className="standings-rounds">{row.rounds ?? row.played ?? 0}</b></td>
                    <td data-label="Played" className="num">{row.played ?? 0}</td>
                    <td data-label="Won" className="num">{row.won ?? 0}</td>
                    <td data-label="Lost" className="num">{row.lost ?? 0}</td>
                    <td data-label="Points" className="num"><b className="standings-points">{row.points ?? 0}</b></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="standings-key muted">R = rounds completed · P = matches played.</div>
        </div>
      )}
    </div>
  );
}
