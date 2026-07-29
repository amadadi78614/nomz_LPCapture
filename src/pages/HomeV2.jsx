import { Link } from 'react-router-dom';
import {
  FIXTURES,
  STANDINGS,
  TV_VIDEOS,
  franchiseById,
  teamForm,
  ytThumb,
} from '../data/seed';
import { SponsorRail } from '../components/ui';
import '../styles/home-v2.css';

function roundsPlayed(franchiseId) {
  return new Set(
    FIXTURES.filter(
      (fixture) => fixture.league === 'mens'
        && fixture.status === 'final'
        && (fixture.home === franchiseId || fixture.away === franchiseId),
    ).map((fixture) => fixture.round),
  ).size;
}

function CompetitionCard({ eyebrow, title, copy, to, tone = 'gold', status }) {
  return (
    <Link to={to} className={`lpv2-competition lpv2-competition-${tone}`}>
      <span className="lpv2-kicker">{eyebrow}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
      <div className="lpv2-competition-foot">
        <span>{status || 'Explore competition'}</span>
        <b>→</b>
      </div>
    </Link>
  );
}

const ROUND_FIVE_RESULTS = [
  { round: 5, winner: 'Sahara Lions', score: '18–3', loser: 'Samurai Kick Smashers', fixtureId: 'fx-w5-3', date: '29 Jul' },
  { round: 5, winner: 'Globo Boomerangs', score: '15–7', loser: 'Ice Breakers', fixtureId: 'fx-w5-1', date: '27 Jul' },
  { round: 5, winner: 'Sahara Lions', score: '12–10', loser: 'Avalanche Aces', fixtureId: 'fx-w5-2', date: '27 Jul' },
];

const PREVIOUS_FRANCHISE_RESULTS = [
  { round: 4, winner: 'Sonic Viboras', score: '13–7', loser: 'Sahara Lions' },
  { round: 4, winner: 'Globo Boomerangs', score: '13–6', loser: 'Avalanche Aces' },
  { round: 4, winner: 'Desert Falcons', score: '14–7', loser: 'Ice Breakers' },
  { round: 4, winner: 'Globo Boomerangs', score: '16–7', loser: 'Samurai Kick Smashers' },
];

const LEGACY_ROUND_TWO = [
  { winner: 'Honey Badgers', score: '7–4', loser: 'Leopards' },
  { winner: 'Jackals', score: '7–4', loser: 'Rhinos' },
  { winner: 'Cheetahs', score: '8–3', loser: 'Eagles' },
];

export default function HomeV2() {
  const live = FIXTURES.filter((fixture) => fixture.status === 'live');
  const results = FIXTURES.filter((fixture) => fixture.status === 'final').slice(-3).reverse();
  const nextFixture = FIXTURES.find((fixture) => fixture.status === 'scheduled');
  const standings = STANDINGS.mens?.franchise || [];

  return (
    <main className="lpv2">
      <section className="lpv2-hero">
        <div className="lpv2-hero-grid" />
        <div className="lpv2-hero-content">
          <span className="lpv2-kicker">LOWVELD PADEL · 2026</span>
          <h1>More than a league.<br /><em>A movement.</em></h1>
          <p className="lpv2-hero-copy">
            Growing competitive padel across Mpumalanga through elite franchise competition,
            a record ladies league, youth development and family-centred events.
          </p>
          <div className="lpv2-actions">
            <Link to="/live" className="lpv2-btn lpv2-btn-primary">Match centre</Link>
            <Link to="/standings" className="lpv2-btn">Live standings</Link>
            <Link to="/tv" className="lpv2-btn">Lowveld TV</Link>
          </div>
        </div>

        <div className="lpv2-now">
          <div className="lpv2-now-head">
            <span>Latest news</span>
            <i>{live.length ? `${live.length} LIVE` : 'ROUND 5 UPDATED'}</i>
          </div>
          <article className="lpv2-now-feature">
            <span className="lpv2-kicker">FRANCHISE LEAGUE · ROUND 5</span>
            <strong>Lions roar past<br />Kick Smashers 18–3.</strong>
            <p>Sahara Lions won five of six rubbers at Padel 24 on 29 July, collecting four bonus-point victories.</p>
            <div className="lpv2-date-block">
              <span>Latest result</span>
              <b>LIONS 18–3 KICK SMASHERS</b>
            </div>
          </article>
          <div className="lpv2-now-row">
            <span><b>ROUND 5</b> Lions add another major win · standings and player stats updated</span>
            <Link to="/live">All results →</Link>
          </div>
        </div>
      </section>

      <section className="lpv2-pulse" aria-label="Lowveld Padel latest highlights">
        <div><strong>R5</strong><span>Current round</span></div>
        <div><strong>18–3</strong><span>Lions v Kick Smashers</span></div>
        <div><strong>5–1</strong><span>Rubber wins</span></div>
        <div><strong>29 JUL</strong><span>Latest result</span></div>
      </section>

      <section className="lpv2-section lpv2-story-section">
        <div className="lpv2-section-heading">
          <span className="lpv2-kicker">LATEST FROM LOWVELD PADEL</span>
          <h2>Lions produce the biggest Round 5 win</h2>
        </div>
        <div className="lpv2-story-grid">
          <article className="lpv2-story lpv2-story-main">
            <span className="lpv2-story-number">01</span>
            <h3>Sahara Lions dominate 18–3</h3>
            <p>
              The Lions won five rubbers against Samurai Kick Smashers, including four 4–0 bonus-point victories,
              to record the latest headline result of Round 5.
            </p>
          </article>
          <article className="lpv2-story">
            <span className="lpv2-story-number">02</span>
            <h3>Cian and Yusuf set the tone</h3>
            <p>Cian Maritz and Yusuf Packery opened the night with a 6–4, 6–2, 11–9 victory in P1.</p>
          </article>
          <article className="lpv2-story">
            <span className="lpv2-story-number">03</span>
            <h3>Round 5 tables updated</h3>
            <p>The Franchise, P1, P2 and P3 standings now include the 29 July result and completed rounds.</p>
          </article>
          <article className="lpv2-story">
            <span className="lpv2-story-number">04</span>
            <h3>Match Centre has the full breakdown</h3>
            <p>All six rubbers, pairings and set scores are available in the Round 5 Match Centre.</p>
          </article>
        </div>
      </section>

      <section className="lpv2-section">
        <div className="lpv2-section-heading lpv2-heading-row">
          <div>
            <span className="lpv2-kicker">ROUND 5 SCOREBOARD · UPDATED 29 JULY</span>
            <h2>Latest Franchise League results</h2>
          </div>
          <Link to="/live">Full Match Centre →</Link>
        </div>
        <div className="lpv2-results">
          {ROUND_FIVE_RESULTS.map((result) => (
            <Link key={result.fixtureId} to={`/match/${result.fixtureId}`} className="lpv2-result-row">
              <span className="lpv2-round">R{result.round}</span>
              <span className="lpv2-result-team">{result.winner}</span>
              <strong>{result.score.split('–')[0]}</strong>
              <span className="lpv2-result-team">{result.loser}</span>
              <strong>{result.score.split('–')[1]}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="lpv2-section">
        <div className="lpv2-section-heading lpv2-heading-row">
          <div>
            <span className="lpv2-kicker">ROUND 4 SCOREBOARD</span>
            <h2>Previous Franchise League results</h2>
          </div>
          <Link to="/live">All results →</Link>
        </div>
        <div className="lpv2-results">
          {PREVIOUS_FRANCHISE_RESULTS.map((result) => (
            <Link key={`${result.winner}-${result.loser}`} to="/live" className="lpv2-result-row">
              <span className="lpv2-round">R{result.round}</span>
              <span className="lpv2-result-team">{result.winner}</span>
              <strong>{result.score.split('–')[0]}</strong>
              <span className="lpv2-result-team">{result.loser}</span>
              <strong>{result.score.split('–')[1]}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="lpv2-section">
        <div className="lpv2-section-heading lpv2-heading-row">
          <div>
            <span className="lpv2-kicker">ROUND 2 SCOREBOARD</span>
            <h2>Legacy League results</h2>
          </div>
          <Link to="/legacy-league">Full Legacy League →</Link>
        </div>
        <div className="lpv2-results">
          {LEGACY_ROUND_TWO.map((result) => (
            <Link key={`${result.winner}-${result.loser}`} to="/legacy-league" className="lpv2-result-row">
              <span className="lpv2-round">R2</span>
              <span className="lpv2-result-team">{result.winner}</span>
              <strong>{result.score.split('–')[0]}</strong>
              <span className="lpv2-result-team">{result.loser}</span>
              <strong>{result.score.split('–')[1]}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="lpv2-section">
        <div className="lpv2-section-heading lpv2-heading-row">
          <div>
            <span className="lpv2-kicker">COMPETITION CENTRE</span>
            <h2>Every league. One community.</h2>
          </div>
          <Link to="/leagues">View all leagues →</Link>
        </div>
        <div className="lpv2-competition-grid">
          <CompetitionCard eyebrow="Round 5 updated" title="Franchise League" copy="Lions defeat Kick Smashers 18–3 in the latest result." to="/leagues" tone="blue" status="View results & standings" />
          <CompetitionCard eyebrow="Record season" title="Ladies League" copy="60 ladies. Six franchises. Season preparations continue." to="/leagues" tone="rose" status="Explore Ladies League" />
          <CompetitionCard eyebrow="Round 2 complete" title="LP Legacy" copy="Cheetahs lead after another action-packed round." to="/legacy-league" tone="gold" status="View results & standings" />
          <CompetitionCard eyebrow="International Nations Cup" title="Unity Cup" copy="Competition format and scheduling are under review." to="/unity-cup" tone="muted" status="On hold" />
        </div>
      </section>

      <section className="lpv2-section lpv2-match-section">
        <div className="lpv2-section-heading lpv2-heading-row">
          <div>
            <span className="lpv2-kicker">MATCH CENTRE</span>
            <h2>Results and next action</h2>
          </div>
          <Link to="/live">Full match centre →</Link>
        </div>
        <div className="lpv2-match-grid">
          <div className="lpv2-results">
            {results.map((fixture) => {
              const home = franchiseById(fixture.home);
              const away = franchiseById(fixture.away);
              const score = fixture.score?.totals || fixture.score?.rubberWins || ['–', '–'];
              return (
                <Link key={fixture.id} to={`/match/${fixture.id}`} className="lpv2-result-row">
                  <span className="lpv2-round">R{fixture.round}</span>
                  <span className="lpv2-result-team"><img src={home.logo} alt="" />{home.name}</span>
                  <strong>{score[0]}</strong>
                  <span className="lpv2-result-team"><img src={away.logo} alt="" />{away.name}</span>
                  <strong>{score[1]}</strong>
                </Link>
              );
            })}
          </div>
          <aside className="lpv2-next">
            <span className="lpv2-kicker">NEXT FIXTURE</span>
            {nextFixture ? (
              <>
                <h3>{franchiseById(nextFixture.home).name}<br /><small>vs</small><br />{franchiseById(nextFixture.away).name}</h3>
                <p>{new Date(nextFixture.start).toLocaleString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                <Link to={`/match/${nextFixture.id}`}>Match preview →</Link>
              </>
            ) : <p>Next fixtures will be announced soon.</p>}
          </aside>
        </div>
      </section>

      <section className="lpv2-section">
        <div className="lpv2-section-heading lpv2-heading-row">
          <div>
            <span className="lpv2-kicker">LEAGUE TABLE · UPDATED THROUGH ROUND 5</span>
            <h2>Championship standings</h2>
          </div>
          <Link to="/standings">Full standings →</Link>
        </div>
        <div className="lpv2-table-wrap">
          <table className="lpv2-table lpv2-table-mobile-cards">
            <thead><tr><th>#</th><th>Franchise</th><th>R</th><th>P</th><th>W</th><th>L</th><th>Pts</th><th>Form</th></tr></thead>
            <tbody>
              {standings.slice(0, 7).map((row, index) => {
                const franchise = franchiseById(row.franchise_id);
                const form = teamForm(row.franchise_id, 5);
                return (
                  <tr key={row.franchise_id}>
                    <td data-label="Position">{index + 1}</td>
                    <td data-label="Franchise"><Link to={`/franchise/${franchise.id}`}><img src={franchise.logo} alt="" />{franchise.name}</Link></td>
                    <td data-label="Rounds"><b>{roundsPlayed(row.franchise_id)}</b></td>
                    <td data-label="Played">{row.played}</td>
                    <td data-label="Won">{row.won}</td>
                    <td data-label="Lost">{row.lost}</td>
                    <td data-label="Points"><b>{row.points}</b></td>
                    <td data-label="Form"><span className="lpv2-form">{form.length ? form.join(' ') : '—'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="lpv2-section lpv2-editorial">
        <div>
          <span className="lpv2-kicker">THE NEXT CHAPTER</span>
          <h2>Lowveld Padel keeps growing</h2>
          <p>
            The Franchise League, Ladies League, Legacy League and community competitions continue
            to build a stronger competitive padel ecosystem across the Lowveld.
          </p>
          <Link to="/leagues">Explore all competitions →</Link>
        </div>
        <div className="lpv2-editorial-mark">LP</div>
      </section>

      {TV_VIDEOS.length > 0 && (
        <section className="lpv2-section">
          <div className="lpv2-section-heading lpv2-heading-row">
            <div><span className="lpv2-kicker">LOWVELD TV</span><h2>Watch the action</h2></div>
            <Link to="/tv">All videos →</Link>
          </div>
          <div className="lpv2-tv-grid">
            {TV_VIDEOS.slice(0, 3).map((video) => (
              <Link key={video.id} to="/tv" className="lpv2-video">
                <div>{(video.thumbnail || ytThumb(video.youtube_url)) && <img src={video.thumbnail || ytThumb(video.youtube_url)} alt={video.title} />}<span>▶</span></div>
                <b>{video.title}</b>
                <small>{video.category}</small>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="lpv2-section"><SponsorRail placement="home" /></section>
    </main>
  );
}
