import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  STANDINGS, FRANCHISES, PLAYERS, FIXTURES,
  franchiseById, stripeVar, TIER_SPONSORS,
  LEGACY_FRANCHISES, LEGACY_STANDINGS, LEGACY_PLAYERS, LEGACY_FIXTURES,
  legacyFranchiseById, winPct,
} from '../data/seed';
import { SponsorRail } from '../components/ui';
import '../styles/leagues-standings-fix.css';
import '../styles/league-differentials.css';

function completedFixtures(row, tier = 'franchise') {
  const rubbersPerFixture = tier === 'franchise' ? 6 : 2;
  return Math.min(6, Math.round((Number(row?.played) || 0) / rubbersPerFixture));
}

function formatDiff(value) {
  const n = Number(value) || 0;
  return n > 0 ? `+${n}` : String(n);
}

const isRegularSeasonFixture = (fixture) =>
  fixture.league === 'mens'
  && fixture.status === 'final'
  && !fixture.stage
  && Number(fixture.round) <= 6;

function buildDifferentials(tier) {
  const stats = Object.fromEntries(
    FRANCHISES.filter((franchise) => franchise.league === 'mens')
      .map((franchise) => [franchise.id, { sd: 0, gd: 0, scoredRubbers: 0 }]),
  );

  FIXTURES.filter(isRegularSeasonFixture).forEach((fixture) => {
    (fixture.score?.rubbers || []).forEach((rubber) => {
      if (tier !== 'franchise' && rubber.court !== tier) return;
      if (!Array.isArray(rubber.sets) || rubber.sets.length === 0) return;

      let homeSets = 0;
      let awaySets = 0;
      let homeGames = 0;
      let awayGames = 0;

      rubber.sets.forEach((setScore) => {
        if (!Array.isArray(setScore) || setScore.length < 2) return;
        const home = Number(setScore[0]) || 0;
        const away = Number(setScore[1]) || 0;
        homeGames += home;
        awayGames += away;
        if (home > away) homeSets += 1;
        if (away > home) awaySets += 1;
      });

      if (stats[fixture.home]) {
        stats[fixture.home].sd += homeSets - awaySets;
        stats[fixture.home].gd += homeGames - awayGames;
        stats[fixture.home].scoredRubbers += 1;
      }
      if (stats[fixture.away]) {
        stats[fixture.away].sd += awaySets - homeSets;
        stats[fixture.away].gd += awayGames - homeGames;
        stats[fixture.away].scoredRubbers += 1;
      }
    });
  });

  return stats;
}

function LeagueStandingsTable({ tier = 'franchise' }) {
  const rows = STANDINGS.mens?.[tier] || [];
  const differentials = useMemo(() => buildDifferentials(tier), [tier]);
  const hasAdjustment = rows.some((row) => row.adj);

  return (
    <div className="league-standings-shell">
      <table className="tbl league-standings-table">
        <thead>
          <tr>
            <th>#</th><th>Franchise</th>
            <th className="num">R</th><th className="num">P</th>
            <th className="num">W</th><th className="num">L</th><th className="num">D</th>
            <th className="num">RD</th><th className="num">SD</th><th className="num">GD</th>
            <th className="num">BP</th><th className="num">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const franchise = franchiseById(row.franchise_id);
            const diff = differentials[row.franchise_id] || { sd: 0, gd: 0, scoredRubbers: 0 };
            const rd = (Number(row.won) || 0) - (Number(row.lost) || 0);
            return (
              <tr key={row.franchise_id}>
                <td><span className={`pos-badge ${tier === 'franchise' && index < 4 ? 'q' : ''}`}>{index + 1}</span></td>
                <td className="league-team-cell">
                  <Link to={`/franchise/${franchise.id}`} className="row">
                    <span className="league-team-stripe" style={{ background: stripeVar(franchise.id) }} />
                    <img src={franchise.logo} alt="" />
                    <b>{franchise.name}{row.adj ? ' *' : ''}</b>
                  </Link>
                </td>
                <td className="num league-rounds"><b>{completedFixtures(row, tier)}</b></td>
                <td className="num">{row.played}</td>
                <td className="num">{row.won}</td>
                <td className="num">{row.lost}</td>
                <td className="num">{row.drawn}</td>
                <td className={`num league-diff-column ${rd > 0 ? 'diff-positive' : rd < 0 ? 'diff-negative' : ''}`}>{formatDiff(rd)}</td>
                <td className={`num league-diff-column ${diff.sd > 0 ? 'diff-positive' : diff.sd < 0 ? 'diff-negative' : ''}`} title={`From ${diff.scoredRubbers} regular-season rubbers with recorded set scores`}>{formatDiff(diff.sd)}</td>
                <td className={`num league-diff-column ${diff.gd > 0 ? 'diff-positive' : diff.gd < 0 ? 'diff-negative' : ''}`} title={`From ${diff.scoredRubbers} regular-season rubbers with recorded set scores`}>{formatDiff(diff.gd)}</td>
                <td className="num">{row.bp}</td>
                <td className="num league-points"><b>{row.points}</b></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="league-standings-key muted">
        Final regular-season table after Round 6 · every franchise plays six fixtures · R = rounds · P = rubbers · RD = rubber difference · SD = set difference · GD = game difference.
        Playoff results are excluded from this table{hasAdjustment ? ' · * includes a league points adjustment' : ''}.
      </div>
    </div>
  );
}

function PlaceholderSeason({ season, league }) {
  return <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}><div style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 20, marginBottom: 8 }}>{league} · {season}</div><p className="muted" style={{ margin: '0 0 14px', fontSize: 13 }}>Historical data for {season} will be published here.</p><span className="chip">Coming Soon</span></div>;
}

const mvpValue = (player) => Number(player.stats?.mvp_points) || 0;
const playerWins = (player) => Number(player.stats?.wins) || 0;
const playerPlayed = (player) => Number(player.stats?.played) || 0;

function divisionLeaders(tier) {
  const ranked = PLAYERS
    .filter((player) => player.league === 'mens' && player.tier === tier && playerPlayed(player) > 0)
    .sort((a, b) => mvpValue(b) - mvpValue(a) || playerWins(b) - playerWins(a) || winPct(b.stats) - winPct(a.stats) || playerPlayed(b) - playerPlayed(a));
  if (!ranked.length) return [];
  const top = ranked[0];
  return ranked.filter((player) => mvpValue(player) === mvpValue(top) && playerWins(player) === playerWins(top));
}

function MvpDivisionCard({ tier, leaders }) {
  if (!leaders.length) return null;
  const lead = leaders[0];
  return (
    <div className="card" style={{ borderTop: '3px solid var(--gold)' }}>
      <span className="eyebrow">{tier} MVP</span>
      <h3 className="display" style={{ margin: '6px 0 8px', fontSize: 22 }}>{leaders.map((player) => player.name).join(' & ')}</h3>
      <div className="muted" style={{ fontSize: 12 }}>
        {leaders.length > 1 ? 'Joint leaders' : 'Current leader'} · {playerPlayed(lead)} rubbers · {playerWins(lead)}W–{Number(lead.stats?.losses) || 0}L · {winPct(lead.stats)}% win · ★ {mvpValue(lead)}
      </div>
    </div>
  );
}

function MensLeague() {
  const [season, setSeason] = useState('s3');
  const [subTab, setSubTab] = useState('standings');
  const [tier2, setTier2] = useState('franchise');
  const rankedPlayers = useMemo(() => [...PLAYERS]
    .filter((p) => p.league === 'mens' && p.stats.played > 0)
    .sort((a, b) => mvpValue(b) - mvpValue(a) || playerWins(b) - playerWins(a) || winPct(b.stats) - winPct(a.stats) || playerPlayed(b) - playerPlayed(a)), []);
  const mvpLeaders = useMemo(() => ({ P1: divisionLeaders('P1'), P2: divisionLeaders('P2'), P3: divisionLeaders('P3') }), []);

  return <>
    <div className="tabbar mt league-tabs">{[['s1','Season 1'],['s2','Season 2'],['s3','Season 3']].map(([key,label]) => <button key={key} className={season===key?'on':''} onClick={() => { setSeason(key); setSubTab('standings'); setTier2('franchise'); }}>{label}</button>)}</div>
    {season === 's1' && <div className="mt"><PlaceholderSeason season="Season 1" league="Men's Franchise League" /></div>}
    {season === 's2' && <div className="mt"><PlaceholderSeason season="Season 2" league="Men's Franchise League" /></div>}
    {season === 's3' && <>
      <div className="tabbar mt league-tabs">{[['standings','Standings'],['franchises','Franchises'],['rankings','Rankings']].map(([key,label]) => <button key={key} className={subTab===key?'on':''} onClick={() => setSubTab(key)}>{label}</button>)}</div>
      {subTab === 'standings' && <div className="mt">
        <p className="muted league-rules">Rubber win = 3 pts · draw = 1 pt · bonus point for a 4–0 win. The six-round regular season is complete; playoff results are separate.</p>
        <div className="tabbar mt league-tabs league-tier-tabs">{[['franchise','Franchise'],['P1','P1'],['P2','P2'],['P3','P3']].map(([value,label]) => <button key={value} className={tier2===value?'on':''} onClick={() => setTier2(value)}>{label}</button>)}</div>
        {tier2 !== 'franchise' && TIER_SPONSORS[tier2] && <div className="row mt league-sponsor" style={{ gap: 10, alignItems: 'center' }}><img src={TIER_SPONSORS[tier2].logo} alt={TIER_SPONSORS[tier2].name} /><span className="muted">{tier2} Log · presented by {TIER_SPONSORS[tier2].name}</span></div>}
        <div className="mt"><LeagueStandingsTable tier={tier2} /></div>
        {tier2 === 'franchise' && <p className="muted mt" style={{ fontSize: 12 }}>Top 4 qualified for Finals Night.</p>}
      </div>}
      {subTab === 'franchises' && <div className="grid cols-2 mt">{STANDINGS.mens.franchise.map((row,index) => { const franchise=franchiseById(row.franchise_id); return <Link key={franchise.id} to={`/franchise/${franchise.id}`} className="card stripe row spread" style={{ '--stripe': stripeVar(franchise.id) }}><div className="row"><img src={franchise.logo} alt="" style={{ width:44,height:44,objectFit:'contain' }}/><div><b style={{fontFamily:'var(--display)',textTransform:'uppercase',fontSize:16}}>{franchise.name}</b><div className="muted" style={{fontSize:12}}>R{completedFixtures(row)} · P{row.played} · W{row.won} · {row.points} pts</div><div className="muted" style={{fontSize:11}}>Owner: {franchise.owner}</div></div></div><span className={`pos-badge ${index<4?'q':''}`} style={{width:30,height:30,fontSize:14}}>{index+1}</span></Link>; })}</div>}
      {subTab === 'rankings' && <div className="mt">
        <div className="row spread" style={{ gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          <div><span className="eyebrow">Current MVP race</span><h2 className="display" style={{ margin: '4px 0', fontSize: 28 }}>P1 · P2 · P3 MVP Leaders</h2></div>
          <span className="muted" style={{ fontSize: 12 }}>Includes completed regular-season and playoff rubbers.</span>
        </div>
        <div className="grid cols-3">
          <MvpDivisionCard tier="P1" leaders={mvpLeaders.P1} />
          <MvpDivisionCard tier="P2" leaders={mvpLeaders.P2} />
          <MvpDivisionCard tier="P3" leaders={mvpLeaders.P3} />
        </div>
        <div className="row spread mt" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div><span className="eyebrow">Overall player ranking</span><h2 className="display" style={{ margin: '4px 0', fontSize: 26 }}>Season 3 leaderboard</h2></div>
          <span className="muted" style={{ fontSize: 12 }}>MVP points → wins → win % → appearances.</span>
        </div>
        <div className="grid mt">{rankedPlayers.slice(0,30).map((p,index) => { const fr=franchiseById(p.franchise_id); return <Link key={p.id} to={`/player/${p.id}`} className="card stripe row spread" style={{'--stripe':stripeVar(fr.id)}}><span className="row"><b className="num" style={{fontSize:20,width:28}}>{index+1}</b><span><b>{p.name}</b><div className="muted" style={{fontSize:11}}>{fr.name} · {p.tier} · {p.stats.played} rubbers · {p.stats.wins}W–{p.stats.losses}L · {winPct(p.stats)}% win</div></span></span><b style={{color:'var(--gold)'}}>★ {p.stats.mvp_points}</b></Link>; })}</div>
        <Link to="/rankings" className="btn ghost mt" style={{display:'block',textAlign:'center'}}>Open full rankings →</Link>
      </div>}
    </>}
  </>;
}

function LadiesLeague() {
  const [season,setSeason]=useState('s2');
  const ladiesFranchises=FRANCHISES.filter((franchise)=>franchise.league==='ladies');
  return <><div className="tabbar mt league-tabs">{[['s1','Season 1'],['s2','Season 2']].map(([key,label]) => <button key={key} className={season===key?'on':''} onClick={()=>setSeason(key)}>{label}</button>)}</div>{season==='s1'&&<div className="mt"><PlaceholderSeason season="Season 1" league="Ladies Franchise League" /></div>}{season==='s2'&&<div className="mt" style={{display:'flex',flexDirection:'column',gap:16}}><div style={{borderRadius:'var(--r)',overflow:'hidden',boxShadow:'0 8px 40px rgba(0,0,0,.6)'}}><img src="/ladies-league-s2.png" alt="Ladies Franchise League Season 2" style={{width:'100%',display:'block'}}/></div><div><p className="eyebrow" style={{marginBottom:10}}>6 Franchises · Season 2 Auction Squads</p><div className="grid cols-2">{ladiesFranchises.map((franchise)=><Link key={franchise.id} to={`/ladies-franchise/${franchise.id}`} className="card row" style={{gap:12}}><img src={franchise.logo} alt="" style={{width:44,height:44,objectFit:'contain'}}/><div><b style={{fontFamily:'var(--display)',textTransform:'uppercase',fontSize:15}}>{franchise.name}</b><div className="muted" style={{fontSize:11}}>View squad →</div></div></Link>)}</div></div></div>}</>;
}

function LegacyLeagueSection() {
  const [subTab,setSubTab]=useState('standings');
  const standings=useMemo(() => [...LEGACY_STANDINGS].sort((a,b)=>b.points-a.points || (b.gd||0)-(a.gd||0)),[]);
  const players=useMemo(() => [...LEGACY_PLAYERS].filter((p)=>p.stats?.played>0).sort((a,b)=>(b.stats.mvp_points||0)-(a.stats.mvp_points||0) || b.stats.wins-a.stats.wins || winPct(b.stats)-winPct(a.stats)),[]);
  const results=useMemo(() => [...LEGACY_FIXTURES].filter((f)=>f.status==='final').sort((a,b)=>new Date(b.start)-new Date(a.start)),[]);
  return <>
    <div className="tabbar mt league-tabs">{[['standings','Standings'],['franchises','Franchises'],['rankings','Player Rankings'],['results','Results']].map(([key,label])=><button key={key} className={subTab===key?'on':''} onClick={()=>setSubTab(key)}>{label}</button>)}</div>
    {subTab==='standings'&&<div className="league-standings-shell mt"><table className="tbl league-standings-table"><thead><tr><th>#</th><th>Franchise</th><th className="num">P</th><th className="num">W</th><th className="num">L</th><th className="num">GD</th><th className="num">Pts</th></tr></thead><tbody>{standings.map((row,index)=>{const fr=legacyFranchiseById(row.franchise_id); if(!fr)return null; return <tr key={row.franchise_id}><td><span className="pos-badge">{index+1}</span></td><td className="league-team-cell"><Link to={`/legacy-franchise/${fr.id}`} className="row"><span className="league-team-stripe" style={{background:fr.primary}}/><img src={fr.logo} alt=""/><b>{fr.name}</b></Link></td><td className="num">{row.played}</td><td className="num">{row.won}</td><td className="num">{row.lost}</td><td className="num">{row.gd>0?`+${row.gd}`:row.gd}</td><td className="num league-points"><b>{row.points}</b></td></tr>;})}</tbody></table><div className="league-standings-key muted">Official table after Round 3.</div></div>}
    {subTab==='franchises'&&<div className="grid cols-2 mt">{LEGACY_FRANCHISES.map((fr)=>{const row=standings.find((r)=>r.franchise_id===fr.id);return <Link key={fr.id} to={`/legacy-franchise/${fr.id}`} className="card row spread" style={{borderLeft:`4px solid ${fr.primary}`}}><span className="row"><img src={fr.logo} alt="" style={{width:46,height:46,objectFit:'contain'}}/><span><b style={{fontFamily:'var(--display)',textTransform:'uppercase'}}>{fr.name}</b><div className="muted" style={{fontSize:11}}>{row?.points||0} pts · {row?.won||0}W–{row?.lost||0}L</div></span></span><span>→</span></Link>;})}</div>}
    {subTab==='rankings'&&<div className="mt"><p className="muted" style={{fontSize:13}}>Ranked from completed Legacy League rubbers.</p><div className="grid mt">{players.length===0?<div className="card"><p className="muted">No completed player results available.</p></div>:players.map((p,index)=>{const fr=legacyFranchiseById(p.franchise_id);return <Link key={p.id} to={`/legacy-franchise/${p.franchise_id}`} className="card row spread" style={{borderLeft:`4px solid ${fr?.primary||'var(--gold)'}`}}><span className="row"><b className="num" style={{fontSize:20,width:28}}>{index+1}</b><span><b>{p.name}</b><div className="muted" style={{fontSize:11}}>{fr?.name} · {p.kind==='youth'?'Youth':'Adult'} · {p.stats.played} rubbers · {winPct(p.stats)}% win</div></span></span><b style={{color:'var(--gold)'}}>★ {p.stats.mvp_points||((p.stats.wins||0)*3+(p.stats.bonus_points||0))}</b></Link>;})}</div><Link to="/rankings" className="btn ghost mt" style={{display:'block',textAlign:'center'}}>Open all rankings →</Link></div>}
    {subTab==='results'&&<div className="grid mt">{results.map((f)=>{const home=legacyFranchiseById(f.home);const away=legacyFranchiseById(f.away);return <div key={f.id} className="card"><div className="row spread"><b>{home?.name}</b><b className="num">{f.score?.totals?.[0]}–{f.score?.totals?.[1]}</b><b>{away?.name}</b></div><div className="muted" style={{fontSize:11,marginTop:8}}>Round {f.round} · {new Date(f.start).toLocaleDateString('en-ZA',{day:'numeric',month:'short',year:'numeric'})}</div></div>;})}</div>}
  </>;
}

export function Leagues() {
  const [league,setLeague]=useState(()=>{const selected=new URLSearchParams(window.location.search).get('league'); return ['ladies','legacy'].includes(selected)?selected:'mens';});
  const selectLeague=(nextLeague)=>{setLeague(nextLeague);const url=nextLeague==='mens'?'/leagues':`/leagues?league=${nextLeague}`;window.history.replaceState({},'',url);};
  return <div className="page leagues-page"><h1 className="display">Leagues</h1><div className="tabbar mt league-tabs league-main-tabs"><button className={league==='mens'?'on':''} onClick={()=>selectLeague('mens')}>Men's Franchise League</button><button className={league==='ladies'?'on':''} onClick={()=>selectLeague('ladies')}>Ladies Franchise League</button><button className={league==='legacy'?'on':''} onClick={()=>selectLeague('legacy')}>LP Legacy League</button></div>{league==='mens'&&<MensLeague/>}{league==='ladies'&&<LadiesLeague/>}{league==='legacy'&&<LegacyLeagueSection/>}<div className="mt"><SponsorRail placement="leagues"/></div></div>;
}
