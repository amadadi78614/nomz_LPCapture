// ============================================================
// LOWVELD PADEL — LOCAL SEED DATA (mirrors Supabase schema)
//
// OFFICIAL COMPETITION STRUCTURE (per LPFL team sheets & logs):
// - Each franchise fields THREE court tiers: P1 / P2 / P3,
//   six players per tier (18-player squads).
// - Court tier sponsors: P1 Astron Energy · P2 Vawda's Tyre
//   Torque · P3 Omar's Motor Den.
// - Each fixture = 6 rubbers (2 per tier) across three slots
//   (18:00 / 19:15 / 20:30).
// - LOGS: rubber win = 3 pts · draw = 1 pt · BONUS POINT for a
//   4-0 rubber win. Four tables: Franchise log (all rubbers)
//   + P1 / P2 / P3 tier logs. Fixture-night winner (posters)
//   = aggregate games.
// - Ladies Season 3 has not started — fixtures TBA.
// ============================================================

export const SEASON = { id: 's3', name: 'Season 3', year: 2026, status: 'active' };
export const LADIES_SEASON_STATUS = 'pre';

export const FRANCHISES = [
  { id: 'avalanche-aces', name: 'Avalanche Aces', league: 'mens', short: 'Aces', logo: '/logos/avalanche-aces.webp', owner: 'Frik de Beer', ownerBrand: 'Ryan Tate', venue: 'Padel 24', founded: 2024 },
  { id: 'desert-falcons', name: 'Desert Falcons', league: 'mens', short: 'Falcons', logo: '/logos/desert-falcons.webp', owner: 'Ahmed Ismail & Muhammad Mangerah', venue: 'Padel 24', founded: 2024 },
  { id: 'globo-boomerangs', name: 'Global Boomerangs', league: 'mens', short: 'Boomerangs', logo: '/logos/globo-boomerangs.webp', owner: 'Nabeel Meer', venue: 'Play 360', founded: 2024 },
  { id: 'ice-breakers', name: 'Ice Breakers', league: 'mens', short: 'Ice Breakers', logo: '/logos/ice-breakers.webp', owner: 'Zaheer Methar & Irshaad Moola', venue: 'Padel 24', founded: 2024 },
  { id: 'samurai-kicksmashers', name: 'Samurai Kick Smashers', league: 'mens', short: 'Kick Smashers', logo: '/logos/samurai-kicksmashers.webp', owner: 'Siraaj Shaik & Shaun Marope', ownerBrand: 'Patels Hardware', venue: 'Play 360', founded: 2024 },
  { id: 'sonic-viboras', name: 'Sonic Viboras', league: 'mens', short: 'Viboras', logo: '/logos/sonic-viboras.webp', owner: 'Wayne Wagner', venue: 'Padel 24', founded: 2024 },
  { id: 'sahara-lions', name: 'Sahara Lions', league: 'mens', short: 'Lions', logo: '/logos/sahara-lions.webp', owner: 'Majid Bapu', venue: 'Play 360', founded: 2024 },
  { id: 'arctic-angels', name: 'Arctic Angels', league: 'ladies', logo: '/logos/arctic-angels.webp', owner: 'Franchise Owner', venue: 'Padel 24', founded: 2025 },
  { id: 'backhand-blossoms', name: 'Backhand Blossoms', league: 'ladies', logo: '/logos/backhand-blossoms.webp', owner: 'Franchise Owner', venue: 'Play 360', founded: 2025 },
  { id: 'desert-roses', name: 'Desert Roses', league: 'ladies', logo: '/logos/desert-roses.webp', owner: 'Franchise Owner', venue: 'Padel 24', founded: 2025 },
  { id: 'lunar-lillies', name: 'Lunar Lillies', league: 'ladies', logo: '/logos/lunar-lillies.webp', owner: 'Franchise Owner', venue: 'Play 360', founded: 2025 },
  { id: 'net-novas', name: 'Net Novas', league: 'ladies', logo: '/logos/net-novas.webp', owner: 'Franchise Owner', venue: 'Padel 24', founded: 2025 },
  { id: 'phoenix-flames', name: 'Phoenix Flames', league: 'ladies', logo: '/logos/phoenix-flames.webp', owner: 'Franchise Owner', venue: 'Play 360', founded: 2025 },
];

// Court tier sponsors (official)
export const TIER_SPONSORS = {
  P1: { name: 'Astron Energy', logo: '/sponsors/astron-energy.png', tagline: 'Powering Performance' },
  P2: { name: "Vawda's Tyre Torque", logo: '/sponsors/vawdas-tyre-torque.png', tagline: 'Driven by Performance' },
  P3: { name: "Omar's Motor Den", logo: '/sponsors/omars-motor-den.png', tagline: 'Est. 2016' },
};

// ---- Squads (official Season 3 team sheets, 1 Jun 2026) ------
const SQUADS = {
  'avalanche-aces': {
    P1: ['Wiehann Mohlen', 'Hoffman Maritz', 'Patrick Leyden', 'Donovan Taylor', 'Ryan Tate', 'Steven Pinker'],
    P2: ['Etienne Grobler', 'Ruaan Naude', 'Frik de Beer', 'Felix Lombard', 'Pierre de Villiers', 'Luqmaan Hoosen'],
    P3: ['Anas Mungalee', 'Kobus van Rensburg', 'Gerco van Rooyen', 'Rishaad Shaik', 'Piotr Latusek', 'Prashil Nagar'],
  },
  'desert-falcons': {
    P1: ['Uwaiz Patel', 'Yusuf Patel', 'Ahmed Ismail', 'Faheem Nomani', 'Reinhardt Trollip', 'Schalk Schutte'],
    P2: ['Warno Smit', 'Morne Steenekamp', 'Ryan Wicht', 'Fahad Patel', 'Rayhaan Dinath', 'Ebrahim Mungalee'],
    P3: ['Jacques Burger', 'Reino Grobler', 'Muhammad Mangerah', 'Zaeem Sadiq', 'Danie Rautenbach', 'Jude van den Berg'],
  },
  'sahara-lions': {
    P1: ['Cameron Jacobsz', 'Cian Maritz', 'Yusuf Packery', 'Pieter Badenhorst', 'Justin van Staaden', 'Suhayl Packery'],
    P2: ['Naeem Omar', 'Alfaiz Mamji', 'Adil Patel', 'Soyab Patel', 'Suliman Patel', 'Irfaan Mamji'],
    P3: ['Drikus Prins', 'Warren Morgan', 'Irfaan Mahomed', 'Aadil Asvat', 'Imtiaz Mohamed', 'Majid Bapu'],
  },
  'globo-boomerangs': {
    P1: ['Yusuf Asvat', 'Joseph van der Merwe', 'Ahmed Mungalee', 'Liam Morgan', 'Lefa Mogamedi', 'Adil Ahmed'],
    P2: ['Bevin Francis', 'Muhammed Shehzad Meer', 'Ryan Kennett', 'Diego Sebastian', 'Duran Greever', 'Nabeel Meer'],
    P3: ['Kiran Hansraj', 'Stefan Erasmus', 'Taahir Mungalee', 'Suhail Patel', 'Shaffique Jeewa', 'Farhaan Shaik'],
  },
  'samurai-kicksmashers': {
    P1: ['Durell Pillay', 'Bryan Theron', 'Burger Bester', 'Muhammad Azhar Sujee', 'Siraaj Shaik', 'Danyaal Nomani'],
    P2: ['Muhammed Jina', 'Muneer Shaik', 'Armand Esterhuizen', 'Shaun Moropa', 'Tim Forssman', 'Sikander Cassim'],
    P3: ['Riaz Ahmed Bellim', 'Brent Grix', 'Dillon Francis', 'Imraan Khan', 'Ismail Karodia', 'Nuaym Shaik'],
  },
  'ice-breakers': {
    P1: ['Duhan Swart', 'JD Herbst', 'Imaad Arabi', 'Maaz Randera', 'Zaheer Methar', 'Salmaan Methar'],
    P2: ['Jacques van Zyl', 'Phil-Mar van Rensburg', 'Zayd Methar', 'Nicky Joubert', 'Zahid Methar', 'Chaz Taylor'],
    P3: ['Wayne Enslin', 'Sergio Correia', 'Waldo van Tonder', 'Irshaad Moola', 'Shaun Caromba', 'Aadam Nomani'],
  },
  'sonic-viboras': {
    P1: ['Heinrich Coomans', 'Anton Grote', 'Yusuf Moola', 'Pieter Boshoff', 'Ridhwaan Sujee', 'Erlo Olivier'],
    P2: ['Warwick Morgan', 'Joshua Hoffman', 'Marius Loock', 'Khalid Jeewa', 'Ismail Fakir', 'Jacques Henning'],
    P3: ['George du Toit', 'Dewald Meyer', 'Gerrit Smith', 'Stefan de Villiers', 'Mohamed Dadamia', 'Saliem Mahomed'],
  },
};

let pid = 0;
export const PLAYERS = [];
for (const [frId, tiers] of Object.entries(SQUADS)) {
  for (const [tierName, names] of Object.entries(tiers)) {
    names.forEach((name, i) => {
      pid += 1;
      PLAYERS.push({
        id: `p${pid}`,
        name,
        franchise_id: frId,
        league: 'mens',
        tier: tierName,
        role: tierName === 'P1' && i === 0 ? 'captain' : 'player',
        lp_rating: Math.round(1400 + (tierName === 'P1' ? 120 : tierName === 'P2' ? 0 : -120) + Math.sin(pid * 1.7) * 60),
        auction_price: 1000 + ((pid * 137) % 9) * 250,
        stats: { played: 0, wins: 0, losses: 0, rubbers_won: 0, games_won: 0, sets_won: 0, sets_lost: 0, bonus_points: 0, mvp_points: 0 },
      });
    });
  }
}

const byName = (frId, name) => PLAYERS.find((p) => p.franchise_id === frId && p.name === name);
const ids = (frId, ...names) => names.map((n) => byName(frId, n)?.id || null);

// ---- Sponsors (official court-tier partners) ------------------
export const SPONSORS = [
  { id: 'sp-title', name: 'Title Partner — Available', tier: 'title', url: '#', blurb: 'League naming rights across app, broadcast graphics and Finals Night.' },
  { id: 'sp-astron', name: 'Astron Energy', tier: 'gold', url: '#', logo: '/sponsors/astron-energy.png', blurb: 'Official P1 court sponsor — the P1 Log Table presented by Astron Energy.' },
  { id: 'sp-vawdas', name: "Vawda's Tyre Torque", tier: 'gold', url: '#', logo: '/sponsors/vawdas-tyre-torque.png', blurb: 'Official P2 court sponsor — the P2 Log Table presented by Vawda\'s Tyre Torque.' },
  { id: 'sp-omars', name: "Omar's Motor Den", tier: 'gold', url: '#', logo: '/sponsors/omars-motor-den.png', blurb: 'Official P3 court sponsor — the P3 Log Table presented by Omar\'s Motor Den.' },
];

// ---- OFFICIAL SEASON 3 FIXTURES ------------------------------
// Rubber: { slot, court(tier), home/away display names,
//           homeIds/awayIds (null when not yet confirmed),
//           games:[h,a] | null when score not published, winner }
const T = (date, h = 18, m = 0) => `${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00+02:00`;

export const FIXTURES = [
  // WEEK 1 · 8–10 Jun · DH: Avalanche Aces
  // MD1 · Mon 8 Jun — rubber outcomes per official P1/P2/P3 logs;
  // pair names & exact games for IB v SV not yet published.
  { id: 'fx-w1-1', round: 1, league: 'mens', home: 'ice-breakers', away: 'sonic-viboras', start: T('2026-06-08'), status: 'final', court: 'Padel 24',
    score: { winner: 'away', totals: [3, 17], rubberWins: [1, 5], rubbers: [
      { slot: '18:00', court: 'P1', home: 'Duhan / JD', away: 'Heinrich / Anton',
        homeIds: ids('ice-breakers', 'Duhan Swart', 'JD Herbst'), awayIds: ids('sonic-viboras', 'Heinrich Coomans', 'Anton Grote'),
        games: [0, 4], winner: 'away', sets: [[1, 6], [4, 6], [7, 10]] },
      { slot: '19:15', court: 'P1', home: 'Zaheer / Maaz', away: 'Yusuf Moola / Ridhwaan Sujee',
        homeIds: ids('ice-breakers', 'Zaheer Methar', 'Maaz Randera'), awayIds: ids('sonic-viboras', 'Yusuf Moola', 'Ridhwaan Sujee'),
        games: [3, 0], winner: 'home', sets: [[6, 4], [4, 6], [10, 8]] },
      { slot: '18:00', court: 'P2', home: 'Jacques / Phil-Mar', away: 'Warwick / Joshua',
        homeIds: ids('ice-breakers', 'Jacques van Zyl', 'Phil-Mar van Rensburg'), awayIds: ids('sonic-viboras', 'Warwick Morgan', 'Joshua Hoffman'),
        games: [0, 3], winner: 'away', sets: [[1, 6], [7, 6], [7, 10]] },
      { slot: '20:05', court: 'P2', home: 'Zayd / Nicky', away: 'Marius / Khalid',
        homeIds: ids('ice-breakers', 'Zayd Methar', 'Nicky Joubert'), awayIds: ids('sonic-viboras', 'Marius Loock', 'Khalid Jeewa'),
        games: [0, 4], winner: 'away', sets: [[4, 6], [3, 6], [4, 12]] },
      { slot: '18:00', court: 'P3', home: 'Waldo / Irshaad', away: 'Stefan / Mohamed Dadamia',
        homeIds: ids('ice-breakers', 'Waldo van Tonder', 'Irshaad Moola'), awayIds: ids('sonic-viboras', 'Stefan de Villiers', 'Mohamed Dadamia'),
        games: [0, 3], winner: 'away', sets: [[6, 4], [2, 6], [6, 10]] },
      { slot: '19:15', court: 'P3', home: 'Wayne / Sergio', away: 'Dewald / Gerrit',
        homeIds: ids('ice-breakers', 'Wayne Enslin', 'Sergio Correia'), awayIds: ids('sonic-viboras', 'Dewald Meyer', 'Gerrit Smith'),
        games: [0, 3], winner: 'away', sets: [[5, 6], [7, 6], [10, 7]] },
    ] } },
  { id: 'fx-w1-2', round: 1, league: 'mens', home: 'samurai-kicksmashers', away: 'avalanche-aces', start: T('2026-06-08'), status: 'final', court: 'Play 360', dh: true,
    score: { winner: 'home', totals: [12, 9], rubberWins: [3, 3], rubbers: [
      { slot: '18:00', court: 'P2', home: 'Shaun Moropa / Tim Forssman', away: 'Felix Lombard / Pierre de Villiers',
        homeIds: ids('samurai-kicksmashers', 'Shaun Moropa', 'Tim Forssman'), awayIds: ids('avalanche-aces', 'Felix Lombard', 'Pierre de Villiers'), games: [4, 0], winner: 'home' },
      { slot: '18:00', court: 'P3', home: 'Riaz Ahmed Bellim / Brent Grix', away: 'Anas Mungalee / Kobus van Rensburg',
        homeIds: ids('samurai-kicksmashers', 'Riaz Ahmed Bellim', 'Brent Grix'), awayIds: ids('avalanche-aces', 'Anas Mungalee', 'Kobus van Rensburg'), games: [0, 3], winner: 'away' },
      { slot: '19:15', court: 'P1', home: 'Durell Pillay / Bryan Theron', away: 'Patrick Leyden / Hoffman Maritz',
        homeIds: ids('samurai-kicksmashers', 'Durell Pillay', 'Bryan Theron'), awayIds: ids('avalanche-aces', 'Patrick Leyden', 'Hoffman Maritz'), games: [4, 0], winner: 'home' },
      { slot: '19:15', court: 'P3', home: 'Dillon Francis / Ismail Karodia', away: 'Gerco van Rooyen / Piotr Latusek',
        homeIds: ids('samurai-kicksmashers', 'Dillon Francis', 'Ismail Karodia'), awayIds: ids('avalanche-aces', 'Gerco van Rooyen', 'Piotr Latusek'), games: [0, 3], winner: 'away' },
      { slot: '20:30', court: 'P1', home: 'Siraaj Shaik / Muhammad Azhar Sujee', away: 'Ryan Tate / Steven Pinker',
        homeIds: ids('samurai-kicksmashers', 'Siraaj Shaik', 'Muhammad Azhar Sujee'), awayIds: ids('avalanche-aces', 'Ryan Tate', 'Steven Pinker'), games: [4, 0], winner: 'home' },
      { slot: '20:30', court: 'P2', home: 'Muhammed Jina / Armand Esterhuizen', away: 'Etienne Grobler / Frik de Beer',
        homeIds: ids('samurai-kicksmashers', 'Muhammed Jina', 'Armand Esterhuizen'), awayIds: ids('avalanche-aces', 'Etienne Grobler', 'Frik de Beer'), games: [0, 3], winner: 'away' },
    ] } },
  // MD2 · Wed 10 Jun
  { id: 'fx-w1-3', round: 1, league: 'mens', home: 'desert-falcons', away: 'avalanche-aces', start: T('2026-06-10'), status: 'final', court: 'Padel 24', dh: true,
    score: { winner: 'home', totals: [21, 0], rubberWins: [6, 0], rubbers: [
      { slot: '18:00', court: 'P2', home: 'Rayhaan Dinath / Boms', away: 'Felix Lombard / Luqmaan Hoosen',
        homeIds: ids('desert-falcons', 'Rayhaan Dinath', 'Ebrahim Mungalee'), awayIds: ids('avalanche-aces', 'Felix Lombard', 'Luqmaan Hoosen'), games: [3, 0], winner: 'home' },
      { slot: '18:00', court: 'P3', home: 'Muhammad Mangerah / Jude van den Berg', away: 'Gerco van Rooyen / Prashil Nagar',
        homeIds: ids('desert-falcons', 'Muhammad Mangerah', 'Jude van den Berg'), awayIds: ids('avalanche-aces', 'Gerco van Rooyen', 'Prashil Nagar'), games: [3, 0], winner: 'home' },
      { slot: '19:15', court: 'P1', home: 'Ahmed Ismail / Faheem Nomani', away: 'Donovan Taylor / Ryan Tate',
        homeIds: ids('desert-falcons', 'Ahmed Ismail', 'Faheem Nomani'), awayIds: ids('avalanche-aces', 'Donovan Taylor', 'Ryan Tate'), games: [4, 0], winner: 'home' },
      { slot: '19:15', court: 'P3', home: 'Jacques Burger / Reino Grobler', away: 'Anas Mungalee / Kobus van Rensburg',
        homeIds: ids('desert-falcons', 'Jacques Burger', 'Reino Grobler'), awayIds: ids('avalanche-aces', 'Anas Mungalee', 'Kobus van Rensburg'), games: [3, 0], winner: 'home' },
      { slot: '20:30', court: 'P1', home: 'Uwaiz Patel / Yusuf Patel', away: 'Patrick Leyden / Hoffman Maritz',
        homeIds: ids('desert-falcons', 'Uwaiz Patel', 'Yusuf Patel'), awayIds: ids('avalanche-aces', 'Patrick Leyden', 'Hoffman Maritz'), games: [4, 0], winner: 'home' },
      { slot: '20:30', court: 'P2', home: 'Warno Smit / Morne Steenekamp', away: 'Etienne Grobler / Frik de Beer',
        homeIds: ids('desert-falcons', 'Warno Smit', 'Morne Steenekamp'), awayIds: ids('avalanche-aces', 'Etienne Grobler', 'Frik de Beer'), games: [4, 0], winner: 'home' },
    ] } },
  { id: 'fx-w1-4', round: 1, league: 'mens', home: 'globo-boomerangs', away: 'sahara-lions', start: T('2026-06-10'), status: 'final', court: 'Play 360',
    score: { winner: 'away', totals: [8, 15], rubberWins: [2, 4], rubbers: [
      { slot: '18:00', court: 'P2', home: 'Momo / Bevin Francis', away: 'Naeem Omar / Alfaiz Mamji',
        homeIds: ids('globo-boomerangs', 'Muhammed Shehzad Meer', 'Bevin Francis'), awayIds: ids('sahara-lions', 'Naeem Omar', 'Alfaiz Mamji'), games: [4, 0], winner: 'home' },
      { slot: '18:00', court: 'P3', home: 'Shaffique Jeewa / Suhail Patel', away: 'Imtiaz Mohamed / Majid Bapu',
        homeIds: ids('globo-boomerangs', 'Shaffique Jeewa', 'Suhail Patel'), awayIds: ids('sahara-lions', 'Imtiaz Mohamed', 'Majid Bapu'), games: [4, 0], winner: 'home' },
      { slot: '19:15', court: 'P1', home: 'Jojo / Joseph van der Merwe', away: 'Yusuf Packery / Pieter Badenhorst',
        homeIds: ids('globo-boomerangs', 'Yusuf Asvat', 'Joseph van der Merwe'), awayIds: ids('sahara-lions', 'Yusuf Packery', 'Pieter Badenhorst'), games: [0, 4], winner: 'away' },
      { slot: '19:15', court: 'P3', home: 'Taahir Mungalee / Stefan Erasmus', away: 'Warren Morgan / Aadil Asvat',
        homeIds: ids('globo-boomerangs', 'Taahir Mungalee', 'Stefan Erasmus'), awayIds: ids('sahara-lions', 'Warren Morgan', 'Aadil Asvat'), games: [0, 4], winner: 'away' },
      { slot: '20:30', court: 'P1', home: 'Ahmed Mungalee / Adil Ahmed', away: 'Justin van Staaden / Suhayl Packery',
        homeIds: ids('globo-boomerangs', 'Ahmed Mungalee', 'Adil Ahmed'), awayIds: ids('sahara-lions', 'Justin van Staaden', 'Suhayl Packery'), games: [0, 3], winner: 'away' },
      { slot: '20:30', court: 'P2', home: 'Diego Sebastian / Duran Greever', away: 'Adil Patel / Soyab Patel',
        homeIds: ids('globo-boomerangs', 'Diego Sebastian', 'Duran Greever'), awayIds: ids('sahara-lions', 'Adil Patel', 'Soyab Patel'), games: [0, 4], winner: 'away' },
    ] } },

  // WEEK 2 · 17–18 Jun · BYE: Sahara Lions
  // MD3 · Tue 17 Jun
  { id: 'fx-w2-1', round: 2, league: 'mens', home: 'avalanche-aces', away: 'ice-breakers', start: T('2026-06-17'), status: 'final', court: 'Padel 24',
    score: { winner: 'away', totals: [7, 16], rubberWins: [2, 4], rubbers: [
      { slot: '18:00', court: 'P1', home: 'Steven Pinker / Donovan Taylor', away: 'Imaad Arabi / Salmaan Methar',
        homeIds: ids('avalanche-aces', 'Steven Pinker', 'Donovan Taylor'), awayIds: ids('ice-breakers', 'Imaad Arabi', 'Salmaan Methar'), games: [0, 4], winner: 'away' },
      { slot: '18:00', court: 'P2', home: 'Pierre de Villiers / Luqmaan Hoosen', away: 'Zahid Methar / Chaz Taylor',
        homeIds: ids('avalanche-aces', 'Pierre de Villiers', 'Luqmaan Hoosen'), awayIds: ids('ice-breakers', 'Zahid Methar', 'Chaz Taylor'), games: [0, 4], winner: 'away' },
      { slot: '19:15', court: 'P2', home: 'Etienne Grobler / Frik de Beer', away: 'Jacques van Zyl / Zayd Methar',
        homeIds: ids('avalanche-aces', 'Etienne Grobler', 'Frik de Beer'), awayIds: ids('ice-breakers', 'Jacques van Zyl', 'Zayd Methar'), games: [3, 0], winner: 'home' },
      { slot: '19:15', court: 'P3', home: 'Rishaad Shaik / Prashil Nagar', away: 'Aadam Nomani / Shaun Caromba',
        homeIds: ids('avalanche-aces', 'Rishaad Shaik', 'Prashil Nagar'), awayIds: ids('ice-breakers', 'Aadam Nomani', 'Shaun Caromba'), games: [4, 0], winner: 'home' },
      { slot: '20:30', court: 'P1', home: 'Wiehann Mohlen / Patrick Leyden', away: 'Duhan Swart / JD Herbst',
        homeIds: ids('avalanche-aces', 'Wiehann Mohlen', 'Patrick Leyden'), awayIds: ids('ice-breakers', 'Duhan Swart', 'JD Herbst'), games: [0, 4], winner: 'away' },
      { slot: '20:30', court: 'P3', home: 'Kobus van Rensburg / Gerco van Rooyen', away: 'Sergio Correia / Wayne Enslin',
        homeIds: ids('avalanche-aces', 'Kobus van Rensburg', 'Gerco van Rooyen'), awayIds: ids('ice-breakers', 'Sergio Correia', 'Wayne Enslin'), games: [0, 4], winner: 'away' },
    ] } },
  { id: 'fx-w2-2', round: 2, league: 'mens', home: 'sonic-viboras', away: 'samurai-kicksmashers', start: T('2026-06-17'), status: 'final', court: 'Play 360',
    score: { winner: 'home', totals: [15, 7], rubberWins: [4, 2], rubbers: [
      { slot: '18:00', court: 'P1', home: 'Heinrich Coomans / Anton Grote', away: 'Bryan Theron / Durell Pillay',
        homeIds: ids('sonic-viboras', 'Heinrich Coomans', 'Anton Grote'), awayIds: ids('samurai-kicksmashers', 'Bryan Theron', 'Durell Pillay'), games: [4, 0], winner: 'home' },
      { slot: '18:00', court: 'P2', home: 'Warwick Morgan / Marius Loock', away: 'Muhammed Jina / Muneer Shaik',
        homeIds: ids('sonic-viboras', 'Warwick Morgan', 'Marius Loock'), awayIds: ids('samurai-kicksmashers', 'Muhammed Jina', 'Muneer Shaik'), games: [4, 0], winner: 'home' },
      { slot: '19:15', court: 'P2', home: 'Ismail Fakir / Jacques Henning', away: 'Tim Forssman / Sikander Cassim',
        homeIds: ids('sonic-viboras', 'Ismail Fakir', 'Jacques Henning'), awayIds: ids('samurai-kicksmashers', 'Tim Forssman', 'Sikander Cassim'), games: [0, 3], winner: 'away' },
      { slot: '19:15', court: 'P3', home: 'George du Toit / Dewald Meyer', away: 'Brent Grix / Dillon Francis',
        homeIds: ids('sonic-viboras', 'George du Toit', 'Dewald Meyer'), awayIds: ids('samurai-kicksmashers', 'Brent Grix', 'Dillon Francis'), games: [4, 0], winner: 'home' },
      { slot: '20:30', court: 'P1', home: 'Ridhwaan Sujee / Erlo Olivier', away: 'Burger Bester / Danyaal Nomani',
        homeIds: ids('sonic-viboras', 'Ridhwaan Sujee', 'Erlo Olivier'), awayIds: ids('samurai-kicksmashers', 'Burger Bester', 'Danyaal Nomani'), games: [3, 0], winner: 'home' },
      { slot: '20:30', court: 'P3', home: 'Stefan de Villiers / Saliem Mahomed', away: 'Ismail Karodia / Imraan Khan',
        homeIds: ids('sonic-viboras', 'Stefan de Villiers', 'Saliem Mahomed'), awayIds: ids('samurai-kicksmashers', 'Ismail Karodia', 'Imraan Khan'), games: [0, 4], winner: 'away' },
    ] } },
  // MD4 · Thu 18 Jun — pairings confirmed, result pending
  { id: 'fx-w2-3', round: 2, league: 'mens', home: 'globo-boomerangs', away: 'desert-falcons', start: T('2026-06-18'), status: 'final', court: 'Padel 24', tossWonBy: 'desert-falcons',
    score: { winner: 'away', totals: [3, 19], rubberWins: [1, 5], rubbers: [
      { slot: '18:00', court: 'P1', home: 'Jojo / Joseph', away: 'Uwaiz / Yusuf',
        homeIds: ids('globo-boomerangs', 'Yusuf Asvat', 'Joseph van der Merwe'), awayIds: ids('desert-falcons', 'Uwaiz Patel', 'Yusuf Patel'),
        games: [0, 4], winner: 'away', sets: [[1, 6], [4, 6], [6, 10]] },
      { slot: '18:00', court: 'P2', home: 'Ryan / Nabz', away: 'Fahad / Ryan Wicht',
        homeIds: ids('globo-boomerangs', 'Ryan Kennett', 'Nabeel Meer'), awayIds: ids('desert-falcons', 'Fahad Patel', 'Ryan Wicht'),
        games: [3, 0], winner: 'home', sets: [[6, 3], [6, 2], [5, 10]] },
      { slot: '19:15', court: 'P2', home: 'Momo / Bevan', away: 'Warno / Morne',
        homeIds: ids('globo-boomerangs', 'Muhammed Shehzad Meer', 'Bevin Francis'), awayIds: ids('desert-falcons', 'Warno Smit', 'Morne Steenekamp'),
        games: [0, 3], winner: 'away', sets: [[6, 4], [6, 7], [8, 10]] },
      { slot: '19:15', court: 'P3', home: 'Shaffique / Suhail', away: 'Danie / Zaeem',
        homeIds: ids('globo-boomerangs', 'Shaffique Jeewa', 'Suhail Patel'), awayIds: ids('desert-falcons', 'Danie Rautenbach', 'Zaeem Sadiq'),
        games: [0, 4], winner: 'away', sets: [[6, 7], [5, 7], [6, 10]] },
      { slot: '20:30', court: 'P1', home: 'Ahmed / Lima', away: 'Reinhardt / Schalk',
        homeIds: ids('globo-boomerangs', 'Ahmed Mungalee', 'Liam Morgan'), awayIds: ids('desert-falcons', 'Reinhardt Trollip', 'Schalk Schutte'),
        games: [0, 4], winner: 'away', sets: [[3, 6], [4, 6], [8, 10]] },
      { slot: '20:30', court: 'P3', home: 'Kieran / Stefan', away: 'Jacques / Reino',
        homeIds: ids('globo-boomerangs', 'Kiran Hansraj', 'Stefan Erasmus'), awayIds: ids('desert-falcons', 'Jacques Burger', 'Reino Grobler'),
        games: [0, 4], winner: 'away', sets: [[4, 6], [4, 6], [7, 10]] },
    ] } },

  // WEEK 3 · 22–24 Jun · DH: Sonic Viboras
  { id: 'fx-w3-1', round: 3, league: 'mens', home: 'avalanche-aces', away: 'sonic-viboras', start: T('2026-06-22'), status: 'final', court: 'Play 360', dh: true,
    score: { winner: 'draw', totals: [10, 10], rubberWins: [3, 3], rubbers: [
      { slot: '18:00', court: 'P1', home: 'Hoffman Maritz / Wiehann Mohlen', away: 'Heinrich Coomans / Anton Grote',
        homeIds: ids('avalanche-aces', 'Hoffman Maritz', 'Wiehann Mohlen'), awayIds: ids('sonic-viboras', 'Heinrich Coomans', 'Anton Grote'), games: [0, 3], winner: 'away', sets: [[2, 6], [6, 1], [7, 10]] },
      { slot: '18:00', court: 'P3', home: 'Anas Mungalee / Gerco van Rooyen', away: 'Gerrit Smith / Dewald Meyer',
        homeIds: ids('avalanche-aces', 'Anas Mungalee', 'Gerco van Rooyen'), awayIds: ids('sonic-viboras', 'Gerrit Smith', 'Dewald Meyer'), games: [3, 0], winner: 'home', sets: [[3, 6], [6, 4], [10, 3]] },
      { slot: '19:15', court: 'P1', home: 'Patrick Leyden / Donovan Taylor', away: 'Yusuf Moola / Pieter Boshoff',
        homeIds: ids('avalanche-aces', 'Patrick Leyden', 'Donovan Taylor'), awayIds: ids('sonic-viboras', 'Yusuf Moola', 'Pieter Boshoff'), games: [0, 4], winner: 'away', sets: [[2, 6], [1, 6], [5, 10]] },
      { slot: '19:15', court: 'P2', home: 'Etienne Grobler / Ruaan Naude', away: 'Warwick Morgan / Joshua Hoffman',
        homeIds: ids('avalanche-aces', 'Etienne Grobler', 'Ruaan Naude'), awayIds: ids('sonic-viboras', 'Warwick Morgan', 'Joshua Hoffman'), games: [3, 0], winner: 'home', sets: [[3, 6], [7, 5], [10, 2]] },
      { slot: '20:30', court: 'P2', home: 'Frik de Beer / Pierre de Villiers', away: 'Ismail Fakir / Jacques Henning',
        homeIds: ids('avalanche-aces', 'Frik de Beer', 'Pierre de Villiers'), awayIds: ids('sonic-viboras', 'Ismail Fakir', 'Jacques Henning'), games: [4, 0], winner: 'home', sets: [[6, 2], [6, 2], [10, 2]] },
      { slot: '20:30', court: 'P3', home: 'Rishaad Shaik / Piotr Latusek', away: 'Mohamed Dadamia / Saliem Mahomed',
        homeIds: ids('avalanche-aces', 'Rishaad Shaik', 'Piotr Latusek'), awayIds: ids('sonic-viboras', 'Mohamed Dadamia', 'Saliem Mahomed'), games: [0, 3], winner: 'away', sets: [[1, 6], [6, 1], [0, 10]] },
    ] } },
  { id: 'fx-w3-2', round: 3, league: 'mens', home: 'samurai-kicksmashers', away: 'desert-falcons', start: T('2026-06-22'), status: 'final', court: 'Padel 24',
    score: { winner: 'away', totals: [3, 19], rubberWins: [1, 5], rubbers: [
      { slot: '18:00', court: 'P3', home: 'Nuaym Shaik / Imraan Khan', away: 'Jude van den Berg / Danie Rautenbach',
        homeIds: ids('samurai-kicksmashers', 'Nuaym Shaik', 'Imraan Khan'), awayIds: ids('desert-falcons', 'Jude van den Berg', 'Danie Rautenbach'), games: [0, 4], winner: 'away', sets: [[1, 6], [1, 6], [4, 10]] },
      { slot: '18:00', court: 'P1', home: 'Bryan Theron / Burger Bester', away: 'Uwaiz Patel / Yusuf Patel',
        homeIds: ids('samurai-kicksmashers', 'Bryan Theron', 'Burger Bester'), awayIds: ids('desert-falcons', 'Uwaiz Patel', 'Yusuf Patel'), games: [0, 4], winner: 'away', sets: [[1, 6], [3, 6], [5, 10]] },
      { slot: '19:15', court: 'P2', home: 'Sikander Cassim / Tim Forssman', away: 'Rayhaan Dinath / Fahad Patel',
        homeIds: ids('samurai-kicksmashers', 'Sikander Cassim', 'Tim Forssman'), awayIds: ids('desert-falcons', 'Rayhaan Dinath', 'Fahad Patel'), games: [0, 3], winner: 'away', sets: [[7, 5], [3, 6], [4, 10]] },
      { slot: '19:15', court: 'P1', home: 'Siraaj Shaik / Muhammad Azhar Sujee', away: 'Ahmed Ismail / Faheem Nomani',
        homeIds: ids('samurai-kicksmashers', 'Siraaj Shaik', 'Muhammad Azhar Sujee'), awayIds: ids('desert-falcons', 'Ahmed Ismail', 'Faheem Nomani'), games: [3, 0], winner: 'home', sets: [[3, 6], [7, 5], [13, 11]] },
      { slot: '20:30', court: 'P2', home: 'Armand Esterhuizen / Shaun Moropa', away: 'Warno Smit / Morne Steenekamp',
        homeIds: ids('samurai-kicksmashers', 'Armand Esterhuizen', 'Shaun Moropa'), awayIds: ids('desert-falcons', 'Warno Smit', 'Morne Steenekamp'), games: [0, 4], winner: 'away', sets: [[1, 6], [4, 6], [2, 10]] },
      { slot: '20:30', court: 'P3', home: 'Riyaz Ahmed Bellim / Dillon Francis', away: 'Jacques Burger / Reino Grobler',
        homeIds: ids('samurai-kicksmashers', 'Riyaz Ahmed Bellim', 'Dillon Francis'), awayIds: ids('desert-falcons', 'Jacques Burger', 'Reino Grobler'), games: [0, 4], winner: 'away', sets: [[3, 6], [5, 7], [6, 10]] },
    ] } },
  { id: 'fx-w3-3', round: 3, league: 'mens', home: 'globo-boomerangs', away: 'sonic-viboras', start: T('2026-06-24'), status: 'final', court: 'Padel 24', dh: true,
    score: { winner: 'away', totals: [6, 16], rubberWins: [2, 4] },
    rubbers: [
      { slot: '18:00', court: 'P1', sets: [{home:3,away:6},{home:5,away:7},{home:9,away:11}], games: [0, 4], winner: 'away',
        homeIds: ids('globo-boomerangs', 'Ahmed Mungalee', 'Yusuf Asvat'), awayIds: ids('sonic-viboras', 'Heinrich Coomans', 'Anton Grote') },
      { slot: '18:00', court: 'P3', sets: [{home:6,away:7},{home:2,away:6},{home:12,away:14}], games: [0, 4], winner: 'away',
        homeIds: ids('globo-boomerangs', 'Taahir Mungalee', 'Kiran Hansraj'), awayIds: ids('sonic-viboras', 'George Smith', 'Dewald Meyer') },
      { slot: '19:15', court: 'P1', sets: [{home:2,away:6},{home:1,away:6},{home:3,away:10}], games: [0, 4], winner: 'away',
        homeIds: ids('globo-boomerangs', 'Liam Morgan', 'Lefa Mogamedi'), awayIds: ids('sonic-viboras', 'Dr Moola', 'Bossie') },
      { slot: '19:15', court: 'P2', sets: [{home:6,away:4},{home:4,away:6},{home:8,away:10}], games: [3, 0], winner: 'home',
        homeIds: ids('globo-boomerangs', 'Ryan Kennett', 'Diego Sebastian'), awayIds: ids('sonic-viboras', 'Marius Loock', 'Khalid Jeewa') },
      { slot: '20:30', court: 'P2', sets: [{home:3,away:6},{home:6,away:4},{home:9,away:11}], games: [3, 0], winner: 'home',
        homeIds: ids('globo-boomerangs', 'Shehzad Meer', 'Bevin Francis'), awayIds: ids('sonic-viboras', 'Warwick Morgan', 'Joshua Hoffman') },
      { slot: '20:30', court: 'P3', sets: [{home:7,away:5},{home:6,away:3},{home:10,away:2}], games: [0, 4], winner: 'away',
        homeIds: ids('globo-boomerangs', 'Shaffique Jeewa', 'Farhaan Shaik'), awayIds: ids('sonic-viboras', 'Stefan de Villiers', 'Mohamed Dadamia') },
    ],
    pairs: { slots: [
      { slot: '18:00', rubbers: [
        ['P1', 'Ahmed Mungalee / Yusuf Asvat', 'Heinrich Coomans / Anton Grote'],
        ['P3', 'Taahir Mungalee / Kiran Hansraj', 'George Smith / Dewald Meyer'],
      ] },
      { slot: '19:15', rubbers: [
        ['P1', 'Liam Morgan / Lefa Mogamedi', 'Dr Moola / Bossie'],
        ['P2', 'Ryan Kennett / Diego Sebastian', 'Marius Loock / Khalid Jeewa'],
      ] },
      { slot: '20:30', rubbers: [
        ['P2', 'Shehzad Meer / Bevin Francis', 'Warwick Morgan / Joshua Hoffman'],
        ['P3', 'Shaffique Jeewa / Farhaan Shaik', 'Stefan de Villiers / Mohamed Dadamia'],
      ] },
    ] } },
  { id: 'fx-w3-4', round: 3, league: 'mens', home: 'sahara-lions', away: 'ice-breakers', start: T('2026-06-24'), status: 'final', court: 'Play 360',
    score: { winner: 'away', totals: [6, 15], rubberWins: [2, 4] },
    rubbers: [
      { slot: '18:00', court: 'P1', sets: [{home:6,away:1},{home:7,away:6},{home:7,away:10}], games: [3, 0], winner: 'home',
        homeIds: ids('sahara-lions', 'Cameron Jacobsz', 'Yusuf Packery'), awayIds: ids('ice-breakers', 'Duhan Swart', 'JD Herbst') },
      { slot: '18:00', court: 'P3', sets: [{home:4,away:6},{home:6,away:7},{home:7,away:10}], games: [0, 4], winner: 'away',
        homeIds: ids('sahara-lions', 'Drikus Prins', 'Warren Morgan'), awayIds: ids('ice-breakers', 'Wayne Enslin', 'Sergio Correia') },
      { slot: '19:15', court: 'P1', sets: [{home:7,away:5},{home:4,away:6},{home:10,away:8}], games: [3, 0], winner: 'home',
        homeIds: ids('sahara-lions', 'Pieter Badenhorst', 'Justin van Staaden'), awayIds: ids('ice-breakers', 'Maaz Randera', 'Zaheer Methar') },
      { slot: '19:15', court: 'P2', sets: [{home:2,away:6},{home:6,away:3},{home:4,away:10}], games: [0, 3], winner: 'away',
        homeIds: ids('sahara-lions', 'Naeem Omar', 'Alfaiz Mamji'), awayIds: ids('ice-breakers', 'Zahid Methar', 'Chaz Taylor') },
      { slot: '20:30', court: 'P2', sets: [{home:4,away:6},{home:2,away:6},{home:3,away:10}], games: [0, 4], winner: 'away',
        homeIds: ids('sahara-lions', 'Suliman Patel', 'Irfaan Mamji'), awayIds: ids('ice-breakers', 'Jacques van Zyl', 'Nicky Joubert') },
      { slot: '20:30', court: 'P3', sets: [{home:5,away:7},{home:5,away:7},{home:6,away:10}], games: [0, 4], winner: 'away',
        homeIds: ids('sahara-lions', 'Imtiaz Mohamed', 'Irfaan Mahomed'), awayIds: ids('ice-breakers', 'Irshaad Moola', 'Waldo van Tonder') },
    ],
    pairs: { slots: [
      { slot: '18:00', rubbers: [
        ['P1', 'Cameron Jacobsz / Yusuf Packery', 'Duhan Swart / JD Herbst'],
        ['P3', 'Drikus Prins / Warren Morgan', 'Wayne Enslin / Sergio Correia'],
      ] },
      { slot: '19:15', rubbers: [
        ['P1', 'Pieter Badenhorst / Justin van Staaden', 'Maaz Randera / Zaheer Methar'],
        ['P2', 'Naeem Omar / Alfaiz Mamji', 'Jacques van Zyl / Nicky Joubert'],
      ] },
      { slot: '20:30', rubbers: [
        ['P2', 'Suliman Patel / Irfaan Mamji', 'Zahid Methar / Chaz Taylor'],
        ['P3', 'Imtiaz Mohamed / Irfaan Mahomed', 'Irshaad Moola / Waldo van Tonder'],
      ] },
    ] } },

  // SCHOOL HOLIDAY BREAK · 29 Jun – 20 Jul

  // WEEK 4 · 21–22 Jul · DH: Global Boomerangs
  { id: 'fx-w4-1', round: 4, league: 'mens', home: 'globo-boomerangs', away: 'avalanche-aces', start: T('2026-07-21'), status: 'scheduled', court: 'Play 360', dh: true },
  { id: 'fx-w4-2', round: 4, league: 'mens', home: 'sahara-lions', away: 'sonic-viboras', start: T('2026-07-21'), status: 'scheduled', court: 'Padel 24' },
  { id: 'fx-w4-3', round: 4, league: 'mens', home: 'globo-boomerangs', away: 'samurai-kicksmashers', start: T('2026-07-22'), status: 'scheduled', court: 'Padel 24', dh: true },
  { id: 'fx-w4-4', round: 4, league: 'mens', home: 'ice-breakers', away: 'desert-falcons', start: T('2026-07-22'), status: 'scheduled', court: 'Play 360' },

  // WEEK 5 · 27–29 Jul · DH: Sahara Lions
  { id: 'fx-w5-1', round: 5, league: 'mens', home: 'sahara-lions', away: 'avalanche-aces', start: T('2026-07-27'), status: 'scheduled', court: 'Padel 24', dh: true },
  { id: 'fx-w5-2', round: 5, league: 'mens', home: 'globo-boomerangs', away: 'ice-breakers', start: T('2026-07-27'), status: 'scheduled', court: 'Play 360' },
  { id: 'fx-w5-3', round: 5, league: 'mens', home: 'samurai-kicksmashers', away: 'sahara-lions', start: T('2026-07-29'), status: 'scheduled', court: 'Padel 24', dh: true },
  { id: 'fx-w5-4', round: 5, league: 'mens', home: 'desert-falcons', away: 'sonic-viboras', start: T('2026-07-29'), status: 'scheduled', court: 'Play 360' },

  // WEEK 6 · 3 Aug
  { id: 'fx-w6-1', round: 6, league: 'mens', home: 'samurai-kicksmashers', away: 'ice-breakers', start: T('2026-08-03'), status: 'scheduled', court: 'Padel 24' },
  { id: 'fx-w6-2', round: 6, league: 'mens', home: 'desert-falcons', away: 'sahara-lions', start: T('2026-08-03'), status: 'scheduled', court: 'Play 360' },
];

// ---- LOG ENGINE ------------------------------------------------
// Rubber win = 3 pts · draw = 1 pt · bonus point for a 4-0 win.
// Tier-log adjustments as issued by the league.
export const LOG_ADJUSTMENTS = {
  P3: { 'desert-falcons': { points: -8, note: 'League adjustment' } },
};

const isBonus = (games, side) => !!games && games[side === 'home' ? 0 : 1] === 4 && games[side === 'home' ? 1 : 0] === 0;

function deriveLog(league, tier) {
  const teams = FRANCHISES.filter((f) => f.league === league);
  const rows = Object.fromEntries(teams.map((t) => [t.id, {
    franchise_id: t.id, played: 0, won: 0, lost: 0, drawn: 0, bp: 0, points: 0, adj: 0,
  }]));
  FIXTURES.filter((f) => f.league === league && f.status === 'final' && f.score?.rubbers).forEach((f) => {
    f.score.rubbers.forEach((r) => {
      if (tier && r.court !== tier) return;
      const h = rows[f.home]; const a = rows[f.away];
      h.played += 1; a.played += 1;
      if (r.winner === 'draw') {
        h.drawn += 1; a.drawn += 1; h.points += 1; a.points += 1;
      } else {
        const w = r.winner === 'home' ? h : a;
        const l = r.winner === 'home' ? a : h;
        w.won += 1; w.points += 3; l.lost += 1;
        if (isBonus(r.games, r.winner)) { w.bp += 1; w.points += 1; }
      }
    });
  });
  if (tier && LOG_ADJUSTMENTS[tier]) {
    Object.entries(LOG_ADJUSTMENTS[tier]).forEach(([fid, { points }]) => {
      if (rows[fid]) { rows[fid].points += points; rows[fid].adj = points; }
    });
  }
  return Object.values(rows).sort((x, y) => y.points - x.points || y.won - x.won || x.played - y.played);
}

// ---- OFFICIAL LOG TABLES (as published by the league) ----------
// Source of truth = the league's official Franchise + P1/P2/P3 log
// graphics. Entered verbatim so the site mirrors the published
// record exactly (the official tables don't fully reconcile with
// each other, so we display them as issued rather than recomputing).
// Row order = published ranking. Cols: [id, P, W, L, D, BP, Pts].
const NM = {
  Falcons: 'desert-falcons', Sonics: 'sonic-viboras', Kicksmashers: 'samurai-kicksmashers',
  IceBreakers: 'ice-breakers', Aces: 'avalanche-aces', Lions: 'sahara-lions', Globo: 'globo-boomerangs',
};
const mkRow = ([name, P, W, L, D, BP, pts], adj) => ({
  franchise_id: NM[name], played: P, won: W, lost: L, drawn: D, bp: BP, points: pts, adj: adj || 0,
});
const OFFICIAL = {
  // Updated through MD6 (24 Jun 2026)
  franchise: [
    ['Falcons', 18, 16, 2, 0, 11, 59], ['Sonics', 24, 16, 8, 0, 10, 58],
    ['Aces', 24, 8, 16, 0, 2, 26], ['Kicksmashers', 18, 6, 12, 0, 4, 22],
    ['Lions', 12, 6, 6, 0, 3, 21], ['IceBreakers', 18, 9, 9, 0, 7, 34], ['Globo', 18, 5, 13, 0, 2, 17],
  ].map((r) => mkRow(r)),
  P1: [
    ['Sonics', 8, 7, 1, 0, 5, 26], ['Falcons', 6, 5, 1, 0, 5, 20], ['Lions', 4, 4, 0, 0, 1, 13],
    ['IceBreakers', 6, 3, 3, 0, 2, 11], ['Kicksmashers', 6, 3, 3, 0, 2, 11], ['Aces', 8, 0, 8, 0, 0, 0], ['Globo', 6, 0, 6, 0, 0, 0],
  ].map((r) => mkRow(r)),
  P2: [
    ['Falcons', 6, 5, 1, 0, 2, 17], ['Aces', 8, 4, 4, 0, 1, 13], ['Globo', 6, 4, 2, 0, 1, 13],
    ['Sonics', 8, 3, 5, 0, 2, 11], ['IceBreakers', 6, 3, 3, 0, 2, 11], ['Kicksmashers', 6, 2, 4, 0, 1, 7], ['Lions', 4, 1, 3, 0, 1, 4],
  ].map((r) => mkRow(r)),
  P3: [
    ['Falcons', 6, 6, 0, 0, 4, 22], ['Sonics', 8, 6, 2, 0, 3, 21],
    ['Aces', 8, 4, 4, 0, 1, 13], ['IceBreakers', 6, 3, 3, 0, 3, 12],
    ['Lions', 4, 1, 3, 0, 1, 4], ['Globo', 6, 1, 5, 0, 1, 4], ['Kicksmashers', 6, 1, 5, 0, 1, 4],
  ].map((r) => mkRow(r, 0)),
};
// Falcons' P3 carries a published league deduction (raw 22 − 8 = 14).
OFFICIAL.P3.find((r) => r.franchise_id === 'desert-falcons').adj = -8;

// Sort every table by points, then wins, then bonus points, so the
// displayed order always matches the points (no manual re-ordering).
const sortTable = (rows) => [...rows].sort((a, b) =>
  b.points - a.points || b.won - a.won || b.bp - a.bp || a.lost - b.lost);
['franchise', 'P1', 'P2', 'P3'].forEach((t) => { OFFICIAL[t] = sortTable(OFFICIAL[t]); });

export const STANDINGS = {
  mens: OFFICIAL,
  ladies: { franchise: [], P1: [], P2: [], P3: [] },
};

// ---- Player stats + partnerships derived from rubbers ----------
// Process fixtures in chronological order so LP Rating (Elo) is
// computed match-by-match as the season actually unfolded.
const ratedRubbers = [];
[...FIXTURES]
  .filter((f) => f.status === 'final' && f.score?.rubbers)
  .sort((a, b) => new Date(a.start) - new Date(b.start))
  .forEach((f) => {
    f.score.rubbers.forEach((r) => {
      const homeP = (r.homeIds || []).filter(Boolean);
      const awayP = (r.awayIds || []).filter(Boolean);
      // Sets won/lost per side. Every rubber is best-of-3 (two game
      // sets + a 10-pt champions tiebreak), and the rubber points
      // encode the set result: a 4-pt win = 3-0 in sets, a 3-pt win
      // = 2-1. Use explicit set scores when present, else derive from
      // the points so sets are correct for every match.
      let homeSets = 0; let awaySets = 0;
      if (r.sets) {
        r.sets.forEach(([h, a]) => { if (h > a) homeSets += 1; else awaySets += 1; });
      } else if (r.games) {
        const hp = r.games[0]; const ap = r.games[1];
        if (r.winner === 'home') { homeSets = hp === 4 ? 3 : 2; awaySets = hp === 4 ? 0 : 1; }
        else if (r.winner === 'away') { awaySets = ap === 4 ? 3 : 2; homeSets = ap === 4 ? 0 : 1; }
      }
      [['home', 'homeIds', 0, homeSets, awaySets], ['away', 'awayIds', 1, awaySets, homeSets]].forEach(([side, key, idx, setsFor, setsAg]) => {
        (r[key] || []).filter(Boolean).forEach((pidX) => {
          const p = PLAYERS.find((x) => x.id === pidX);
          if (!p) return;
          p.stats.played += 1;
          // games_won only from real set scores (champions TB excluded); incomplete by design
          if (r.sets) r.sets.slice(0, 2).forEach((st) => { p.stats.games_won += st[idx]; });
          p.stats.sets_won += setsFor; p.stats.sets_lost += setsAg;
          if (r.winner === side) {
            p.stats.wins += 1; p.stats.rubbers_won += 1;
            if (isBonus(r.games, side)) p.stats.bonus_points += 1;
          } else if (r.winner !== 'draw') p.stats.losses += 1;
          p.stats.mvp_points = p.stats.rubbers_won * 3 + p.stats.bonus_points;
        });
      });
      // partnerships (same-side pairs)
      [[homeP, r.winner === 'home'], [awayP, r.winner === 'away']].forEach(([pair, won]) => {
        if (pair.length === 2) {
          [[pair[0], pair[1]], [pair[1], pair[0]]].forEach(([a, b]) => {
            const p = PLAYERS.find((x) => x.id === a);
            if (!p.partners) p.partners = {};
            if (!p.partners[b]) p.partners[b] = { played: 0, won: 0 };
            p.partners[b].played += 1;
            if (won) p.partners[b].won += 1;
          });
        }
      });
      if (homeP.length && awayP.length && r.winner !== 'draw') {
        ratedRubbers.push({ homeP, awayP, winner: r.winner, games: r.games });
      }
    });
  });

// ---- LP Rating: doubles Elo computed from real results ---------
// Pair rating = mean of the two; K=32 (×2 provisional first 5
// rubbers per player); margin bonus ×1.15 for a clean (4-0) win.
PLAYERS.forEach((p) => { p.lp_rating = 1400; p._rated = 0; });
const expected = (a, b) => 1 / (1 + 10 ** ((b - a) / 400));
ratedRubbers.forEach((rb) => {
  const hp = rb.homeP.map((id) => PLAYERS.find((x) => x.id === id)).filter(Boolean);
  const ap = rb.awayP.map((id) => PLAYERS.find((x) => x.id === id)).filter(Boolean);
  if (hp.length !== 2 || ap.length !== 2) return;
  const hr = (hp[0].lp_rating + hp[1].lp_rating) / 2;
  const ar = (ap[0].lp_rating + ap[1].lp_rating) / 2;
  const homeWon = rb.winner === 'home';
  const margin = isBonus(rb.games, rb.winner) ? 1.15 : 1;
  const eh = expected(hr, ar);
  [[hp, 1 - 0, homeWon ? 1 : 0, eh], [ap, 0, homeWon ? 0 : 1, 1 - eh]].forEach(([pair, , actual, exp]) => {
    pair.forEach((pl) => {
      const k = (pl._rated < 5 ? 64 : 32) * margin;
      pl.lp_rating = Math.round(pl.lp_rating + k * (actual - exp));
      pl._rated += 1;
    });
  });
});

export const NEWS = [
  { id: 'nm6b', kicker: 'Match Day 6', title: 'Ice Breakers storm past Lions 15-6 — surge into top 3', date: T('2026-06-24', 23), tag: 'mens', body: 'Ice Breakers took four rubbers to Lions\' two at Play 360 — Wayne/Sergio, Nicky/Jacques and Irshaad/Waldo all posting bonus-point wins to jump to 34 points. Cameron Jacobsz and Pieter Badenhorst kept Lions\' P1 pride intact with two wins, but it wasn\'t enough.' },
  { id: 'nm6a', kicker: 'Match Day 6', title: 'Sonics blow past Boomerangs 16-6 — close to within 1 point of Falcons', date: T('2026-06-24', 22, 30), tag: 'mens', body: 'Sonic Viboras were ruthless at Padel 24 — Heinrich/Anton, Yusuf/Pieter and Stefan/Mohamed all sweeping bonus points as the Sonics move to 58 points, just 1 behind the Falcons. Global Boomerangs took two P2 rubbers to avoid a whitewash. The title race is officially alive.' },
  { id: 'nlg', kicker: 'Historic First · LP Legacy League', title: 'And so it begins. A new chapter: the LP Legacy Franchise League launches', date: T('2026-06-23', 20), tag: 'legacy', body: 'Where youth and adults come together — a pathway for growth, mentorship, competition and community. Juniors and seniors building skills side by side and shaping the future champions of Lowveld Padel. The draft is complete: 48 players across six franchises, five adults and three youth per team. #LowveldPadel #Padel' },
  { id: 'nm5a', kicker: 'Match Day 5', title: 'Falcons march on: 19-3 over the Kick Smashers as the lead stretches to 17', date: T('2026-06-22', 22), tag: 'mens', body: 'Desert Falcons took five of six rubbers at Padel 24 — Uwaiz and Yusuf Patel and the Warno/Morne pair both sweeping 3-0 — to move clear at the top on 59 points. Only Siraaj Shaik and Azhar Sujee struck back for the Smashers, edging an 11-13 champions-tiebreak thriller.' },
  { id: 'nm5b', kicker: 'Match Day 5', title: 'Honours even: Sonic Viboras and Avalanche Aces share the spoils 10-10', date: T('2026-06-22', 22, 30), tag: 'mens', body: 'A genuine tie at Play 360 — three rubbers each. Coomans and Grote stayed perfect with a P1 win, Dr Moola and Boshoff swept their rubber, but the Aces hit back through Frik de Beer and Pierre de Villiers and a battling P2 from Grobler and Naude to split the night.' },
  { id: 'nm4', kicker: 'Match Day 4', title: 'Falcons stay perfect: 19-3 demolition of the Boomerangs at Padel 24', date: T('2026-06-18', 22), tag: 'mens', body: 'Desert Falcons made it twelve rubbers unbeaten, taking five of six against Global Boomerangs. Only Ryan Kennett and Nabeel Meer interrupted the procession, edging their P2 rubber 6-3, 6-2 before the Falcons closed out the night.' },
  { id: 'n0', kicker: 'Match Day 3', title: 'Ice Breakers stun the Aces 16-7 for a first win; Viboras down the Smashers 15-7', date: T('2026-06-17', 22), tag: 'mens', body: 'Week 2 belonged to the Ice Breakers \u2014 Imaad/Salmaan, Swart/Herbst and Correia/Enslin all posting clean wins to sink Avalanche Aces 16-7 at Padel 24. At Play 360, Sonic Viboras took four rubbers to beat Samurai Kick Smashers 15-7.' },
  { id: 'n1', kicker: 'Log tables', title: 'Falcons lead on 21 after the opening rounds; P3 drama as they sit bottom on -2', date: T('2026-06-11', 11), tag: 'mens', body: 'The Astron Energy P1, Vawda\'s Tyre Torque P2 and Omar\'s Motor Den P3 logs are live. Desert Falcons lead the franchise log — but a league adjustment leaves their P3 pairs bottom.' },
  { id: 'n2', kicker: 'Match Day 2', title: 'Statement night: Falcons blank the Aces 21-0 at Padel 24', date: T('2026-06-10', 22), tag: 'mens', body: 'Desert Falcons won all six rubbers without dropping a game — four bonus-point performances in one night and an emphatic answer to anyone writing early power rankings.' },
  { id: 'n3', kicker: 'Match Day 2', title: 'Lions roar back from 0-8 down to take the Boomerangs 15-8', date: T('2026-06-10', 22, 30), tag: 'mens', body: 'Global Boomerangs swept the 18:00 slot with two 4-0 bonus-point wins, then Sahara Lions won the last four rubbers 15-0 — Packery/Badenhorst and Morgan/Asvat flipping the night at Play 360.' },
  { id: 'n4', kicker: 'Match Day 1', title: 'Kick Smashers edge the Aces 12-9 in the Season 3 opener', date: T('2026-06-08', 22), tag: 'mens', body: 'Three 4-0 bonus-point wins against three 3-0 replies — the Samurai took the night on aggregate games in the format\'s first margin-of-victory lesson at Play 360.' },
  { id: 'n5', kicker: 'League news', title: 'Season 3 fixtures released: 21 matches, two venues, four double-header weeks', date: T('2026-06-05', 10), tag: 'league', body: 'The full round robin runs 8 June to 3 August across Padel 24 and Play 360, with a school-holiday break from 29 June to 20 July.' },
  { id: 'n6', kicker: 'Announcement', title: 'Ladies League: Season 3 launch details to be announced', date: T('2026-06-06', 10), tag: 'ladies', body: 'The Ladies League launch date, lineup and fixtures will be published here and pushed to the app the moment they are locked.' },
];

export const POWER_RANKINGS = {
  mens: ['desert-falcons', 'sonic-viboras', 'ice-breakers', 'sahara-lions', 'samurai-kicksmashers', 'globo-boomerangs', 'avalanche-aces'],
  ladies: [],
};

export const franchiseById = (id) => FRANCHISES.find((f) => f.id === id) || { name: id, logo: '/logos/lp-logo.webp', id };
export const playerById = (id) => PLAYERS.find((p) => p.id === id);
export const stripeVar = (id) => `var(--fr-${id})`;

// Best partnership for a player (min 1 together), by win then win%
export const bestPartner = (playerId) => {
  const p = playerById(playerId);
  if (!p?.partners) return null;
  const rows = Object.entries(p.partners).map(([pid, rec]) => ({
    player: playerById(pid), ...rec, pct: rec.played ? rec.won / rec.played : 0,
  })).filter((r) => r.player);
  rows.sort((a, b) => b.won - a.won || b.pct - a.pct || b.played - a.played);
  return rows[0] || null;
};
export const winPct = (st) => (st.played ? Math.round((st.wins / st.played) * 100) : 0);

// Head-to-head record between two franchises, from final fixtures.
export const headToHead = (aId, bId) => {
  const meetings = [];
  let aWins = 0; let bWins = 0; let aPtsTotal = 0; let bPtsTotal = 0;
  FIXTURES.filter((f) => f.status === 'final' && f.score?.totals)
    .filter((f) => [f.home, f.away].includes(aId) && [f.home, f.away].includes(bId))
    .sort((x, y) => new Date(x.start) - new Date(y.start))
    .forEach((f) => {
      const [hp, ap] = f.score.totals;
      const aPts = f.home === aId ? hp : ap;
      const bPts = f.home === aId ? ap : hp;
      aPtsTotal += aPts; bPtsTotal += bPts;
      if (aPts > bPts) aWins += 1; else if (bPts > aPts) bWins += 1;
      meetings.push({ id: f.id, date: f.start, aPts, bPts, round: f.round, court: f.court });
    });
  const last = meetings[meetings.length - 1] || null;
  const biggest = meetings.slice().sort((m, n) => Math.abs(n.aPts - n.bPts) - Math.abs(m.aPts - m.bPts))[0] || null;
  return { aWins, bWins, played: meetings.length, aPtsTotal, bPtsTotal, meetings, last, biggest };
};

// Top players for a franchise by MVP points (for rivalry key players).
export const topPlayers = (franchiseId, n = 2) => PLAYERS
  .filter((p) => p.franchise_id === franchiseId && p.stats.played > 0)
  .sort((a, b) => b.stats.mvp_points - a.stats.mvp_points || b.lp_rating - a.lp_rating)
  .slice(0, n);

// Recent form (last N results) for a franchise, newest last → ['W','L',...]
export const teamForm = (franchiseId, n = 5) => FIXTURES
  .filter((f) => f.status === 'final' && (f.home === franchiseId || f.away === franchiseId) && f.score)
  .sort((a, b) => new Date(a.start) - new Date(b.start))
  .map((f) => (f.score.winner === (f.home === franchiseId ? 'home' : 'away') ? 'W' : 'L'))
  .slice(-n);

// Season MVP leader (computed) — used by Hall of Fame / homepage.
export const mvpLeader = (league = 'mens') => [...PLAYERS]
  .filter((p) => p.stats.played > 0 && p.league === league)
  .sort((a, b) => b.stats.mvp_points - a.stats.mvp_points || b.stats.rubbers_won - a.stats.rubbers_won)[0] || null;

/* ======================= LOWVELD TV ===========================
 * Video content for the Lowveld TV page. Every item is a slot that
 * renders fully even when empty — drop a real `youtube_url` (watch,
 * youtu.be, embed or live link) in later and the card goes live.
 *
 * Shape: {
 *   id            unique key
 *   title         headline shown on the card
 *   subtitle      optional one-liner / context
 *   thumbnail     optional image path (else a branded placeholder shows)
 *   youtube_url   '' until you have it; '' renders the "coming soon" state
 *   category      'live' | 'highlights' | 'replay' | 'interview' | 'show'
 *   date          ISO date string (sorts newest-first)
 *   duration      optional label e.g. '12:40' (omit for live)
 *   sponsor       optional sponsor id from SPONSORS for a "presented by" tag
 *   franchises    optional [id,...] tags for filtering later
 * }
 * Helper getYouTubeId() handles all URL shapes; empty url => null => slot.
 */
export const getYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/live\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const re of patterns) { const m = url.match(re); if (m) return m[1]; }
  return null;
};
export const ytThumb = (url) => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};
export const ytEmbed = (url) => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
};

// The single featured live stream (or next scheduled). url '' => offline state.
export const TV_LIVE = {
  id: 'tv-live',
  title: 'Lowveld Padel — Live Match Centre',
  subtitle: 'Match-night streams beam in here. Tap in when the lights go on.',
  thumbnail: '',
  youtube_url: '', // paste a YouTube live/watch URL to go live
  category: 'live',
  date: '2026-06-22',
  sponsor: 'astron-energy',
  franchises: [],
};

// All on-demand content. Empty slots are intentional — replace url later.
export const TV_VIDEOS = [
  // ---- Match Highlights ----
  { id: 'hl-md4-falcons-globo', title: 'Match Day 4 Highlights — Falcons 19-3 Boomerangs', subtitle: 'Desert Falcons stay perfect', thumbnail: '', youtube_url: '', category: 'highlights', date: '2026-06-18', duration: '', sponsor: 'astron-energy', franchises: ['desert-falcons', 'globo-boomerangs'] },
  { id: 'hl-md3-aces-ib', title: 'Match Day 3 Highlights — Ice Breakers 16-7 Aces', subtitle: 'Breakers land their first win', thumbnail: '', youtube_url: '', category: 'highlights', date: '2026-06-17', duration: '', sponsor: '', franchises: ['avalanche-aces', 'ice-breakers'] },
  { id: 'hl-md3-sonics-ks', title: 'Match Day 3 Highlights — Viboras 15-7 Kick Smashers', subtitle: 'Sonics keep the pressure on', thumbnail: '', youtube_url: '', category: 'highlights', date: '2026-06-17', duration: '', sponsor: '', franchises: ['sonic-viboras', 'samurai-kicksmashers'] },
  { id: 'hl-md1-sonics-ib', title: 'Match Day 1 Highlights — Viboras 17-3 Ice Breakers', subtitle: 'Opening-night statement', thumbnail: '', youtube_url: '', category: 'highlights', date: '2026-06-08', duration: '', sponsor: '', franchises: ['sonic-viboras', 'ice-breakers'] },

  // ---- Full Match Replays ----
  { id: 'rp-md4-falcons-globo', title: 'Full Replay — Falcons v Boomerangs (MD4)', subtitle: 'Every rubber, start to finish', thumbnail: '', youtube_url: '', category: 'replay', date: '2026-06-18', duration: '', sponsor: '', franchises: ['desert-falcons', 'globo-boomerangs'] },
  { id: 'rp-md3-sonics-ks', title: 'Full Replay — Viboras v Kick Smashers (MD3)', subtitle: 'Play 360', thumbnail: '', youtube_url: '', category: 'replay', date: '2026-06-17', duration: '', sponsor: '', franchises: ['sonic-viboras', 'samurai-kicksmashers'] },
  { id: 'rp-md1-sonics-ib', title: 'Full Replay — Viboras v Ice Breakers (MD1)', subtitle: 'Season 3 opener', thumbnail: '', youtube_url: '', category: 'replay', date: '2026-06-08', duration: '', sponsor: '', franchises: ['sonic-viboras', 'ice-breakers'] },

  // ---- Player Interviews ----
  { id: 'int-coomans', title: 'On the Mic — Heinrich Coomans', subtitle: 'The Viboras P1 anchor on a perfect start', thumbnail: '', youtube_url: '', category: 'interview', date: '2026-06-17', duration: '', sponsor: '', franchises: ['sonic-viboras'] },
  { id: 'int-falcons-captain', title: 'On the Mic — Desert Falcons Captain', subtitle: 'Building an unbeaten run', thumbnail: '', youtube_url: '', category: 'interview', date: '2026-06-18', duration: '', sponsor: '', franchises: ['desert-falcons'] },
  { id: 'int-rising-star', title: 'Rising Star Spotlight', subtitle: 'The breakout name of the season so far', thumbnail: '', youtube_url: '', category: 'interview', date: '2026-06-12', duration: '', sponsor: '', franchises: [] },

  // ---- Weekly Show ----
  { id: 'show-ep3', title: 'The Lowveld Padel Show — Episode 3', subtitle: 'Week 2 review, MVP race & power rankings', thumbnail: '', youtube_url: '', category: 'show', date: '2026-06-19', duration: '', sponsor: 'astron-energy', franchises: [] },
  { id: 'show-ep2', title: 'The Lowveld Padel Show — Episode 2', subtitle: 'Falcons soar, Breakers strike back', thumbnail: '', youtube_url: '', category: 'show', date: '2026-06-12', duration: '', sponsor: 'astron-energy', franchises: [] },
  { id: 'show-ep1', title: 'The Lowveld Padel Show — Episode 1', subtitle: 'Season 3 launch special', thumbnail: '', youtube_url: '', category: 'show', date: '2026-06-05', duration: '', sponsor: 'astron-energy', franchises: [] },
];

export const TV_CATEGORIES = [
  { key: 'highlights', label: 'Match Highlights' },
  { key: 'replay', label: 'Replays' },
  { key: 'interview', label: 'Player Interviews' },
  { key: 'show', label: 'Weekly Show' },
];
export const tvByCategory = (cat) => TV_VIDEOS
  .filter((v) => v.category === cat)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

/* ===================== RIVALRIES ==============================
 * Seeded rivalries. Head-to-head, last meeting and biggest win are
 * computed live from FIXTURES via headToHead(); the story + intensity
 * are editorial. Add more by appending {id, a, b, tag, story}.
 */
export const RIVALRIES = [
  { id: 'aces-viboras', a: 'avalanche-aces', b: 'sonic-viboras', tag: 'The Velocity Derby',
    story: 'Ice against sound. The Aces and Viboras have come to define the sharp end of the Lowveld grid — every meeting a referendum on who really owns centre court.' },
  { id: 'falcons-kicksmashers', a: 'desert-falcons', b: 'samurai-kicksmashers', tag: 'Talons & Steel',
    story: 'The league\'s unbeaten machine against its most explosive strikers. When the Falcons\' discipline meets the Kick Smashers\' firepower, something has to give.' },
  { id: 'sonics-falcons', a: 'sonic-viboras', b: 'desert-falcons', tag: 'The Summit',
    story: 'First versus second. The two pace-setters of Season 3, separated by a handful of points and a single rivalry that could decide the title.' },
  { id: 'ib-aces', a: 'ice-breakers', b: 'avalanche-aces', tag: 'Cold Front',
    story: 'The Ice Breakers found their season the night they sank the Aces. A young rivalry, already with an edge.' },
];
export const rivalryById = (id) => RIVALRIES.find((r) => r.id === id);

/* ===================== HALL OF FAME ===========================
 * Season honours. Season 3 is live, so its winners read "In progress"
 * and pull the current leader. Prior seasons are placeholders ready
 * for real history — fill names/franchises when you have them.
 */
export const HALL_OF_FAME = {
  seasonChampions: [
    { season: 'Season 3', year: 2026, franchise: null, note: 'In progress — Falcons & Viboras setting the pace' },
    { season: 'Season 2', year: 2025, franchise: null, note: 'Add champion' },
    { season: 'Season 1', year: 2024, franchise: null, note: 'Add champion' },
  ],
  mvps: [
    { season: 'Season 3', year: 2026, playerId: null, note: 'Race live — see the MVP leaderboard' },
    { season: 'Season 2', year: 2025, playerId: null, note: 'Add MVP' },
    { season: 'Season 1', year: 2024, playerId: null, note: 'Add MVP' },
  ],
  // editorial slots — fill with real names/quotes when ready
  allTimeGreats: [
    { name: '', franchise: '', blurb: 'Reserved for a Lowveld legend.' },
    { name: '', franchise: '', blurb: 'Reserved for a Lowveld legend.' },
    { name: '', franchise: '', blurb: 'Reserved for a Lowveld legend.' },
  ],
  bestCaptains: [
    { name: '', franchise: '', blurb: 'A captain who built something.' },
    { name: '', franchise: '', blurb: 'A captain who built something.' },
  ],
  biggestMoments: [
    { title: 'Desert Falcons go 21-0', date: '2026-06-10', blurb: 'The first whitewash of Season 3 — Falcons blank the Aces across all six rubbers.' },
    { title: 'Ice Breakers\' first strike', date: '2026-06-17', blurb: '16-7 over the Aces for a maiden win that lit up Week 2.' },
    { title: 'Viboras\' 17-3 opener', date: '2026-06-08', blurb: 'A statement on opening night that set the season\'s tempo.' },
  ],
};

/* ================== DRAFT / AUCTION HISTORY ===================
 * Season 3 auction board. Reuses each PLAYER's auction_price.
 * Top spends & steals are computed; the story is editorial.
 */
export const AUCTION = {
  season: 'Season 3',
  totalSpendLabel: 'R8.61M',
  story: 'Season 3\'s auction reshaped the Lowveld order. Franchises spent big on proven match-winners while a handful of shrewd picks delivered the season\'s best value.',
};
// Full board: every player with their price + franchise, priciest first.
export const auctionBoard = () => [...PLAYERS]
  .filter((p) => p.league === 'mens')
  .sort((a, b) => b.auction_price - a.auction_price);
// Biggest steals = best MVP-points-per-R among players who've featured.
export const auctionSteals = (n = 6) => [...PLAYERS]
  .filter((p) => p.league === 'mens' && p.stats.played > 0 && p.auction_price > 0)
  .map((p) => ({ ...p, valueScore: p.stats.mvp_points / (p.auction_price / 1000) }))
  .sort((a, b) => b.valueScore - a.valueScore)
  .slice(0, n);
export const auctionTopSpends = (n = 6) => auctionBoard().slice(0, n);

/* ===================== DYNASTY TRACKER ========================
 * Franchise legacy. titles/finals are seeded (no real history yet —
 * all start at 0/your data); current S3 form is computed live.
 */
export const DYNASTY = {
  spotlight: 'sonic-viboras',
  spotlightStory: 'Sonic Viboras arrived in Season 3 chasing a maiden crown. Heinrich Coomans and Anton Grote have driven a relentless start — the title chase is real.',
  legacy: [
    { franchise: 'desert-falcons', titles: 0, finals: 0, note: 'Unbeaten and top of the table.' },
    { franchise: 'sonic-viboras', titles: 0, finals: 0, note: 'Title chasers — second and climbing.' },
    { franchise: 'samurai-kicksmashers', titles: 0, finals: 0, note: 'Explosive but inconsistent.' },
    { franchise: 'ice-breakers', titles: 0, finals: 0, note: 'Found their feet in Week 2.' },
    { franchise: 'avalanche-aces', titles: 0, finals: 0, note: 'Rebuilding after a tough start.' },
    { franchise: 'sahara-lions', titles: 0, finals: 0, note: 'A game in hand and ambition.' },
    { franchise: 'globo-boomerangs', titles: 0, finals: 0, note: 'Fighting for momentum.' },
  ],
};

/* ===================== FAN ZONE ==============================
 * Interactive fan features. Votes/predictions are client-side only
 * (no backend) — they persist in component state for the session.
 * Player-of-the-week candidates = current top MVP performers.
 */
export const fanPotwCandidates = (n = 4) => [...PLAYERS]
  .filter((p) => p.league === 'mens' && p.stats.played > 0)
  .sort((a, b) => b.stats.mvp_points - a.stats.mvp_points || b.lp_rating - a.lp_rating)
  .slice(0, n);
// Upcoming fixtures fans can predict (scheduled men's matches).
export const fanPredictionFixtures = () => FIXTURES
  .filter((f) => f.status === 'scheduled' && f.league === 'mens')
  .slice(0, 4);
export const FAN_POLLS = [
  { id: 'poll-title', q: 'Who lifts the Season 3 title?', options: ['desert-falcons', 'sonic-viboras', 'samurai-kicksmashers', 'ice-breakers'] },
  { id: 'poll-mvp', q: 'Season 3 MVP comes from…', options: ['sonic-viboras', 'desert-falcons', 'samurai-kicksmashers', 'avalanche-aces'] },
];

/* =================================================================
 * LEGACY LEAGUE  —  an official Lowveld Padel competition.
 * Same structure & visual quality as the Franchise League.
 * Squads/results are seeded placeholders ready to be replaced.
 * ================================================================= */
export const LEGACY_FRANCHISES = [
  { id: 'lp-leopards', name: 'LP Leopards', short: 'Leopards', league: 'legacy',
    motto: 'Silent. Smart. Deadly.', primary: '#b8860b', secondary: '#3a1d5c', accent: '#f5c542' },
  { id: 'lp-rhinos', name: 'LP Rhinos', short: 'Rhinos', league: 'legacy',
    motto: 'Tough. Solid. Unstoppable.', primary: '#9a9ba0', secondary: '#2b2b2e', accent: '#c79a3e' },
  { id: 'lp-cheetahs', name: 'LP Cheetahs', short: 'Cheetahs', league: 'legacy',
    motto: 'Speed. Agility. Precision.', primary: '#d2691e', secondary: '#1a1a1a', accent: '#e8853a' },
  { id: 'lp-honey-badgers', name: 'LP Honey Badgers', short: 'Honey Badgers', league: 'legacy',
    motto: 'Fearless. Relentless. Never Back Down.', primary: '#9aa823', secondary: '#15160d', accent: '#c4d22e' },
  { id: 'lp-eagles', name: 'LP Eagles', short: 'Eagles', league: 'legacy',
    motto: 'Rise. Focus. Dominate.', primary: '#2f7fa6', secondary: '#cfd6dc', accent: '#4aa8d4' },
  { id: 'lp-jackals', name: 'LP Jackals', short: 'Jackals', league: 'legacy',
    motto: 'Clever. Adaptive. Strategic.', primary: '#c79a3e', secondary: '#1c1408', accent: '#e0bc6a' },
].map((f) => ({ ...f, logo: `/legacy/${f.id}.jpeg` }));
export const legacyFranchiseById = (id) => LEGACY_FRANCHISES.find((f) => f.id === id);

// LP Legacy League Draft COMPLETE — 48 players, 6 teams (5 adults + 3 youth each).
// Youth carry their draft round (R#). Stats start at zero for Season 4.
const LEGACY_DRAFT = {
  'lp-leopards': {
    adults: ['Ozayr Shaik', 'Jovan Erasmus', 'Ridhwaan Sujee', 'Adil Amod', 'Muhammad Mangerah'],
    youth: [['Huzaifah Sujee', 11], ['Muhammed Ruhaan Shaik', 16], ['Ebrahim Mangerah', 12]],
  },
  'lp-rhinos': {
    adults: ['Rafiq Mohamed', 'Christiaan van Aardt', 'Irshaad Moola', 'Zinidine Morgan', 'Yusuf Amod'],
    youth: [['Ayaan Mohamed', 10], ['Muhammed Moola', 6], ['Eesa Moola', 15]],
  },
  'lp-cheetahs': {
    adults: ['Shoaib Nomani', 'Sandeep Daya', 'Mauritz van der Mescht', 'Michael Smit', 'Mohamed Nomani'],
    youth: [['Abdurahmaan Jogee', 8], ['Mikel Pillay', 13], ['Aadam Nomani', 2]],
  },
  'lp-honey-badgers': {
    adults: ['Jameel Valley', 'Faheem Seedat', 'Scharl van den Berg', 'Sailesh Nagar', 'Zandre de Kok'],
    youth: [['Jude van den Berg', 1], ['Reyhaan Seedat', 16], ['Seth van den Berg', 4]],
  },
  'lp-eagles': {
    adults: ['Fiaz Bhikhoo', 'Sahal Yunus', 'Dian Erasmus', 'Akmeer Amod', 'Mohamed Azhar Sujee'],
    youth: [['Nathan Mckenzie', 3], ['Armaan Bhikhoo', 5], ['Yahya Sujee', 14]],
  },
  'lp-jackals': {
    adults: ['Fahad Patel', 'Zunaid Ganchi', 'Stiaan Duvenhage', 'Yusuf Ismail', 'Spanner Mescht'],
    youth: [['Zuhayr Ismail', 9], ['Dewan Duvenhage', 17], ['Mohamed Hoosein Patel', 7]],
  },
};
const blankStats = () => ({ played: 0, wins: 0, losses: 0, rubbers_won: 0, sets_won: 0, sets_lost: 0, bonus_points: 0, mvp_points: 0 });
export const LEGACY_PLAYERS = Object.entries(LEGACY_DRAFT).flatMap(([fid, sq], fi) => [
  ...sq.adults.map((name, i) => ({
    id: `lg-${fi}-a${i}`, name, franchise_id: fid, league: 'legacy', kind: 'adult', draftRound: null,
    lp_rating: 1400, stats: blankStats(),
  })),
  ...sq.youth.map(([name, round], i) => ({
    id: `lg-${fi}-y${i}`, name, franchise_id: fid, league: 'legacy', kind: 'youth', draftRound: null,
    lp_rating: 1400, stats: blankStats(),
  })),
]);
export const LEGACY_SQUAD_NOTE = 'Squads confirmed — the LP Legacy League draft is complete.';
export const legacyPlayersByFranchise = (fid) => LEGACY_PLAYERS.filter((p) => p.franchise_id === fid);

// Standings start level — fill as results come in.
export const LEGACY_STANDINGS = LEGACY_FRANCHISES.map((fr) => ({
  franchise_id: fr.id, played: 0, won: 0, lost: 0, drawn: 0, bp: 0, points: 0, adj: 0,
}));

export const LEGACY_FIXTURES = []; // add scheduled/final fixtures here, same shape as FIXTURES
export const LEGACY_POWER = LEGACY_FRANCHISES.map((f) => f.id); // weekly order, seed = registration order
export const LEGACY_STATUS = 'drafted'; // 'pre' → 'drafted' (squads set) → 'live' (results in)

/* =================================================================
 * ROAD TO THE 360 SUPER CUP  —  Lowveld's national journey.
 * 28–30 August 2026. Lowveld Padel has been invited to compete.
 * ================================================================= */
export const ROAD_TO_360 = {
  title: 'Road to the 360 Super Cup',
  subtitle: 'Lowveld Padel has been invited to compete on the national stage.',
  location: 'Johannesburg',
  dates: '28–30 August 2026',
  startDate: '2026-08-28',
  finalsDate: '2026-08-30',
  timeline: [
    { id: 't1', label: 'Invitation Received', date: '', status: 'done' },
    { id: 't2', label: 'Squad Announcement', date: '', status: 'pending' },
    { id: 't3', label: 'Training Camp', date: '', status: 'pending' },
    { id: 't4', label: 'Travel Day', date: '', status: 'pending' },
    { id: 't5', label: 'Day 1', date: '2026-08-28', status: 'pending' },
    { id: 't6', label: 'Day 2', date: '2026-08-29', status: 'pending' },
    { id: 't7', label: 'Finals Day', date: '2026-08-30', status: 'pending' },
  ],
  squad: [],        // [{ playerId }] once announced
  fixtures: [],     // tournament fixtures
  results: [],      // tournament results
  standings: [],    // tournament group/standings
  matchReports: [], // [{ title, date, body }]
  updates: [],      // [{ date, text }] daily updates
};

/* =================================================================
 * COMMUNITY PREDICTION LEAGUE  +  LP AI
 * Predictions persist client-side (session) — wire to Supabase later.
 * ================================================================= */
export const PREDICTION_OPTIONS = [
  { key: 'a40', label: '4-0', side: 'a' },
  { key: 'a31', label: '3-1', side: 'a' },
  { key: 'draw', label: '2-2', side: 'draw' },
  { key: 'b31', label: '3-1', side: 'b' },
  { key: 'b40', label: '4-0', side: 'b' },
];
export const PREDICTION_SCORING = { exact: 5, correctDraw: 4, correctWinner: 3, wrong: 0 };
export const PREDICTOR_BADGES = [
  { name: 'Rookie', min: 0 }, { name: 'Analyst', min: 15 }, { name: 'Expert', min: 35 },
  { name: 'Guru', min: 60 }, { name: 'Legend', min: 100 },
];
export const badgeFor = (pts) => [...PREDICTOR_BADGES].reverse().find((b) => pts >= b.min) || PREDICTOR_BADGES[0];
// Leaderboard seed (empty — fills as the community plays).
export const PREDICTION_LEADERBOARD = [];

// Match of the Week = next scheduled men's fixture (fallback: most recent final).
export const matchOfTheWeek = () =>
  FIXTURES.find((f) => f.status === 'scheduled' && f.league === 'mens')
  || [...FIXTURES].reverse().find((f) => f.status === 'final' && f.league === 'mens')
  || null;

// LP AI prediction: blends standings strength, LP ratings, form & H2H.
export const lpAiPredict = (fixture) => {
  if (!fixture) return null;
  const sFr = STANDINGS.mens.franchise;
  const row = (id) => sFr.find((r) => r.franchise_id === id) || { points: 0, played: 1, won: 0 };
  const rate = (id) => {
    const ps = PLAYERS.filter((p) => p.franchise_id === id && p.stats.played > 0);
    return ps.length ? ps.reduce((s, p) => s + p.lp_rating, 0) / ps.length : 1400;
  };
  const a = fixture.home; const b = fixture.away;
  const ra = row(a); const rb = row(b);
  const ppgA = ra.points / Math.max(1, ra.played); const ppgB = rb.points / Math.max(1, rb.played);
  const eloA = rate(a); const eloB = rate(b);
  const h2h = headToHead(a, b);
  // weighted score
  let scoreA = ppgA * 2 + (eloA - 1400) / 50 + h2h.aWins;
  let scoreB = ppgB * 2 + (eloB - 1400) / 50 + h2h.bWins;
  const total = scoreA + scoreB || 1;
  const pA = scoreA / total;
  const winner = pA >= 0.5 ? a : b;
  const conf = Math.round(50 + Math.abs(pA - 0.5) * 100);
  // map confidence → predicted margin
  const margin = conf >= 75 ? '4-0' : conf >= 60 ? '3-1' : '3-1';
  return { winner, loser: winner === a ? b : a, confidence: Math.min(95, conf), margin };
};

/* =================================================================
 * PLAYER OF THE WEEK  (nominees = current top MVP performers)
 * ================================================================= */
export const playerOfWeek = {
  current: null,                 // set a playerId to crown a winner
  nominees: () => fanPotwCandidates(5),
  previous: [],                  // [{ week, playerId }]
};

/* =================================================================
 * WEEKLY POWER RANKINGS with movement + commentary
 * ================================================================= */
export const POWER_RANKINGS_WEEKLY = {
  mens: [
    { franchise: 'desert-falcons', move: 'same', note: 'Still top. Falcons on 59 — but Sonics are now just 1 point behind.' },
    { franchise: 'sonic-viboras', move: 'up', note: '16-6 over the Boomerangs. Coomans, Grote, Moola/Boshoff all dominant — title race is on.' },
    { franchise: 'ice-breakers', move: 'up', note: 'Huge night — 15-6 over the Lions. On 34 points and moving fast.' },
    { franchise: 'sahara-lions', move: 'down', note: 'Dropped to 21 pts after the IB defeat. Still alive but need a response.' },
    { franchise: 'samurai-kicksmashers', move: 'same', note: 'Idle this round. Watching from 22 pts.' },
    { franchise: 'globo-boomerangs', move: 'up', note: 'Took 2 rubbers off the Sonics — showing some fight at 17 pts.' },
    { franchise: 'avalanche-aces', move: 'down', note: 'Still searching for form. Break comes just in time.' },
  ],
};
