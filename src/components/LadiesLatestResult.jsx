import { latestLadiesResult } from '../data/ladiesSeason2OctoberResults';
export { latestLadiesResult } from '../data/ladiesSeason2OctoberResults';

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
