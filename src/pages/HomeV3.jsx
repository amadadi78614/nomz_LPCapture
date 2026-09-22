import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home-v3.css';

const highlights = [
  { eyebrow: '360 SUPER CUP · 2026', title: 'A national podium.', copy: 'Lowveld Padel finished third in Johannesburg: 20 matches, 10 wins, 28 points and a +7 game differential.', stat: '3RD', statLabel: 'NATIONAL FINISH', to: '/360-super-cup', cta: 'Relive the Super Cup', tone: 'gold', image: '/super-cup/lowveld-squad.webp' },
  { eyebrow: 'LP LEGACY LEAGUE · COMPLETE', title: 'The first Legacy.', copy: 'LP Honey Badgers are the inaugural champions, ahead of LP Cheetahs and LP Rhinos on the 2026 podium.', stat: '1ST', statLabel: 'HONEY BADGERS', to: '/leagues?league=legacy', cta: 'See the champions', tone: 'blue', image: '/legacy/gallery/legacy-finals-feature.webp' },
  { eyebrow: "MEN'S FRANCHISE LEAGUE · SEASON 3", title: 'Falcons fly highest.', copy: 'Desert Falcons closed the season as champions after a 14–8 Grand Final victory over Sonic Viboras.', stat: '14–8', statLabel: 'GRAND FINAL', to: '/leagues', cta: "Explore the men's league", tone: 'red', image: '/logos/desert-falcons.webp' },
];

const destinations = [
  { eyebrow: 'COMPETE', title: 'Leagues', copy: "Men's, Ladies and Legacy competitions in one place.", to: '/leagues', cta: 'Explore leagues' },
  { eyebrow: 'TRACK', title: 'Results & rankings', copy: 'Match results, franchise tables and player performance.', to: '/live', cta: 'Open match centre' },
  { eyebrow: 'WATCH', title: 'Lowveld TV', copy: 'Highlights, streams and the moments that shaped the season.', to: '/tv', cta: 'Watch now' },
];

export default function HomeV3() {
  useEffect(() => {
    const removeOldPromos = () => {
      document.querySelectorAll('[data-ladies-mw3], [data-ladies-mw4], [data-ladies-mw5], [data-ladies-mw5-final]').forEach((node) => node.remove());
    };
    removeOldPromos();
    const observer = new MutationObserver(removeOldPromos);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return <main className="hv3">
    <section className="hv3-hero hv3-brand-hero">
      <div className="hv3-hero-copy">
        <div className="hv3-live-pill"><span /> LOWVELD PADEL · MBOMBELA</div>
        <p className="hv3-overline">PEOPLE · PADEL · PURPOSE</p>
        <h1>PLAY. COMPETE.<br/><em>CONNECT. BELONG.</em></h1>
        <p className="hv3-lead">More than matches. Lowveld Padel brings players, families and partners together through competitive leagues, real rankings and a community built to last.</p>
        <div className="hv3-actions"><Link to="/leagues" className="hv3-primary">Explore the leagues</Link><Link to="/register">Join Lowveld Padel</Link></div>
      </div>
      <aside className="hv3-hero-scoreboard hv3-season-card">
        <div className="hv3-scoreboard-head"><span>2026 SEASON</span><b>THE STORY SO FAR</b></div>
        <Link className="hv3-season-row" to="/360-super-cup"><span>01</span><div><b>Super Cup</b><small>Lowveld finishes third nationally</small></div><strong>3RD</strong></Link>
        <Link className="hv3-season-row" to="/leagues?league=legacy"><span>02</span><div><b>Legacy League</b><small>Honey Badgers make history</small></div><strong>1ST</strong></Link>
        <Link className="hv3-season-row" to="/leagues"><span>03</span><div><b>Men's Season 3</b><small>Desert Falcons crowned champions</small></div><strong>CHAMPS</strong></Link>
        <div className="hv3-hero-foot"><span>Completed competitions</span><Link to="/leagues">View all leagues →</Link></div>
      </aside>
    </section>

    <section className="hv3-proof-strip" aria-label="Lowveld Padel values">
      <span><b>PLAY</b><small>Real competition</small></span><span><b>CONNECT</b><small>A stronger community</small></span><span><b>TRACK</b><small>Results that matter</small></span><span><b>BELONG</b><small>More than a game</small></span>
    </section>

    <section className="hv3-channel-section">
      <div className="hv3-section-heading"><div><span className="hv3-kicker">2026 SEASON HIGHLIGHTS</span><h2>Three campaigns. One Lowveld.</h2></div><p>The latest completed achievements—without stale matchweek promotions or provisional tables.</p></div>
      <div className="hv3-channel-grid">{highlights.map((item) => <Link to={item.to} className={`hv3-channel hv3-channel-${item.tone} hv3-highlight-card`} key={item.title} style={{'--card-image': `url(${item.image})`}}><div><span className="hv3-kicker">{item.eyebrow}</span><h3>{item.title}</h3><p>{item.copy}</p></div><div className="hv3-channel-bottom"><div className="hv3-channel-stat"><strong>{item.stat}</strong><span>{item.statLabel}</span></div><b>{item.cta} →</b></div></Link>)}</div>
    </section>

    <section className="hv3-channel-section hv3-ladies-feature">
      <div className="hv3-ladies-copy"><span className="hv3-kicker">LADIES FRANCHISE LEAGUE · SEASON 2</span><h2>Sixty players. Six franchises. One stage.</h2><p>Explore the Ladies Season 2 hub for verified results, franchise squads, standings and player rankings. Matchweek promotions now live inside the competition archive—not on the front page.</p><div className="hv3-actions"><Link to="/leagues?league=ladies" className="hv3-primary">Enter Ladies Season 2</Link><Link to="/rankings">Player rankings</Link></div></div>
      <div className="hv3-ladies-art"><img src="/ladies-league-s2.png" alt="Lowveld Padel Ladies Franchise League Season 2" /></div>
    </section>

    <section className="hv3-channel-section">
      <div className="hv3-section-heading"><div><span className="hv3-kicker">YOUR LOWVELD PADEL</span><h2>Everything starts here.</h2></div><p>Find the competition, performance data and coverage you came for.</p></div>
      <div className="hv3-destination-grid">{destinations.map((item) => <Link to={item.to} className="hv3-destination" key={item.title}><span className="hv3-kicker">{item.eyebrow}</span><h3>{item.title}</h3><p>{item.copy}</p><b>{item.cta} →</b></Link>)}</div>
    </section>

    <section className="hv3-cta-band"><div><span className="hv3-kicker">BE PART OF THE NEXT CHAPTER</span><h2>Play. Get ranked. Get seen.</h2></div><div className="hv3-actions"><Link to="/register" className="hv3-primary">Register your interest</Link><Link to="/community">Join the community</Link></div></section>
  </main>;
}
