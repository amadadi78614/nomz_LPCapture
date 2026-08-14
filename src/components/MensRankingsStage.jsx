import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PLAYERS, franchiseById, stripeVar, winPct } from '../data/seed';

const mvp = (player) => Number(player.stats?.mvp_points) || 0;
const wins = (player) => Number(player.stats?.wins) || 0;
const losses = (player) => Number(player.stats?.losses) || 0;
const played = (player) => Number(player.stats?.played) || 0;
const bonus = (player) => Number(player.stats?.bonus_points) || 0;
const lossPct = (player) => played(player) ? Math.round((losses(player) / played(player)) * 1000) / 10 : 0;
const displayName = (player) => player.name === 'Uwaiz Patel' ? 'Uwais Patel' : player.name;

const SORTS = [['mvp','MVP points'],['win','Win %'],['wins','Wins'],['played','Appearances']];
const DIVISIONS = [['P1','P1'],['P2','P2'],['P3','P3']];

function comparePlayers(sortBy) {
  if (sortBy === 'win') return (a,b) => winPct(b.stats)-winPct(a.stats) || played(b)-played(a) || wins(b)-wins(a) || mvp(b)-mvp(a);
  if (sortBy === 'wins') return (a,b) => wins(b)-wins(a) || winPct(b.stats)-winPct(a.stats) || played(b)-played(a) || mvp(b)-mvp(a);
  if (sortBy === 'played') return (a,b) => played(b)-played(a) || winPct(b.stats)-winPct(a.stats) || wins(b)-wins(a) || mvp(b)-mvp(a);
  return (a,b) => mvp(b)-mvp(a) || wins(b)-wins(a) || winPct(b.stats)-winPct(a.stats) || played(b)-played(a) || displayName(a).localeCompare(displayName(b));
}

function sharedRank(rows, index) {
  if (index === 0) return 1;
  const current = rows[index];
  const previous = rows[index - 1];
  const tied = mvp(current) === mvp(previous) && wins(current) === wins(previous) && losses(current) === losses(previous) && played(current) === played(previous);
  return tied ? sharedRank(rows, index - 1) : index + 1;
}

function TopTen({ court, players }) {
  const rows = players.filter((p) => p.tier === court).sort(comparePlayers('mvp')).slice(0, 10);
  return <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
      <span className="eyebrow">{court} MVP</span>
      <h3 className="display" style={{ margin: '4px 0 0', fontSize: 22 }}>Top 10</h3>
    </div>
    {rows.map((player,index) => {
      const franchise=franchiseById(player.franchise_id);
      return <Link key={player.id} to={`/player/${player.id}`} className="row spread" style={{ padding:'10px 14px',borderBottom:index<rows.length-1?'1px solid var(--line)':'none',textDecoration:'none',gap:10 }}>
        <span className="row" style={{gap:9,minWidth:0}}>
          <b className="num muted" style={{width:20}}>{sharedRank(rows,index)}</b>
          <img src={franchise?.logo} alt="" style={{width:26,height:26,objectFit:'contain'}}/>
          <span><b style={{fontSize:13}}>{displayName(player)}</b><div className="muted" style={{fontSize:10}}>{franchise?.short||franchise?.name}</div></span>
        </span>
        <span style={{textAlign:'right'}}><b className="num" style={{color:'var(--gold)'}}>★ {mvp(player)}</b><div className="muted" style={{fontSize:10}}>{wins(player)}W–{losses(player)}L · {winPct(player.stats)}%</div></span>
      </Link>;
    })}
  </div>;
}

export default function MensRankingsStage({ showHeader = true }) {
  const [division,setDivision] = useState('P1');
  const [sortBy,setSortBy] = useState('mvp');
  const allPlayers = useMemo(() => PLAYERS.filter((player) => player.league === 'mens' && played(player) > 0), []);
  const ranked = useMemo(() => allPlayers.filter((player) => player.tier === division).sort(comparePlayers(sortBy)), [allPlayers,division,sortBy]);

  return <section className="mt">
    {showHeader && <div className="row spread" style={{gap:12,flexWrap:'wrap',alignItems:'end'}}>
      <div><span className="eyebrow">Verified through 13 August 2026 semi-final</span><h2 className="display" style={{margin:'4px 0',fontSize:30}}>Men's Season 3 Rankings</h2></div>
      <span className="muted" style={{fontSize:12}}>Regular season + completed playoff rubbers</span>
    </div>}

    <div className="card mt" style={{borderLeft:'4px solid var(--gold)',padding:16}}>
      <b style={{display:'block',marginBottom:6}}>MVP scoring</b>
      <div className="muted" style={{fontSize:12,lineHeight:1.6}}>3 points per rubber win + 1 bonus point for a 4–0 win. Rankings are separated by P1, P2 and P3. Played, won, lost, win percentage and loss percentage are shown for every player.</div>
    </div>

    <div className="mt"><span className="eyebrow">Division MVP ladders</span><h3 className="display" style={{margin:'4px 0 12px',fontSize:27}}>Top 10 · P1 / P2 / P3</h3><div className="grid cols-3"><TopTen court="P1" players={allPlayers}/><TopTen court="P2" players={allPlayers}/><TopTen court="P3" players={allPlayers}/></div></div>

    <div className="mt"><span className="eyebrow">Full rankings</span><div className="tabbar mt league-tabs league-tier-tabs">{DIVISIONS.map(([value,label]) => <button key={value} className={division===value?'on':''} onClick={() => setDivision(value)}>{label}</button>)}</div></div>
    <div className="mt"><span className="eyebrow">Rank by</span><div className="tabbar mt league-tabs league-tier-tabs">{SORTS.map(([value,label]) => <button key={value} className={sortBy===value?'on':''} onClick={() => setSortBy(value)}>{label}</button>)}</div></div>

    <div className="row spread mt" style={{gap:12,flexWrap:'wrap',alignItems:'end'}}>
      <div><span className="eyebrow">{division} leaderboard</span><h3 className="display" style={{margin:'4px 0',fontSize:26}}>All players</h3></div>
      <span className="muted" style={{fontSize:11}}>{ranked.length} ranked players</span>
    </div>

    <div className="grid mt">{ranked.map((player,index) => {
      const franchise=franchiseById(player.franchise_id);
      const rank=sortBy==='mvp'?sharedRank(ranked,index):index+1;
      return <Link key={player.id} to={`/player/${player.id}`} className="card stripe row spread" style={{'--stripe':stripeVar(franchise?.id),gap:12}}>
        <span className="row" style={{minWidth:0,gap:12}}>
          <b className="num" style={{fontSize:22,width:30,flex:'0 0 auto'}}>{rank}</b>
          <span style={{minWidth:0}}>
            <b style={{fontSize:15}}>{displayName(player)}</b>
            <div className="muted" style={{fontSize:11,marginTop:3}}>{franchise?.name} · {player.tier}</div>
            <div className="muted" style={{fontSize:11,marginTop:4}}><b>{played(player)}P</b> · {wins(player)}W · {losses(player)}L · {winPct(player.stats)}% win · {lossPct(player)}% loss</div>
            <div className="muted" style={{fontSize:10,marginTop:3}}>★ {mvp(player)} MVP pts · {bonus(player)} BP</div>
          </span>
        </span>
        <span style={{textAlign:'right',flex:'0 0 auto'}}><b className="num" style={{color:'var(--gold)',fontSize:20}}>{sortBy==='mvp'?`★ ${mvp(player)}`:sortBy==='win'?`${winPct(player.stats)}%`:sortBy==='wins'?`${wins(player)} W`:played(player)}</b></span>
      </Link>;
    })}</div>
  </section>;
}
