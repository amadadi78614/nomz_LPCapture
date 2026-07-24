import { Link } from 'react-router-dom';
import {
  FIXTURES,
  NEWS,
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

export default function HomeV2() {
  const live = FIXTURES.filter((fixture) => fixture.status === 'live');
  const results = FIXTURES.filter((fixture) => fixture.status === 'final').slice(-3).reverse();
  const nextFixture = FIXTURES.find((fixture) => fixture.status === 'scheduled');
  const standings = STANDINGS.mens?.franchise || [];
  const leadStory = NEWS[0];

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
            <span>Happening now</span>
            <i>{live.length ? `${live.length} LIVE` : 'LATEST'}</i>
          </div>
          <article className="lpv2-now-feature">
            <span className="lpv2-kicker">LADIES LEAGUE · BIGGER THAN EVER</span>
            <strong>60 ladies.<br />6 franchises.</strong>
            <p>The biggest Ladies League in Lowveld Padel history.</p>
            <div className="lpv2-date-block">
              <span>Auction</span>
              <b>29 JULY 2026</b>
            </div>
          </article>
          <div className="lpv2-now-row">
            <span><b>THIS WEEKEND</b> Legacy League Round 2</span>
            <Link to="/legacy-league">View league →</Link>
          </div>
        </div>
      </section>

      <section className="lpv2-pulse" aria-label="Lowveld Padel growth highlights">
        <div><strong>60</strong><span>Ladies registered</span></div>
        <div><strong>6</strong><span>Ladies franchises</span></div>
        <div><strong>7</strong><span>Men's franchises</span></div>
        <div><strong>R2</strong><span>Legacy this weekend</span></div>
      </section>

      <section className="lpv2-section lpv2-story-section">
        <div className="lpv2-section-heading">
          <span className="lpv2-kicker">THE NEXT CHAPTER</span>
          <h2>Building the future of padel</h2>
        </div>
        <div className="lpv2-story-grid">
          <article className="lpv2-story lpv2-story-main">
            <span className="lpv2-story-number">01</span>
            <h3>The largest Ladies League we have ever staged</h3>
            <p>
              Sixty players will enter six franchises, with the auction taking place on
              29 July. It is a major step forward for women's participation and competitive
              padel in the Lowveld.
            </p>
          </article>
          <article className="lpv2-story">
            <span className="lpv2-story-number">02</span>
            <h3>Legacy League Round 2</h3>
            <p>Fun, competitive and family-driven padel returns this weekend for the second round.</p>
          </article>
          <article className="lpv2-story">
            <span className="lpv2-story-number">03</span>
            <h3>Youth development</h3>
            <p>Creating a pathway for young players to learn, compete and become the next generation of Lowveld champions.</p>
          </article>
          <article className="lpv2-story">
            <span className="lpv2-story-number">04</span>
            <h3>Fathers, sons and family</h3>
            <p>Using padel to strengthen family bonds and create shared sporting memories across generations.</p>
          </article>
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
          <CompetitionCard eyebrow="Season 3" title="Franchise League" copy="The title race enters its decisive stage." to="/leagues" tone="blue" />
          <CompetitionCard eyebrow="Record season" title="Ladies League" copy="60 ladies. Six franchises. Auction on 29 July." to="/leagues" tone="rose" status="Auction · 29 July" />
          <CompetitionCard eyebrow="Family competition" title="LP Legacy" copy="Round 2 takes place this weekend." to="/legacy-league" tone="gold" status="Round 2 · This weekend" />
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
            <span className="lpv2-kicker">LEAGUE TABLE</span>
            <h2>Championship standings</h2>
          </div>
          <Link to="/standings">Full standings →</Link>
        </div>
        <div className="lpv2-table-wrap">
          <table className="lpv2-table">
            <thead><tr><th>#</th><th>Franchise</th><th>R</th><th>P</th><th>W</th><th>L</th><th>Pts</th><th>Form</th></tr></thead>
            <tbody>
              {standings.slice(0, 7).map((row, index) => {
                const franchise = franchiseById(row.franchise_id);
                const form = teamForm(row.franchise_id, 5);
                return (
                  <tr key={row.franchise_id}>
                    <td>{index + 1}</td>
                    <td><Link to={`/franchise/${franchise.id}`}><img src={franchise.logo} alt="" />{franchise.name}</Link></td>
                    <td>{roundsPlayed(row.franchise_id)}</td>
                    <td>{row.played}</td>
                    <td>{row.won}</td>
                    <td>{row.lost}</td>
                    <td><b>{row.points}</b></td>
                    <td><span className="lpv2-form">{form.length ? form.join(' ') : '—'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {leadStory && (
        <section className="lpv2-section lpv2-editorial">
          <div>
            <span className="lpv2-kicker">LATEST FROM LOWVELD PADEL</span>
            <h2>{leadStory.title}</h2>
            <p>{leadStory.body}</p>
            <Link to="/news">Read all news →</Link>
          </div>
          <div className="lpv2-editorial-mark">LP</div>
        </section>
      )}

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
