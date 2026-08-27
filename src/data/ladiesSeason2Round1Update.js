import { LADIES_S2_TEAMS } from './ladiesSeason2Data';

// Ladies Franchise League Season 2 — verified results through 26 August 2026.
// MVP: 3 pts per rubber win + 1 bonus for a clean 4–0.
// Administrative awards affect the franchise score only: no player appearance, win, BP or MVP credit.

export const LADIES_S2_ROUND1_RESULTS = [
  {
    id:'ladies-s2-2026-08-19-phoenix-arctic', date:'2026-08-19', venue:'Play 360', status:'FT',
    home:'Phoenix Flames', away:'Arctic Angels', homePoints:8, awayPoints:7,
    rubbers:[
      {home:['Martinette Meyer','Samantha de Araujo'],away:['Mieke Swart','Deeja Badat'],sets:['6-4','6-2','10-4'],homePoints:4,awayPoints:0},
      {home:['Marz Asvat','Maryke Botha'],away:['Brigitte du Preez','Aldorette Van Der Mescht'],sets:['3-6','3-6','3-10'],homePoints:0,awayPoints:4},
      {home:['Helene Van der Merwe','Anneri Duvenage'],away:['Nazrana Meer','Zantelle Hopkins'],sets:['6-1','6-2','10-8'],homePoints:4,awayPoints:0},
    ],
  },
  {
    id:'ladies-s2-2026-08-19-blossoms-novas', date:'2026-08-19', venue:'Padel 24', status:'FT',
    home:'Backhand Blossoms', away:'Net Novas', homePoints:8, awayPoints:7,
    rubbers:[
      {home:['Amor Caromba','Diyaana Nomani'],away:['Maxine Lambourn','Mufeedah Hoosen'],sets:['1-6','4-6','10-6'],homePoints:0,awayPoints:3},
      {home:['Sunel Grote','Imaan Packery'],away:['Simone Maritz','Carien Vos'],sets:['6-2','6-4','10-5'],homePoints:4,awayPoints:0},
      {home:['Rinie De Klerk','Jana Kotze'],away:['Emily Anders','Mariette Venter'],sets:['4-6','3-6','6-10'],homePoints:0,awayPoints:4},
      {home:['Nasreen Methar','Zahra Jogi'],away:['Imaan Shaik','Larisa de Kock'],sets:['6-3','6-0','10-5'],homePoints:4,awayPoints:0},
    ],
  },
  {
    id:'ladies-s2-2026-08-19-lunar-desert', date:'2026-08-19', venue:'Padel 24', status:'FT',
    home:'Lunar Lillies', away:'Desert Roses', homePoints:11, awayPoints:4,
    note:'Week 1 availability leniency: final rubber awarded 4–0 to Lunar Lillies as an administrative team award only; no individual player statistics or MVP points awarded for that rubber.',
    rubbers:[
      {home:['Bianca Renell Morgan','Lizle Tilburn'],away:['Aletia Van Rooyen','Annali Hugo'],sets:['1-6','1-6','4-10'],homePoints:0,awayPoints:4},
      {home:['Stephanie Steenekamp','Dalene Minnaar'],away:['Icem Wilken','Tasneem Sheikh'],sets:['6-2','6-3','12-14'],homePoints:3,awayPoints:0},
      {home:['Jeanetha Boshoff','Miané Swart'],away:['Lia Odendaal','Michelle Human'],sets:['6-1','6-1','10-7'],homePoints:4,awayPoints:0},
      {home:['Heleen Van Der Mescht','Mari Jaquire'],away:[],sets:[],homePoints:4,awayPoints:0,admin:true,label:'Administrative 4–0 award — Desert Roses unable to field pair'},
    ],
  },
];

export const LADIES_S2_ROUND2_RESULTS = [
  {
    id:'ladies-s2-2026-08-26-desert-arctic', date:'2026-08-26', venue:'Padel 24', status:'FT',
    home:'Desert Roses', away:'Arctic Angels', homePoints:4, awayPoints:9,
    rubbers:[
      {home:['Aletia Van Rooyen','Anje Hope'],away:['Lana Nel','Aldorette Van Der Mescht'],sets:['7-5','2-6','9-11'],homePoints:0,awayPoints:3},
      {home:['Michelle Human','Debbie'],away:['Shelly','Deeja Badat'],sets:['5-7','6-4','4-10'],homePoints:0,awayPoints:3},
      {home:['Tasneem Sheikh','Icem Wilken'],away:['Zantelle Hopkins','Brigitte du Preez'],sets:['6-3','6-2','10-6'],homePoints:4,awayPoints:0},
      {home:['Lia Odendaal','Simone'],away:['Storme Spearpoint','Noerien Moolla'],sets:['4-6','4-6','10-8'],homePoints:0,awayPoints:3},
    ],
  },
  {
    id:'ladies-s2-2026-08-26-lunar-novas', date:'2026-08-26', venue:'Padel 24', status:'FT',
    home:'Lunar Lillies', away:'Net Novas', homePoints:11, awayPoints:4,
    rubbers:[
      {home:['Bianca Renell Morgan','Lizle Tilburn'],away:['Imaan Shaik','Larisa de Kock'],sets:['0-6','0-6','8-10'],homePoints:0,awayPoints:4},
      {home:['Heleen Van Der Mescht','Mari Jaquire'],away:['Mufeedah Hoosen','Jeanine Pillay'],sets:['6-4','6-4','11-9'],homePoints:4,awayPoints:0},
      {home:['Stephanie Steenekamp','Firdaus Hoosen'],away:['Emily Anders','Mariette Venter'],sets:['3-6','6-2','10-5'],homePoints:3,awayPoints:0},
      {home:['Jeanetha Boshoff','Miané Swart'],away:['Simone Maritz','Carien Vos'],sets:['6-2','6-2','10-1'],homePoints:4,awayPoints:0},
    ],
  },
  {
    id:'ladies-s2-2026-08-26-phoenix-blossoms', date:'2026-08-26', venue:'Play 360', status:'FT',
    home:'Phoenix Flames', away:'Backhand Blossoms', homePoints:0, awayPoints:15,
    rubbers:[
      {home:['Nasreen Omar','Tanija De Villiers'],away:['Sunel Grote','Rinie De Klerk'],sets:['5-7','2-6','9-11'],homePoints:0,awayPoints:4},
      {home:['Anneri Duvenage','Gizelle Taylor'],away:['Zahra Jogi','Amor Caromba'],sets:['3-6','1-6','4-10'],homePoints:0,awayPoints:4},
      {home:['Helene Van der Merwe','Martinette Meyer'],away:['Jana Kotze','Dhiya Ismail'],sets:['6-2','4-6','8-10'],homePoints:0,awayPoints:3},
      {home:['Marz Asvat','Maryke Botha'],away:['Faeeza Patel','Diyaana Nomani'],sets:['3-6','1-6','4-10'],homePoints:0,awayPoints:4},
    ],
  },
];

export const LADIES_S2_RESULTS = [...LADIES_S2_ROUND1_RESULTS, ...LADIES_S2_ROUND2_RESULTS];

const teamByName = Object.fromEntries(LADIES_S2_TEAMS.map((team) => [team.name, team]));
const playerByName = Object.fromEntries(LADIES_S2_TEAMS.flatMap((team) => team.players.map((player) => [player.name, player])));
const guestStats = {};
const blankPlayerStats = () => ({played:0,wins:0,losses:0,rubbers_won:0,bonus_points:0,mvp_points:0,sets_won:0,sets_lost:0});
const ensurePlayer = (name, team) => {
  if (playerByName[name]) return playerByName[name];
  if (!guestStats[name]) guestStats[name] = {id:`ladies-s2-guest-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,name,franchise_id:teamByName[team]?.id||'',stats:blankPlayerStats()};
  return guestStats[name];
};

LADIES_S2_TEAMS.forEach((team) => {
  team.stats = {played:0,wins:0,losses:0,points:0,pointsFor:0,pointsAgainst:0,differential:0,setsWon:0,setsLost:0,setDifferential:0,status:'Awaiting result'};
  team.players.forEach((player) => Object.assign(player.stats, blankPlayerStats()));
});

const scoreParts = (score) => String(score || '').split('-').map(Number);

LADIES_S2_RESULTS.forEach((match) => {
  const home = teamByName[match.home];
  const away = teamByName[match.away];
  if (home && away) {
    home.stats.points += match.homePoints; away.stats.points += match.awayPoints;
    home.stats.pointsFor += match.homePoints; home.stats.pointsAgainst += match.awayPoints;
    away.stats.pointsFor += match.awayPoints; away.stats.pointsAgainst += match.homePoints;
    home.stats.differential = home.stats.pointsFor - home.stats.pointsAgainst;
    away.stats.differential = away.stats.pointsFor - away.stats.pointsAgainst;
    home.stats.status = match.status; away.stats.status = match.status;
    if (match.status === 'FT') {
      home.stats.played += 1; away.stats.played += 1;
      if (match.homePoints > match.awayPoints) { home.stats.wins += 1; away.stats.losses += 1; }
      else if (match.awayPoints > match.homePoints) { away.stats.wins += 1; home.stats.losses += 1; }
    }
  }

  match.rubbers.forEach((rubber) => {
    if (rubber.admin) return;

    const homeWon = rubber.homePoints > rubber.awayPoints;
    const winners = homeWon ? rubber.home : rubber.away;
    const losers = homeWon ? rubber.away : rubber.home;
    const winningRubberPoints = homeWon ? rubber.homePoints : rubber.awayPoints;
    const mvpForWinner = 3 + (winningRubberPoints === 4 ? 1 : 0);

    rubber.home.forEach((name) => ensurePlayer(name, match.home).stats.played += 1);
    rubber.away.forEach((name) => ensurePlayer(name, match.away).stats.played += 1);
    winners.forEach((name) => {
      const player = ensurePlayer(name, homeWon ? match.home : match.away);
      player.stats.wins += 1; player.stats.rubbers_won += 1; player.stats.mvp_points += mvpForWinner;
      if (winningRubberPoints === 4) player.stats.bonus_points += 1;
    });
    losers.forEach((name) => ensurePlayer(name, homeWon ? match.away : match.home).stats.losses += 1);

    (rubber.sets || []).forEach((score) => {
      const [h, a] = scoreParts(score);
      if (!Number.isFinite(h) || !Number.isFinite(a) || h === a) return;
      if (h > a) {
        if (home) home.stats.setsWon += 1;
        if (away) away.stats.setsLost += 1;
        rubber.home.forEach((name) => ensurePlayer(name, match.home).stats.sets_won += 1);
        rubber.away.forEach((name) => ensurePlayer(name, match.away).stats.sets_lost += 1);
      } else {
        if (away) away.stats.setsWon += 1;
        if (home) home.stats.setsLost += 1;
        rubber.away.forEach((name) => ensurePlayer(name, match.away).stats.sets_won += 1);
        rubber.home.forEach((name) => ensurePlayer(name, match.home).stats.sets_lost += 1);
      }
    });
  });
});

LADIES_S2_TEAMS.forEach((team) => { team.stats.setDifferential = team.stats.setsWon - team.stats.setsLost; });

export const LADIES_S2_STANDINGS = LADIES_S2_TEAMS.map((team) => ({...team.stats,id:team.id,name:team.name,logo:team.logo}))
  .sort((a,b) => b.points-a.points || b.differential-a.differential || b.setDifferential-a.setDifferential || a.name.localeCompare(b.name));

const rosterRankings = LADIES_S2_TEAMS.flatMap((team) => team.players.map((player) => ({...player.stats,id:player.id,name:player.name,team:team.name,logo:team.logo})));
const guestRankings = Object.values(guestStats).map((player) => ({...player.stats,id:player.id,name:player.name,team:LADIES_S2_TEAMS.find((team)=>team.id===player.franchise_id)?.name||'Ladies Season 2',logo:LADIES_S2_TEAMS.find((team)=>team.id===player.franchise_id)?.logo||''}));
export const LADIES_S2_RANKINGS = [...rosterRankings,...guestRankings].filter((player)=>player.played>0)
  .sort((a,b)=>b.mvp_points-a.mvp_points || b.wins-a.wins || a.name.localeCompare(b.name));
export const ladiesRankNumber = (players,index) => {
  if (index === 0) return 1;
  const a=players[index], b=players[index-1];
  return a.mvp_points===b.mvp_points && a.wins===b.wins ? ladiesRankNumber(players,index-1) : index+1;
};

const signed = (value) => Number(value) > 0 ? `+${value}` : String(value);

function renderLadiesLive() {
  const root = document.querySelector('.lpv2');
  if (root && !root.querySelector('[data-ladies-round1-live]')) {
    const section = document.createElement('section');
    section.className = 'lpv2-section'; section.dataset.ladiesRound1Live = 'true';
    section.innerHTML = `<div class="lpv2-section-heading"><span class="lpv2-kicker">LADIES FRANCHISE LEAGUE · MATCHWEEK 2</span><h2>Season 2 live</h2><p class="muted">Latest verified scores · through 26 August 2026</p></div><div class="grid cols-2">${LADIES_S2_ROUND2_RESULTS.map((m)=>`<div class="card" style="padding:16px"><span class="eyebrow">FT · ${m.venue}</span><div class="row spread" style="margin-top:10px"><b>${m.home}</b><strong>${m.homePoints}</strong></div><div class="row spread"><b>${m.away}</b><strong>${m.awayPoints}</strong></div></div>`).join('')}</div>`;
    const pulse = root.querySelector('.lpv2-pulse');
    if (pulse?.nextSibling) root.insertBefore(section,pulse.nextSibling); else root.appendChild(section);
  }

  if (location.pathname === '/leagues') {
    const page = document.querySelector('.leagues-page');
    const active = page && [...page.querySelectorAll('button')].some((button)=>button.classList.contains('on') && button.textContent.includes('Ladies Franchise League'));
    if (active && !page.querySelector('[data-ladies-round1-table]')) {
      const section = document.createElement('section');
      section.dataset.ladiesRound1Table = 'true'; section.className = 'card'; section.style.cssText='padding:18px;margin:16px 0;overflow-x:auto';
      section.innerHTML = `<span class="eyebrow">Season 2 · Through Matchweek 2</span><h2 class="display" style="margin:5px 0 6px">Franchise log</h2><p class="muted" style="margin:0 0 12px;font-size:11px">P/W/L are completed franchise fixtures. Pts/PF/PA are accumulated rubber points. GD = PF−PA. SW/SL/SD count played sets only; the Week 1 administrative 4–0 award carries no set or player credit.</p><table class="tbl" style="min-width:760px;width:100%"><thead><tr><th>#</th><th>Franchise</th><th>P</th><th>W</th><th>L</th><th>Pts</th><th>PF</th><th>PA</th><th>GD</th><th>SW</th><th>SL</th><th>SD</th></tr></thead><tbody>${LADIES_S2_STANDINGS.map((t,i)=>`<tr><td>${i+1}</td><td><b>${t.name}</b></td><td>${t.played}</td><td>${t.wins}</td><td>${t.losses}</td><td><b>${t.points}</b></td><td>${t.pointsFor}</td><td>${t.pointsAgainst}</td><td>${signed(t.differential)}</td><td>${t.setsWon}</td><td>${t.setsLost}</td><td>${signed(t.setDifferential)}</td></tr>`).join('')}</tbody></table><h3 class="display" style="margin:18px 0 4px">Player MVP rankings</h3><p class="muted" style="margin:0 0 8px;font-size:11px">3 points per rubber win + 1 bonus for a clean 4–0. Administrative awards do not count as appearances, wins, bonus points or MVP points.</p>${LADIES_S2_RANKINGS.map((p,i)=>`<div class="row spread" style="padding:7px 0"><span>${ladiesRankNumber(LADIES_S2_RANKINGS,i)}. ${p.name} <small class="muted">· ${p.team} · ${p.played} P · ${p.wins} W</small></span><b>${p.mvp_points} MVP pts</b></div>`).join('')}`;
      page.prepend(section);
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', renderLadiesLive);
  new MutationObserver(()=>requestAnimationFrame(renderLadiesLive)).observe(document.documentElement,{childList:true,subtree:true});
}
