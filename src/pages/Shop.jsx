import {catalog,money,useCart} from '../commerce/store';
import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {categories,groupsFor,partnerOffers,plannedRange,enquiryLink,safePartner} from '../commerce/shop';
import '../styles/shop.css';
function Product({group,onAdd}){
 const [selected,setSelected]=useState(group.variants.length===1?group.variants[0].id:'');
 const p=group.variants.find(v=>v.id===selected);const display=p||group.variants[0];
 const available=p&&p.capacity>0&&Number.isInteger(p.price_cents)&&p.price_cents>0;
 return <article className="shop-card">
 {display.image_url&&/^(https:\/\/|\/[^/])/.test(display.image_url)?<img src={display.image_url} alt={group.title} loading="lazy"/>:<div className="shop-monogram" aria-hidden="true">LP</div>}
 <span className="chip">{group.category}</span><h2>{group.title}</h2><p>{display.description}</p>
 {group.variants.length>1&&<label>Choose size / colour<select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Select an option</option>{group.variants.map(v=><option key={v.id} value={v.id} disabled={v.capacity<=0}>{v.meta.option||v.title} — {money(v.price_cents)}{v.capacity<=0?' — unavailable':''}</option>)}</select></label>}
 {display.meta.sizeGuide&&<p><b>Size guide:</b> {display.meta.sizeGuide}</p>}
 {display.meta.deadline&&<p><b>Pre-order closes:</b> {display.meta.deadline}</p>}
 <p className="shop-price">{p?money(p.price_cents):'Choose an option for price'}</p><p><b>Collection:</b> {display.fulfilment}</p>
 {display.rules&&<details><summary>Product information & returns</summary><p>{display.rules}</p></details>}
 <button className="btn" disabled={!available} onClick={()=>onAdd(p)}>{!p?'Choose an option':!available?'Currently unavailable':'Add to cart'}</button>
 </article>;
}
export default function Shop(){
 const [category,setCategory]=useState('All'),[products,setProducts]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState('');const cart=useCart();
 async function load(){setLoading(true);setError('');try{setProducts((await catalog()).filter(p=>p.kind==='product'));}catch{setError('We could not load the shop. Please retry before ordering.');}finally{setLoading(false);}}
 useEffect(()=>{load();},[]);
 const matches=c=>category==='All'||category===c;
 const groups=groupsFor(products).filter(g=>matches(g.category));const offers=partnerOffers.filter(p=>safePartner(p.url));
 return <main className="page lp-shop">
 <header className="shop-hero"><span className="chip">LOWVELD PADEL · THE SHOP</span><h1>Wear your colours.<br/>Bring your game.</h1><p>Teamwear, match-day essentials and selected partner gear for the Lowveld padel community.</p><div className="shop-actions"><a className="btn" href="#shop-range">Explore the range</a><Link className="btn secondary" to="/cart">View cart ({cart.items.length})</Link></div></header>
 <nav className="shop-tabs" aria-label="Product categories">{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</nav>
 {notice&&<p role="status" className="shop-notice">{notice} <Link to="/cart">Go to checkout →</Link></p>}
 <section id="shop-range" aria-label="Shop range">
 {loading?<p role="status">Loading available products…</p>:error?<div role="alert"><p>{error}</p><button className="btn" onClick={load}>Retry</button></div>:<>
 {groups.length>0&&<><h2>Available to order</h2><div className="shop-grid">{groups.map(g=><Product key={g.id} group={g} onAdd={p=>{cart.add(p);setNotice(p.title+' added to your cart.');}}/>)}</div></>}
 {!groups.length&&category!=='Partner Offers'&&<p className="shop-notice">No products are available to buy in this category yet. Enquire below; we’ll confirm price and availability before any payment.</p>}
 </>}
 {category!=='Partner Offers'&&<><h2>Help shape the LP range</h2><p>Enquiries only — these are not paid pre-orders or stock reservations.</p><div className="shop-grid">{plannedRange.filter(([,c])=>matches(c)).map(([title,c,description])=><article className="shop-card" key={title}><span className="chip">ENQUIRE · NOT ON SALE</span><h3>{title}</h3><p>{description}</p><a className="btn secondary" href={enquiryLink(title)}>Enquire by email</a></article>)}</div></>}
 {matches('Partner Offers')&&<section className="shop-partners"><h2>Partner offers</h2><p>Approved affiliate offers open the partner’s checkout. LP may earn a commission; the retailer handles payment, delivery and returns.</p>{offers.length?<div className="shop-grid">{offers.map(p=><article className="shop-card" key={p.id}><span className="chip">AFFILIATE OFFER</span><h3>{p.title}</h3><p>{p.description}</p><a className="btn" href={p.url} target="_blank" rel="sponsored noopener noreferrer">Buy from {p.partner} ↗</a></article>)}</div>:<p>No affiliate offers are active yet. We’ll publish them once partner arrangements are confirmed.</p>}</section>}
 </section>
 <section className="shop-help"><h2>Shopping with LP</h2><div className="shop-grid"><div><h3>One cart</h3><p>Add available products and event entries together. Prices and availability are checked again at checkout. Choose from the payment methods shown there.</p></div><div><h3>Collection</h3><p>LP products are collection-only. Check each listing for the location and timing before paying. No shipping is included.</p></div><div><h3>Questions & returns</h3><p>Contact LP about sizing, availability or a return before ordering if anything is unclear. Include your order reference for existing purchases.</p><a href="mailto:admin@lowveldpadel.co.za">admin@lowveldpadel.co.za</a></div></div></section>
 </main>;
}
