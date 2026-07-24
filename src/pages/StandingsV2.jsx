import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FIXTURES,
  STANDINGS,
  TIER_SPONSORS,
  LEGACY_STANDINGS,
  franchiseById,
  legacyFranchiseById,
  stripeVar,
} from '../data/seed';
import { ComingSoon } from '../components/ui';

function roundsPlayed(franchiseId, league) {
  return new Set(
    FIXTURES.filter(
      (fixture) => fixture.league === league
        && fixture.status === 'final'
        && (fixture.home === franchiseId || fixture.away === franchiseId),
    ).map((fixture) => fixture.round),
  ).size;
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
    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
      <table className="tbl" style={{ minWidth: 760 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Franchise</th>
            <th className="num" title="Distinct league rounds completed">R</th>
            <th className="num" title="Matches or rubbers played">P</th>
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
                <td>
                  <Link to={`/franchise/${franchise.id}`} className="row" style={{ gap: 8 }}>
                    <span style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: stripeVar(franchise.id) }} />
                    <img src={franchise.logo} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                    <b>{franchise.name}{row.adj ? ' *' : ''}</b>
                  </Link>
                </td>
                <td className="num"><b style={{ color: 'var(--gold)' }}>{roundsPlayed(row.franchise_id, league)}</b></td>
                <td className="num">{row.played}</td>
                <td className="num">{row.won}</td>
                <td className="num">{row.lost}</td>
                <td className="num">{row.drawn}</td>
                <td className="num">{row.bp}</td>
                <td className="num"><b style={{ color: row.points < 0 ? 'var(--loss)' : 'inherit' }}>{row.points}</b></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="muted" style={{ padding: '8px 14px', fontSize: 11, borderTop: '1px solid rgba(255,255,255,.06)' }}>
        R = rounds completed · P = matches/rubbers played{hasAdjustment ? ' · * includes a league points adjustment' : ''}.
      </div>
    </div>
  );
}

export default function StandingsV2() {
  const [league, setLeague] = useState('mens');
  const [tier, setTier] = useState('franchise');
  const legacyRows = [...LEGACY_STANDINGS].sort((a, b) => b.points - a.points);

  return (
    <div className="page">
      <h1 className="display">Log Tables</h1>
      <p className="muted" style={{ fontSize: 13 }}>
        Rounds and played are shown separately: R tracks league rounds completed, while P tracks matches or rubbers played.
      </p>

      <div className="tabbar mt">
        <button className={league === 'mens' ? 'on' : ''} onClick={() => { setLeague('mens'); setTier('franchise'); }}>Men's</button>
        <button className={league === 'ladies' ? 'on' : ''} onClick={() => { setLeague('ladies'); setTier('franchise'); }}>Ladies</button>
        <button className={league === 'legacy' ? 'on' : ''} onClick={() => setLeague('legacy')}>LP Legacy</button>
      </div>

      {league === 'mens' && (
        <div className="tabbar mt">
          {[['franchise', 'Franchise'], ['P1', 'P1'], ['P2', 'P2'], ['P3', 'P3']].map(([value, label]) => (
            <button key={value} className={tier === value ? 'on' : ''} onClick={() => setTier(value)}>{label}</button>
          ))}
        </div>
      )}

      {league === 'mens' && tier !== 'franchise' && TIER_SPONSORS[tier] && (
        <div className="row mt" style={{ gap: 10, alignItems: 'center' }}>
          <img src={TIER_SPONSORS[tier].logo} alt={TIER_SPONSORS[tier].name} style={{ height: 26, borderRadius: 4 }} />
          <span className="muted" style={{ fontSize: 12 }}>{tier} Log Table · presented by {TIER_SPONSORS[tier].name}</span>
        </div>
      )}

      {league !== 'legacy' && <div className="mt"><LeagueTable league={league} tier={tier} /></div>}
      {league === 'mens' && tier === 'franchise' && <p className="muted mt" style={{ fontSize: 12 }}>Top 4 qualify for Finals Night.</p>}

      {league === 'legacy' && (
        <div className="card mt" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="tbl" style={{ minWidth: 650 }}>
            <thead><tr><th>#</th><th>Franchise</th><th className="num">R</th><th className="num">P</th><th className="num">W</th><th className="num">L</th><th className="num">Pts</th></tr></thead>
            <tbody>
              {legacyRows.map((row, index) => {
                const franchise = legacyFranchiseById(row.franchise_id);
                if (!franchise) return null;
                return (
                  <tr key={row.franchise_id}>
                    <td><span className="pos-badge">{index + 1}</span></td>
                    <td><Link to={`/legacy-franchise/${franchise.id}`} className="row" style={{ gap: 8 }}><img src={franchise.logo} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} /><b>{franchise.name}</b></Link></td>
                    <td className="num"><b style={{ color: 'var(--gold)' }}>{row.rounds ?? row.played ?? 0}</b></td>
                    <td className="num">{row.played ?? 0}</td>
                    <td className="num">{row.won ?? 0}</td>
                    <td className="num">{row.lost ?? 0}</td>
                    <td className="num"><b>{row.points ?? 0}</b></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="muted" style={{ padding: '8px 14px', fontSize: 11, borderTop: '1px solid rgba(255,255,255,.06)' }}>R = rounds completed · P = matches played.</div>
        </div>
      )}
    </div>
  );
}
