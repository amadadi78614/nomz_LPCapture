export const UPCOMING_EVENTS = [
  {id:'mens-franchise', name:"Men’s Franchise League — Season 4", timing:'Planned for February/March 2027 · Exact dates TBC', description:'Individual player registration for the next franchise season.', details:'Fees, venues, squad allocation and final competition rules TBC.'},
  {id:'kruger-cup-2', name:'Kruger Cup 2', timing:'Planned for November 2026 · Exact date TBC', description:'Men’s and women’s divisions. Pair registration is planned.', details:'Playing categories, entry limits, fees, venue and final rules TBC.'},
  {id:'youth', name:'Youth Cup', timing:'Planned for November 2026 · Exact date TBC', description:'Boys’ and girls’ divisions: U10, U11, U15 and U19.', details:'Age cut-off, individual or pair entry, fees, venue and final rules TBC. Parent/guardian consent will be required.'},
  {id:'franchise-cup', name:'LP Franchise Cup', timing:'Two-day event · Dates TBC', description:'Current league players representing their respective franchises in a dedicated cup event.', details:'Participating divisions, squad sizes, venues, fees and the final cup format are being discussed.'},
];
export function UpcomingEvent({event}) {
  return <section className="card" style={{padding:24,borderTop:'3px solid var(--gold)'}}>
    <span className="chip">COMING SOON · DATES TBC</span>
    <h2 className="display" style={{margin:'16px 0 8px'}}>{event.name}</h2>
    <p style={{color:'var(--gold)'}}>{event.timing}</p>
    <p style={{lineHeight:1.7}}>{event.description}</p>
    <p className="muted" style={{lineHeight:1.7}}>{event.details}</p>
    <p><b>Registration opens soon. No payment is due now.</b></p>
  </section>;
}
