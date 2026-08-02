import { Link } from 'react-router-dom';
import HomeV2 from './HomeV2';
import { franchiseById, legacyFranchiseById } from '../data/seed';
import '../styles/home-championship.css';

const legacyResults = [
  {
    winner: 'Honey Badgers',
    winnerId: 'lp-honey-badgers',
    score: '7–4',
    loser: 'LP Cheetahs',
    loserId: 'lp-cheetahs',
  },
  {
    winner: 'LP Jackals',
    winnerId: 'lp-jackals',
    score: '8–4',
    loser: 'LP Eagles',
    loserId: 'lp-eagles',
  },
];

const raceCards = [
  {
    label: 'P1 Championship Race',
    title: 'Falcons and Lions chase the P1 crown',
    copy: 'Desert Falcons lead on 36 points. Sahara Lions remain alive on 31. Two matches remain for each team and every point now carries title pressure.',
    tone: 'gold',
    teams: ['desert-falcons', 'sahara-lions'],
    to: '/leagues',
    status: 'Falcons 36 · Lions 31',
  },
  {
    label: 'P2 Title Decider',
    title: 'Globo set the target. Falcons must go perfect.',
    copy: 'Globo Boomerangs have completed their P2 season on 32 points. Desert Falcons sit on 24 with two matches left and need the full eight points to stay in the title race.',
    tone: 'blue',
    teams: ['globo-boomerangs', 'desert-falcons'],
    to: '/leagues',
    status: 'Globo 32 · Falcons 24',
  },
  {
    label: 'Finals Night Race',
    title: 'Three teams. Two playoff places.',
    copy: 'Globo Boomerangs are third on 61 points. Sahara Lions have 58 and Ice Breakers 48, with the final fixtures still able to reshape the top four.',
    tone: 'green',
    teams: ['globo-boomerangs', 'sahara-lions', 'ice-breakers'],
    to: '/standings',
    status: '3rd, 4th and 5th still in play',
  },
];

function TeamMarks({ ids }) {
  return (
    <div className="hcr-team-marks" aria-hidden="true">
      {ids.map((id) => {
        const team = franchiseById(id);
        return <img key={id} src={team.logo} alt="" />;
      })}
    </div>
  );
}

export default function HomeChampionship() {
  return (
    <>
      <section className="hcr-shell">
        <div className="hcr-hero">
          <div>
            <span className="hcr-eyebrow">SEASON 3 · CHAMPIONSHIP RUN-IN</span>
            <h1>The pressure is rising.<br /><em>Every point matters.</em></h1>
            <p>
              The P1 and P2 title races are entering their final stretch while three franchises fight for the last two Finals Night positions.
            </p>
            <div className="hcr-actions">
              <Link to="/leagues" className="hcr-primary">View championship tables</Link>
              <Link to="/live" className="hcr-secondary">Match Centre</Link>
            </div>
          </div>
          <div className="hcr-countdown">
            <span>THE RUN-IN</span>
            <strong>2</strong>
            <b>title races</b>
            <small>plus a three-team playoff fight</small>
          </div>
        </div>

        <div className="hcr-race-grid">
          {raceCards.map((card) => (
            <Link key={card.label} to={card.to} className={`hcr-race-card hcr-${card.tone}`}>
              <div className="hcr-race-top">
                <span>{card.label}</span>
                <TeamMarks ids={card.teams} />
              </div>
              <h2>{card.title}</h2>
              <p>{card.copy}</p>
              <footer><b>{card.status}</b><span>Explore →</span></footer>
            </Link>
          ))}
        </div>

        <div className="hcr-legacy">
          <div className="hcr-legacy-copy">
            <span className="hcr-eyebrow">LP LEGACY LEAGUE · ROUND 3 COMPLETE</span>
            <h2>Badgers take top spot. Jackals keep climbing.</h2>
            <p>Honey Badgers beat LP Cheetahs 7–4, while LP Jackals defeated LP Eagles 8–4. The table, individual results and player statistics are now updated.</p>
            <Link to="/leagues?league=legacy">View Legacy standings and rankings →</Link>
          </div>
          <div className="hcr-legacy-results">
            {legacyResults.map((result) => {
              const winner = legacyFranchiseById(result.winnerId);
              const loser = legacyFranchiseById(result.loserId);
              return (
                <Link key={result.winnerId} to="/legacy-league" className="hcr-result-row">
                  <span><img src={winner?.logo} alt="" />{result.winner}</span>
                  <strong>{result.score}</strong>
                  <span>{result.loser}<img src={loser?.logo} alt="" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <HomeV2 />
    </>
  );
}
