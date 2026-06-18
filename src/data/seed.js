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
  { id: 'avalanche-aces', name: 'Avalanche Aces', league: 'mens', logo: '/logos/avalanche-aces.webp', owner: 'Franchise Owner', venue: 'Padel 24', founded: 2024 },
  { id: 'desert-falcons', name: 'Desert Falcons', league: 'mens', logo: '/logos/desert-falcons.webp', owner: 'Franchise Owner', venue: 'Padel 24', founded: 2024 },
  { id: 'globo-boomerangs', name: 'Global Boomerangs', league: 'mens', logo: '/logos/globo-boomerangs.webp', owner: 'Franchise Owner', venue: 'Play 360', founded: 2024 },
  { id: 'ice-breakers', name: 'Ice Breakers', league: 'mens', logo: '/logos/ice-breakers.webp', owner: 'Franchise Owner', venue: 'Padel 24', founded: 2024 },
  { id: 'samurai-kicksmashers', name: 'Samurai Kick Smashers', league: 'mens', logo: '/logos/samurai-kicksmashers.webp', owner: 'Franchise Owner', venue: 'Play 360', founded: 2024 },
  { id: 'sonic-viboras', name: 'Sonic Viboras', league: 'mens', logo: '/logos/sonic-viboras.webp', owner: 'Franchise Owner', venue: 'Padel 24', founded: 2024 },
  { id: 'sahara-lions', name: 'Sahara Lions', league: 'mens', logo: '/logos/sahara-lions.webp', owner: 'Franchise Owner', venue: 'Play 360', founded: 2024 },
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
    P2: ['Warno Smit', 'Morne Steenekamp', 'Ryan Wicht', 'Fahad Patel', 'Rayhaan Dinath', 'Ibrahim Mungalee'],
    P3: ['Jacques Burger', 'Reino Grobler', 'M Mangerah', 'Zaeem Sadiq', 'Danie Rautenbach', 'Jude van den Berg'],
  },
  'sahara-lions': {
    P1: ['Cameron Jacobsz', 'Cian Maritz', 'Yusuf Packery', 'Pieter Badenhorst', 'Justin van Staaden', 'Suhayl Packery'],
    P2: ['Naeem Omar', 'Alfaiz Mamji', 'Adil Patel', 'Soyab Patel', 'Suliman Patel', 'Irfaan Mamji'],
    P3: ['Drikus Prins', 'Warren Morgan', 'Irfaan Mahomed', 'Aadil Asvat', 'Imtiaz Mohamed', 'Majid Bapu'],
  },
  'globo-boomerangs': {
    P1: ['Yusuf Asvat', 'Joseph van der Merwe', 'Ahmed Mungalee', 'Liam Morgan', 'Lefa Mogamedi', 'Adil Ahmed'],
    P2: ['Bevin Francis', 'M Shehzad Meer', 'Ryan Kennett', 'Diego Sebastian', 'Duran Greever', 'Nabeel Meer'],
    P3: ['Kiran Hansraj', 'Stefan Erasmus', 'Taahir Mungalee', 'Suhail Patel', 'Shaffique Jeewa', 'Farhaan Shaik'],
  },
  'samurai-kicksmashers': {
    P1: ['Durell Pillay', 'Bryan Theron', 'Burger Bester', 'M Azhar Sujee', 'Siraaj Shaik', 'Danyaal Nomani'],
    P2: ['M Jina', 'Muneer Shaik', 'Armand Esterhuizen', 'Shaun Moropa', 'Tim Forssman', 'Sikander Cassim'],
    P3: ['Riaz Ahmed Bellim', 'Brent Grix', 'Dillon Francis', 'Imraan Khan', 'Ismail Karodia', 'Nuaym Shaik'],
  },
  'ice-breakers': {
    P1: ['Duhan Swart', 'JD Herbst', 'Imaad Arabi', 'Maaz Randera', 'Zaheer Methar', 'Salmaan Methar'],
    P2: ['Jacques van Zyl', 'Phil-Mar van Rensburg', 'Zayd Methar', 'Nicky Joubert', 'Zahid Methar', 'Chaz Taylor'],
    P3: ['Wayne Enslin', 'Sergio Correia', 'Waldo van Tonder', 'Irshaad Moola', 'S Coramba', 'Aadam Nomani'],
  },
  'sonic-viboras': {
    P1: ['Heinrich Coomans', 'Anton Grote', 'Yusuf Moola', 'Pieter Boshoff', 'Ridhwaan Sujee', 'Erlo Olivier'],
    P2: ['Warwick Morgan', 'Joshua Hoffman', 'Marius Loock', 'Khalid Jeewa', 'Ismail Fakir', 'Jacques Henning'],
    P3: ['George du Toit', 'Dewald Meyer', 'Gerrit Smith', 'Stefan de Villiers', 'M Dadamia', 'Saliem Mahomed'],
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
      { slot: '18:00', court: 'P3', home: 'Waldo / Irshaad', away: 'Stefan / M Dadamia',
        homeIds: ids('ice-breakers', 'Waldo van Tonder', 'Irshaad Moola'), awayIds: ids('sonic-viboras', 'Stefan de Villiers', 'M Dadamia'),
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
      { slot: '20:30', court: 'P1', home: 'Siraaj Shaik / M Azhar Sujee', away: 'Ryan Tate / Steven Pinker',
        homeIds: ids('samurai-kicksmashers', 'Siraaj Shaik', 'M Azhar Sujee'), awayIds: ids('avalanche-aces', 'Ryan Tate', 'Steven Pinker'), games: [4, 0], winner: 'home' },
      { slot: '20:30', court: 'P2', home: 'M Jina / Armand Esterhuizen', away: 'Etienne Grobler / Frik de Beer',
        homeIds: ids('samurai-kicksmashers', 'M Jina', 'Armand Esterhuizen'), awayIds: ids('avalanche-aces', 'Etienne Grobler', 'Frik de Beer'), games: [0, 3], winner: 'away' },
    ] } },
  // MD2 · Wed 10 Jun
  { id: 'fx-w1-3', round: 1, league: 'mens', home: 'desert-falcons', away: 'avalanche-aces', start: T('2026-06-10'), status: 'final', court: 'Padel 24', dh: true,
    score: { winner: 'home', totals: [21, 0], rubberWins: [6, 0], rubbers: [
      { slot: '18:00', court: 'P2', home: 'Rayhaan Dinath / Boms', away: 'Felix Lombard / Luqmaan Hoosen',
        homeIds: ids('desert-falcons', 'Rayhaan Dinath'), awayIds: ids('avalanche-aces', 'Felix Lombard', 'Luqmaan Hoosen'), games: [3, 0], winner: 'home' },
      { slot: '18:00', court: 'P3', home: 'M Mangerah / Jude van den Berg', away: 'Gerco van Rooyen / Prashil Nagar',
        homeIds: ids('desert-falcons', 'M Mangerah', 'Jude van den Berg'), awayIds: ids('avalanche-aces', 'Gerco van Rooyen', 'Prashil Nagar'), games: [3, 0], winner: 'home' },
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
        homeIds: ids('globo-boomerangs', 'Bevin Francis'), awayIds: ids('sahara-lions', 'Naeem Omar', 'Alfaiz Mamji'), games: [4, 0], winner: 'home' },
      { slot: '18:00', court: 'P3', home: 'Shaffique Jeewa / Suhail Patel', away: 'Imtiaz Mohamed / Majid Bapu',
        homeIds: ids('globo-boomerangs', 'Shaffique Jeewa', 'Suhail Patel'), awayIds: ids('sahara-lions', 'Imtiaz Mohamed', 'Majid Bapu'), games: [4, 0], winner: 'home' },
      { slot: '19:15', court: 'P1', home: 'Jojo / Joseph van der Merwe', away: 'Yusuf Packery / Pieter Badenhorst',
        homeIds: ids('globo-boomerangs', 'Joseph van der Merwe'), awayIds: ids('sahara-lions', 'Yusuf Packery', 'Pieter Badenhorst'), games: [0, 4], winner: 'away' },
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
    score: { winner: 'away', totals: [7, 16], rubberWins: [1, 5], rubbers: [
      { slot: '18:00', court: 'P1', home: 'Steven Pinker / Donovan Taylor', away: 'Imaad Arabi / Salmaan Methar',
        homeIds: ids('avalanche-aces', 'Steven Pinker', 'Donovan Taylor'), awayIds: ids('ice-breakers', 'Imaad Arabi', 'Salmaan Methar'), games: [0, 4], winner: 'away' },
      { slot: '18:00', court: 'P2', home: 'Pierre de Villiers / Luqmaan Hoosen', away: 'Zahid Methar / Chaz Taylor',
        homeIds: ids('avalanche-aces', 'Pierre de Villiers', 'Luqmaan Hoosen'), awayIds: ids('ice-breakers', 'Zahid Methar', 'Chaz Taylor'), games: [0, 4], winner: 'away' },
      { slot: '19:15', court: 'P2', home: 'Etienne Grobler / Frik de Beer', away: 'Jacques van Zyl / Zayd Methar',
        homeIds: ids('avalanche-aces', 'Etienne Grobler', 'Frik de Beer'), awayIds: ids('ice-breakers', 'Jacques van Zyl', 'Zayd Methar'), games: [3, 0], winner: 'home' },
      { slot: '19:15', court: 'P3', home: 'Rishaad Shaik / Prashil Nagar', away: 'Aadam Nomani / Shaun',
        homeIds: ids('avalanche-aces', 'Rishaad Shaik', 'Prashil Nagar'), awayIds: ids('ice-breakers', 'Aadam Nomani'), games: [4, 0], winner: 'home' },
      { slot: '20:30', court: 'P1', home: 'Wiehann Mohlen / Patrick Leyden', away: 'Duhan Swart / JD Herbst',
        homeIds: ids('avalanche-aces', 'Wiehann Mohlen', 'Patrick Leyden'), awayIds: ids('ice-breakers', 'Duhan Swart', 'JD Herbst'), games: [0, 4], winner: 'away' },
      { slot: '20:30', court: 'P3', home: 'Kobus van Rensburg / Gerco van Rooyen', away: 'Sergio Correia / Wayne Enslin',
        homeIds: ids('avalanche-aces', 'Kobus van Rensburg', 'Gerco van Rooyen'), awayIds: ids('ice-breakers', 'Sergio Correia', 'Wayne Enslin'), games: [0, 4], winner: 'away' },
    ] } },
  { id: 'fx-w2-2', round: 2, league: 'mens', home: 'sonic-viboras', away: 'samurai-kicksmashers', start: T('2026-06-17'), status: 'final', court: 'Play 360',
    score: { winner: 'home', totals: [15, 7], rubberWins: [4, 2], rubbers: [
      { slot: '18:00', court: 'P1', home: 'Heinrich Coomans / Anton Grote', away: 'Bryan Theron / Durell Pillay',
        homeIds: ids('sonic-viboras', 'Heinrich Coomans', 'Anton Grote'), awayIds: ids('samurai-kicksmashers', 'Bryan Theron', 'Durell Pillay'), games: [4, 0], winner: 'home' },
      { slot: '18:00', court: 'P2', home: 'Warwick Morgan / Marius Loock', away: 'M Jina / Muneer Shaik',
        homeIds: ids('sonic-viboras', 'Warwick Morgan', 'Marius Loock'), awayIds: ids('samurai-kicksmashers', 'M Jina', 'Muneer Shaik'), games: [4, 0], winner: 'home' },
      { slot: '19:15', court: 'P2', home: 'Ismail Fakir / Jacques Henning', away: 'Tim Forssman / Sikander Cassim',
        homeIds: ids('sonic-viboras', 'Ismail Fakir', 'Jacques Henning'), awayIds: ids('samurai-kicksmashers', 'Tim Forssman', 'Sikander Cassim'), games: [0, 3], winner: 'away' },
      { slot: '19:15', court: 'P3', home: 'George du Toit / Dewald Meyer', away: 'Brent Grix / Dillon Francis',
        homeIds: ids('sonic-viboras', 'George du Toit', 'Dewald Meyer'), awayIds: ids('samurai-kicksmashers', 'Brent Grix', 'Dillon Francis'), games: [4, 0], winner: 'home' },
      { slot: '20:30', court: 'P1', home: 'Ridhwaan Sujee / Erlo Olivier', away: 'Burger Bester / Danyaal Nomani',
        homeIds: ids('sonic-viboras', 'Ridhwaan Sujee', 'Erlo Olivier'), awayIds: ids('samurai-kicksmashers', 'Burger Bester', 'Danyaal Nomani'), games: [3, 0], winner: 'home' },
      { slot: '20:30', court: 'P3', home: 'Stefan de Villiers / Saliem Mahomed', away: 'Ismail Karodia / Imraan Khan',
        homeIds: ids('sonic-viboras', 'Stefan de Villiers', 'Saliem Mahomed'), awayIds: ids('samurai-kicksmashers', 'Ismail Karodia', 'Imraan Khan'), games: [0, 3], winner: 'away' },
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
        homeIds: ids('globo-boomerangs', 'M Shehzad Meer', 'Bevin Francis'), awayIds: ids('desert-falcons', 'Warno Smit', 'Morne Steenekamp'),
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
  { id: 'fx-w3-1', round: 3, league: 'mens', home: 'avalanche-aces', away: 'sonic-viboras', start: T('2026-06-22'), status: 'scheduled', court: 'Play 360', dh: true },
  { id: 'fx-w3-2', round: 3, league: 'mens', home: 'samurai-kicksmashers', away: 'desert-falcons', start: T('2026-06-22'), status: 'scheduled', court: 'Padel 24' },
  { id: 'fx-w3-3', round: 3, league: 'mens', home: 'globo-boomerangs', away: 'sonic-viboras', start: T('2026-06-24'), status: 'scheduled', court: 'Padel 24', dh: true },
  { id: 'fx-w3-4', round: 3, league: 'mens', home: 'sahara-lions', away: 'ice-breakers', start: T('2026-06-24'), status: 'scheduled', court: 'Play 360' },

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

export const STANDINGS = {
  mens: {
    franchise: deriveLog('mens', null),
    P1: deriveLog('mens', 'P1'),
    P2: deriveLog('mens', 'P2'),
    P3: deriveLog('mens', 'P3'),
  },
  ladies: { franchise: deriveLog('ladies', null), P1: [], P2: [], P3: [] },
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
      // per-player counting stats + sets won
      let homeSets = 0; let awaySets = 0;
      if (r.sets) r.sets.forEach(([h, a]) => { if (h > a) homeSets += 1; else awaySets += 1; });
      [['home', 'homeIds', 0, homeSets, awaySets], ['away', 'awayIds', 1, awaySets, homeSets]].forEach(([side, key, idx, setsFor, setsAg]) => {
        (r[key] || []).filter(Boolean).forEach((pidX) => {
          const p = PLAYERS.find((x) => x.id === pidX);
          if (!p) return;
          p.stats.played += 1;
          if (r.games) p.stats.games_won += r.games[idx];
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
  mens: ['sonic-viboras', 'desert-falcons', 'sahara-lions', 'ice-breakers', 'samurai-kicksmashers', 'globo-boomerangs', 'avalanche-aces'],
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
