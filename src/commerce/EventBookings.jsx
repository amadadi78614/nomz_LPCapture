import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {catalog,money,useCart} from './store';
export default function EventBookings(){
 const [events,setEvents]=useState([]),[error,setError]=useState(''),[selected,setSelected]=useState(null),[notice,setNotice]=useState('');const cart=useCart();
 useEffect(()=>{catalog().then(rows=>setEvents(rows.filter(r=>r.kind==='event'&&new Date(r.event_at)>new Date()))).catch(e=>setError(e.message));},[]);
 function add(e){e.preventDefault();const f=new FormData(e.currentTarget);const count=selected.entry_type==='pair'?2:1;
 const details={participants:Array.from({length:count},(_,i)=>({name:f.get(`name${i}`),dob:f.get(`dob${i}`),level:f.get(`level${i}`)})),division:f.get('division')||'',guardianName:f.get('guardianName')||'',guardianMobile:f.get('guardianMobile')||'',guardianConsent:f.get('guardianConsent')==='on',rulesAccepted:true};
 cart.add(selected,details);setNotice(`${selected.title} added to your cart.`);setSelected(null);
 }
 return <section className="commerce-panel"><h2 className="display">Book events</h2><p>Book a confirmed event, then continue shopping or add another registration before checkout.</p>{error&&<p role="alert">Could not load bookable events. Please refresh.</p>}{notice&&<p role="status">{notice} <Link to="/cart">View cart →</Link></p>}
 {!events.length&&!error&&<p className="muted">Confirmed event bookings will appear here. Ubuntu is R250 per player per event; dates and venue are still TBC. No payment is due for an expression of interest.</p>}
 {events.map(event=><article className="commerce-panel" key={event.id}><h3>{event.title}</h3><p>{new Date(event.event_at).toLocaleString('en-ZA')} · {event.venue}</p><p>{event.description}</p><b>{money(event.price_cents)} / {event.entry_type==='pair'?'pair':'player'}</b><button className="btn" onClick={()=>{setSelected(event);setNotice('');}}>Enter player details</button></article>)}
 {selected&&<form className="commerce-form commerce-panel" onSubmit={add}><h3>{selected.title}</h3>{selected.divisions.length>0&&<label>Division<select name="division" required defaultValue=""><option value="" disabled>Select division</option>{selected.divisions.map(d=><option key={d}>{d}</option>)}</select></label>}
 {Array.from({length:selected.entry_type==='pair'?2:1},(_,i)=><fieldset key={i}><legend>Player {i+1}</legend><label>Full name<input name={`name${i}`} minLength={2} required maxLength={160}/></label><label>Date of birth<input name={`dob${i}`} type="date" required max={new Date().toISOString().slice(0,10)}/></label><label>Playing level<select name={`level${i}`} required><option>P1</option><option>P2</option><option>P3</option><option>Unranked / unsure</option></select></label></fieldset>)}
 <fieldset><legend>Under-18 players: parent / guardian</legend><label>Guardian name<input name="guardianName" required={selected.entry_type==='youth'}/></label><label>Guardian mobile<input name="guardianMobile" type="tel" required={selected.entry_type==='youth'}/></label><label className="check"><input name="guardianConsent" type="checkbox" required={selected.entry_type==='youth'}/>I am authorised to register the under-18 participant(s).</label></fieldset>
 <p style={{whiteSpace:'pre-wrap'}}>{selected.rules}</p><label className="check"><input type="checkbox" required/>I accept the event rules above. Entry remains subject to LP approval.</label><button className="btn">Add registration to cart</button><button type="button" className="btn secondary" onClick={()=>setSelected(null)}>Cancel</button></form>}
 </section>;
}
