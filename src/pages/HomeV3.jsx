import { Link } from 'react-router-dom';
import LadiesLatestResult from '../components/LadiesLatestResult';
import LadiesPlayoffs from '../components/LadiesPlayoffs';
import '../styles/home-v3.css';
import '../styles/grand-final.css';

export default function HomeV3() {
  return <main className="hv3 gf-home">
    <section className="gf-hero" aria-labelledby="final-title">
      <div className="gf-copy">
        <span className="gf-label">LOWVELD PADEL · LADIES FRANCHISE LEAGUE</span>
        <p className="gf-date">22 OCTOBER 2026 / PLAY 360</p>
        <h1 id="final-title">BLOSSOMS.<br/><em>CHAMPIONS.</em></h1>
        <p className="gf-intro">Backhand Blossoms defeat Lunar Lillies <strong>7–6 to win the Season 2 title.</strong></p>
        <div className="gf-matchup"><span>BACKHAND<br/><b>BLOSSOMS</b></span><i>7–6</i><span>LUNAR<br/><b>LILLIES</b></span></div>
        <div className="hv3-actions"><a className="hv3-primary" href="#final-night">Relive the final ↓</a><Link to="/leagues?league=ladies">League hub →</Link></div>
        <p className="gf-invite">Two rubbers each. One decisive bonus point. A final to remember.</p>
      </div>
      <a className="gf-poster" href="/ladies-champions-2026.webp" target="_blank" rel="noreferrer" aria-label="Open the Backhand Blossoms champions poster">
        <img src="/ladies-champions-2026.webp" alt="Backhand Blossoms, Ladies Franchise League champions, beat Lunar Lillies 7–6 in the Grand Final." width="1024" height="1536" fetchPriority="high"/>
        <span>THE CHAMPIONS POSTER ↗</span>
      </a>
    </section>
    <div className="gf-ticker" aria-label="Grand Final tagline"><span>TWO TEAMS</span><i>✦</i><span>ONE FINAL</span><i>✦</i><span>ONE LEGACY</span></div>
    <section id="final-night" className="gf-night">
      <div className="hv3-section-heading"><div><span className="hv3-kicker">THURSDAY 22 OCTOBER · ALL TIMES SAST</span><h2>The title is theirs.</h2></div><p>Play 360. 22 October 2026. Full time.</p></div>
      <div className="gf-schedule"><article><span>01 / CHAMPIONS</span><strong>7 POINTS</strong><h3>Backhand Blossoms</h3><p>Season 2 champions</p></article><article><span>02 / RUNNERS-UP</span><strong>6 POINTS</strong><h3>Lunar Lillies</h3><p>Two hard-fought rubber wins</p></article></div>
    </section>
    <LadiesPlayoffs/>
    <section className="gf-result-section"><div className="hv3-section-heading"><div><span className="hv3-kicker">GRAND FINAL · 22 OCTOBER</span><h2>Every rubber. Every point.</h2></div><Link to="/live">Match Centre →</Link></div><LadiesLatestResult/></section>
    <section aria-label="Kruger Cup 2026" style={{margin:'16px auto 22px',padding:'22px 23px',border:'1px solid #ad8147',borderRadius:18,background:'linear-gradient(105deg,#101722,#271c13)',color:'#ffdb9e',display:'flex',gap:20,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
      <div style={{flex:'1 1 250px'}}>
        <p style={{fontSize:11,fontWeight:800,letterSpacing:2,margin:'0 0 7px',color:'#e8b363'}}>SATURDAY · 10 OCTOBER 2026 · PADEL 24</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(24px,4vw,35px)',margin:'0 0 6px',color:'#f9d39a'}}>THE KRUGER CUP</h2>
        <p style={{fontSize:14,margin:0,color:'#f3e8d6'}}>Relive the tournament: winners, standout pairs, match-day highlights and event memories.</p>
      </div>
      <a href="/kruger-cup-2026" style={{minHeight:48,background:'linear-gradient(130deg,#f1b654,#e4c084)',color:'#131820',fontWeight:800,borderRadius:10,textDecoration:'none',display:'inline-flex',justifyContent:'center',alignItems:'center',padding:'12px 19px',flex:'0 0 auto'}}>🏆 Explore Kruger Cup 2026 →</a>
    </section>
    <section className="hv3-channel-section">
      <div className="hv3-section-heading"><div><span className="hv3-kicker">FROM ACROSS LOWVELD PADEL</span><h2>Champions and national pride.</h2></div><p>Completed competitions remain easy to find without taking the spotlight away from the Ladies Grand Final.</p></div>
      <div className="hv3-destination-grid">
        <Link to="/360-super-cup" className="hv3-destination"><span className="hv3-kicker">360 SUPER CUP · 2026</span><h3>Lowveld finishes third nationally.</h3><p>20 matches. 10 wins. 28 points. A +7 game differential.</p><b>Relive the Super Cup →</b></Link>
        <Link to="/leagues?league=legacy" className="hv3-destination"><span className="hv3-kicker">LEGACY LEAGUE · COMPLETE</span><h3>Honey Badgers make history.</h3><p>LP Cheetahs finish second and LP Rhinos complete the inaugural podium.</p><b>Celebrate the Legacy →</b></Link>
        <Link to="/leagues" className="hv3-destination"><span className="hv3-kicker">MEN'S SEASON 3 · COMPLETE</span><h3>Desert Falcons crowned champions.</h3><p>A 14–8 Grand Final victory over Sonic Viboras sealed the title.</p><b>Explore Season 3 →</b></Link>
      </div>
    </section>

    <section className="hv3-cta-band"><div><span className="hv3-kicker">22 OCTOBER · PLAY 360 · FULL TIME</span><h2>Celebrate our champions.</h2></div><div className="hv3-actions"><Link to="/leagues?league=ladies" className="hv3-primary">Grand Final hub →</Link><Link to="/live">Latest results</Link></div></section>
  </main>;
}
