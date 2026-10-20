export const latestLadiesResult = {
  id: 'ladies-s2-2026-10-20-blossoms-novas', date: '2026-10-20', venue: 'Play 360', status: 'FT',
  home: 'Backhand Blossoms', away: 'Net Novas', homePoints: 12, awayPoints: 3,
  rubbers: [
    { time: '18:00', home: ['Faeeza Patel', 'Amor Caromba'], away: ['Larisa de Kock', 'Maxine Lambourn'], sets: ['6-0', '6-0', '10-2'], homePoints: 4, awayPoints: 0 },
    { time: '18:00', home: ['Sunel Grote', 'Imaan Packery'], away: ['Carien Vos', 'Simone Maritz'], sets: ['7-5', '7-5', '10-8'], homePoints: 4, awayPoints: 0 },
    // Detailed 20:07 report used; earlier 20:06 message reported the tiebreak as 10-6.
    { time: '19:00', home: ['Jana Kotze', 'Dhiya Ismail'], away: ['Elsa Fryer', 'Emily Anders'], sets: ['6-2', '6-2', '10-2'], homePoints: 4, awayPoints: 0 },
    { time: '19:00', home: ['Nasreen Methar', 'Zahra Jogi'], away: ['Mariette Venter', 'Imaan Shaik'], sets: ['1-6', '7-5', '5-10'], homePoints: 0, awayPoints: 3 },
  ],
};

// Published separately from the completed regular-season log: round not supplied.
export default function LadiesLatestResult() {
  const match = latestLadiesResult;
  return <section className="card mt" aria-label="Latest Ladies result" style={{borderTop:'3px solid #ef4fa0'}}>
    <span className="eyebrow">Ladies Season 2 · Full time · 20 October 2026 · Play 360</span>
    <h2 className="display" style={{margin:'12px 0'}}>Backhand Blossoms <span style={{color:'#ef4fa0'}}>12–3</span> Net Novas</h2>
    <p className="muted">Three clean-sweep wins for Blossoms. Mariette and Imaan take the final rubber for Net Novas.</p>
    <div className="grid cols-2">{match.rubbers.map((rubber, i) => <article className="card" key={i}>
      <span className="eyebrow">{rubber.time} · Rubber {i + 1}</span>
      <p><b>{rubber.home.join(' / ')}</b><br/><span className="muted">vs</span><br/><b>{rubber.away.join(' / ')}</b></p>
      <p>Sets (Blossoms–Novas): <strong>{rubber.sets.join(' · ')}</strong></p>
      <b>Points: {rubber.homePoints}–{rubber.awayPoints}</b>
    </article>)}</div>
  </section>;
}
