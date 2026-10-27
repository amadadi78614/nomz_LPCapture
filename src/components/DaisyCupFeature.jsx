import {Link} from 'react-router-dom';
export default function DaisyCupFeature(){
 return <section aria-label="Daisy Cup registration" className="daisy-feature">
  <img src="/events/daisy-cup-2026.webp" width="1200" height="800" alt="The Daisy Cup — Where Champions Bloom. Partners: Diadem, OSHEE and Game & Grind."/>
  <div><span className="chip">Ladies doubles · 28 November 2026</span><h2 className="display">The Daisy Cup</h2><p>Where Champions Bloom.</p><p><b>Padel 24, Nelspruit</b><br/>08:00–22:00 SAST · 24 pairs · R800 per pair</p><p>R6,000 prize pool &amp; more.</p><p className="muted">With Diadem, OSHEE and Game &amp; Grind.</p><Link className="btn" to="/register?event=daisy-cup">Register your pair →</Link></div>
  <style>{`.daisy-feature{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:24px;align-items:center;padding:22px;margin:20px 0;border:1px solid #b78b48;border-radius:20px;background:linear-gradient(120deg,#20131b,#0d111b);color:#fff}.daisy-feature img{width:100%;height:auto;border-radius:12px}.daisy-feature h2{font-size:clamp(28px,4vw,46px);margin:16px 0 8px}.daisy-feature p{line-height:1.6}.daisy-feature .btn{background:#ec087e;color:white}@media(max-width:720px){.daisy-feature{grid-template-columns:1fr;padding:14px;gap:12px}}`}</style>
 </section>;
}
