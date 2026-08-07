import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PLAYERS, franchiseById, stripeVar, winPct } from '../data/seed';

const mvp = (player) => Number(player.stats?.mvp_points) || 0;
const wins = (player) => Number(player.stats?.wins) || 0;
const losses = (player) => Number(player.stats?.losses) || 0;
const played = (player) => Number(player.stats?.played) || 0;
const bonus = (player) => Number(player.stats?.bonus_points) || 0;

const SORTS = [
  ['performance', 'Overall rank'],
  ['mvp', 'MVP points'],
  ['win', 'Win %'],
  ['wins', 'Wins'],
  ['played', 'Appearances'],
];

const DIVISIONS = [
  ['all', 'Overall'],
  ['P1', 'P1'],
  ['P2', 'P2'],
  ['P3', 'P3'],
];

function comparePlayers(sortBy) {
  if (sortBy === 'performance' || sortBy === 'win') {
    return (a, b) => winPct(b.stats) - winPct(a.stats)
      || played(b) - played(a)
      || wins(b) - wins(a)
      || mvp(b) - mvp(a);
  }
  if (sortBy === 'wins') {
    return (a, b) => wins(b) - wins(a)
      || winPct(b.stats) - winPct(a.stats)
      || played(b) - played(a)
      || mvp(b) - mvp(a);
  }
  if (sortBy === 'played') {
    return (a, b) => played(b) - played(a)
      || winPct(b.stats) - winPct(a.stats)
      || wins(b) - wins(a)
      || mvp(b) - mvp(a);
  }
  return (a, b) => mvp(b) - mvp(a)
    || wins(b) - wins(a)
    || winPct(b.stats) - winPct(a.stats)
    || played(b) - played(a);
}

function metricValue(player, sortBy) {
  if (sortBy === 'performance') return `${winPct(player.stats)}%`;
  if (sortBy === 'win') return `${winPct(player.stats)}%`;
  if (sortBy === 'wins') return `${wins(player)} W`;
  if (sortBy === 'played') return `${played(player)}`;
  return `★ ${mvp(player)}`;
}

function metricLabel(sortBy) {
  if (sortBy === 'performance') return 'Overall rank';
  if (sortBy === 'win') return 'Win rate';
  if (sortBy === 'wins') return 'Rubber wins';
  if (sortBy === 'played') return 'Rubbers';
  return 'MVP pts';
}

function LeaderSummary({ label, player, value }) {
  if (!player) return null;
  const franchise = franchiseById(player.franchise_id);
  return (
    <div className="card" style={{ padding: 16, borderTop: '3px solid var(--gold)' }}>
      <span className="eyebrow">{label}</span>
      <div style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 20, marginTop: 5 }}>{player.name}</div>
      <div className="muted" style={{ fontSize: 11, marginTop: 5 }}>{franchise?.name} · {player.tier}</div>
      <div className="num" style={{ color: 'var(--gold)', fontWeight: 900, fontSize: 21, marginTop: 8 }}>{value}</div>
    </div>
  );
}

export default function MensRankingsStage({ showHeader = true }) {
  const [division, setDivision] = useState('all');
  const [sortBy, setSortBy] = useState('performance');

  const allPlayers = useMemo(() => PLAYERS.filter((player) => player.league === 'mens' && played(player) > 0), []);

  const ranked = useMemo(() => allPlayers
    .filter((player) => division === 'all' || player.tier === division)
    .sort(comparePlayers(sortBy)), [allPlayers, division, sortBy]);

  const performanceLeader = useMemo(() => [...allPlayers].sort(comparePlayers('performance'))[0], [allPlayers]);
  const mvpLeader = useMemo(() => [...allPlayers].sort(comparePlayers('mvp'))[0], [allPlayers]);
  const winsLeader = useMemo(() => [...allPlayers].sort(comparePlayers('wins'))[0], [allPlayers]);

  return (
    <section className="mt">
      {showHeader && (
        <div className="row spread" style={{ gap: 12, flexWrap: 'wrap', alignItems: 'end' }}>
          <div>
            <span className="eyebrow">Season 3 player intelligence</span>
            <h2 className="display" style={{ margin: '4px 0', fontSize: 30 }}>Rankings Centre</h2>
          </div>
          <span className="muted" style={{ fontSize: 12 }}>Regular season + completed playoff rubbers</span>
        </div>
      )}

      <div className="card mt" style={{ borderLeft: '4px solid var(--gold)', padding: 16 }}>
        <b style={{ display: 'block', marginBottom: 6 }}>How rankings work</b>
        <div className="muted" style={{ fontSize: 12, lineHeight: 1.6 }}>
          <b style={{ color: 'var(--text)' }}>Overall player rank = win % → appearances → wins → MVP points.</b>
          {' '}That rewards sustained winning first: a 7–0 record ranks above a 7–1 record. The MVP race remains a separate official points competition: 3 points per rubber win + 1 bonus point for a 4–0 win.
        </div>
      </div>

      <div className="grid cols-3 mt">
        <LeaderSummary label="Overall #1" player={performanceLeader} value={`${winPct(performanceLeader?.stats)}% · ${played(performanceLeader)} rubbers`} />
        <LeaderSummary label="MVP points leader" player={mvpLeader} value={`★ ${mvp(mvpLeader)}`} />
        <LeaderSummary label="Most wins" player={winsLeader} value={`${wins(winsLeader)} wins`} />
      </div>

      <div className="mt">
        <span className="eyebrow">Choose division</span>
        <div className="tabbar mt league-tabs league-tier-tabs">
          {DIVISIONS.map(([value, label]) => (
            <button key={value} className={division === value ? 'on' : ''} onClick={() => setDivision(value)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="mt">
        <span className="eyebrow">Rank by</span>
        <div className="tabbar mt league-tabs league-tier-tabs">
          {SORTS.map(([value, label]) => (
            <button key={value} className={sortBy === value ? 'on' : ''} onClick={() => setSortBy(value)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="row spread mt" style={{ gap: 12, flexWrap: 'wrap', alignItems: 'end' }}>
        <div>
          <span className="eyebrow">{division === 'all' ? 'Overall' : division} leaderboard</span>
          <h3 className="display" style={{ margin: '4px 0', fontSize: 26 }}>{metricLabel(sortBy)}</h3>
        </div>
        <span className="muted" style={{ fontSize: 11 }}>{ranked.length} ranked players</span>
      </div>

      <div className="grid mt">
        {ranked.map((player, index) => {
          const franchise = franchiseById(player.franchise_id);
          return (
            <Link key={player.id} to={`/player/${player.id}`} className="card stripe row spread" style={{ '--stripe': stripeVar(franchise?.id), gap: 12 }}>
              <span className="row" style={{ minWidth: 0, gap: 12 }}>
                <b className="num" style={{ fontSize: 22, width: 30, flex: '0 0 auto' }}>{index + 1}</b>
                <span style={{ minWidth: 0 }}>
                  <b style={{ fontSize: 15 }}>{player.name}</b>
                  <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>
                    {franchise?.name} · {player.tier} · {played(player)} rubbers · {wins(player)}W–{losses(player)}L · {winPct(player.stats)}% win
                  </div>
                  <div className="muted" style={{ fontSize: 10, marginTop: 3 }}>
                    ★ {mvp(player)} MVP pts · {bonus(player)} bonus {bonus(player) === 1 ? 'point' : 'points'}
                  </div>
                </span>
              </span>
              <span style={{ textAlign: 'right', flex: '0 0 auto' }}>
                <b className="num" style={{ color: 'var(--gold)', fontSize: 20 }}>{metricValue(player, sortBy)}</b>
                <div className="muted" style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 2 }}>{metricLabel(sortBy)}</div>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
