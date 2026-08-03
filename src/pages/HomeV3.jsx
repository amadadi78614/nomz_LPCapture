import { Link } from 'react-router-dom';
import { franchiseById } from '../data/seed';
import '../styles/home-v3.css';

const FRANCHISE_TABLE = [
  { id: 'desert-falcons', r: 5, p: 30, w: 24, l: 6, rd: 18, bp: 16, pts: 88 },
  { id: 'sonic-viboras', r: 6, p: 36, w: 22, l: 14, rd: 8, bp: 11, pts: 77 },
  { id: 'globo-boomerangs', r: 6, p: 36, w: 17, l: 19, rd: -2, bp: 10, pts: 61 },
  { id: 'sahara-lions', r: 5, p: 30, w: 16, l: 14, rd: 2, bp: 10, pts: 58 },
  { id: 'ice-breakers', r: 5, p: 30, w: 13, l: 17, rd: -4, bp: 9, pts: 48 },
  { id: 'avalanche-aces', r: 6, p: 36, w: 13, l: 23, rd: -10, bp: 3, pts: 42 },
  { id: 'samurai-kicksmashers', r: 5, p: 30, w: 9, l: 21, rd: -12, bp: 5, pts: 32 },
];

const LEGACY_RESULTS = [
  { winner: 'Honey Badgers', score: '7–4', loser: 'LP Cheetahs' },
  { winner: 'LP Jackals', score: '8–4', loser: 'LP Eagles' },
];

function StandingRow({ row, index }) {
  const franchise = franchiseById(row.id);
  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <Link to={`/franchise/${row.id}`} className="hv3-team">
          <img src={franchise.logo} alt="" />
          <span>{franchise.name}</span>
        </Link>
      </td>
      <td>{row.r}</td>
      <td>{row.p}</td>
      <td>{row.w}</td>
      <td>{row.l}</td>
      <td className={row.rd > 0 ? 'hv3-pos' : row.rd < 0 ? 'hv3-neg' : ''}>{row.rd > 0 ? `+${row.rd}` : row.rd}</td>
      <td>{row.bp}</td>
      <td><strong>{row.pts}</strong></td>
    </tr>
  );
}

export default function HomeV3() {
  return (
    <main className="hv3">
      <section className="hv3-hero">
        <div>
          <span className="hv3-kicker">MEN'S FRANCHISE LEAGUE · SEASON 3</span>
          <h1>The title race is alive.</h1>
          <p>Falcons lead the overall table, the P1 and P2 crowns are still in play, and the fight for Finals Night is tightening.</p>
          <div className="hv3-actions">
            <Link to="/leagues" className="hv3-primary">View full standings</Link>
            <Link to="/live">Match Centre</Link>
          </div>
        </div>
        <div className="hv3-hero-panel">
          <span>P1 TITLE RACE</span>
          <strong>Falcons 36</strong>
          <b>Lions 31</b>
          <small>Two matches remain for each team.</small>
        </div>
      </section>

      <section className="hv3-grid">
        <article>
          <span className="hv3-kicker">P2 TITLE DECIDER</span>
          <h2>Globo set the target at 32.</h2>
          <p>Desert Falcons sit on 24 with two matches left. They need the full eight points to draw level.</p>
        </article>
        <article>
          <span className="hv3-kicker">FINALS NIGHT BATTLE</span>
          <h2>Three teams. Two spots.</h2>
          <p>Globo Boomerangs, Sahara Lions and Ice Breakers remain in the race for the final playoff positions.</p>
        </article>
        <article>
          <span className="hv3-kicker">LP LEGACY · ROUND 3</span>
          <h2>Badgers and Jackals win.</h2>
          {LEGACY_RESULTS.map((result) => (
            <div className="hv3-score" key={result.winner}>
              <span>{result.winner}</span><strong>{result.score}</strong><span>{result.loser}</span>
            </div>
          ))}
          <Link to="/legacy-league">Legacy table and stats →</Link>
        </article>
      </section>

      <section className="hv3-section">
        <div className="hv3-heading">
          <div>
            <span className="hv3-kicker">CURRENT VERIFIED POSITION</span>
            <h2>Men's Franchise League standings</h2>
          </div>
          <Link to="/leagues">Full league centre →</Link>
        </div>

        <div className="hv3-table-wrap">
          <table className="hv3-table">
            <thead>
              <tr><th>#</th><th>Franchise</th><th>R</th><th>P</th><th>W</th><th>L</th><th>RD</th><th>BP</th><th>Pts</th></tr>
            </thead>
            <tbody>
              {FRANCHISE_TABLE.map((row, index) => <StandingRow key={row.id} row={row} index={index} />)}
            </tbody>
          </table>
        </div>

        <div className="hv3-note">
          <strong>Table key:</strong> R = completed fixtures · P = rubbers played · RD = rubber difference · BP = bonus points.
          <br />
          Set difference and game difference are not displayed yet because some earlier fixtures do not have complete underlying set scores. They will only be published once the historical score gaps are verified.
        </div>
      </section>

      <section className="hv3-section hv3-closing">
        <span className="hv3-kicker">WHAT'S NEXT</span>
        <h2>Every point now changes the season.</h2>
        <p>Follow the title races, Finals Night qualification and updated player rankings across every competition.</p>
        <div className="hv3-actions">
          <Link to="/rankings" className="hv3-primary">Player rankings</Link>
          <Link to="/leagues?league=legacy">LP Legacy League</Link>
          <Link to="/leagues?league=ladies">Ladies League</Link>
        </div>
      </section>
    </main>
  );
}
