import { Link } from 'react-router-dom';

/* ─── Flag CDN helper ─────────────────────────────────────────────────────── */
const Flag = ({ code, alt, style = {} }) => (
  <img
    src={`https://flagcdn.com/${code}.svg`}
    alt={alt}
    style={{ display: 'block', ...style }}
  />
);

export default function BattleOfBorders() {
  return (
    <div className="page">
      <BobStyles />

      {/* ── TOP EYEBROW ── */}
      <div className="bob-eyebrow">
        <span>Lowveld Padel Presents</span>
        <span className="bob-star">★ International Nations Cup ★</span>
        <span className="bob-mandela">Nelson Mandela Day</span>
      </div>

      {/* ── MAIN TITLE ── */}
      <div className="bob-title-wrap">
        <h1 className="bob-title">
          Battle<br />of<br /><span className="bob-green">Borders</span>
        </h1>
        <p className="bob-tagline">Two Nations. One Trophy. <span className="bob-gold">Eternal</span> Bragging Rights.</p>
      </div>

      {/* ── VS MATCHUP ── */}
      <div className="bob-vs-card">

        {/* South Africa */}
        <div className="bob-team bob-sa">
          <span className="bob-team-label">★ Team ★</span>
          <div className="bob-flag-wrap">
            <Flag code="za" alt="South Africa flag" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
          </div>
          <b className="bob-team-name">South Africa</b>
          <span className="bob-team-venue">Padel 24 · Mbombela</span>
        </div>

        {/* VS */}
        <div className="bob-vs-center">
          <span className="bob-vs">VS</span>
        </div>

        {/* Eswatini */}
        <div className="bob-team bob-esw">
          <span className="bob-team-label">★ Team ★</span>
          <div className="bob-flag-wrap">
            <Flag code="sz" alt="Eswatini flag" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
          </div>
          <b className="bob-team-name">Eswatini</b>
          <span className="bob-team-venue">UVPadel · Everyone's Game</span>
        </div>

      </div>

      {/* ── MOTTOS ── */}
      <div className="bob-mottos">
        <div className="bob-motto bob-motto-sa">
          <div className="bob-motto-flag">
            <Flag code="za" alt="South Africa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span className="bob-muted">Pride. Passion.</span>
          <span className="bob-green-italic">Legacy.</span>
        </div>
        <div className="bob-motto bob-motto-esw" style={{ textAlign: 'right' }}>
          <div className="bob-motto-flag bob-motto-flag-right">
            <Flag code="sz" alt="Eswatini" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span className="bob-muted">Rivalry. Respect.</span>
          <span className="bob-green-italic">Glory.</span>
        </div>
      </div>

      {/* ── EVENT DETAILS ── */}
      <div className="bob-details-grid">
        <div className="bob-detail">
          <span className="bob-detail-ico-svg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </span>
          <span className="bob-detail-label">DATE</span>
          <b className="bob-detail-val">18 July 2026</b>
        </div>
        <div className="bob-detail">
          <span className="bob-detail-ico-svg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
            </svg>
          </span>
          <span className="bob-detail-label">VENUE</span>
          <b className="bob-detail-val">Vodacom 4U The Grove</b>
        </div>
        <div className="bob-detail">
          <span className="bob-detail-ico-svg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </span>
          <span className="bob-detail-label">NATIONS</span>
          <b className="bob-detail-val">2 Teams · 1 Trophy</b>
        </div>
        <div className="bob-detail">
          <span className="bob-detail-ico-svg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
            </svg>
          </span>
          <span className="bob-detail-label">CHAMPION</span>
          <b className="bob-detail-val">Eternal Bragging Rights</b>
        </div>
      </div>

      {/* ── INAUGURAL BADGE ── */}
      <div className="bob-badge">
        ★ Inaugural Edition · 2026 ★
      </div>

      {/* ── SPONSORS ── */}
      <div className="bob-sponsors">
        <p className="bob-sponsors-label">Proudly Supported By</p>
        <div className="bob-sponsors-row">
          {['Vodacom 4U · The Grove', 'Lowvelder', 'OSHEE Sport & Vitamin Drinks'].map((s) => (
            <span key={s} className="chip" style={{ fontSize: 12 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ── HASHTAG ── */}
      <div className="bob-footer">
        <span>#BattleOfBorders</span>
        <span className="bob-muted"> · </span>
        <span>Where Nations Collide. Legends Rise.</span>
      </div>

      <div style={{ marginTop: 24 }}>
        <Link to="/" className="btn ghost">← Back to Home</Link>
      </div>
    </div>
  );
}

function BobStyles() {
  return (
    <style>{`
      /* ── EYEBROW ── */
      .bob-eyebrow { text-align:center; margin-bottom:8px; }
      .bob-eyebrow span { display:block; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }
      .bob-star { color:var(--gold) !important; font-weight:800; margin:2px 0; }
      .bob-mandela { color:#9aa823 !important; font-weight:800; font-size:13px !important; }

      /* ── TITLE ── */
      .bob-title-wrap {
        text-align:center; padding:20px 0 16px;
        background:radial-gradient(ellipse at 50% 0%, rgba(154,168,35,.14), transparent 65%);
      }
      .bob-title {
        font-family:var(--display); font-size:clamp(52px,14vw,96px); line-height:.85;
        text-transform:uppercase; letter-spacing:.02em; margin:0;
      }
      .bob-green { color:#9aa823; -webkit-text-stroke:2px #9aa823; }
      .bob-tagline { font-size:13px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); margin:12px 0 0; }
      .bob-gold { color:var(--gold); }

      /* ── VS CARD ── */
      .bob-vs-card {
        display:grid; grid-template-columns:1fr auto 1fr; gap:12px; align-items:center;
        background:linear-gradient(135deg,rgba(0,60,30,.35),rgba(10,15,28,.65),rgba(30,30,80,.35));
        border:1px solid var(--line); border-radius:var(--r); padding:24px 12px; margin:20px 0;
        backdrop-filter:blur(6px);
      }
      .bob-team { display:flex; flex-direction:column; align-items:center; gap:8px; text-align:center; }
      .bob-team-label { font-size:10px; letter-spacing:.1em; color:var(--gold); font-weight:800; }

      /* ── FLAG in VS card ── */
      .bob-flag-wrap {
        width:90px; height:60px;
        border-radius:8px;
        overflow:hidden;
        border:2px solid rgba(255,255,255,.18);
        box-shadow:0 4px 18px rgba(0,0,0,.45), 0 0 0 1px rgba(154,168,35,.25);
        flex-shrink:0;
      }

      .bob-team-name { font-family:var(--display); text-transform:uppercase; font-size:18px; letter-spacing:.04em; }
      .bob-team-venue { font-size:11px; color:var(--muted); }
      .bob-vs-center { display:flex; align-items:center; justify-content:center; }
      .bob-vs {
        font-family:var(--display); font-size:42px; color:#9aa823; font-weight:900;
        text-shadow:0 0 24px rgba(154,168,35,.6), 0 0 60px rgba(154,168,35,.25);
      }

      /* ── MOTTOS ── */
      .bob-mottos { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:16px 0; }
      .bob-motto {
        position:relative; overflow:hidden;
        display:flex; flex-direction:column; gap:2px; padding:14px 12px;
        background:var(--surface); border:1px solid var(--line); border-radius:var(--r-sm);
      }
      /* Flag watermark behind motto text */
      .bob-motto-flag {
        position:absolute; top:0; left:0; width:100%; height:100%;
        opacity:.13; pointer-events:none;
      }
      .bob-motto-flag-right { }
      .bob-motto > span { position:relative; z-index:1; }
      .bob-muted { color:var(--muted); font-size:13px; font-weight:800; font-style:italic; }
      .bob-green-italic { color:#9aa823; font-size:15px; font-weight:900; font-style:italic; }

      /* ── DETAILS GRID ── */
      .bob-details-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:16px 0; }
      .bob-detail {
        display:flex; flex-direction:column; align-items:center; gap:6px; padding:16px 10px;
        background:var(--surface); border:1px solid var(--line); border-radius:var(--r-sm); text-align:center;
      }
      .bob-detail-ico-svg {
        width:22px; height:22px; color:#9aa823; display:block;
      }
      .bob-detail-ico-svg svg { width:100%; height:100%; }
      .bob-detail-label { font-size:9px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
      .bob-detail-val { font-family:var(--display); text-transform:uppercase; font-size:13px; color:var(--text); }

      /* ── BADGE ── */
      .bob-badge {
        text-align:center; padding:14px; margin:16px 0;
        background:linear-gradient(90deg,transparent,rgba(199,154,62,.18),transparent);
        border-top:1px solid rgba(199,154,62,.35); border-bottom:1px solid rgba(199,154,62,.35);
        font-family:var(--display); font-size:15px; letter-spacing:.12em; color:var(--gold); text-transform:uppercase;
      }

      /* ── SPONSORS ── */
      .bob-sponsors { text-align:center; margin:16px 0; }
      .bob-sponsors-label { font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:10px; }
      .bob-sponsors-row { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }

      /* ── FOOTER ── */
      .bob-footer {
        text-align:center; padding:16px 0 0; font-size:12px; letter-spacing:.06em;
        color:#9aa823; text-transform:uppercase; font-weight:700;
      }
    `}</style>
  );
}
