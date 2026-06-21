// Central config for all WhatsApp / community links.
// Replace "#" with real invite URLs later — no component changes needed.
export const communityLinks = {
  leagueCommunity: '#',
  matchdayChat: '#',
  legacyLeague: '#',
  roadTo360: '#',
  acesSupporters: '#',
  viborasNation: '#',
  falconsFans: '#',
  kicksmashersSupporters: '#',
};

// Helper: build a WhatsApp share link for any text (works on mobile + web).
export const waShare = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;
export default communityLinks;
