import { Link } from 'react-router-dom';
import { FIXTURES, FRANCHISES, STANDINGS, franchiseById } from '../data/seed';
import '../styles/home-v3.css';

const LEGACY_RESULTS = [
  { winner: 'Honey Badgers', score: '7–4', loser: 'LP Cheetahs' },
  { winner: 'LP Jackals', score: '8–4', loser: 'LP Eagles' },
];

function buildHomepageDifferentials() {
  const stats = Object.fromEntries(
    FRANCHISES.filter((franchise) => franchise.league === 'mens')
      .map((franchise) => [franchise.id, { sd: 0, gd: 0, scoredRubbers: 0 }]),
  );

  FIXTURES.filter((fixture) => fixture.league === 'mens' && fixture.status === 'final' && fixture.stage !== 'qualifier')
    .forEach((fixture) => {
      (fixture.score?.rubbers || []).forEach((rubber) => {
        if (!Array.isArray(rubber.sets) || rubber.sets.length === 0) return;
        let homeSets = 0;
        let awaySets = 0;
        let homeGames = 0;
        let awayGames = 0;
        let hasValidSet = false;

        rubber.sets.forEach((setScore) => {
          if (!Array.isArray(setScore) || setScore.length < 2) return;
          const home = Number(setScore[0]);
          const away = Number(setScore[1]);
          if (!Number.isFinite(home) || !Number.isFinite(away)) return;
          hasValidSet = true;
          homeGames += home;
          awayGames += away;
          if (home > away) homeSets += 1;
          if (away > home) awaySets += 1;
        });

        if (!hasValidSet) return;
        if (stats[fixture.home]) {
          stats[fixture.home].sd += homeSets - awaySets;
          stats[fixture.home].gd += homeGames - awayGames;
          stats[fixture.home].scoredRubbers += 1;
        }
        if (stats[fixture.away]) {
          stats[fixture.away].sd += awaySets - homeSets;
          stats[fixture.away].gd += awayGames - homeGames;
          stats[fixture.away].scoredRubbers += 1;
        }
      });
    });

  return stats;
}

function signed(value) {
  const number = Number(value) || 0;
  return number > 0 ? `+${number}` : String(number);
}

function differentialClass(value) {
  const number = Number(value) || 0;
  if (number > 0) return 'hv3-pos';
  if (number < 0) return 'hv3-neg';
  return '';
}

function StandingRow({ row, index, differentials }) {
  const franchise = franchiseById(row.franchise_id);
  const differential = differentials[row.franchise_id] || { sd: 0, gd: 0, scoredRubbers: 0 };
  const rd = row.won - row.lost;
  const rounds = Math.round(row.played / 6);

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <Link to={`/franchise/${row.franchise_id}`} className="hv3-team">
          <img src={franchise.logo} alt="" />
          <span>{franchise.name}</span>
        </Link>
      </td>
      <td>{rounds}</td><td>{row.played}</td><td>{row.won}</td><td>{row.lost}</td>
      <td className={differentialClass(rd)}>{signed(rd)}</td>
      <td className={differentialClass(differential.sd)} title={`From ${differential.scoredRubbers} rubbers with recorded set scores`}>{signed(differential.sd)}</td>
      <td className={differentialClass(differential.gd)} title={`From ${differential.scoredRubbers} rubbers with recorded set scores`}>{signed(differential.gd)}</td>
      <td>{row.bp}</td><td><strong>{row.points}</strong></td>
    </tr>
  );
}

export default function HomeV3() {
  const standings = [...(STANDINGS.mens?.franchise || [])].sort((a, b) => b.points - a.points || b.won - a.won || b.bp - a.bp);
  const differentials = buildHomepageDifferentials();

  return (
    <main className="hv3">
      <section className="hv3-hero">
        <div>
          <span className="hv3-kicker">MEN'S FRANCHISE LEAGUE · FINALS SERIES</span>
          <h1>Sonics are through to a third successive final.</h1>
          <p>Sonic Viboras produced a complete qualifier performance to defeat Desert Falcons 15–8. One place remains in the final.</p>
          <div className="hv3-actions">
            <Link to="/live" className="hv3-primary">View match results</Link>
            <Link to="/leagues">Updated standings</Link>
          </div>
        </div>
        <div className="hv3-hero-panel">
          <span>QUALIFIER RESULT</span>
          <strong>SONICS 15</strong>
          <b>FALCONS 8</b>
          <small>Sonics book their third consecutive final appearance.</small>
        </div>
      </section>

      <section className="hv3-grid">
        <article>
          <span className="hv3-kicker">SEMI-FINAL SHOWDOWN</span>
          <h2>Falcons vs Lions. One final place.</h2>
          <p>The Falcons have lost two fixtures in succession. The Lions arrive with momentum after victories over Falcons and Ice Breakers. Who will face the Sonics?</p>
        </article>
        <article>
          <span className="hv3-kicker">P1 SHOCK</span>
          <h2>Uwaiz and Yusuf suffer their first defeat.</h2>
          <p>The Falcons' outstanding P1 pair were beaten for the first time as Coomans and Anton delivered a defining 3–0 result for the Sonics.</p>
        </article>
        <article>
          <span className="hv3-kicker">LATEST RESULTS</span>
          <div className="hv3-score"><span>Sahara Lions</span><strong>13–7</strong><span>Desert Falcons</span></div>
          <div className="hv3-score"><span>Ice Breakers</span><strong>17–4</strong><span>Kick Smashers</span></div>
          <div className="hv3-score"><span>Sahara Lions</span><strong>15–7</strong><span>Ice Breakers</span></div>
          <div className="hv3-score"><span>Sonic Viboras</span><strong>15–8</strong><span>Desert Falcons</span></div>
        </article>
      </section>

      <section className="hv3-section">
        <div className="hv3-heading">
          <div>
            <span className="hv3-kicker">REGULAR-SEASON POSITION</span>
            <h2>Men's Franchise League standings</h2>
          </div>
          <Link to="/leagues">Full league centre →</Link>
        </div>

        <div className="hv3-table-wrap">
          <table className="hv3-table">
            <thead><tr><th>#</th><th>Franchise</th><th>R</th><th>P</th><th>W</th><th>L</th><th>RD</th><th>SD</th><th>GD</th><th>BP</th><th>Pts</th></tr></thead>
            <tbody>{standings.map((row, index) => <StandingRow key={row.franchise_id} row={row} index={index} differentials={differentials} />)}</tbody>
          </table>
        </div>

        <div className="hv3-note">
          <strong>Table key:</strong> R = completed fixtures · P = rubbers played · RD = rubber difference · SD = set difference · GD = game difference · BP = bonus points.
          <br />Playoff and qualifier results are shown in Match Centre and player statistics but do not alter the completed regular-season table.
        </div>
      </section>

      <section className="hv3-grid">
        <article>
          <span className="hv3-kicker">LP LEGACY · ROUND 3</span>
          <h2>Badgers and Jackals win.</h2>
          {LEGACY_RESULTS.map((result) => <div className="hv3-score" key={result.winner}><span>{result.winner}</span><strong>{result.score}</strong><span>{result.loser}</span></div>)}
          <Link to="/leagues?league=legacy">Legacy table and stats →</Link>
        </article>
        <article>
          <span className="hv3-kicker">THE FINAL AWAITS</span>
          <h2>Sonics wait. Falcons and Lions collide.</h2>
          <p>Form says Lions. Pedigree says Falcons. The semi-final now decides the second finalist.</p>
          <Link to="/live">Follow the Finals Series →</Link>
        </article>
      </section>
    </main>
  );
}
