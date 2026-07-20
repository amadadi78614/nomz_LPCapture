// Central config for all WhatsApp / community links.
// Set real invite URLs here — components read from this file automatically.
// Leave as null (not "#") until real URLs are available.
export const communityLinks = {
  leagueCommunity: null,   // TODO: replace with real WhatsApp group link
  matchdayChat:    null,   // TODO: replace with real WhatsApp group link
  legacyLeague:    null,   // TODO: replace with real WhatsApp group link
  roadTo360:       null,   // TODO: replace with real WhatsApp group link
  superCup:        null,   // TODO: replace with real WhatsApp group link
  acesSupporters:       null,
  viborasNation:        null,
  falconsFans:          null,
  kicksmashersSupporters: null,
};

// Helper: build a WhatsApp share link for any text (works on mobile + web)
export const waShare = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;

export default communityLinks;
