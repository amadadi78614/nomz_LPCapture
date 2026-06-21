import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TV_LIVE, TV_VIDEOS, TV_CATEGORIES, tvByCategory,
  getYouTubeId, ytThumb, ytEmbed, franchiseById, SPONSORS,
} from '../data/seed';
import { SectionHead, SponsorRail } from '../components/ui';

const sponsorById = (id) => SPONSORS.find((s) => s.id === id);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });

/* ---------- shared video card ---------- */
function VideoThumb({ video, onPlay, ratio = '56.25%' }) {
  const id = getYouTubeId(video.youtube_url);
  const thumb = video.thumbnail || ytThumb(video.youtube_url);
  const live = video.category === 'live';
  return (
    <button
      onClick={() => id && onPlay(video)}
      className="tv-thumb"
      style={{ '--ratio': ratio, cursor: id ? 'pointer' : 'default' }}
      aria-label={video.title}
    >
      <div className="tv-thumb-img">
        {thumb ? (
          <img src={thumb} alt="" loading="lazy" />
        ) : (
          <div className="tv-thumb-empty">
            <img src="/brand/lp-mark.png" alt="" className="tv-thumb-mark" />
          </div>
        )}
        <span className={`tv-play ${id ? '' : 'soon'}`}>{id ? '►' : '◷'}</span>
        {live && id && <span className="tv-badge live">● LIVE</span>}
        {live && !id && <span className="tv-badge soon">OFFLINE</span>}
        {!live && !id && <span className="tv-badge soon">Coming soon</span>}
        {video.duration && id && <span className="tv-dur">{video.duration}</span>}
      </div>
    </button>
  );
}

function VideoCard({ video, onPlay }) {
  const id = getYouTubeId(video.youtube_url);
  const sp = sponsorById(video.sponsor);
  return (
    <div className="tv-card">
      <VideoThumb video={video} onPlay={onPlay} />
      <div className="tv-card-body">
        <div className="row spread" style={{ gap: 8 }}>
          <span className="muted" style={{ fontSize: 11 }}>{fmtDate(video.date)}</span>
          {sp && <span className="muted" style={{ fontSize: 10 }}>presented by {sp.name}</span>}
        </div>
        <p className="tv-card-title">{video.title}</p>
        {video.subtitle && <p className="muted" style={{ fontSize: 12, margin: 0 }}>{video.subtitle}</p>}
        <div className="row" style={{ gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {(video.franchises || []).map((fid) => {
            const fr = franchiseById(fid);
            return <span key={fid} className="chip" style={{ fontSize: 10, padding: '1px 7px' }}>{fr.name}</span>;
          })}
          {!id && <span className="chip" style={{ fontSize: 10, color: 'var(--muted)' }}>awaiting upload</span>}
        </div>
      </div>
    </div>
  );
}

/* ---------- horizontal carousel row ---------- */
function Carousel({ title, items, onPlay, to }) {
  if (!items.length) return null;
  return (
    <section style={{ marginTop: 28 }}>
      <SectionHead title={title} to={to} cta="All" />
      <div className="tv-rail">
        {items.map((v) => (
          <div className="tv-rail-item" key={v.id}><VideoCard video={v} onPlay={onPlay} /></div>
        ))}
      </div>
    </section>
  );
}

/* ---------- lightbox player ---------- */
function Player({ video, onClose }) {
  const embed = ytEmbed(video.youtube_url);
  if (!embed) return null;
  return (
    <div className="tv-modal" onClick={onClose}>
      <div className="tv-modal-inner" onClick={(e) => e.stopPropagation()}>
        <button className="tv-modal-x" onClick={onClose} aria-label="Close">✕</button>
        <div className="tv-modal-video">
          <iframe
            src={`${embed}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div style={{ padding: '12px 4px 0' }}>
          <p style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>{video.title}</p>
          {video.subtitle && <p className="muted" style={{ fontSize: 13, margin: '4px 0 0' }}>{video.subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------- main page ---------- */
export default function LowveldTV() {
  const [playing, setPlaying] = useState(null);
  const [filter, setFilter] = useState('all');
  const liveId = getYouTubeId(TV_LIVE.youtube_url);

  const cats = filter === 'all' ? TV_CATEGORIES : TV_CATEGORIES.filter((c) => c.key === filter);

  return (
    <div className="page">
      <LowveldTVStyles />
      <span className="eyebrow" style={{ color: 'var(--live)' }}>Lowveld TV</span>
      <h1 className="display">The Broadcast Home of Lowveld Padel</h1>
      <p className="muted" style={{ maxWidth: 620 }}>
        Live match nights, highlights, full replays, player interviews and the weekly show — all in one place.
      </p>

      {/* ---- Featured live stream ---- */}
      <section className="tv-live" style={{ marginTop: 18 }}>
        <div className="tv-live-frame">
          {liveId ? (
            <div className="tv-thumb-img" style={{ '--ratio': '56.25%' }}>
              <iframe
                src={`${ytEmbed(TV_LIVE.youtube_url)}?rel=0`}
                title={TV_LIVE.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          ) : (
            <div className="tv-thumb-img tv-live-off" style={{ '--ratio': '56.25%' }}>
              <div className="tv-thumb-empty">
                <img src="/brand/lp-mark.png" alt="" className="tv-thumb-mark" />
                <span className="tv-badge soon" style={{ position: 'static', marginTop: 10 }}>Stream offline</span>
              </div>
            </div>
          )}
        </div>
        <div className="tv-live-meta">
          <span className={`tv-livetag ${liveId ? 'on' : ''}`}>{liveId ? '● LIVE NOW' : 'NEXT BROADCAST'}</span>
          <h2 style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', margin: '8px 0 4px', fontSize: 22 }}>{TV_LIVE.title}</h2>
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>{TV_LIVE.subtitle}</p>
          {!liveId && (
            <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
              Match-night streams appear here automatically. Until then, follow every rubber in the{' '}
              <Link to="/live" className="gold">Match Centre</Link>.
            </p>
          )}
          {sponsorById(TV_LIVE.sponsor) && (
            <p className="muted" style={{ marginTop: 10, fontSize: 11 }}>Broadcast presented by {sponsorById(TV_LIVE.sponsor).name}</p>
          )}
        </div>
      </section>

      {/* ---- category filter ---- */}
      <div className="tabbar mt" style={{ marginTop: 22 }}>
        <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>All</button>
        {TV_CATEGORIES.map((c) => (
          <button key={c.key} className={filter === c.key ? 'on' : ''} onClick={() => setFilter(c.key)}>{c.label}</button>
        ))}
      </div>

      {/* ---- content rows ---- */}
      {cats.map((c) => (
        <Carousel key={c.key} title={c.label} items={tvByCategory(c.key)} onPlay={setPlaying} />
      ))}

      <div style={{ marginTop: 30 }}><SponsorRail placement="tv" /></div>

      {playing && <Player video={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}

/* ---------- scoped styles ---------- */
function LowveldTVStyles() {
  return (
    <style>{`
      .tv-thumb { display:block; width:100%; padding:0; border:0; background:none; text-align:left; }
      .tv-thumb-img { position:relative; width:100%; padding-top:var(--ratio,56.25%); border-radius:var(--r-sm); overflow:hidden; background:#070a13; border:1px solid var(--line); }
      .tv-thumb-img img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
      .tv-thumb-empty { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;
        background:radial-gradient(circle at 50% 35%, rgba(255,255,255,.05), transparent 70%), #0a0f1c; }
      .tv-thumb-mark { width:46px; height:46px; object-fit:contain; opacity:.5; }
      .tv-play { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:46px; height:46px; border-radius:50%;
        display:flex; align-items:center; justify-content:center; font-size:16px; color:#fff;
        background:rgba(0,0,0,.55); border:1.5px solid rgba(255,255,255,.7); backdrop-filter:blur(2px); }
      .tv-play.soon { font-size:18px; opacity:.6; border-style:dashed; }
      .tv-badge { position:absolute; top:8px; left:8px; font-size:10px; font-weight:700; letter-spacing:.04em; padding:2px 7px; border-radius:4px;
        font-family:var(--data); text-transform:uppercase; }
      .tv-badge.live { background:var(--live); color:#fff; }
      .tv-badge.soon { background:rgba(255,255,255,.1); color:var(--muted); border:1px solid var(--line); }
      .tv-dur { position:absolute; bottom:8px; right:8px; font-size:11px; font-family:var(--data); background:rgba(0,0,0,.7); color:#fff; padding:1px 6px; border-radius:4px; }
      .tv-card { background:var(--surface); border:1px solid var(--line); border-radius:var(--r); overflow:hidden; height:100%; display:flex; flex-direction:column; }
      .tv-card-body { padding:10px 12px 12px; display:flex; flex-direction:column; gap:4px; }
      .tv-card-title { font-weight:600; font-size:14px; line-height:1.25; margin:2px 0 0; }
      .tv-rail { display:flex; gap:14px; overflow-x:auto; padding:14px 2px 6px; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; }
      .tv-rail::-webkit-scrollbar { height:6px; } .tv-rail::-webkit-scrollbar-thumb { background:var(--line-strong); border-radius:3px; }
      .tv-rail-item { flex:0 0 78%; max-width:300px; scroll-snap-align:start; }
      .tv-live { display:grid; grid-template-columns:1fr; gap:16px; background:var(--surface); border:1px solid var(--line); border-radius:var(--r); padding:14px; }
      .tv-live-frame { position:relative; }
      .tv-live-off { }
      .tv-live-meta { display:flex; flex-direction:column; justify-content:center; }
      .tv-livetag { align-self:flex-start; font-family:var(--data); font-size:11px; font-weight:700; letter-spacing:.06em; padding:3px 9px; border-radius:5px;
        background:rgba(255,255,255,.08); color:var(--muted); border:1px solid var(--line); }
      .tv-livetag.on { background:var(--live); color:#fff; border-color:transparent; animation:tvpulse 2s infinite; }
      @keyframes tvpulse { 0%,100%{opacity:1} 50%{opacity:.65} }
      .tv-modal { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,.86); display:flex; align-items:center; justify-content:center; padding:16px; }
      .tv-modal-inner { width:100%; max-width:860px; }
      .tv-modal-video { position:relative; width:100%; padding-top:56.25%; border-radius:var(--r); overflow:hidden; background:#000; }
      .tv-modal-video iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }
      .tv-modal-x { position:absolute; top:14px; right:16px; z-index:2; width:38px; height:38px; border-radius:50%; border:1px solid rgba(255,255,255,.3);
        background:rgba(0,0,0,.5); color:#fff; font-size:15px; cursor:pointer; }
      @media (min-width:760px) {
        .tv-live { grid-template-columns:1.6fr 1fr; padding:16px; }
        .tv-rail-item { flex:0 0 300px; }
      }
    `}</style>
  );
}
