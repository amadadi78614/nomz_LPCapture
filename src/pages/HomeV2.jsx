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
  { round: 5, winner: 'Globo Boomerangs', score: '15–7', loser: 'Ice Breakers', fixtureId: 'fx-w5-1' },
  { round: 5, winner: 'Sahara Lions', score: '12–10', loser: 'Avalanche Aces', fixtureId: 'fx-w5-2' },
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
            <i>{live.length ? `${live.length} LIVE` : 'ROUND 5 COMPLETE'}</i>
          </div>
          <article className="lpv2-now-feature">
            <span className="lpv2-kicker">FRANCHISE LEAGUE · ROUND 5</span>
            <strong>Boomerangs beat the Breakers.<br />Lions edge the Aces.</strong>
            <p>Globo Boomerangs won 15–7, while Sahara Lions claimed a dramatic 12–10 victory on 27 July.</p>
            <div className="lpv2-date-block">
              <span>Latest results</span>
              <b>BOOMERANGS 15–7 · LIONS 12–10</b>
            </div>
          </article>
          <div className="lpv2-now-row">
            <span><b>ROUND 5</b> Twelve rubbers completed · standings and player stats updated</span>
            <Link to="/live">All results →</Link>
          </div>
        </div>
      </section>

      <section className="lpv2-pulse" aria-label="Lowveld Padel latest highlights">
        <div><strong>R5</strong><span>Current round</span></div>
        <div><strong>15–7</strong><span>Boomerangs v Breakers</span></div>
        <div><strong>12–10</strong><span>Lions v Aces</span></div>
        <div><strong>29 JUL</strong><span>Ladies auction</span></div>
      </section>

      <section className="lpv2-section lpv2-story-section">
        <div className="lpv2-section-heading">
          <span className="lpv2-kicker">LATEST FROM LOWVELD PADEL</span>
          <h2>Round 5 delivers two statement results</h2>
        </div>
        <div className="lpv2-story-grid">
          <article className="lpv2-story lpv2-story-main">
            <span className="lpv2-story-number">01</span>
            <h3>Boomerangs defeat Ice Breakers 15–7</h3>
            <p>
              Globo Boomerangs collected four rubber wins, including three bonus-point victories,
              to secure the first completed result of Round 5.
            </p>
          </article>
          <article className="lpv2-story">
            <span className="lpv2-story-number">02</span>
            <h3>Lions survive an Aces fightback</h3>
            <p>Sahara Lions and Avalanche Aces split the rubbers 3–3, but the Lions took the fixture 12–10.</p>
          </article>
          <article className="lpv2-story">
            <span className="lpv2-story-number">03</span>
            <h3>Tables now include Round 5</h3>
            <p>The Franchise, P1, P2 and P3 tables now show rounds completed separately from rubbers played.</p>
          </article>
          <article className="lpv2-story">
            <span className="lpv2-story-number">04</span>
            <h3>Ladies League auction next</h3>
            <p>Sixty ladies across six franchises enter the biggest Ladies League auction yet on 29 July.</p>
          </article>
        </div>
      </section>

      <section className="lpv2-section">
        <div className="lpv2-section-heading lpv2-heading-row">
          <div>
            <span className="lpv2-kicker">ROUND 5 SCOREBOARD · 27 JULY</span>
            <h2>Tonight's Franchise League results</h2>
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
          <CompetitionCard eyebrow="Round 5 underway" title="Franchise League" copy="Boomerangs beat the Breakers and Lions edge the Aces." to="/leagues" tone="blue" status="View results & standings" />
          <CompetitionCard eyebrow="Record season" title="Ladies League" copy="60 ladies. Six franchises. Auction on 29 July." to="/leagues" tone="rose" status="Auction · 29 July" />
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
          <h2>Biggest Ladies League yet</h2>
          <p>
            Sixty ladies will compete across six franchises, with the player auction taking place
            on 29 July. The league forms part of Lowveld Padel's wider commitment to competitive
            growth, youth development and stronger family participation.
          </p>
          <Link to="/leagues">Explore all competitions →</Link>
        </div>
        <div className="lpv2-editorial-mark">60</div>
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
