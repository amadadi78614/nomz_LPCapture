// =====================================================================
// Lowveld TV — media data layer
// ---------------------------------------------------------------------
// Every item follows ONE schema. To publish a video, paste its link into
// `youtube_url`. Until then the card renders a tasteful "coming soon"
// state. No fake videos are hard-coded — empty youtube_url == unpublished.
//
//   {
//     id:          unique string
//     title:       headline
//     subtitle:    small line under the title (optional)
//     thumbnail:   image URL (optional — falls back to the YouTube
//                  thumbnail when youtube_url is set, else a gradient)
//     youtube_url: '' until you have the link (any youtube/youtu.be form)
//     category:    one of TV_CATEGORIES ids
//     date:        'YYYY-MM-DD'
//     duration:    'MM:SS' label (optional)
//     franchise:   franchise id for colour accent (optional)
//     live:        true only for an on-air stream (optional)
//   }
// =====================================================================

export const TV_CATEGORIES = [
  { id: 'live', label: 'Live Stream', blurb: 'Match nights, streamed from the Lowveld courts.' },
  { id: 'highlights', label: 'Match Highlights', blurb: 'The big points, the upsets, the bonus-point clean sweeps.' },
  { id: 'replays', label: 'Full Replays', blurb: 'Every rubber, start to finish, on demand.' },
  { id: 'interviews', label: 'Player Interviews', blurb: 'Courtside with the names making the headlines.' },
  { id: 'show', label: 'The Weekly Show', blurb: 'Lowveld Padel\'s magazine show — results, rankings, rivalries.' },
];

// ---------------------------------------------------------------------
// Seeded placeholders. Titles reference real Season 3 fixtures/results so
// the page feels alive — but youtube_url is intentionally empty. Replace
// '' with a real link to publish, or add new objects with the same shape.
// ---------------------------------------------------------------------
export const MEDIA = [
  // ---- Featured live slot (one item with category 'live' is featured) ----
  {
    id: 'live-next', category: 'live', live: false,
    title: 'LPFL Live — Week 3 Match Night',
    subtitle: 'Doubleheader · Padel 24 & Play 360',
    youtube_url: '', thumbnail: '', date: '2026-06-22',
  },

  // ---- Match highlights (mapped to real results) ----
  { id: 'hl-w2-1', category: 'highlights', franchise: 'ice-breakers',
    title: 'Ice Breakers stun the Aces 16-7', subtitle: 'Match Day 3 · three bonus-point sweeps',
    youtube_url: '', thumbnail: '', date: '2026-06-17', duration: '08:42', fixtureId: 'fx-w2-1' },
  { id: 'hl-w2-2', category: 'highlights', franchise: 'sonic-viboras',
    title: 'Viboras down the Smashers 15-7', subtitle: 'Match Day 3 · Coomans & Grote in control',
    youtube_url: '', thumbnail: '', date: '2026-06-17', duration: '07:15', fixtureId: 'fx-w2-2' },
  { id: 'hl-w2-3', category: 'highlights', franchise: 'desert-falcons',
    title: 'Falcons go 19-3 to stay perfect', subtitle: 'Match Day 4 · twelve rubbers unbeaten',
    youtube_url: '', thumbnail: '', date: '2026-06-18', duration: '09:03', fixtureId: 'fx-w2-3' },
  { id: 'hl-w1-3', category: 'highlights', franchise: 'desert-falcons',
    title: 'Falcons blank the Aces 21-0', subtitle: 'Match Day 2 · a perfect night',
    youtube_url: '', thumbnail: '', date: '2026-06-10', duration: '06:30', fixtureId: 'fx-w1-3' },

  // ---- Full replays ----
  { id: 'rp-w2-1', category: 'replays', franchise: 'avalanche-aces',
    title: 'Avalanche Aces v Ice Breakers — full match', subtitle: 'Match Day 3 · all six rubbers',
    youtube_url: '', thumbnail: '', date: '2026-06-17', duration: '1:52:00', fixtureId: 'fx-w2-1' },
  { id: 'rp-w2-2', category: 'replays', franchise: 'sonic-viboras',
    title: 'Sonic Viboras v Samurai Kick Smashers — full match', subtitle: 'Match Day 3 · all six rubbers',
    youtube_url: '', thumbnail: '', date: '2026-06-17', duration: '1:48:00', fixtureId: 'fx-w2-2' },
  { id: 'rp-w2-3', category: 'replays', franchise: 'globo-boomerangs',
    title: 'Global Boomerangs v Desert Falcons — full match', subtitle: 'Match Day 4 · all six rubbers',
    youtube_url: '', thumbnail: '', date: '2026-06-18', duration: '1:55:00', fixtureId: 'fx-w2-3' },

  // ---- Player interviews ----
  { id: 'iv-coomans', category: 'interviews', franchise: 'sonic-viboras',
    title: 'Courtside: Heinrich Coomans', subtitle: 'Top of the LP Rating after two from two',
    youtube_url: '', thumbnail: '', date: '2026-06-17', duration: '04:20' },
  { id: 'iv-falcons', category: 'interviews', franchise: 'desert-falcons',
    title: 'Inside the unbeaten Falcons', subtitle: 'The pairing that hasn\'t dropped a match',
    youtube_url: '', thumbnail: '', date: '2026-06-18', duration: '05:48' },
  { id: 'iv-icebreakers', category: 'interviews', franchise: 'ice-breakers',
    title: 'Ice Breakers on their first win', subtitle: 'How the upset of the season came together',
    youtube_url: '', thumbnail: '', date: '2026-06-17', duration: '03:55' },

  // ---- The weekly show ----
  { id: 'show-ep3', category: 'show',
    title: 'The Weekly Show — Episode 3', subtitle: 'Falcons fly, Ice Breakers shock, the title race tightens',
    youtube_url: '', thumbnail: '', date: '2026-06-19', duration: '22:10' },
  { id: 'show-ep2', category: 'show',
    title: 'The Weekly Show — Episode 2', subtitle: 'Week 1 reaction, power rankings, MVP race',
    youtube_url: '', thumbnail: '', date: '2026-06-12', duration: '19:40' },
  { id: 'show-ep1', category: 'show',
    title: 'The Weekly Show — Season 3 Launch', subtitle: 'Squads, draft fallout, who to watch',
    youtube_url: '', thumbnail: '', date: '2026-06-05', duration: '24:05' },
];

// ---------------------------------------------------------------------
// YouTube helpers — accept any common link form and degrade gracefully.
// ---------------------------------------------------------------------
export function youtubeId(url) {
  if (!url) return null;
  const m = String(url).match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}
export function youtubeThumb(item) {
  if (item.thumbnail) return item.thumbnail;
  const id = youtubeId(item.youtube_url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
export function youtubeEmbed(url, { autoplay = true } = {}) {
  const id = youtubeId(url);
  if (!id) return null;
  const p = new URLSearchParams({ rel: '0', modestbranding: '1', autoplay: autoplay ? '1' : '0' });
  return `https://www.youtube.com/embed/${id}?${p.toString()}`;
}
export const isPublished = (item) => !!youtubeId(item.youtube_url);

// Selectors
export const mediaByCategory = (cat) =>
  MEDIA.filter((m) => m.category === cat).sort((a, b) => new Date(b.date) - new Date(a.date));
export const featuredLive = () => MEDIA.find((m) => m.category === 'live') || null;
export const publishedCount = () => MEDIA.filter(isPublished).length;
