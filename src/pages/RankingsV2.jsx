import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PLAYERS,
  STANDINGS,
  FRANCHISES,
  LEGACY_PLAYERS,
  LEGACY_STANDINGS,
  LEGACY_FRANCHISES,
  franchiseById,
  legacyFranchiseById,
  stripeVar,
  winPct,
} from '../data/seed';
import { tier } from '../lib/lpRating';

const SORT_OPTIONS = [
  ['lp', 'LP Rating'],
  ['win', 'Win %'],
  ['wins', 'Rubber Wins'],
  ['mvp', 'MVP Points'],
];

const legacyMvp = (player) => (player.stats?.rubbers_won || player.stats?.wins || 0) * 3 + (player.stats?.bonus_points || 0);
const legacyWinPct = (player) => {
  const played = player.stats?.played || 0;
  return played ? Math.round(((player.stats?.wins || 0) / played) * 100) : 0;
};

const mensMvpValue = (player) => Number(player.stats?.mvp_points) || 0;
const mensWins = (player) => Number(player.stats?.wins) || 0;
const mensPlayed = (player) => Number(player.stats?.played) || 0;

function TeamTable({ rows, legacy = false }) {
  return (
    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
        <thead>
          <tr>
            {['#', 'Franchise', 'P', 'W', 'L', legacy ? 'GD' : 'BP', 'Points'].map((heading) => (
              <th key={heading} style={{ textAlign: heading === 'Franchise' ? 'left' : 'center', padding: '12px 10px', borderBottom: '1px solid var(--line)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const fr = legacy ? legacyFranchiseById(row.franchise_id) : franchiseById(row.franchise_id);
            if (!fr) return null;
            const to = legacy ? `/legacy-franchise/${fr.id}` : `/franchise/${fr.id}`;
            return (
              <tr key={row.franchise_id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td className="num" style={{ textAlign: 'center', padding: 11, fontWeight: 800 }}>{index + 1}</td>
                <td style={{ padding: 11 }}>
                  <Link to={to} className="row" style={{ gap: 10, textDecoration: 'none' }}>
                    <img src={fr.logo} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} />
                    <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>{fr.name}</b>
                  </Link>
                </td>
                <td className="num" style={{ textAlign: 'center' }}>{row.played || 0}</td>
                <td className="num" style={{ textAlign: 'center', color: 'var(--win)' }}>{row.won || 0}</td>
                <td className="num" style={{ textAlign: 'center', color: 'var(--loss)' }}>{row.lost || 0}</td>
                <td className="num" style={{ textAlign: 'center' }}>{legacy ? (row.gd || 0) : (row.bp || 0)}</td>
                <td className="num" style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 900 }}>{row.points || 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function rankNumber(players, index, legacy, sortBy) {
  if (index === 0) return 1;
  const current = players[index];
  const previous = players[index - 1];
  const metric = (player) => {
    const stats = player.stats || {};
    if (legacy) {
      if (sortBy === 'win') return legacyWinPct(player);
      if (sortBy === 'wins') return stats.wins || 0;
      return legacyMvp(player);
    }
    if (sortBy === 'lp') return Number(player.lp_rating) || 0;
    if (sortBy === 'win') return winPct(stats);
    if (sortBy === 'wins') return stats.wins || 0;
    return stats.mvp_points || 0;
  };
  return metric(current) === metric(previous) ? rankNumber(players, index - 1, legacy, sortBy) : index + 1;
}

function PlayerList({ players, legacy = false, sortBy }) {
  if (!players.length) return <div className="card"><p className="muted" style={{ margin: 0 }}>No completed results are available for this ranking yet.</p></div>;
  return (
    <div className="grid">
      {players.map((player, index) => {
        const fr = legacy ? legacyFranchiseById(player.franchise_id) : franchiseById(player.franchise_id);
        if (!fr) return null;
        const stats = player.stats || {};
        const value = legacy
          ? sortBy === 'win' ? `${legacyWinPct(player)}%` : sortBy === 'wins' ? (stats.wins || 0) : `★ ${legacyMvp(player)}`
          : sortBy === 'lp' ? player.lp_rating : sortBy === 'win' ? `${winPct(stats)}%` : sortBy === 'wins' ? (stats.wins || 0) : `★ ${stats.mvp_points || 0}`;
        const to = legacy ? `/legacy-franchise/${player.franchise_id}` : `/player/${player.id}`;
        const playerTier = legacy ? (player.kind === 'youth' ? 'Youth' : 'Adult') : tier(player.lp_rating).label;
        return (
          <Link key={player.id || player.name} to={to} className="card stripe" style={{ '--stripe': legacy ? fr.primary : stripeVar(fr.id), padding: 12 }}>
            <div className="row spread">
              <span className="row" style={{ minWidth: 0 }}>
                <b className="num muted" style={{ width: 28 }}>{rankNumber(players, index, legacy, sortBy)}</b>
                <span className="avatar" style={{ width: 36, height: 36, fontSize: 12 }}>{player.name.split(' ').map((word) => word[0]).join('').slice(0, 3)}</span>
                <span style={{ minWidth: 0 }}>
                  <b style={{ fontSize: 14 }}>{player.name}</b>
                  <div className="muted" style={{ fontSize: 11 }}>{fr.name} · {playerTier}</div>
                </span>
              </span>
              <b className="num" style={{ color: sortBy === 'lp' ? 'var(--gold)' : 'var(--text)', fontSize: 17 }}>{value}</b>
            </div>
            <div className="row" style={{ gap: 12, marginTop: 8, fontSize: 11, flexWrap: 'wrap' }}>
              <span className="muted">{stats.played || 0} rubbers</span>
              <span style={{ color: 'var(--win)' }}>{stats.wins || 0} W</span>
              <span style={{ color: 'var(--loss)' }}>{stats.losses || 0} L</span>
              <span className="muted">{legacy ? legacyWinPct(player) : winPct(stats)}% win</span>
              {(stats.bonus_points || 0) > 0 && <span className="gold">{stats.bonus_points} BP</span>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function buildMvpLeaders(players, court = 'all') {
  const eligible = players
    .filter((player) => player.league === 'mens' && mensPlayed(player) > 0)
    .filter((player) => court === 'all' || player.tier === court)
    .sort((a, b) => mensMvpValue(b) - mensMvpValue(a) || mensWins(b) - mensWins(a) || winPct(b.stats) - winPct(a.stats));

  if (!eligible.length) return [];
  const top = eligible[0];
  return eligible.filter((player) =>
    mensMvpValue(player) === mensMvpValue(top)
    && mensWins(player) === mensWins(top)
    && mensPlayed(player) === mensPlayed(top));
}

function MvpLeaderCard({ label, leaders }) {
  if (!leaders.length) return null;
  const points = mensMvpValue(leaders[0]);
  const wins = mensWins(leaders[0]);
  const played = mensPlayed(leaders[0]);
  return (
    <div className="card" style={{ borderTop: '3px solid var(--gold)' }}>
      <span className="eyebrow">{label}</span>
      <h3 className="display" style={{ margin: '6px 0 8px', fontSize: 22 }}>
        {leaders.map((player) => player.name).join(' & ')}
      </h3>
      <div className="muted" style={{ fontSize: 12 }}>
        {leaders.length > 1 ? 'Joint leaders' : 'Current leader'} · {played} rubbers · {wins} wins · ★ {points} MVP pts
      </div>
      {leaders.length > 1 && <p className="muted" style={{ margin: '8px 0 0', fontSize: 11 }}>Equal results are displayed as a joint lead — no artificial split between tied players.</p>}
    </div>
  );
}

export default function RankingsV2() {
  const [league, setLeague] = useState('mens');
  const [view, setView] = useState('players');
  const [sortBy, setSortBy] = useState('mvp');
  const [court, setCourt] = useState('all');
  const [franchise, setFranchise] = useState('all');

  const mensTeams = useMemo(() => [...(STANDINGS.mens?.franchise || [])].sort((a, b) => b.points - a.points || b.won - a.won || b.bp - a.bp), []);
  const legacyTeams = useMemo(() => [...LEGACY_STANDINGS].sort((a, b) => b.points - a.points || (b.gd || 0) - (a.gd || 0)), []);

  const mensPlayers = useMemo(() => {
    const list = PLAYERS.filter((player) => player.league === 'mens' && player.stats?.played > 0)
      .filter((player) => court === 'all' || player.tier === court)
      .filter((player) => franchise === 'all' || player.franchise_id === franchise);
    const sorters = {
      lp: (a, b) => b.lp_rating - a.lp_rating,
      win: (a, b) => winPct(b.stats) - winPct(a.stats) || b.stats.wins - a.stats.wins,
      wins: (a, b) => b.stats.wins - a.stats.wins || winPct(b.stats) - winPct(a.stats),
      mvp: (a, b) => b.stats.mvp_points - a.stats.mvp_points || b.stats.wins - a.stats.wins,
    };
    return [...list].sort(sorters[sortBy]);
  }, [sortBy, court, franchise]);

  const legacyPlayers = useMemo(() => {
    const played = LEGACY_PLAYERS.filter((player) => (player.stats?.played || 0) > 0);
    const sorters = {
      win: (a, b) => legacyWinPct(b) - legacyWinPct(a) || (b.stats?.wins || 0) - (a.stats?.wins || 0),
      wins: (a, b) => (b.stats?.wins || 0) - (a.stats?.wins || 0) || legacyWinPct(b) - legacyWinPct(a),
      mvp: (a, b) => legacyMvp(b) - legacyMvp(a) || (b.stats?.wins || 0) - (a.stats?.wins || 0),
    };
    return [...played].sort(sorters[sortBy === 'lp' ? 'mvp' : sortBy]);
  }, [sortBy]);

  const mvpLeaders = useMemo(() => ({
    overall: buildMvpLeaders(PLAYERS, 'all'),
    P1: buildMvpLeaders(PLAYERS, 'P1'),
    P2: buildMvpLeaders(PLAYERS, 'P2'),
    P3: buildMvpLeaders(PLAYERS, 'P3'),
  }), []);

  const currentTeams = league === 'legacy' ? legacyTeams : mensTeams;
  const currentPlayers = league === 'legacy' ? legacyPlayers : mensPlayers;

  return (
    <div className="page">
      <div className="row spread" style={{ gap: 12, flexWrap: 'wrap' }}>
        <div>
          <span className="eyebrow">Verified from completed results</span>
          <h1 className="display" style={{ margin: '4px 0' }}>Rankings</h1>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>Men’s Season 3, LP Legacy League and Ladies Season 2 in one place.</p>
        </div>
        <Link to="/legacy-league" className="btn gold">Open Legacy League →</Link>
      </div>

      <div className="tabbar mt">
        <button className={league === 'mens' ? 'on' : ''} onClick={() => { setLeague('mens'); setSortBy('mvp'); }}>Men’s</button>
        <button className={league === 'legacy' ? 'on' : ''} onClick={() => { setLeague('legacy'); setSortBy('mvp'); }}>LP Legacy</button>
        <button className={league === 'ladies' ? 'on' : ''} onClick={() => setLeague('ladies')}>Ladies Season 2</button>
      </div>

      {league === 'ladies' ? (
        <>
          <div className="card mt" style={{ borderLeft: '4px solid #f0abcc' }}>
            <h2 className="display" style={{ marginTop: 0, fontSize: 20 }}>Ladies Season 2 rankings</h2>
            <p className="muted" style={{ marginBottom: 12 }}>The auction squads are confirmed. Competitive rankings will activate from completed Season 2 results; no fake pre-season order will be published.</p>
            <Link to="/leagues?tab=ladies" className="btn ghost">View all six Ladies franchises →</Link>
          </div>
          <div className="grid cols-3 mt">
            {FRANCHISES.filter((fr) => fr.league === 'ladies').map((fr) => (
              <Link key={fr.id} to={`/ladies-franchise/${fr.id}`} className="card row" style={{ gap: 12 }}>
                <img src={fr.logo} alt="" style={{ width: 42, height: 42, objectFit: 'contain' }} />
                <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>{fr.name}</b>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>
          {league === 'mens' && (
            <section className="mt">
              <div className="row spread" style={{ gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <div>
                  <span className="eyebrow">Current MVP race</span>
                  <h2 className="display" style={{ margin: '4px 0', fontSize: 28 }}>Overall + division leaders</h2>
                </div>
                <span className="muted" style={{ fontSize: 12 }}>P1, P2 and P3 are judged separately. Overall uses all completed rubbers.</span>
              </div>
              <div className="grid cols-2">
                <MvpLeaderCard label="Overall MVP" leaders={mvpLeaders.overall} />
                <MvpLeaderCard label="P1 MVP" leaders={mvpLeaders.P1} />
                <MvpLeaderCard label="P2 MVP" leaders={mvpLeaders.P2} />
                <MvpLeaderCard label="P3 MVP" leaders={mvpLeaders.P3} />
              </div>
              <div className="card mt" style={{ borderLeft: '4px solid var(--gold)' }}>
                <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>MVP integrity rule</b>
                <p className="muted" style={{ margin: '6px 0 0', fontSize: 12 }}>Uwais Patel and Yusuf Patel played together throughout the campaign. Their shared results are treated as identical and, when tied, they are shown as joint leaders rather than being artificially ranked first and second.</p>
              </div>
            </section>
          )}

          <div className="tabbar mt">
            <button className={view === 'players' ? 'on' : ''} onClick={() => setView('players')}>Player Rankings</button>
            <button className={view === 'teams' ? 'on' : ''} onClick={() => setView('teams')}>Franchise Rankings</button>
            <button className={view === 'power' ? 'on' : ''} onClick={() => setView('power')}>Power Order</button>
          </div>

          {view === 'players' && (
            <>
              <div className="tabbar mt">
                {SORT_OPTIONS.filter(([key]) => !(league === 'legacy' && key === 'lp')).map(([key, label]) => (
                  <button key={key} className={sortBy === key ? 'on' : ''} onClick={() => setSortBy(key)}>{label}</button>
                ))}
              </div>
              {league === 'mens' && (
                <>
                  <div className="row mt" style={{ gap: 6, flexWrap: 'wrap' }}>
                    <span className="muted" style={{ fontSize: 11 }}>Court</span>
                    {['all', 'P1', 'P2', 'P3'].map((value) => <button key={value} className={`chip ${court === value ? 'on' : ''}`} onClick={() => setCourt(value)}>{value === 'all' ? 'All' : value}</button>)}
                  </div>
                  <div className="row mt" style={{ gap: 6, flexWrap: 'wrap' }}>
                    <span className="muted" style={{ fontSize: 11 }}>Franchise</span>
                    <button className={`chip ${franchise === 'all' ? 'on' : ''}`} onClick={() => setFranchise('all')}>All</button>
                    {FRANCHISES.filter((fr) => fr.league === 'mens').map((fr) => <button key={fr.id} className={`chip ${franchise === fr.id ? 'on' : ''}`} onClick={() => setFranchise(fr.id)}>{fr.short || fr.name}</button>)}
                  </div>
                </>
              )}
              <p className="muted mt" style={{ fontSize: 12 }}>
                {sortBy === 'mvp' && 'MVP Points: 3 per rubber won plus 1 bonus point for a clean 4–0. Equal records share the same ranking.'}
                {sortBy === 'wins' && 'Rubber Wins: total individual rubbers won, not team fixtures. Equal totals share the same ranking.'}
                {sortBy === 'win' && 'Win %: rubbers won divided by rubbers played. Equal percentages share the same ranking.'}
                {sortBy === 'lp' && 'LP Rating: doubles Elo calculated chronologically from completed rubbers.'}
              </p>
              <PlayerList players={currentPlayers} legacy={league === 'legacy'} sortBy={sortBy} />
            </>
          )}

          {view === 'teams' && <div className="mt"><TeamTable rows={currentTeams} legacy={league === 'legacy'} /></div>}

          {view === 'power' && (
            <div className="mt">
              <div className="card" style={{ marginBottom: 10 }}>
                <p className="muted" style={{ margin: 0, fontSize: 13 }}>Power order currently follows the verified competition table. Movement arrows have been removed until genuine week-on-week snapshots are stored.</p>
              </div>
              <div className="grid">
                {currentTeams.map((row, index) => {
                  const fr = league === 'legacy' ? legacyFranchiseById(row.franchise_id) : franchiseById(row.franchise_id);
                  return (
                    <Link key={row.franchise_id} to={league === 'legacy' ? `/legacy-franchise/${row.franchise_id}` : `/franchise/${row.franchise_id}`} className="card stripe row spread" style={{ '--stripe': league === 'legacy' ? fr.primary : stripeVar(fr.id) }}>
                      <span className="row" style={{ gap: 10 }}>
                        <b className="num" style={{ width: 28, fontSize: 22 }}>{index + 1}</b>
                        <img src={fr.logo} alt="" style={{ width: 34, height: 34, objectFit: 'contain' }} />
                        <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>{fr.name}</b>
                      </span>
                      <b className="num" style={{ color: 'var(--gold)' }}>{row.points} pts</b>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {league === 'legacy' && (
        <div className="card mt" style={{ borderLeft: '4px solid var(--gold)' }}>
          <div className="row spread" style={{ gap: 10, flexWrap: 'wrap' }}>
            <div>
              <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>LP Legacy League restored</b>
              <p className="muted" style={{ margin: '4px 0 0', fontSize: 12 }}>Cheetahs, Honey Badgers, Leopards, Jackals, Rhinos and Eagles are ranked from the official Round 3 table.</p>
            </div>
            <Link to="/legacy-league" className="btn ghost">Fixtures, results and franchises →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
