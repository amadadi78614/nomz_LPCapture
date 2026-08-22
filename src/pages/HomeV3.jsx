import { Link } from 'react-router-dom';
import { FRANCHISES, STANDINGS, franchiseById, legacyFranchiseById } from '../data/seed';
import { LEGACY_LIVE_STANDINGS } from '../data/legacyLive';
import '../styles/home-v3.css';

const TODAY_RESULTS = [
  { home: 'LP Cheetahs', homeScore: 9, awayScore: 0, away: 'LP Jackals' },
  { home: 'LP Eagles', homeScore: 4, awayScore: 7, away: 'LP Leopards' },
  { home: 'Honey Badgers', homeScore: 4, awayScore: 8, away: 'LP Rhinos' },
];

const channels = [
  {
    eyebrow: 'LP LEGACY',
    title: 'The league phase is complete.',
    copy: 'Cheetahs finish top on 36 points after a dominant final-round statement. The playoff picture is locked.',
    stat: '36',
    statLabel: 'PTS · CHEETAHS',
    to: '/leagues?league=legacy',
    cta: 'Open Legacy League',
    tone: 'gold',
  },
  {
    eyebrow: 'LADIES FRANCHISE LEAGUE',
    title: 'Season 2 takes centre court.',
    copy: 'A deeper field, fresh rivalries and the biggest ladies franchise season yet. Follow fixtures, teams and the title race.',
    stat: 'S2',
    statLabel: 'NOW LIVE',
    to: '/leagues?league=ladies',
    cta: 'Enter Ladies League',
    tone: 'blue',
  },
  {
    eyebrow: "MEN'S FRANCHISE LEAGUE",
    title: 'Falcons reign as champions.',
    copy: 'Season 3 is in the books after Desert Falcons beat two-time champions Sonic Viboras 14–8 in the Grand Final.',
    stat: '14–8',
    statLabel: 'GRAND FINAL',
    to: '/leagues?league=mens',
    cta: 'Season 3 archive',
    tone: 'red',
  },
];

function signed(value) {
  const n = Number(value) || 0;
  return n > 0 ? `+${n}` : String(n);
}

function legacyRows() {
  return [...LEGACY_LIVE_STANDINGS].map((row) => ({ ...row, franchise: legacyFranchiseById(row.franchise_id) }));
}

function mensLeaders() {
  return [...(STANDINGS.mens?.franchise || [])]
    .sort((a, b) => Number(b.points || 0) - Number(a.points || 0))
    .slice(0, 3)
    .map((row) => ({ ...row, franchise: franchiseById(row.franchise_id) }));
}

export default function HomeV3() {
  const legacy = legacyRows();
  const topThree = legacy.slice(0, 3);
  const mensTopThree = mensLeaders();
  const mensCount = FRANCHISES.filter((f) => f.league === 'mens').length;

  return (
    <main className="hv3">
      <section className="hv3-hero">
        <div className="hv3-hero-copy">
          <div className="hv3-live-pill"><span /> LOWVELD PADEL · 22 AUGUST 2026</div>
          <p className="hv3-overline">LP LEGACY LEAGUE · FINAL REGULAR-SEASON TABLE</p>
          <h1>CHEETAHS<br /><em>FINISH ON TOP.</em></h1>
          <p className="hv3-lead">Five fixtures. Four wins. Thirty-six points. The Cheetahs close the league phase at No. 1 and carry the momentum into the playoffs.</p>
          <div className="hv3-actions">
            <Link to="/leagues?league=legacy" className="hv3-primary">View final table</Link>
            <Link to="/rankings">Player rankings</Link>
          </div>
        </div>

        <aside className="hv3-hero-scoreboard">
          <div className="hv3-scoreboard-head">
            <span>FINAL TABLE</span>
            <b>TOP 3</b>
          </div>
          {topThree.map((row, index) => (
            <Link className={`hv3-podium-row hv3-podium-${index + 1}`} to={`/legacy-franchise/${row.franchise_id}`} key={row.franchise_id}>
              <span className="hv3-rank">{index + 1}</span>
              {row.franchise?.logo && <img src={row.franchise.logo} alt="" />}
              <span className="hv3-podium-name">{row.franchise?.name || row.franchise_id}</span>
              <strong>{row.points}</strong>
              <small>PTS</small>
            </Link>
          ))}
          <div className="hv3-hero-foot">
            <span>League phase complete</span>
            <Link to="/leagues?league=legacy">Full standings →</Link>
          </div>
        </aside>
      </section>

      <section className="hv3-score-strip" aria-label="Latest results">
        <div className="hv3-score-strip-title">
          <span className="hv3-dot" />
          <div><b>LATEST RESULTS</b><small>22 AUG · MATCHDAYS 13–14</small></div>
        </div>
        {TODAY_RESULTS.map((result) => (
          <div className="hv3-result" key={`${result.home}-${result.away}`}>
            <span>{result.home}</span>
            <strong>{result.homeScore}<i>–</i>{result.awayScore}</strong>
            <span>{result.away}</span>
          </div>
        ))}
        <Link className="hv3-results-link" to="/leagues?league=legacy">All results →</Link>
      </section>

      <section className="hv3-channel-section">
        <div className="hv3-section-heading">
          <div>
            <span className="hv3-kicker">YOUR LEAGUES</span>
            <h2>Three competitions. One Lowveld.</h2>
          </div>
          <p>Move straight into the competition you follow.</p>
        </div>
        <div className="hv3-channel-grid">
          {channels.map((channel) => (
            <Link to={channel.to} className={`hv3-channel hv3-channel-${channel.tone}`} key={channel.title}>
              <div>
                <span className="hv3-kicker">{channel.eyebrow}</span>
                <h3>{channel.title}</h3>
                <p>{channel.copy}</p>
              </div>
              <div className="hv3-channel-bottom">
                <div className="hv3-channel-stat"><strong>{channel.stat}</strong><span>{channel.statLabel}</span></div>
                <b>{channel.cta} →</b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="hv3-split">
        <div className="hv3-panel hv3-table-panel">
          <div className="hv3-panel-head">
            <div><span className="hv3-kicker">LP LEGACY</span><h2>Final standings</h2></div>
            <Link to="/leagues?league=legacy">League centre →</Link>
          </div>
          <div className="hv3-legacy-table">
            <div className="hv3-legacy-head"><span>#</span><span>TEAM</span><span>P</span><span>W</span><span>GD</span><span>PTS</span></div>
            {legacy.map((row, index) => (
              <Link to={`/legacy-franchise/${row.franchise_id}`} className={index === 0 ? 'hv3-legacy-row is-leader' : 'hv3-legacy-row'} key={row.franchise_id}>
                <span>{index + 1}</span>
                <span className="hv3-legacy-team">{row.franchise?.logo && <img src={row.franchise.logo} alt="" />}<b>{row.franchise?.name || row.franchise_id}</b></span>
                <span>{row.played}</span>
                <span>{row.won}</span>
                <span className={row.gd > 0 ? 'pos' : row.gd < 0 ? 'neg' : ''}>{signed(row.gd)}</span>
                <strong>{row.points}</strong>
              </Link>
            ))}
          </div>
          <p className="hv3-table-note">All six teams have completed five league fixtures. Rankings are ordered by accumulated Legacy League points.</p>
        </div>

        <aside className="hv3-panel hv3-feature-panel">
          <span className="hv3-kicker">THIS WEEK'S SPOTLIGHT</span>
          <div className="hv3-feature-number">S2</div>
          <h2>Now the ladies take over.</h2>
          <p>The men's champions have been crowned. Legacy has completed its league phase. The next chapter belongs to the Ladies Franchise League.</p>
          <div className="hv3-feature-list">
            <span><b>01</b> Fresh franchises and rivalries</span>
            <span><b>02</b> Fixtures and standings in one hub</span>
            <span><b>03</b> Rankings updated through the season</span>
          </div>
          <Link to="/leagues?league=ladies" className="hv3-primary hv3-wide">Follow Season 2</Link>
        </aside>
      </section>

      <section className="hv3-data-row">
        <article><span className="hv3-kicker">MEN'S SEASON 3</span><strong>{mensCount}</strong><p>franchises competed in the men's season.</p></article>
        <article><span className="hv3-kicker">LEGACY LEADER</span><strong>36</strong><p>points put Cheetahs at the top of the final table.</p></article>
        <article><span className="hv3-kicker">FINAL DAY</span><strong>3</strong><p>Legacy fixtures completed on 22 August.</p></article>
        <article><span className="hv3-kicker">MEN'S PODIUM</span><strong>{mensTopThree.length}</strong><p>regular-season leaders remain available in the full league archive.</p></article>
      </section>

      <section className="hv3-cta-band">
        <div>
          <span className="hv3-kicker">LOWVELD PADEL</span>
          <h2>Everything happening on court, in one place.</h2>
        </div>
        <div className="hv3-actions">
          <Link to="/live" className="hv3-primary">Match centre</Link>
          <Link to="/rankings">Rankings</Link>
          <Link to="/tv">Lowveld TV</Link>
          <Link to="/community">Community</Link>
        </div>
      </section>
    </main>
  );
}
