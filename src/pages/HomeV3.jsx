import { Link } from 'react-router-dom';
import { FIXTURES, FRANCHISES, STANDINGS, franchiseById } from '../data/seed';
import '../styles/home-v3.css';

const LEGACY_RESULTS = [
  { winner: 'LP Rhinos', score: '7–3', loser: 'LP Leopards' },
  { winner: 'LP Cheetahs', score: '7–4', loser: 'LP Leopards' },
  { winner: 'LP Eagles', score: '6–3', loser: 'LP Rhinos' },
  { winner: 'Honey Badgers', score: '7–3', loser: 'LP Jackals' },
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
          <span className="hv3-kicker">LADIES FRANCHISE LEAGUE · SEASON 2 · STARTS THIS WEEK</span>
          <h1>The spotlight turns to the ladies.</h1>
          <p>With the Men's Franchise League concluded and the Legacy League charging towards the playoff stages, the highly anticipated Season 2 of the Lowveld Ladies Franchise League is ready to take centre court.</p>
          <div className="hv3-actions">
            <Link to="/leagues?league=ladies" className="hv3-primary">Enter Ladies League</Link>
            <Link to="/leagues?league=legacy">Legacy playoff race</Link>
          </div>
        </div>
        <div className="hv3-hero-panel">
          <span>THE BIGGEST LADIES FRANCHISE FIELD YET</span>
          <strong>Season 2 starts this week</strong>
          <b>A NEW CHAPTER FOR LOWVELD PADEL</b>
          <small>More ladies than ever before are entering a Lowveld franchise league. New teams, new rivalries and a new title race are about to begin.</small>
        </div>
      </section>

      <section className="hv3-grid">
        <article>
          <span className="hv3-kicker">LADIES SEASON 2</span>
          <h2>Our biggest ladies league yet.</h2>
          <p>The largest group of ladies ever assembled for a Lowveld franchise league is ready to compete. The anticipation is huge — and the countdown is on.</p>
        </article>
        <article>
          <span className="hv3-kicker">MEN'S SEASON 3 · COMPLETE</span>
          <h2>Falcons leave the stage as champions.</h2>
          <p>Desert Falcons closed the Men's Franchise League with a memorable 14–8 Grand Final victory over two-time champions Sonic Viboras.</p>
        </article>
        <article>
          <span className="hv3-kicker">LP LEGACY · RUN-IN</span>
          <h2>The playoff race is heating up.</h2>
          <p>With the Legacy League moving towards its playoff stages, every remaining match carries serious weight before the postseason picture is locked in.</p>
        </article>
      </section>

      <section className="hv3-section">
        <div className="hv3-heading">
          <div>
            <span className="hv3-kicker">STAY CLOSE TO THE ACTION</span>
            <h2>Fixtures, results and updates all week.</h2>
          </div>
          <Link to="/leagues?league=ladies">Ladies League centre →</Link>
        </div>
        <div className="hv3-grid">
          <article>
            <span className="hv3-kicker">WHATSAPP COMMUNITY</span>
            <h2>Watch the Lowveld Padel WhatsApp group.</h2>
            <p>Further Ladies League fixtures, team news, match updates and announcements will be shared through the Lowveld Padel WhatsApp group as the season gets underway.</p>
          </article>
          <article>
            <span className="hv3-kicker">NEW RIVALRIES</span>
            <h2>Fresh teams. Fresh pressure.</h2>
            <p>Season 2 brings a deeper field and a new set of match-ups, with every franchise starting from zero and every point there to be won.</p>
          </article>
          <article>
            <span className="hv3-kicker">THIS WEEK</span>
            <h2>It all begins now.</h2>
            <p>The men's champions have been crowned. Legacy is heading for the playoffs. Now the ladies take centre stage.</p>
          </article>
        </div>
      </section>

      <section className="hv3-section">
        <div className="hv3-heading">
          <div>
            <span className="hv3-kicker">SEASON 3 AWARDS</span>
            <h2>Men's Franchise League MVPs</h2>
          </div>
          <Link to="/rankings">Full player rankings →</Link>
        </div>
        <div className="hv3-grid">
          <article>
            <span className="hv3-kicker">P1 MVP · JOINT WINNERS</span>
            <h2>Yusuf Patel & Uwais Patel</h2>
            <p>The Desert Falcons pair were inseparable across the season and finished the job together in the final.</p>
          </article>
          <article>
            <span className="hv3-kicker">P2 MVP</span>
            <h2>Adil Patel</h2>
            <p>The Sahara Lions standout takes the P2 MVP award after an exceptional Season 3 campaign.</p>
          </article>
          <article>
            <span className="hv3-kicker">P3 MVP · JOINT WINNERS</span>
            <h2>Danie Rautenbach & Jude van den Berg</h2>
            <p>The Falcons pair close out Season 3 as joint P3 MVPs after another winning performance in the Grand Final.</p>
          </article>
        </div>
      </section>

      <section className="hv3-section">
        <div className="hv3-heading">
          <div>
            <span className="hv3-kicker">FINAL REGULAR-SEASON POSITION</span>
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
          <strong>Six-round regular season:</strong> every franchise played six fixtures before the playoffs. Playoff and final results appear separately and do not change the regular-season table.
          <br />
          R = rounds · P = rubbers · RD = rubber difference · SD = set difference · GD = game difference · BP = bonus points.
        </div>
      </section>

      <section className="hv3-section hv3-closing">
        <span className="hv3-kicker">LP LEGACY · 15 AUGUST 2026</span>
        <h2>Four fresh Legacy results reshape the table.</h2>
        {LEGACY_RESULTS.map((result) => (
          <div className="hv3-score" key={`${result.winner}-${result.loser}`}>
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
