import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LADIES_S2_RANKINGS, ladiesRankNumber } from '../data/ladiesSeason2Round1Update';
import { LADIES_S2_TEAMS } from '../data/ladiesSeason2Data';

export default function LadiesPlayerRankings() {
  const [team, setTeam] = useState('all');
  const [query, setQuery] = useState('');
  const competitive = LADIES_S2_RANKINGS.filter(player=>player.played);
  const rows = LADIES_S2_RANKINGS.map((player)=>({...player, rank:player.played ? ladiesRankNumber(competitive,competitive.indexOf(player)) : '—'}))
    .filter(player=>(team==='all'||player.team===team)&&player.name.toLowerCase().includes(query.toLowerCase()));
  return <section className="mt" aria-label="Ladies player rankings">
    <div className="card" style={{borderTop:'3px solid #f0abcc'}}>
      <span className="eyebrow">Ladies Season 2 · Latest included result: 22 October 2026</span>
      <h2 className="display">All player MVP rankings</h2>
      <p className="muted">Recorded regular-season results plus both 14 October playoffs, the 20 October semi-final and the 22 October Grand Final. Reconciled with the supplied WhatsApp text on 24 October. MVP points: 3 per rubber win + 1 for a clean sweep. Ranking: MVP points → wins → sets won; equal records share a rank.</p>
      <p className="muted"><strong>Provisional historical record:</strong> the earlier Blossoms–Lillies line-up remains disputed. The supplied export starts on 5 October and cannot verify that earlier match. Two 14 October rubbers have only two reported sets; no third-set scores have been invented. Regular-season team standings exclude playoffs.</p>
      <p className="muted">Seed is the submitted position within each team. Players with no recorded appearance are listed without a competitive rank.</p>
      <div className="row" style={{gap:12,flexWrap:'wrap'}}>
        <label>Franchise <select value={team} onChange={e=>setTeam(e.target.value)} style={{maxWidth:'100%',padding:10}}><option value="all">All franchises</option>{LADIES_S2_TEAMS.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}</select></label>
        <label>Player <input type="search" placeholder="Find a player" value={query} onChange={e=>setQuery(e.target.value)} style={{padding:10,maxWidth:'100%'}}/></label>
        <span className="chip">{rows.length} players</span>
      </div>
    </div>
    <div className="card mt" style={{overflowX:'auto',padding:0}}><table className="tbl" style={{minWidth:740,width:'100%'}}>
      <thead><tr>{['Rank','Player / franchise','Team seed','Played','Wins','Losses','Sets W','Sets L','Bonus','MVP'].map(h=><th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map(p=><tr key={p.id}><td>{p.rank}</td><td><b>{p.name}</b><div className="muted" style={{fontSize:11}}>{p.team}</div></td><td>{p.seed ?? 'Unassigned'}</td><td>{p.played}</td><td>{p.wins}</td><td>{p.losses}</td><td>{p.sets_won}</td><td>{p.sets_lost}</td><td>{p.bonus_points}</td><td><b>{p.mvp_points}</b></td></tr>)}</tbody>
    </table>{!rows.length&&<p style={{padding:16}}>No matching players.</p>}</div>
    <p className="muted" style={{fontSize:12}}>Desert Roses: the submitted list names Simoné and Debbie at seeds 2 and 4. Previous roster entries Marise and Hunaynah remain listed separately without assigned seeds.</p>
    <div className="row" style={{gap:10,flexWrap:'wrap'}}>{LADIES_S2_TEAMS.map(t=><Link className="chip" key={t.id} to={`/ladies-franchise/${t.id}`}>{t.name} seedings →</Link>)}</div>
  </section>;
}
