// Page titles and share-preview text per route.
// Used by the app (browser tab title) and by vite.config.js, which writes a
// static HTML file per route so deep links return 200 and WhatsApp/Google
// previews show the right title, description and image.

export const SITE_URL = 'https://www.lowveldpadel.co.za';
export const SITE_NAME = 'Lowveld Padel';

export const DEFAULT_META = {
  title: 'Lowveld Padel — Live',
  description: "Live scores, standings, player stats and franchise news from Mbombela's premier padel league.",
  image: '/ladies-champions-2026.webp',
};

export const ROUTE_META = {
  '/': DEFAULT_META,
  '/register': {
    title: 'Register — The Daisy Cup, 28 November | Lowveld Padel',
    description: 'Ladies doubles at Padel 24, Nelspruit. 28 November 2026, 08:00–22:00. 24 pairs, R800 per pair, R6,000 prize pool.',
    image: '/events/daisy-cup-2026.webp',
  },
  '/live': { title: 'Match Centre | Lowveld Padel', description: 'Live scores and latest results from Lowveld Padel leagues and cups.' },
  '/leagues': { title: 'Leagues | Lowveld Padel', description: "Standings, fixtures and results for the Men's Franchise League, Ladies Franchise League and LP Legacy League." },
  '/standings': { title: 'Standings | Lowveld Padel', description: 'Current league standings across Lowveld Padel competitions.' },
  '/rankings': { title: 'Rankings | Lowveld Padel', description: 'LP Rating player rankings for Lowveld Padel.' },
  '/players': { title: 'Players | Lowveld Padel', description: 'Player profiles, ratings and match records.' },
  '/franchises': { title: 'Franchises | Lowveld Padel', description: 'Every Lowveld Padel franchise, squad and season record.' },
  '/gallery': { title: 'Photo Gallery | Lowveld Padel', description: 'Photos from Lowveld Padel finals nights and events.' },
  '/kruger-cup-2026': { title: 'Kruger Cup 2026 | Lowveld Padel', description: 'Winners, standout pairs and highlights from the Kruger Cup, 10 October 2026 at Padel 24.' },
  '/360-super-cup': { title: '360 Super Cup | Lowveld Padel', description: 'Lowveld finished third nationally at the 360 Super Cup: 20 matches, 10 wins, 28 points.' },
  '/news': { title: 'News | Lowveld Padel', description: 'News from Lowveld Padel leagues, franchises and events.' },
  '/sponsors': { title: 'Sponsors | Lowveld Padel', description: 'The partners behind Lowveld Padel.' },
  '/shop': { title: 'Shop | Lowveld Padel', description: 'LP apparel and padel gear.' },
  '/cart': { title: 'Cart | Lowveld Padel', description: DEFAULT_META.description },
  '/tv': { title: 'Lowveld TV | Lowveld Padel', description: 'Videos and highlights from Lowveld Padel.' },
  '/rivalries': { title: 'Rivalries | Lowveld Padel', description: 'The biggest head-to-head rivalries in Lowveld Padel.' },
  '/hall-of-fame': { title: 'Hall of Fame | Lowveld Padel', description: 'Champions and record holders of Lowveld Padel.' },
  '/draft': { title: 'Draft History | Lowveld Padel', description: 'Every Lowveld Padel draft and auction.' },
  '/dynasty': { title: 'Dynasty Tracker | Lowveld Padel', description: 'Franchise dynasties across Lowveld Padel seasons.' },
  '/fan-zone': { title: 'Fan Zone | Lowveld Padel', description: DEFAULT_META.description },
  '/predictor': { title: 'Predictor | Lowveld Padel', description: DEFAULT_META.description },
  '/community': { title: 'Community | Lowveld Padel', description: DEFAULT_META.description },
  '/sports-hub': { title: 'Sports Hub | Lowveld Padel', description: DEFAULT_META.description },
  '/all-time-rankings': { title: 'All-Time Rankings | Lowveld Padel', description: 'All-time player rankings across Lowveld Padel seasons.' },
  '/more': { title: 'More | Lowveld Padel', description: DEFAULT_META.description },
  '/privacy': { title: 'Privacy & POPIA | Lowveld Padel', description: 'How Lowveld Padel handles personal information under POPIA.' },
};

export function metaForPath(pathname) {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return { ...DEFAULT_META, ...(ROUTE_META[clean] || {}) };
}
