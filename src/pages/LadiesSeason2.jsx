import { Link, useParams } from 'react-router-dom';
import { LADIES_S2_TEAMS } from '../data/ladiesSeason2Data';

export function LadiesSeason2Franchise() {
  const { id } = useParams();
  const team = LADIES_S2_TEAMS.find((item) => item.id === id);
  if (!team) return <div className="page"><p className="muted">Ladies franchise not found.</p></div>;
  const owner = team.players.find((player) => player.role === 'owner');
  const captain = team.players.find((player) => player.role === 'captain');
  const squad = team.players.filter((player) => player.role === 'player');

  return (
    <div className="page">
      <Link to="/leagues" className="muted" style={{ fontSize: 12 }}>← Ladies Franchise League</Link>
      <section className="card" style={{ marginTop: 12, padding: 20, display: 'grid', gridTemplateColumns: 'minmax(110px,180px) 1fr', gap: 22, alignItems: 'center' }}>
        <img src={team.logo} alt={team.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 16 }} />
        <div>
          <span className="eyebrow">Ladies Franchise League · Season 2</span>
          <h1 className="display" style={{ margin: '5px 0 8px' }}>{team.name}</h1>
          <p className="muted" style={{ margin: 0 }}>Auction complete · 10-player squad confirmed</p>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            <span className="chip">Owner: {owner?.name}</span>
            <span className="chip">Captain: {captain?.name}</span>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <div className="row spread" style={{ alignItems: 'end' }}><div><span className="eyebrow">Official squad</span><h2 className="display" style={{ margin: '4px 0 0' }}>Season 2 roster</h2></div><span className="chip">10 players</span></div>
        <div className="grid cols-2 mt">
          {[owner, captain, ...squad].filter(Boolean).map((player) => (
            <article key={player.id} className="card row spread" style={{ gap: 12 }}>
              <div className="row" style={{ gap: 10 }}>
                <span className="avatar">{player.name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2)}</span>
                <div><b>{player.name}</b><div className="muted" style={{ fontSize: 11 }}>{player.role === 'owner' ? 'Franchise Owner' : player.role === 'captain' ? 'Captain' : 'Player'}</div></div>
              </div>
              {player.role !== 'player' && <span className="chip">{player.role}</span>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
