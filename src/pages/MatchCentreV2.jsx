import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FIXTURES } from '../data/seed';
import { ROUND5_FIXTURES } from '../data/franchiseRound5Update';
import '../data/ladiesSeason2Matchweek3Update';
import '../data/ladiesSeason2Matchweek4Update';
import '../data/ladiesSeason2Matchweek5Update';
import '../data/ladiesSeason2Matchweek5FinalUpdate';
import { LADIES_S2_RESULTS, LADIES_S2_STANDINGS } from '../data/ladiesSeason2Round1Update';
import { LiveScoreCard, ResultCard } from '../components/ui';
import '../styles/match-centre-v2.css';

const mergeFixtures = () => [...ROUND5_FIXTURES, ...FIXTURES].filter((fixture, index, list) => list.findIndex((item) => item.id === fixture.id) === index);
const stageLabel = (stage = '') => ({ eliminator: 'Playoff Eliminator', qualifier: 'Final Qualifier', semifinal: 'Semi-final', 'semi-final': 'Semi-final', final: 'Franchise League Final' }[stage] || 'Playoffs');
const matchweek = (match) => { const date = new Date(`${match.date}T12:00:00`); if (date >= new Date('2026-09-15')) return 5; if (date >= new Date('2026-09-09')) return 4; if (date >= new Date('2026-09-02')) return 3; if (date >= new Date('2026-08-26')) return 2; return 1; };

function LadiesResult({ match }) {
  const home = LADIES_S2_STANDINGS.find((team) => team.name === match.home);
  const away = LADIES_S2_STANDINGS.find((team) => team.name === match.away);
  return <article className="card mc2-ladies-result"><div className="mc2-result-meta"><span>FT · {match.venue || 'Lowveld Padel'}</span><span>{new Date(`${match.date}T12:00:00`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span></div><div className={match.homePoints > match.awayPoints ? 'winner' : ''}>{home?.logo && <img src={home.logo} alt=""/>}<b>{match.home}</b><strong>{match.homePoints}</strong></div><div className={match.awayPoints > match.homePoints ? 'winner' : ''}>{away?.logo && <img src={away.logo} alt=""/>}<b>{match.away}</b><strong>{match.awayPoints}</strong></div></article>;
}

function LadiesCentre() {
  const [tab, setTab] = useState('results');
  const [week, setWeek] = useState(5);
  const results = useMemo(() => [...LADIES_S2_RESULTS].sort((a, b) => new Date(b.date) - new Date(a.date)), []);
  const weeks = [...new Set(results.map(matchweek))].sort((a, b) => b - a);
  const visible = results.filter((match) => matchweek(match) === week);
  const qualifiers = LADIES_S2_STANDINGS.slice(0, 4);
  return <><div className="tabbar mt mc2-tabs"><button className={tab === 'results' ? 'on' : ''} onClick={() => setTab('results')}>Latest results</button><button className={tab === 'playoffs' ? 'on' : ''} onClick={() => setTab('playoffs')}>Upcoming playoffs</button></div>{tab === 'results' && <><div className="mc2-rounds" aria-label="Matchweek filter">{weeks.map((item) => <button key={item} className={`chip ${week === item ? 'on' : ''}`} onClick={() => setWeek(item)}>Matchweek {item}</button>)}</div><section className="mc2-round-section mc2-current-section"><div className="mc2-round-heading"><div><span className="eyebrow">Ladies Season 2 · Matchweek {week}</span><h2>{week === 5 ? 'Latest verified results' : `Matchweek ${week} results`}</h2></div><span className="muted">{visible.length} fixtures</span></div><div className="mc2-grid">{visible.map((match) => <LadiesResult key={match.id} match={match}/>)}</div></section></>}{tab === 'playoffs' && <section className="mc2-playoff-now"><div className="mc2-playoff-copy"><span className="eyebrow">Up next · Ladies Season 2</span><h2>Four teams. One championship.</h2><p>The top four have earned their place in the playoff field. The confirmed bracket, match times and venues will appear here as soon as they are released.</p><Link to="/leagues?league=ladies" className="btn gold">Open Ladies playoff hub →</Link></div><div className="mc2-qualifiers"><div className="mc2-qualifier-head"><span>Qualified teams</span><b>TOP 4</b></div>{qualifiers.map((team, index) => <div className="mc2-qualifier" key={team.id}><span>{index + 1}</span>{team.logo && <img src={team.logo} alt=""/>}<b>{team.name}</b><strong>{team.points} pts</strong></div>)}</div></section>}</>;
}

function MensArchive() {
  const fixturesData = useMemo(() => mergeFixtures(), []);
  const [tab, setTab] = useState('results');
  const playoffs = fixturesData.filter((f) => f.status === 'final' && f.stage).sort((a, b) => new Date(b.start) - new Date(a.start));
  const season = fixturesData.filter((f) => f.status === 'final' && !f.stage).sort((a, b) => new Date(b.start) - new Date(a.start));
  const live = fixturesData.filter((f) => f.status === 'live');
  const visible = tab === 'results' ? playoffs : season;
  return <><div className="tabbar mt mc2-tabs"><button className={tab === 'results' ? 'on' : ''} onClick={() => setTab('results')}>Playoff results</button><button className={tab === 'season' ? 'on' : ''} onClick={() => setTab('season')}>Regular season</button>{live.length > 0 && <button className={tab === 'live' ? 'on' : ''} onClick={() => setTab('live')}>● Live</button>}</div><section className="mc2-round-section mc2-archive-section"><div className="mc2-round-heading"><div><span className="eyebrow">Men's Season 3 · Complete</span><h2>{tab === 'results' ? 'Playoff archive' : tab === 'season' ? 'Regular-season archive' : 'Live matches'}</h2></div></div><div className="mc2-grid">{tab !== 'live' && visible.map((f) => <div key={f.id}>{f.stage && <div className="mc2-stage-label">{stageLabel(f.stage)} · {new Date(f.start).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</div>}<ResultCard fixture={f}/></div>)}{tab === 'live' && live.map((f) => <LiveScoreCard key={f.id} fixture={f}/>)}</div></section></>;
}

export default function MatchCentreV2() {
  const [competition, setCompetition] = useState('ladies');
  return <div className="page mc2-page"><div className="mc2-head"><div><span className="eyebrow">{competition === 'ladies' ? 'Current competition · Ladies Season 2' : "Archive · Men's Season 3"}</span><h1 className="display">Match Centre</h1><p className="muted">{competition === 'ladies' ? 'Matchweek 5 is complete. Follow the four-team playoff field and the latest verified results.' : "The completed men's season remains available as a historical record."}</p></div>{competition === 'ladies' && <span className="chip mc2-next">PLAYOFFS NEXT</span>}</div><div className="mc2-competition" aria-label="Choose competition"><button className={competition === 'ladies' ? 'on' : ''} onClick={() => setCompetition('ladies')}><small>CURRENT</small><b>Ladies Season 2</b></button><button className={competition === 'mens' ? 'on' : ''} onClick={() => setCompetition('mens')}><small>COMPLETED</small><b>Men's Season 3 archive</b></button></div>{competition === 'ladies' ? <LadiesCentre/> : <MensArchive/>}</div>;
}
