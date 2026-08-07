import { Link } from 'react-router-dom';
import { FIXTURES, FRANCHISES, STANDINGS, franchiseById } from '../data/seed';
import '../styles/home-v3.css';

const LEGACY_RESULTS = [
  { winner: 'Honey Badgers', score: '7–4', loser: 'LP Cheetahs' },
  { winner: 'LP Jackals', score: '8–4', loser: 'LP Eagles' },
];

const isRegularSeasonFixture = (fixture) =>
  fixture.league === 'mens'
  && fixture.status === 'final'
  && !fixture.stage
  && Number(fixture.round) <= 6;

function buildHomepageDifferentials() {
  const stats = Object.fromEntries(
    FRANCHISES.filter((franchise) => franchise.league === 'mens')
      .map((franchise) => [franchise.id, { sd: 0, gd: 0, scoredRubbers: 0 }]),
  );

  FIXTURES.filter(isRegularSeasonFixture).forEach((fixture) => {
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

function regularSeasonRows() {
  return [...(STANDINGS.mens?.franchise || [])]
    .map((row) => ({
      id: row.franchise_id,
      r: Math.min(6, Math.round((Number(row.played) || 0) / 6)),
      p: Number(row.played) || 0,
      w: Number(row.won) || 0,
      l: Number(row.lost) || 0,
      bp: Number(row.bp) || 0,
      pts: Number(row.points) || 0,
    }))
    .sort((a, b) => b.pts - a.pts || b.w - a.w || b.bp - a.bp || a.l - b.l);
}

function StandingRow({ row, index }) {
  const franchise = franchiseById(row.id);
  const differential = HOMEPAGE_DIFFERENTIALS[row.id] || { sd: 0, gd: 0, scoredRubbers: 0 };
  const rd = row.w - row.l;

  return (
    <tr>
      <td data-label="#">{index + 1}</td>
      <td data-label="Franchise">
        <Link to={`/franchise/${row.id}`} className="hv3-team">
          <img src={franchise.logo} alt="" />
          <span>{franchise.name}</span>
        </Link>
      </td>
      <td data-label="Rounds">{row.r}</td>
      <td data-label="Rubbers">{row.p}</td>
      <td data-label="Won">{row.w}</td>
      <td data-label="Lost">{row.l}</td>
      <td data-label="RD" className={differentialClass(rd)}>{signed(rd)}</td>
      <td data-label="SD" className={differentialClass(differential.sd)} title={`From ${differential.scoredRubbers} regular-season rubbers with recorded set scores`}>{signed(differential.sd)}</td>
      <td data-label="GD" className={differentialClass(differential.gd)} title={`From ${differential.scoredRubbers} regular-season rubbers with recorded set scores`}>{signed(differential.gd)}</td>
      <td data-label="BP">{row.bp}</td>
      <td data-label="Points"><strong>{row.pts}</strong></td>
    </tr>
  );
}

export default function HomeV3() {
  const standings = regularSeasonRows();

  return (
    <main className="hv3">
      <section className="hv3-hero">
        <div>
          <span className="hv3-kicker">MEN'S FRANCHISE LEAGUE · FINALS SERIES</span>
          <h1>Sonics reach a third straight final.</h1>
          <p>Sonic Viboras delivered when it mattered, beating the Falcons 15–8 to book another place in the championship match.</p>
          <div className="hv3-actions">
            <Link to="/live" className="hv3-primary">View playoff results</Link>
            <Link to="/leagues">Regular-season table</Link>
          </div>
        </div>
        <div className="hv3-hero-panel">
          <span>SEMI-FINAL</span>
          <strong>Falcons v Lions</strong>
          <b>One final place remains</b>
          <small>Lions carry momentum. Falcons must stop a two-match slide.</small>
        </div>
      </section>

      <section className="hv3-grid">
        <article>
          <span className="hv3-kicker">SONICS SURGE</span>
          <h2>Three finals in three seasons.</h2>
          <p>The Sonics pulled out all the stops in the qualifier and now wait for the winner of Falcons versus Lions.</p>
        </article>
        <article>
          <span className="hv3-kicker">P1 SHOCK</span>
          <h2>Uwaiz and Yusuf suffer their first defeat.</h2>
          <p>The Falcons’ outstanding P1 pair were beaten for the first time as Coomans and Anton claimed a defining 3–0 result.</p>
        </article>
        <article>
          <span className="hv3-kicker">THE FUTURE IS NOW</span>
          <h2>Four young winners.</h2>
          <p>Aadam Nomani (10), Jude van den Berg (12), Yusuf Packery (13) and Joshua Hoffman (13) have all won in the past two matchdays.</p>
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
              {standings.map((row, index) => <StandingRow key={row.id} row={row} index={index} />)}
            </tbody>
          </table>
        </div>

        <div className="hv3-note">
          <strong>Six-round regular season:</strong> every franchise plays six fixtures before the playoffs. Playoff, eliminator and qualifier results appear in Match Centre and player statistics but do not change this table.
          <br />
          R = rounds · P = rubbers · RD = rubber difference · SD = set difference · GD = game difference · BP = bonus points.
        </div>
      </section>

      <section className="hv3-section hv3-closing">
        <span className="hv3-kicker">LP LEGACY · ROUND 3</span>
        <h2>Badgers and Jackals win.</h2>
        {LEGACY_RESULTS.map((result) => (
          <div className="hv3-score" key={result.winner}>
            <span>{result.winner}</span><strong>{result.score}</strong><span>{result.loser}</span>
          </div>
        ))}
        <div className="hv3-actions">
          <Link to="/leagues?league=legacy" className="hv3-primary">Legacy standings</Link>
          <Link to="/rankings">Player rankings</Link>
          <Link to="/leagues?league=ladies">Ladies League</Link>
        </div>
      </section>
    </main>
  );
}
