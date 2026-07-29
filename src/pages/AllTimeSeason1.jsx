import { useMemo, useState } from 'react';
import source from './AllTimeRankings.jsx?raw';

function extractArray(name, nextName) {
  const startToken = `const ${name} = [`;
  const start = source.indexOf(startToken);
  if (start < 0) return [];
  const bodyStart = start + `const ${name} = `.length;
  const endToken = nextName ? `\nconst ${nextName} =` : '\n];';
  let end;
  if (nextName) {
    end = source.indexOf(endToken, bodyStart);
    if (end < 0) return [];
    end += 2;
  } else {
    end = source.indexOf('\n];', bodyStart);
    if (end < 0) return [];
    end += 2;
  }
  const literal = source.slice(bodyStart, end).trim().replace(/;$/, '');
  try {
    return Function(`"use strict"; return (${literal});`)();
  } catch (error) {
    console.error(`Could not load ${name}`, error);
    return [];
  }
}

const PREMIER = extractArray('MENS_PREMIER_S1', 'MENS_CHAMP_S1');
const CHAMPIONSHIP = extractArray('MENS_CHAMP_S1', 'LADIES_S1');
const LADIES = extractArray('LADIES_S1', 'TEAM_COLORS');

const TEAM_COLORS = {
  'Desert Falcons': '#c79a3e', 'Ice Breakers': '#00C8E8', 'Avalanche Aces': '#0057E9',
  'Sonic Viboras': '#9aa823', 'Samurai Kick Smashers': '#dc2626',
  'Global Boomerangs': '#7c3aed', 'Sahara Lions': '#f59e0b',
  'Rulo Apaches': '#6b7280', 'Baltic Blades': '#0891b2',
  'Lunar Lillies': '#8b5cf6', 'Desert Roses': '#ec4899', 'Phoenix Flames': '#f97316',
  'Backhand Blossoms': '#10b981', 'Net Novas': '#3b82f6', 'Arctic Angels': '#06b6d4',
};

function rankSeasonOne(rows) {
  return [...rows]
    .map((player) => ({ ...player, seasons: 1 }))
    .sort((a, b) => b.won - a.won || b.played - a.played || b.setsWon - a.setsWon || b.gamesWon - a.gamesWon)
    .map((player, index) => ({ ...player, rank: index + 1 }));
}

function combineMensSeasonOne() {
  const players = new Map();
  [...PREMIER, ...CHAMPIONSHIP].forEach((player) => {
    const key = player.name.toLowerCase().trim();
    const current = players.get(key);
    if (!current) {
      players.set(key, { ...player, seasons: 1 });
      return;
    }
    players.set(key, {
      ...current,
      played: current.played + player.played,
      won: current.won + player.won,
      lost: current.lost + player.lost,
      setsWon: current.setsWon + player.setsWon,
      gamesWon: current.gamesWon + player.gamesWon,
    });
  });
  return rankSeasonOne([...players.values()]);
}

function SeasonTable({ data }) {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const teams = useMemo(() => [...new Set(data.map((player) => player.team))].sort(), [data]);
  const filtered = data
    .filter((player) => player.name.toLowerCase().includes(search.toLowerCase()))
    .filter((player) => teamFilter === 'all' || player.team === teamFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search player..."
          style={{ flex: 1, minWidth: 150, padding: '10px 13px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', font: 'inherit', fontSize: 13 }}
        />
        <select
          value={teamFilter}
          onChange={(event) => setTeamFilter(event.target.value)}
          style={{ padding: '10px 13px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', font: 'inherit', fontSize: 13 }}
        >
          <option value="all">All Teams</option>
          {teams.map((team) => <option key={team}>{team}</option>)}
        </select>
      </div>
      <p className="muted" style={{ fontSize: 12 }}>{filtered.length} players · Season 1 only</p>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>#</th><th>Player</th><th>Season 1 Team</th><th className="num">Matches</th>
              <th className="num">W</th><th className="num">L</th><th className="num">Win%</th>
              <th className="num">Sets Won</th><th className="num">Games Won</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((player) => {
              const winRate = player.played ? Math.round((player.won / player.played) * 100) : 0;
              const teamColor = TEAM_COLORS[player.team] || 'var(--muted)';
              return (
                <tr key={`${player.name}-${player.team}`}>
                  <td><span className="pos-badge">{player.rank}</span></td>
                  <td><b style={{ fontSize: 13 }}>{player.name}</b></td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 3, height: 14, borderRadius: 2, background: teamColor, display: 'inline-block' }} /><span style={{ fontSize: 11, color: 'var(--muted)' }}>{player.team}</span></span></td>
                  <td className="num">{player.played}</td>
                  <td className="num" style={{ color: 'var(--win)' }}>{player.won}</td>
                  <td className="num" style={{ color: 'var(--loss)' }}>{player.lost}</td>
                  <td className="num"><b style={{ color: winRate >= 60 ? 'var(--win)' : winRate < 40 ? 'var(--muted)' : 'var(--text)' }}>{winRate}%</b></td>
                  <td className="num">{player.setsWon}</td>
                  <td className="num">{player.gamesWon}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AllTimeSeason1() {
  const [league, setLeague] = useState('mens');
  const mens = useMemo(() => combineMensSeasonOne(), []);
  const ladies = useMemo(() => rankSeasonOne(LADIES), []);

  return (
    <div className="page">
      <h1 className="display">All-Time Rankings</h1>
      <p className="muted" style={{ fontSize: 13 }}>Season 1 statistics only. Later seasons will be added once the historical records have been fully verified.</p>
      <div className="tabbar mt">
        <button className={league === 'mens' ? 'on' : ''} onClick={() => setLeague('mens')}>Men's Season 1</button>
        <button className={league === 'ladies' ? 'on' : ''} onClick={() => setLeague('ladies')}>Ladies Season 1</button>
      </div>
      {league === 'mens' && <div className="mt"><SeasonTable data={mens} /></div>}
      {league === 'ladies' && <div className="mt"><SeasonTable data={ladies} /></div>}
    </div>
  );
}
