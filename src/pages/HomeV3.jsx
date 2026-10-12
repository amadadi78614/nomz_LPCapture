import { Link } from 'react-router-dom';
import { LADIES_S2_STANDINGS, LADIES_S2_RANKINGS } from '../data/ladiesSeason2Round1Update';
import '../styles/home-v3.css';
import LadiesPlayoffs from '../components/LadiesPlayoffs';

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
    eyebrow: '14 OCTOBER · 17:30 · PADEL 24',
    title: 'Four franchises. One dream.',
    copy: 'Backhand Blossoms vs Lunar Lillies. Phoenix Flames vs Net Novas. Join us at Padel 24 in Nelspruit for the Ladies playoffs.',
    stat: '14 OCT',
    statLabel: 'PLAYOFF STAGE',
    tone: 'gold',
  },
];

export default function HomeV3() {
  const playoffTeams = LADIES_S2_STANDINGS.slice(0, 4);
  const mvpTop = LADIES_S2_RANKINGS.slice(0, 3);

  return <main className="hv3">
    <section className="hv3-hero hv3-ladies-hero">
      <div className="hv3-hero-copy">
        <div className="hv3-live-pill"><span /> LOWVELD PADEL · LADIES PLAYOFFS</div>
        <p className="hv3-overline">WEDNESDAY 14 OCTOBER · 17:30 · PADEL 24</p>
        <h1>FOUR FRANCHISES.<br/><em>ONE DREAM.</em></h1>
        <p className="hv3-lead">Backhand Blossoms face Lunar Lillies. Phoenix Flames take on Net Novas. The Ladies Franchise League playoffs take centre stage at Padel 24, Nelspruit.</p>
        <div className="hv3-actions"><Link to="/leagues?league=ladies" className="hv3-primary">Explore Ladies playoffs</Link><Link to="/leagues?league=ladies">View playoff fixtures</Link></div>
      </div>
      <Link to="/leagues?league=ladies" aria-label="Open Ladies playoff fixtures" style={{display:'block',maxWidth:350,width:'100%',justifySelf:'center',position:'relative',zIndex:1}}><img src="/ladies-playoffs-2026.jpg" alt="Four franchises. One dream. Backhand Blossoms vs Lunar Lillies and Phoenix Flames vs Net Novas, 14 October 2026 at 17:30, Padel 24 Nelspruit" width="1024" height="1536" style={{display:'block',width:'100%',height:'auto',borderRadius:16}}/></Link>
    </section>

    <LadiesPlayoffs/>

    <section className="hv3-channel-section">
      <div className="hv3-section-heading"><div><span className="hv3-kicker">LADIES LEAGUE HEADLINES</span><h2>The stories shaping the playoffs.</h2></div><p>The confirmed playoff matchups and the regular-season results behind them.</p></div>
      <div className="hv3-channel-grid">{headlines.map((item) => <Link to="/leagues?league=ladies" className={`hv3-channel hv3-channel-${item.tone}`} key={item.title}><div><span className="hv3-kicker">{item.eyebrow}</span><h3>{item.title}</h3><p>{item.copy}</p></div><div className="hv3-channel-bottom"><div className="hv3-channel-stat"><strong>{item.stat}</strong><span>{item.statLabel}</span></div><b>Open Ladies Season 2 →</b></div></Link>)}</div>
    </section>

    <section className="hv3-split">
      <div className="hv3-panel hv3-table-panel">
        <div className="hv3-panel-head"><div><span className="hv3-kicker">LADIES SEASON 2</span><h2>The playoff four</h2></div><Link to="/leagues?league=ladies">Full log →</Link></div>
        <div className="hv3-legacy-table"><div className="hv3-legacy-head"><span>#</span><span>TEAM</span><span>P</span><span>W</span><span>GD</span><span>PTS</span></div>{playoffTeams.map((row, index) => <Link to="/leagues?league=ladies" className={index === 0 ? 'hv3-legacy-row is-leader' : 'hv3-legacy-row'} key={row.id}><span>{index + 1}</span><span className="hv3-legacy-team">{row.logo && <img src={row.logo} alt="" />}<b>{row.name}</b></span><span>{row.played}</span><span>{row.wins}</span><span className={row.differential > 0 ? 'pos' : row.differential < 0 ? 'neg' : ''}>{signed(row.differential)}</span><strong>{row.points}</strong></Link>)}</div>
        <p className="hv3-table-note"><b>Your four playoff teams.</b> Official order: accumulated points, set differential, game/points differential, then head-to-head.</p>
      </div>
      <aside className="hv3-panel hv3-feature-panel"><span className="hv3-kicker">LADIES MVP WATCH</span><div className="hv3-feature-number">MVP</div><h2>Form heading into the playoffs.</h2><p>The players setting the standard through every verified rubber.</p><div className="hv3-feature-list">{mvpTop.map((player, index) => <span key={player.id}><b>0{index + 1}</b> {player.name} · {player.mvp_points} pts</span>)}</div><Link to="/rankings" className="hv3-primary hv3-wide">Full MVP rankings</Link></aside>
    </section>

    <section aria-label="Kruger Cup 2026" style={{margin:'16px auto 22px',padding:'22px 23px',border:'1px solid #ad8147',borderRadius:18,background:'linear-gradient(105deg,#101722,#271c13)',color:'#ffdb9e',display:'flex',gap:20,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
      <div style={{flex:'1 1 250px'}}>
        <p style={{fontSize:11,fontWeight:800,letterSpacing:2,margin:'0 0 7px',color:'#e8b363'}}>SATURDAY · 10 OCTOBER 2026 · PADEL 24</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(24px,4vw,35px)',margin:'0 0 6px',color:'#f9d39a'}}>THE KRUGER CUP</h2>
        <p style={{fontSize:14,margin:0,color:'#f3e8d6'}}>Relive the tournament: winners, standout pairs, match-day highlights and event memories.</p>
      </div>
      <a href="/kruger-cup-2026" style={{minHeight:48,background:'linear-gradient(130deg,#f1b654,#e4c084)',color:'#131820',fontWeight:800,borderRadius:10,textDecoration:'none',display:'inline-flex',justifyContent:'center',alignItems:'center',padding:'12px 19px',flex:'0 0 auto'}}>🏆 Explore Kruger Cup 2026 →</a>
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
