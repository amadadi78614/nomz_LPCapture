import { Link } from 'react-router-dom';
import { FRANCHISES } from '../data/seed';
import '../styles/grand-final.css';

export default function LadiesPlayoffs() {
  return <section className="gf-finalists mt" aria-label="Ladies Grand Final">
    <span className="gf-label">THE GRAND FINAL · 22 OCTOBER 2026 · PLAY 360</span>
    <h2 className="display">Two teams. One final. One legacy.</h2>
    <div className="gf-teams">{['backhand-blossoms','lunar-lillies'].map((id,i)=>{
      const team=FRANCHISES.find(t=>t.id===id&&t.league==='ladies');
      return <Link key={id} className={`gf-team gf-team-${i}`} to={`/ladies-franchise/${id}`}>
        {team?.logo&&<img src={team.logo} alt="" width="100" height="100"/>}
        <span className="gf-label">FINALIST / {i+1===1?'BLOSSOMS':'LILLIES'}</span>
        <h3>{team?.name}</h3><p>{i===0?'Grit. Grace. Game.':'Focus. Flow. Rise.'}</p><b>Meet the squad →</b>
      </Link>;
    })}</div>
    <p className="gf-final-time">Grand Final <b>19:00–21:00</b> <span> / </span> Presentation <b>21:00–22:00</b> · SAST</p>
  </section>;
}
