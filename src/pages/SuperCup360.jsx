import { Link } from 'react-router-dom';
import '../styles/super-cup-archive.css';

const STANDINGS = [
  { pos: 1, team: 'Infinity Padel', played: 20, won: 20, lost: 0, bp: 12, gd: 118, points: 52 },
  { pos: 2, team: 'Vamos Padel', played: 20, won: 11, lost: 9, bp: 8, gd: 22, points: 34 },
  { pos: 3, team: 'Lowveld Padel', played: 20, won: 10, lost: 10, bp: 5, gd: 7, points: 28 },
  { pos: 4, team: 'Azaadville Padel', played: 20, won: 8, lost: 12, bp: 5, gd: -24, points: 23 },
  { pos: 5, team: 'Padel Society', played: 20, won: 6, lost: 14, bp: 2, gd: -51, points: 19 },
  { pos: 6, team: 'Team Padel', played: 20, won: 5, lost: 15, bp: 2, gd: -72, points: 13 },
];

const PHOTOS = [
  ['/super-cup/lowveld-squad.webp', 'The Lowveld squad on the national stage'],
  ['/super-cup/awards-team.webp', 'A podium finish worth celebrating'],
  ['/super-cup/squad-court.webp', 'Together on court in Johannesburg'],
  ['/super-cup/courtside-moment.webp', 'Every point demanded everything'],
  ['/super-cup/teams-together.webp', 'Competition, respect and community'],
];

const REEL = 'https://www.instagram.com/reel/DcyH_5vo9jr';

export default function SuperCup360() {
  return (
    <main className="page sca-page">
      <section className="sca-hero">
        <img src="/super-cup/awards-team.webp" alt="Lowveld Padel at the 2026 360 Super Cup awards" />
        <div className="sca-hero-shade" />
        <div className="sca-hero-copy">
          <span className="eyebrow">360 SUPER CUP · FINAL STANDINGS</span>
          <h1 className="display">A NATIONAL PODIUM.<br/><em>LOWVELD THIRD.</em></h1>
          <p>Twenty matches. Ten wins. A +7 game differential. Lowveld Padel finished third at the 2026 360 Super Cup in Johannesburg.</p>
          <div className="sca-actions">
            <a className="btn gold" href="#super-cup-story">Relive the tournament</a>
            <a className="btn ghost" href={REEL} target="_blank" rel="noreferrer">Watch the Instagram reel ↗</a>
          </div>
        </div>
        <div className="sca-medal"><strong>3RD</strong><span>NATIONAL FINISH</span></div>
      </section>

      <section className="sca-stats" aria-label="Super Cup performance summary">
        {[['20','MATCHES'],['10','WINS'],['28','POINTS'],['+7','GAME DIFF']].map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </section>

      <section id="super-cup-story" className="sca-story">
        <div><span className="eyebrow">THE 2026 CAMPAIGN</span><h2 className="display">LOWVELD TOOK ITS PLACE ON THE NATIONAL STAGE.</h2></div>
        <p>A top-three finish behind champions Infinity Padel and runners-up Vamos Padel. The result belongs to every player, coach and supporter who carried Lowveld colours to Johannesburg.</p>
      </section>

      <section className="sca-table card">
        <div className="sca-section-head"><div><span className="eyebrow">OFFICIAL RESULT</span><h2 className="display">Final standings</h2></div><b>28–30 AUGUST 2026</b></div>
        <div className="sca-table-scroll"><table className="tbl"><thead><tr><th>#</th><th>Team</th><th className="num">P</th><th className="num">W</th><th className="num">L</th><th className="num">BP</th><th className="num">GD</th><th className="num">Pts</th></tr></thead><tbody>{STANDINGS.map(row=><tr key={row.team} className={row.team==='Lowveld Padel'?'is-lowveld':''}><td><b>{row.pos}</b></td><td><b>{row.team}</b></td><td className="num">{row.played}</td><td className="num">{row.won}</td><td className="num">{row.lost}</td><td className="num">{row.bp}</td><td className="num">{row.gd>0?'+':''}{row.gd}</td><td className="num"><b>{row.points}</b></td></tr>)}</tbody></table></div>
      </section>

      <section className="sca-media">
        <div className="sca-section-head"><div><span className="eyebrow">TOURNAMENT ARCHIVE</span><h2 className="display">Photos from Johannesburg</h2></div><a href={REEL} target="_blank" rel="noreferrer">Watch official reel ↗</a></div>
        <div className="sca-gallery">{PHOTOS.map(([src,caption],index)=><figure className={index===0?'sca-gallery-main':''} key={src}><img src={src} alt={caption} loading={index===0?'eager':'lazy'}/><figcaption>{caption}</figcaption></figure>)}</div>
      </section>

      <section className="sca-media">
        <div className="sca-section-head"><div><span className="eyebrow">BEHIND THE RESULT</span><h2 className="display">Four moments. One campaign.</h2></div></div>
        <div className="sca-video-grid">{[1,2,3,4].map(n=><video key={n} controls playsInline preload="metadata" poster={n===4?'/super-cup/courtside-moment.webp':'/super-cup/awards-team.webp'}><source src={`/super-cup/highlight-${n}.mp4`} type="video/mp4"/>Your browser does not support video.</video>)}</div>
      </section>

      <section className="sca-close card">
        <span className="eyebrow">LOWVELD PADEL · 360 SUPER CUP 2026</span>
        <h2 className="display">THIRD IN THE COUNTRY.<br/>FIRST CHAPTER WRITTEN.</h2>
        <p>This journey has concluded, but the result now has a permanent home.</p>
        <div className="sca-actions"><Link className="btn gold" to="/">Back to current competitions</Link><Link className="btn ghost" to="/tv">Lowveld TV</Link></div>
      </section>
    </main>
  );
}
