import { NOMZ_URL } from '../config/nomz';

// Advert for Nomz on the home page. Opens Nomz's own site in a new tab.
export default function NomzPromo(){
 if(!NOMZ_URL) return null;
 const href = `${NOMZ_URL}/?ref=lowveldpadel`;
 return <section aria-labelledby="nomz-promo-title" className="nomz-promo">
  <div className="nomz-promo-copy">
   <p className="nomz-promo-brand">Nomz</p>
   <h2 id="nomz-promo-title">Every match counts.</h2>
   <p>Find padel tournaments and Americanos near you, enter with your partner in a minute, follow live scores and keep a record of every match you play.</p>
   <ul>
    <li>Enter and pay from your phone</li>
    <li>Live scores and your own rating</li>
    <li>Host your own event in a few taps</li>
   </ul>
   <a className="nomz-promo-btn" href={href} target="_blank" rel="noopener">Open Nomz</a>
   <p className="nomz-promo-note">Nomz is an independent app. It opens in a new tab.</p>
  </div>
  <div className="nomz-promo-card" aria-hidden="true">
   <div className="row"><span>Ladies · Group A</span><b>Live</b></div>
   <div className="team"><span>Pair one</span><strong>5</strong></div>
   <div className="team win"><span>Pair two</span><strong>6</strong></div>
   <div className="rating"><span>Your rating</span><strong>1 084</strong><em>+28</em></div>
  </div>
  <style>{`
   .nomz-promo{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:28px;align-items:center;margin:20px 0;padding:28px;border-radius:20px;background:#1638a8;color:#fff}
   .nomz-promo-brand{margin:0;font-weight:900;font-size:22px;letter-spacing:-.02em;color:#ddf247}
   .nomz-promo h2{margin:6px 0 10px;font-size:clamp(28px,4vw,44px);line-height:1.05}
   .nomz-promo p{line-height:1.6;max-width:56ch}
   .nomz-promo ul{margin:12px 0 18px;padding-left:18px;line-height:1.8}
   .nomz-promo-btn{display:inline-block;padding:12px 22px;border-radius:999px;background:#ddf247;color:#0a1a3f;font-weight:800;text-decoration:none}
   .nomz-promo-btn:hover{background:#fff}
   .nomz-promo-btn:focus-visible{outline:3px solid #fff;outline-offset:3px}
   .nomz-promo-note{font-size:12px;opacity:.75;margin-top:10px}
   .nomz-promo-card{background:#fff;color:#0a1a3f;border-radius:16px;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,.25)}
   .nomz-promo-card .row{display:flex;justify-content:space-between;font-size:13px;color:#4d5b78;margin-bottom:8px}
   .nomz-promo-card .row b{color:#1638a8}
   .nomz-promo-card .team{display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid #d3dceb;font-weight:700}
   .nomz-promo-card .team strong{font-size:22px}
   .nomz-promo-card .team.win strong{background:#ddf247;border-radius:8px;padding:0 8px}
   .nomz-promo-card .rating{display:flex;gap:10px;align-items:baseline;margin-top:10px;padding:12px;border-radius:12px;background:#eef3f9}
   .nomz-promo-card .rating span{flex:1;font-size:13px;color:#4d5b78}
   .nomz-promo-card .rating em{font-style:normal;color:#1638a8;font-weight:800}
   @media(max-width:720px){.nomz-promo{grid-template-columns:1fr;padding:18px;gap:16px}}
  `}</style>
 </section>;
}
