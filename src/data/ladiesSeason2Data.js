import { FRANCHISES, PLAYERS } from './seed';

const S = {
  'arctic-angels': { name: 'Arctic Angels', owner: 'Michelle Wagner', captain: 'Noerien Moolla', players: ['Aldorette Van Der Mescht','Annelle Whyte','Brigitte du Preez','Deeja Badat','Lana Nel','Michelle Wagner','Mieke Swart','Nazrana Meer','Noerien Moolla','Storme Spearpoint'] },
  'backhand-blossoms': { name: 'Backhand Blossoms', owner: 'Nasreen Methar', captain: 'Sunel Grote', players: ['Amor Caromba','Dhiya Ismail','Diyaana Nomani','Faeeza Patel','Imaan Packery','Jana Kotze','Nasreen Methar','Rinie De Klerk','Sunel Grote','Zahra Jogi'] },
  'desert-roses': { name: 'Desert Roses', owner: 'Michelle Human', captain: 'Lia Odendaal', players: ['Aletia Van Rooyen','Anje Hope','Annali Hugo','Fazila Hafesji','Hunaynah Mungalee','Icem Wilken','Lia Odendaal','Michelle Human','Tasneem Sheikh','Marise Schutte'] },
  'lunar-lillies': { name: 'Lunar Lillies', owner: 'Dirkie Coomans', captain: 'Jeanetha Boshoff', players: ['Bianca Renell Morgan','Dalene Minnaar','Dirkie Coomans','Firdaus Hoosen','Heleen Van Der Mescht','Jeanetha Boshoff','Lizle Tilburn','Mari Jaquire','Miané Swart','Stephanie Steenekamp'] },
  'net-novas': { name: 'Net Novas', owner: 'Carien Vos', captain: 'Simone Maritz', players: ['Larisa de Kock','Carien Vos','Elsa Fryer','Emily Anders','Imaan Shaik','Jeanine Pillay','Mariette Venter','Maxine Lambourn','Mufeedah Hoosen','Simone Maritz'] },
  'phoenix-flames': { name: 'Phoenix Flames', owner: 'Anneri Duvenage', captain: 'Tanija De Villiers', players: ['Anneri Duvenage','Gizelle Taylor','Helene Van der Merwe','Karlien Janse van Rensburg','Martinette Meyer','Maryke Botha','Marz Asvat','Nasreen Omar','Samantha de Araujo','Tanija De Villiers'] },
};

const slug = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const blankStats = () => ({ played: 0, wins: 0, losses: 0, rubbers_won: 0, games_won: 0, sets_won: 0, sets_lost: 0, bonus_points: 0, mvp_points: 0 });

export const LADIES_S2_TEAMS = Object.entries(S).map(([id, team]) => ({
  id,
  name: team.name,
  short: team.name,
  league: 'ladies',
  logo: `/logos/${id}.webp`,
  owner: team.owner,
  captain: team.captain,
  venue: 'Lowveld Padel',
  founded: 2025,
  players: team.players.map((name) => ({
    id: `ladies-s2-${id}-${slug(name)}`,
    name,
    franchise_id: id,
    league: 'ladies',
    tier: 'Ladies',
    role: name === team.owner ? 'owner' : name === team.captain ? 'captain' : 'player',
    lp_rating: 0,
    auction_price: 0,
    stats: blankStats(),
  })),
}));

LADIES_S2_TEAMS.forEach((team) => {
  const existing = FRANCHISES.find((franchise) => franchise.id === team.id);
  const franchise = { ...team };
  delete franchise.players;
  if (existing) Object.assign(existing, franchise);
  else FRANCHISES.push(franchise);
});

for (let index = PLAYERS.length - 1; index >= 0; index -= 1) {
  if (PLAYERS[index].league === 'ladies') PLAYERS.splice(index, 1);
}
LADIES_S2_TEAMS.forEach((team) => PLAYERS.push(...team.players));
