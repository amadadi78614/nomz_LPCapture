import { LEGACY_PLAYERS as DRAFT_PLAYERS } from './seed';

const blankStats = () => ({ played: 0, wins: 0, losses: 0, rubbers_won: 0, sets_won: 0, sets_lost: 0, bonus_points: 0, mvp_points: 0 });

export const LEGACY_LIVE_FIXTURES = [
  { id:'lg-md1-rhinos-cheetahs', round:1, league:'legacy', home:'lp-rhinos', away:'lp-cheetahs', start:new Date('2026-07-18T14:00:00+02:00'), court:'Play 360', status:'final', score:{ winner:'away', totals:[3,8], rubbers:[
    {slot:'14:00',winner:'home',games:[3,0],homeIds:['Christiaan van Aardt','Zinidine Morgan'],awayIds:['Mauritz van der Mescht','Michael Smit'],sets:[[6,4],[6,3],[1,10]]},
    {slot:'15:00',winner:'away',games:[0,4],homeIds:['Irshaad Moola','Yusuf Amod'],awayIds:['Shoaib Nomani','Mohamed Nomani'],sets:[[4,6],[2,6],[8,10]]},
    {slot:'16:00',winner:'away',games:[0,4],homeIds:['Ayaan Mohamed','Rafiq Mohamed'],awayIds:['Mikel Pillay','Abdurahmaan Jogee'],sets:[[6,7],[3,6],[7,10]]},
  ]}},
  { id:'lg-md1-leopards-jackals', round:1, league:'legacy', home:'lp-leopards', away:'lp-jackals', start:new Date('2026-07-18T14:00:00+02:00'), court:'Play 360', status:'final', score:{ winner:'home', totals:[8,4], rubbers:[
    {slot:'14:00',winner:'away',games:[0,4],homeIds:['Muhammed Ruhaan Shaik','Ebrahim Mangerah'],awayIds:['Dewan Duvenhage','Yusuf Ismail'],sets:[[0,6],[0,6],[6,10]]},
    {slot:'15:00',winner:'home',games:[4,0],homeIds:['Ridhwaan Sujee','Huzaifah Sujee'],awayIds:['Stiaan Duvenhage','Spanner Mescht'],sets:[[6,2],[7,5],[10,0]]},
    {slot:'16:00',winner:'home',games:[4,0],homeIds:['Ozayr Shaik','Adil Amod'],awayIds:['Zunaid Ganchi','Mohamed Hoosein Patel'],sets:[[6,2],[6,2],[10,7]]},
  ]}},
  { id:'lg-md1-eagles-badgers', round:1, league:'legacy', home:'lp-eagles', away:'lp-honey-badgers', start:new Date('2026-07-18T14:00:00+02:00'), court:'Play 360', status:'final', score:{ winner:'away', totals:[4,7], rubbers:[
    {slot:'14:00',winner:'home',games:[4,0],homeIds:['Fiaz Bhikhoo','Sahal Yunus'],awayIds:['Sailesh Nagar','Zandre de Kok'],sets:[[6,0],[6,2],[10,7]]},
    {slot:'15:00',winner:'away',games:[0,4],homeIds:['Dian Erasmus','Mohamed Azhar Sujee'],awayIds:['Jameel Valley','Faheem Seedat'],sets:[[3,6],[3,6],[7,10]]},
    {slot:'16:00',winner:'away',games:[0,3],homeIds:['Armaan Bhikhoo','Yahya Sujee'],awayIds:['Seth van den Berg','Reyhaan Seedat'],sets:[[2,6],[6,4],[7,10]]},
  ]}},

  { id:'lg-2026-08-15-jackals-badgers', round:10, league:'legacy', home:'lp-jackals', away:'lp-honey-badgers', start:new Date('2026-08-15T13:00:00+02:00'), court:'Play 360', status:'final', score:{ winner:'away', totals:[3,7], rubbers:[
    {slot:'13:00',winner:'away',games:[0,3],homeIds:['Joe','Fahad Patel'],awayIds:['Scharl van den Berg','Jameel Valley'],sets:[[6,3],[3,6],[6,10]]},
    {slot:'13:00',winner:'away',games:[0,4],homeIds:['Mohamed Hoosein Patel','Spanner Mescht'],awayIds:['Jude van den Berg','Zandre de Kok'],sets:[[2,6],[2,6],[3,10]]},
    {slot:'15:00',winner:'home',games:[3,0],homeIds:['Mohamed Hoosein Patel','Zuhayr Ismail'],awayIds:['Seth van den Berg','Reyhaan Seedat'],sets:[[5,7],[6,3],[10,6]]},
  ]}},
  { id:'lg-2026-08-15-leopards-cheetahs', round:11, league:'legacy', home:'lp-leopards', away:'lp-cheetahs', start:new Date('2026-08-15T14:00:00+02:00'), court:'Play 360', status:'final', score:{ winner:'away', totals:[4,7], rubbers:[
    {slot:'14:00',winner:'home',games:[4,0],homeIds:['Ozayr Shaik','Muhammad Mangerah'],awayIds:['Sandeep Daya','Mauritz van der Mescht'],sets:[[6,0],[6,0],[10,0]]},
    {slot:'16:00',winner:'away',games:[0,3],homeIds:['Jovan Erasmus','Beast'],awayIds:['Mohamed Nomani','Shoaib Nomani'],sets:[[6,4],[1,6],[2,10]]},
    {slot:'17:00',winner:'away',games:[0,4],homeIds:['Huzaifah Sujee','Muhammed Ruhaan Shaik'],awayIds:['Aadam Nomani','Abdurahmaan Jogee'],sets:[[2,6],[0,6],[4,10]]},
  ]}},
  { id:'lg-2026-08-15-leopards-rhinos', round:12, league:'legacy', home:'lp-leopards', away:'lp-rhinos', start:new Date('2026-08-15T18:00:00+02:00'), court:'Play 360', status:'final', score:{ winner:'away', totals:[3,7], rubbers:[
    {slot:'18:00',winner:'home',games:[3,0],homeIds:['Ozayr Shaik','Ridhwaan Sujee'],awayIds:['Rafiq Mohamed','Irshaad Moola'],sets:[[7,5],[6,4],[6,10]]},
    {slot:'18:00',winner:'away',games:[0,3],homeIds:['Jovan Erasmus','Beast'],awayIds:['Christiaan van Aardt','Yusuf Amod'],sets:[[7,6],[3,6],[4,10]]},
    {slot:'19:00',winner:'away',games:[0,4],homeIds:['Huzaifah Sujee','Ebrahim Mangerah'],awayIds:['Muhammed Moola','Ayaan Mohamed'],sets:[[1,6],[3,6],[3,10]]},
  ]}},
  { id:'lg-2026-08-15-rhinos-eagles', round:12, league:'legacy', home:'lp-rhinos', away:'lp-eagles', start:new Date('2026-08-15T18:00:00+02:00'), court:'Play 360', status:'final', score:{ winner:'away', totals:[3,6], rubbers:[
    {slot:'18:00',winner:'away',games:[0,3],homeIds:['Christiaan van Aardt','Zinidine Morgan'],awayIds:['Sahal Yunus','Akmeer Amod'],sets:[[1,6],[6,4],[4,10]]},
    {slot:'18:00',winner:'home',games:[3,0],homeIds:['Muhammed Moola','Eesa Moola'],awayIds:['Armaan Bhikhoo','Shaheen'],sets:[[3,6],[7,6],[10,6]]},
    {slot:'19:00',winner:'away',games:[0,3],homeIds:['Rafiq Mohamed','Irshaad Moola'],awayIds:['Fiaz Bhikhoo','Mohamed Azhar Sujee'],sets:[[1,6],[3,6],[12,10]]},
  ]}},
];

const teamIds = ['lp-cheetahs','lp-leopards','lp-honey-badgers','lp-eagles','lp-jackals','lp-rhinos'];
export const LEGACY_LIVE_STANDINGS = teamIds.map((id) => ({ franchise_id:id, played:0, won:0, lost:0, drawn:0, bp:0, points:0, mp:0, gd:0, adj:0 }));
const teamRow = (id) => LEGACY_LIVE_STANDINGS.find((row) => row.franchise_id === id);
LEGACY_LIVE_FIXTURES.forEach((fixture) => {
  const h = teamRow(fixture.home); const a = teamRow(fixture.away);
  const [hp, ap] = fixture.score.totals;
  h.played += 1; a.played += 1; h.points += hp; a.points += ap; h.mp += hp; a.mp += ap; h.gd += hp - ap; a.gd += ap - hp;
  if (hp > ap) { h.won += 1; a.lost += 1; } else if (ap > hp) { a.won += 1; h.lost += 1; } else { h.drawn += 1; a.drawn += 1; }
});
LEGACY_LIVE_STANDINGS.sort((a,b) => b.points-a.points || b.won-a.won || b.gd-a.gd);

const playerMap = new Map(DRAFT_PLAYERS.map((p) => [p.name, { ...p, stats: blankStats() }]));
const franchiseForName = (name, fallback) => playerMap.get(name)?.franchise_id || fallback;
const ensurePlayer = (name, fallbackFranchise) => {
  if (!playerMap.has(name)) playerMap.set(name, { id:`lg-live-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`, name, franchise_id:fallbackFranchise, league:'legacy', kind:'adult', draftRound:null, lp_rating:1400, stats:blankStats() });
  return playerMap.get(name);
};
LEGACY_LIVE_FIXTURES.forEach((fixture) => fixture.score.rubbers.forEach((rubber) => {
  const homeNames = rubber.homeIds || []; const awayNames = rubber.awayIds || [];
  const homeSets = (rubber.sets || []).filter(([h,a]) => h>a).length; const awaySets = (rubber.sets || []).filter(([h,a]) => a>h).length;
  [[homeNames,'home',fixture.home,homeSets,awaySets],[awayNames,'away',fixture.away,awaySets,homeSets]].forEach(([names,side,fid,sf,sa]) => names.forEach((name) => {
    const p = ensurePlayer(name, franchiseForName(name,fid)); p.stats.played += 1; p.stats.sets_won += sf; p.stats.sets_lost += sa;
    if (rubber.winner === side) { p.stats.wins += 1; p.stats.rubbers_won += 1; if ((rubber.games?.[side==='home'?0:1]===4) && (rubber.games?.[side==='home'?1:0]===0)) p.stats.bonus_points += 1; }
    else p.stats.losses += 1;
    p.stats.mvp_points = p.stats.rubbers_won * 3 + p.stats.bonus_points;
  }));
}));
export const LEGACY_LIVE_PLAYERS = [...playerMap.values()];

export const LEGACY_LIVE_POWER = [...LEGACY_LIVE_STANDINGS].map((row) => row.franchise_id);
