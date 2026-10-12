import { Link } from 'react-router-dom';
import { FRANCHISES } from '../data/seed';

const fixtures = [
  ['backhand-blossoms', 'lunar-lillies'],
  ['phoenix-flames', 'net-novas'],
];

export default function LadiesPlayoffs() {
  return <section className="mt" aria-label="Ladies playoff fixtures">
    <p style={{color:'#f5bad6',fontWeight:700}}>Wednesday 14 October 2026 · From 17:30 · Padel 24, Nelspruit</p>
    <div className="grid cols-2">
      {fixtures.map((ids) => <article className="card" key={ids[0]} style={{borderTop:'3px solid #ef4fa0'}}>
        <span className="eyebrow">Ladies Franchise League · Playoffs</span>
        {ids.map((id, index) => {
          const team = FRANCHISES.find((item) => item.id === id && item.league === 'ladies');
          return <div key={id}>
            {index > 0 && <div style={{color:'#ef4fa0',fontWeight:900,margin:'5px 0'}}>VS</div>}
            <Link to={`/ladies-franchise/${id}`} className="row" style={{gap:12,padding:'12px 0'}}>
              {team?.logo && <img src={team.logo} alt="" style={{width:42,height:42,objectFit:'contain'}}/>}
              <b>{team?.name || id}</b>
            </Link>
          </div>;
        })}
      </article>)}
    </div>
    <p className="muted" style={{fontSize:12}}>Four teams. One dream. Higher stakes. Brighter stories.</p>
  </section>;
}
