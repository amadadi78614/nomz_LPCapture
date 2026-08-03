import { Link } from 'react-router-dom';
import { FIXTURES, FRANCHISES, franchiseById } from '../data/seed';
import '../styles/home-v3.css';

const FRANCHISE_TABLE = [
  { id: 'desert-falcons', r: 5, p: 30, w: 24, l: 6, bp: 16, pts: 88 },
  { id: 'sonic-viboras', r: 6, p: 36, w: 22, l: 14, bp: 11, pts: 77 },
  { id: 'globo-boomerangs', r: 6, p: 36, w: 17, l: 19, bp: 10, pts: 61 },
  { id: 'sahara-lions', r: 5, p: 30, w: 16, l: 14, bp: 10, pts: 58 },
  { id: 'ice-breakers', r: 5, p: 30, w: 13, l: 17, bp: 9, pts: 48 },
  { id: 'avalanche-aces', r: 6, p: 36, w: 13, l: 23, bp: 3, pts: 42 },
  { id: 'samurai-kicksmashers', r: 5, p: 30, w: 9, l: 21, bp: 5, pts: 32 },
];

const LEGACY_RESULTS = [
  { winner: 'Honey Badgers', score: '7–4', loser: 'LP Cheetahs' },
  { winner: 'LP Jackals', score: '8–4', loser: 'LP Eagles' },
];

function buildHomepageDifferentials() {
  const stats = Object.fromEntries(
    FRANCHISES.filter((franchise) => franchise.league === 'mens')
      .map((franchise) => [franchise.id, { sd: 0, gd: 0, scoredRubbers: 0 }]),
  );

  FIXTURES.filter((fixture) => fixture.league === 'mens' && fixture.status === 'final')
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

const HOMEPAGE_DIFFERENTIALS = buildHomepageDifferentials();

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

function StandingRow({ row, index }) {
  const franchise = franchiseById(row.id);
  const differential = HOMEPAGE_DIFFERENTIALS[row.id] || { sd: 0, gd: 0, scoredRubbers: 0 };
  const rd = row.w - row.l;

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
      <td className={differentialClass(rd)}>{signed(rd)}</td>
      <td className={differentialClass(differential.sd)} title={`From ${differential.scoredRubbers} rubbers with recorded set scores`}>{signed(differential.sd)}</td>
      <td className={differentialClass(differential.gd)} title={`From ${differential.scoredRubbers} rubbers with recorded set scores`}>{signed(differential.gd)}</td>
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
              <tr>
                <th>#</th><th>Franchise</th><th>R</th><th>P</th><th>W</th><th>L</th>
                <th title="Rubber difference">RD</th>
                <th title="Set difference">SD</th>
                <th title="Game difference">GD</th>
                <th>BP</th><th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {FRANCHISE_TABLE.map((row, index) => <StandingRow key={row.id} row={row} index={index} />)}
            </tbody>
          </table>
        </div>

        <div className="hv3-note">
          <strong>Table key:</strong> R = completed fixtures · P = rubbers played · RD = rubber difference · SD = set difference · GD = game difference · BP = bonus points.
          <br />
          RD is calculated from rubber wins and losses. SD and GD are calculated from all currently captured set scores and will update automatically when further historical scores are added.
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
