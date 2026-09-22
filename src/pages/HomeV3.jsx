import { Link } from 'react-router-dom';
import { LADIES_S2_STANDINGS, LADIES_S2_RANKINGS } from '../data/ladiesSeason2Round1Update';
import '../styles/home-v3.css';

const signed = (value) => Number(value) > 0 ? `+${value}` : String(value);

const headlines = [
  {
    eyebrow: 'MATCHWEEK 5 · 16 SEPTEMBER 2026',
    title: 'Lillies roar. Flames win. Blossoms still lead.',
    copy: 'Lunar Lillies stunned Backhand Blossoms 11–4, while Phoenix Flames beat Desert Roses 10–3. The leaders remain top—but the pressure is real.',
    stat: '11–4',
    statLabel: 'STATEMENT WIN',
    tone: 'blue',
  },
  {
    eyebrow: 'MATCHWEEK 5 · 15 SEPTEMBER 2026',
    title: 'Angels edge Novas in a 7–6 thriller.',
    copy: 'The teams split the four rubbers, but Lana Nel and Nazrana Meer’s four-point win proved decisive for Arctic Angels.',
    stat: '7–6',
    statLabel: 'ONE-POINT THRILLER',
    tone: 'red',
  },
  {
    eyebrow: 'UP NEXT · LADIES SEASON 2',
    title: 'The playoffs are coming.',
    copy: 'Every point has shaped the bracket. The regular-season run-in is reaching its conclusion and the next chapter is knockout padel.',
    stat: 'NEXT',
    statLabel: 'PLAYOFF STAGE',
    tone: 'gold',
  },
];

export default function HomeV3() {
  const ladiesTop = LADIES_S2_STANDINGS.slice(0, 3);
  const playoffTeams = LADIES_S2_STANDINGS.slice(0, 4);
  const mvpTop = LADIES_S2_RANKINGS.slice(0, 3);

  return <main className="hv3">
    <section className="hv3-hero hv3-ladies-hero">
      <div className="hv3-hero-copy">
        <div className="hv3-live-pill"><span /> LOWVELD PADEL · LADIES SEASON 2</div>
        <p className="hv3-overline">MATCHWEEK 5 COMPLETE · PLAYOFFS AHEAD</p>
        <h1>THE RACE IS ON.<br/><em>THE PLAYOFFS AWAIT.</em></h1>
        <p className="hv3-lead">Backhand Blossoms still lead, Lunar Lillies have blown the title race open, Phoenix Flames are surging and every franchise now has the playoff stage in sight.</p>
        <div className="hv3-actions"><Link to="/leagues?league=ladies" className="hv3-primary">Enter Ladies Season 2</Link><Link to="/live">Follow the playoff race</Link></div>
      </div>
      <aside className="hv3-hero-scoreboard">
        <div className="hv3-scoreboard-head"><span>LADIES SEASON 2</span><b>TOP 3</b></div>
        {ladiesTop.map((row, index) => <Link className={`hv3-podium-row hv3-podium-${index + 1}`} to="/leagues?league=ladies" key={row.id}><span className="hv3-rank">{index + 1}</span>{row.logo && <img src={row.logo} alt="" />}<span className="hv3-podium-name">{row.name}</span><strong>{row.points}</strong><small>PTS</small></Link>)}
        <div className="hv3-hero-foot"><span>Matchweek 5 complete</span><Link to="/leagues?league=ladies">Full standings →</Link></div>
      </aside>
    </section>

    <section className="hv3-playoff-banner">
      <div><span className="hv3-kicker">UPCOMING · LADIES SEASON 2 PLAYOFFS</span><h2>The regular season built the pressure. Now comes knockout padel.</h2><p>The playoff stage is next. Follow the Ladies hub and Match Centre for the confirmed bracket, fixtures, venues and court times.</p></div>
      <div className="hv3-actions"><Link to="/leagues?league=ladies" className="hv3-primary">Ladies playoff hub</Link><Link to="/live">Match Centre</Link></div>
    </section>

    <section className="hv3-channel-section">
      <div className="hv3-section-heading"><div><span className="hv3-kicker">LADIES LEAGUE HEADLINES</span><h2>The stories shaping the playoffs.</h2></div><p>Current Matchweek 5 headlines and the road ahead—not old Matchweek 3 and 4 promotions.</p></div>
      <div className="hv3-channel-grid">{headlines.map((item) => <Link to="/leagues?league=ladies" className={`hv3-channel hv3-channel-${item.tone}`} key={item.title}><div><span className="hv3-kicker">{item.eyebrow}</span><h3>{item.title}</h3><p>{item.copy}</p></div><div className="hv3-channel-bottom"><div className="hv3-channel-stat"><strong>{item.stat}</strong><span>{item.statLabel}</span></div><b>Open Ladies Season 2 →</b></div></Link>)}</div>
    </section>

    <section className="hv3-split">
      <div className="hv3-panel hv3-table-panel">
        <div className="hv3-panel-head"><div><span className="hv3-kicker">LADIES SEASON 2</span><h2>The playoff race</h2></div><Link to="/leagues?league=ladies">Full log →</Link></div>
        <div className="hv3-legacy-table"><div className="hv3-legacy-head"><span>#</span><span>TEAM</span><span>P</span><span>W</span><span>GD</span><span>PTS</span></div>{playoffTeams.map((row, index) => <Link to="/leagues?league=ladies" className={index === 0 ? 'hv3-legacy-row is-leader' : 'hv3-legacy-row'} key={row.id}><span>{index + 1}</span><span className="hv3-legacy-team">{row.logo && <img src={row.logo} alt="" />}<b>{row.name}</b></span><span>{row.played}</span><span>{row.wins}</span><span className={row.differential > 0 ? 'pos' : row.differential < 0 ? 'neg' : ''}>{signed(row.differential)}</span><strong>{row.points}</strong></Link>)}</div>
        <p className="hv3-table-note"><b>Top four qualify for the playoffs.</b> Official order: accumulated points, set differential, game/points differential, then head-to-head.</p>
      </div>
      <aside className="hv3-panel hv3-feature-panel"><span className="hv3-kicker">LADIES MVP WATCH</span><div className="hv3-feature-number">MVP</div><h2>Form heading into the playoffs.</h2><p>The players setting the standard through every verified rubber.</p><div className="hv3-feature-list">{mvpTop.map((player, index) => <span key={player.id}><b>0{index + 1}</b> {player.name} · {player.mvp_points} pts</span>)}</div><Link to="/rankings" className="hv3-primary hv3-wide">Full MVP rankings</Link></aside>
    </section>

    <section className="hv3-channel-section">
      <div className="hv3-section-heading"><div><span className="hv3-kicker">FROM ACROSS LOWVELD PADEL</span><h2>Champions and national pride.</h2></div><p>Completed competitions remain easy to find without taking the spotlight away from the Ladies playoff race.</p></div>
      <div className="hv3-destination-grid">
        <Link to="/360-super-cup" className="hv3-destination"><span className="hv3-kicker">360 SUPER CUP · 2026</span><h3>Lowveld finishes third nationally.</h3><p>20 matches. 10 wins. 28 points. A +7 game differential.</p><b>Relive the Super Cup →</b></Link>
        <Link to="/leagues?league=legacy" className="hv3-destination"><span className="hv3-kicker">LEGACY LEAGUE · COMPLETE</span><h3>Honey Badgers make history.</h3><p>LP Cheetahs finish second and LP Rhinos complete the inaugural podium.</p><b>Celebrate the Legacy →</b></Link>
        <Link to="/leagues" className="hv3-destination"><span className="hv3-kicker">MEN'S SEASON 3 · COMPLETE</span><h3>Desert Falcons crowned champions.</h3><p>A 14–8 Grand Final victory over Sonic Viboras sealed the title.</p><b>Explore Season 3 →</b></Link>
      </div>
    </section>

    <section className="hv3-cta-band"><div><span className="hv3-kicker">LADIES FRANCHISE LEAGUE · SEASON 2</span><h2>Every point led here.</h2></div><div className="hv3-actions"><Link to="/leagues?league=ladies" className="hv3-primary">Follow the playoffs</Link><Link to="/rankings">MVP rankings</Link><Link to="/tv">Lowveld TV</Link></div></section>
  </main>;
}
