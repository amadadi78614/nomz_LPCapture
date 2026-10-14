import { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  ['LP Apparel', 'Match shirts, training wear and caps. The first collection is being prepared.'],
  ['Padel Gear', 'Rackets, bags, balls and accessories from our local supplier. Range and stock to be confirmed.'],
  ['Partner Offers', 'Selected retailer offers will appear here once affiliate arrangements are confirmed.'],
];
export default function Shop() {
  const [category, setCategory] = useState('All');
  return <main className="page lp-shop">
    <section className="card" style={{padding:'clamp(24px,5vw,60px)',borderTop:'3px solid var(--gold)'}}>
      <span className="chip">COMING SOON</span>
      <h1 className="display" style={{fontSize:'clamp(36px,6vw,68px)',margin:'16px 0'}}>Wear LP. Play your game.</h1>
      <p className="muted" style={{maxWidth:680,lineHeight:1.8}}>LP apparel and padel essentials, brought closer to our community. We’re finalising our supplier range, prices and stock before opening orders.</p>
      <a className="btn" href="mailto:admin@lowveldpadel.co.za?subject=LP%20Shop%20enquiry">Enquire about the shop</a>
    </section>
    <div aria-label="Shop categories" style={{display:'flex',flexWrap:'wrap',gap:10,margin:'24px 0'}}>
      {['All',...categories.map(([name])=>name)].map(name=><button className="btn" key={name} aria-pressed={category===name} onClick={()=>setCategory(name)} style={{background:category===name?'var(--gold)':'var(--card)',color:category===name?'#10131b':'var(--text)',border:'1px solid var(--line)'}}>{name}</button>)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
      {categories.filter(([name])=>category==='All'||category===name).map(([name,copy])=><section className="card" key={name} style={{padding:26}}><span className="chip">RANGE IN PREPARATION</span><h2 className="display" style={{marginTop:20}}>{name}</h2><p className="muted" style={{lineHeight:1.8}}>{copy}</p><p style={{color:'var(--gold)'}}>Products and prices coming soon</p></section>)}
    </div>
    <section className="card" style={{marginTop:24,padding:26}}>
      <h2 className="display">Shopping with LP</h2>
      <p className="muted" style={{lineHeight:1.8}}>For products sold by LP, we plan to offer FNB EFT and Payfast checkout once payments are configured and tested. Orders are not open yet. Collection and delivery options will be shown before payment.</p>
      <p className="muted" style={{lineHeight:1.8}}>Affiliate offers will be clearly labelled and take you to the partner retailer’s checkout. LP may earn a commission; that retailer handles payment, delivery and returns.</p>
      <Link to="/register">Explore upcoming LP competitions →</Link>
    </section>
  </main>;
}
