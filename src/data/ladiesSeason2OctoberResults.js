// Reconciled against the organiser's WhatsApp result reports on 14 October.
// Two rubbers contain only two published sets: preserve those scores and the
// explicitly awarded 3 points; never invent an unreported third set.
export const october14Results = [
  {
    id: 'ladies-s2-2026-10-14-phoenix-novas', date: '2026-10-14', venue: '', status: 'FT', stage: 'eliminator',
    home: 'Phoenix Flames', away: 'Net Novas', homePoints: 3, awayPoints: 9,
    source: 'Organiser WhatsApp result report · 14 October 2026, 21:10',
    rubbers: [
      { time: '17:30', home: ['Gizelle Taylor', 'Maryke Botha'], away: ['Maxine Lambourn', 'Mufeedah Hoosen'], sets: ['6-2', '6-4', '7-10'], homePoints: 3, awayPoints: 0 },
      { time: '17:30', home: ['Anneri Duvenage', 'Samantha de Araujo'], away: ['Mariette Venter', 'Imaan Shaik'], sets: ['3-6', '6-3', '8-10'], homePoints: 0, awayPoints: 3 },
      { time: '18:30', home: ['Karlien Janse van Rensburg', 'Martinette Meyer'], away: ['Elsa Fryer', 'Emily Anders'], sets: ['6-3', '1-6', '8-10'], homePoints: 0, awayPoints: 3 },
      { time: '19:30', home: ['Tanija De Villiers', 'Helene Van der Merwe'], away: ['Carien Vos', 'Simone Maritz'], sets: ['6-7', '1-6'], homePoints: 0, awayPoints: 3, note: 'Only two sets were reported; the organiser awarded 3 points to Net Novas.' },
    ],
  },
  {
    id: 'ladies-s2-2026-10-14-blossoms-lunar', date: '2026-10-14', venue: '', status: 'FT', stage: 'qualifier',
    home: 'Backhand Blossoms', away: 'Lunar Lillies', homePoints: 4, awayPoints: 11,
    source: 'Organiser corrected WhatsApp result report · 14 October 2026, 22:10; confirmed 22:11',
    rubbers: [
      { time: '17:30', home: ['Zahra Jogi', 'Faeeza Patel'], away: ['Bianca Renell Morgan', 'Heleen Van Der Mescht'], sets: ['6-1', '6-1', '10-1'], homePoints: 4, awayPoints: 0 },
      { time: '18:30', home: ['Nasreen Methar', 'Dhiya Ismail'], away: ['Dalene Minnaar', 'Firdaus Hoosen'], sets: ['6-7', '4-6'], homePoints: 0, awayPoints: 3, note: 'Only two sets were reported; the organiser awarded 3 points to Lunar Lillies.' },
      { time: '18:30', home: ['Rinie De Klerk', 'Jana Kotze'], away: ['Dirkie Coomans', 'Stephanie Steenekamp'], sets: ['2-6', '4-6', '3-10'], homePoints: 0, awayPoints: 4 },
      { time: '19:30', home: ['Sunel Grote', 'Imaan Packery'], away: ['Jeanetha Boshoff', 'Miané Swart'], sets: ['4-6', '5-7', '2-10'], homePoints: 0, awayPoints: 4 },
    ],
  },
];

export const october20Result = {
  id: 'ladies-s2-2026-10-20-blossoms-novas', date: '2026-10-20', venue: 'Play 360', status: 'FT',
  home: 'Backhand Blossoms', away: 'Net Novas', homePoints: 12, awayPoints: 3,
  rubbers: [
    { time: '18:00', home: ['Faeeza Patel', 'Amor Caromba'], away: ['Larisa de Kock', 'Maxine Lambourn'], sets: ['6-0', '6-0', '10-2'], homePoints: 4, awayPoints: 0 },
    { time: '18:00', home: ['Sunel Grote', 'Imaan Packery'], away: ['Carien Vos', 'Simone Maritz'], sets: ['7-5', '7-5', '10-8'], homePoints: 4, awayPoints: 0 },
    // Detailed 20:07 report used; earlier 20:06 message reported the tiebreak as 10-6.
    { time: '19:00', home: ['Jana Kotze', 'Dhiya Ismail'], away: ['Elsa Fryer', 'Emily Anders'], sets: ['6-2', '6-2', '10-2'], homePoints: 4, awayPoints: 0 },
    { time: '19:00', home: ['Nasreen Methar', 'Zahra Jogi'], away: ['Mariette Venter', 'Imaan Shaik'], sets: ['1-6', '7-5', '5-10'], homePoints: 0, awayPoints: 3 },
  ],
};

export const latestLadiesResult = {
  id: 'ladies-s2-2026-10-22-final', date: '2026-10-22', venue: 'Play 360', status: 'FT', stage: 'final',
  home: 'Backhand Blossoms', away: 'Lunar Lillies', homePoints: 7, awayPoints: 6,
  rubbers: [
    { time: '19:00', home: ['Sunel Grote', 'Imaan Packery'], away: ['Jeanetha Boshoff', 'Miané Swart'], sets: ['2-6', '6-3', '10-6'], homePoints: 3, awayPoints: 0 },
    { time: '19:00', home: ['Amor Caromba', 'Faeeza Patel'], away: ['Heleen Van Der Mescht', 'Mari Jaquire'], sets: ['6-0', '6-2', '10-1'], homePoints: 4, awayPoints: 0 },
    { time: '20:00', home: ['Rinie De Klerk', 'Jana Kotze'], away: ['Dirkie Coomans', 'Stephanie Steenekamp'], sets: ['5-7', '6-4', '8-10'], homePoints: 0, awayPoints: 3 },
    { time: '20:00', home: ['Dhiya Ismail', 'Zahra Jogi'], away: ['Firdaus Hoosen', 'Dalene Minnaar'], sets: ['6-3', '5-7', '5-10'], homePoints: 0, awayPoints: 3 },
  ],
};
export const LADIES_S2_OCTOBER_RESULTS = [...october14Results, october20Result, latestLadiesResult];
