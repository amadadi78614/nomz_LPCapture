import { Link } from 'react-router-dom';
const championship = [
 ['Group A winners','Faeez Sebastian / Durell Pillay'],['Group A runners-up','Bryan Theron / Anton Grote'],
 ['Group B winners','Yusuf Packery / Ahmed Mungalee'],['Group B runners-up','Uwaiz Patel / M Ashraf Arabi'],
 ['Group C winners','Ridwan Sujee / Justin van Staden'],['Group C runners-up','Yusuf Asvat / Joshua Hoffman']
];
export default function KrugerCup2026(){
 return <main style={{maxWidth:1150,margin:'0 auto',padding:'24px 18px 90px',color:'#f5f1e8'}}>
 <section style={{padding:'clamp(26px,5vw,58px)',border:'1px solid #ae823c',borderRadius:24,background:'radial-gradient(circle at 75% 8%,#594020 0%,transparent 46%),linear-gradient(135deg,#101a26,#101217)',boxShadow:'0 14px 40px #0005'}}>
 <p style={{color:'#dbad62',fontWeight:900,letterSpacing:3}}>LOWVELD PADEL · EVENT RECAP</p>
 <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(38px,7vw,76px)',margin:'12px 0',lineHeight:1.05}}>THE KRUGER CUP <span style={{color:'#e1b56d'}}>2026</span></h1>
 <p style={{color:'#d7d9d9',fontSize:17}}>10 October 2026 · Padel 24 · Nelspruit, Mpumalanga</p>
 <p style={{maxWidth:670,lineHeight:1.7,color:'#e8e0d4'}}>A celebration of competitive padel, big points, great rivalries and a fantastic Lowveld community. Relive our inaugural Kruger Cup below.</p>
 <a href="#results" style={{display:'inline-block',padding:'12px 20px',borderRadius:10,background:'#e4b56c',color:'#17202b',textDecoration:'none',fontWeight:900}}>Explore results ↓</a>
 </section>
 <section id="results" style={{marginTop:35}}>
 <p style={{color:'#d5a05b',letterSpacing:2,fontWeight:800}}>THE PODIUM</p>
 <h2 style={{fontSize:32,margin:'3px 0 22px'}}>Division honours</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:18}}>
 <article style={{padding:25,border:'1px solid #9a713b',background:'#172430',borderRadius:18}}>
 <p style={{color:'#f7c97f',fontSize:13,letterSpacing:1.4}}>🏆 CHALLENGER CHAMPIONS</p>
 <h3 style={{fontFamily:'Georgia,serif',fontSize:28,margin:'12px 0'}}>Scharl van den Berg<br/> & Jude van den Berg</h3>
 <p style={{color:'#afc0ca',lineHeight:1.6}}>Champions confirmed by Tournament Control. Runners-up and the final score will be added once verified.</p>
 </article>
 <article style={{padding:25,border:'1px solid #536879',background:'#172430',borderRadius:18}}>
 <p style={{color:'#e6b97c',fontSize:13,letterSpacing:1.4}}>🏆 CHAMPIONSHIP FINAL</p>
 <h3 style={{fontFamily:'Georgia,serif',fontSize:25,margin:'12px 0'}}>Official podium pending confirmation</h3>
 <p style={{color:'#afc0ca',lineHeight:1.6}}>The final winner and runners-up have not been verified in the recorded tournament results. We will not publish an unconfirmed result.</p>
 </article></div></section>
 <section style={{marginTop:45}}><p style={{color:'#d5a05b',fontWeight:900,letterSpacing:2}}>ROAD TO THE KNOCKOUTS</p><h2 style={{fontSize:30}}>Championship group honours</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(275px,1fr))',gap:12}}>
 {championship.map(([title,n])=><div key={title} style={{padding:'17px 20px',background:'#152431',border:'1px solid #31475a',borderRadius:13}}><p style={{fontSize:12,color:'#e8b674',fontWeight:800,margin:0}}>{title.toUpperCase()}</p><h3 style={{margin:'8px 0 0',fontSize:17}}>{n}</h3></div>)}
 </div></section>
 <section id="gallery" style={{marginTop:45,padding:28,background:'#152431',border:'1px solid #37516b',borderRadius:18}}>
 <p style={{color:'#d8ad6f',fontWeight:900,letterSpacing:2}}>EVENT MEMORIES</p><h2 style={{fontSize:30,margin:'0 0 10px'}}>Photos & videos</h2>
 <p style={{color:'#c7d6df',lineHeight:1.7}}>The full event gallery is being prepared from the tournament media. More match-day images, presentations and videos will appear here as soon as media publishing is completed.</p>
 </section><p style={{marginTop:26}}><Link to="/" style={{color:'#ecc585'}}>← Back to Lowveld Padel</Link></p>
 </main>
}