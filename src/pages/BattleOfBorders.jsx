import { Link } from 'react-router-dom';

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
        <div className="bob-team bob-sa">
          <span className="bob-team-label">★ Team ★</span>
          <div className="bob-team-logo">🇿🇦</div>
          <b className="bob-team-name">South Africa</b>
          <span className="bob-team-venue">Padel 24 · Mbombela</span>
        </div>
        <div className="bob-vs-center">
          <span className="bob-vs">VS</span>
        </div>
        <div className="bob-team bob-esw">
          <span className="bob-team-label">★ Team ★</span>
          <div className="bob-team-logo">🇸🇿</div>
          <b className="bob-team-name">Eswatini</b>
          <span className="bob-team-venue">UVPadel · Everyone's Game</span>
        </div>
      </div>

      {/* ── MOTTOS ── */}
      <div className="bob-mottos">
        <div className="bob-motto">
          <span className="bob-muted">Pride. Passion.</span>
          <span className="bob-green-italic">Legacy.</span>
        </div>
        <div className="bob-motto" style={{ textAlign: 'right' }}>
          <span className="bob-muted">Rivalry. Respect.</span>
          <span className="bob-green-italic">Glory.</span>
        </div>
      </div>

      {/* ── EVENT DETAILS ── */}
      <div className="bob-details-grid">
        <div className="bob-detail">
          <span className="bob-detail-ico">📅</span>
          <span className="bob-detail-label">DATE</span>
          <b className="bob-detail-val">18 July 2026</b>
        </div>
        <div className="bob-detail">
          <span className="bob-detail-ico">📍</span>
          <span className="bob-detail-label">VENUE</span>
          <b className="bob-detail-val">Vodacom 4U The Grove</b>
        </div>
        <div className="bob-detail">
          <span className="bob-detail-ico">🌍</span>
          <span className="bob-detail-label">NATIONS</span>
          <b className="bob-detail-val">2 Teams · 1 Trophy</b>
        </div>
        <div className="bob-detail">
          <span className="bob-detail-ico">🏆</span>
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
      .bob-eyebrow { text-align:center; margin-bottom:8px; }
      .bob-eyebrow span { display:block; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }
      .bob-star { color:var(--gold) !important; font-weight:800; margin:2px 0; }
      .bob-mandela { color:#9aa823 !important; font-weight:800; font-size:13px !important; }

      .bob-title-wrap { text-align:center; padding:20px 0 16px;
        background:radial-gradient(ellipse at 50% 0%, rgba(154,168,35,.12), transparent 60%); }
      .bob-title { font-family:var(--display); font-size:clamp(52px,14vw,96px); line-height:.85;
        text-transform:uppercase; letter-spacing:.02em; margin:0; }
      .bob-green { color:#9aa823; -webkit-text-stroke:2px #9aa823; }
      .bob-tagline { font-size:13px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); margin:12px 0 0; }
      .bob-gold { color:var(--gold); }

      .bob-vs-card { display:grid; grid-template-columns:1fr auto 1fr; gap:12px; align-items:center;
        background:linear-gradient(135deg,rgba(0,60,30,.3),rgba(10,15,28,.6),rgba(30,30,80,.3));
        border:1px solid var(--line); border-radius:var(--r); padding:20px 12px; margin:20px 0; }
      .bob-team { display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center; }
      .bob-sa { }
      .bob-esw { }
      .bob-team-label { font-size:10px; letter-spacing:.1em; color:var(--gold); font-weight:800; }
      .bob-team-logo { font-size:48px; line-height:1; }
      .bob-team-name { font-family:var(--display); text-transform:uppercase; font-size:18px; }
      .bob-team-venue { font-size:11px; color:var(--muted); }
      .bob-vs-center { display:flex; align-items:center; justify-content:center; }
      .bob-vs { font-family:var(--display); font-size:42px; color:#9aa823; font-weight:900;
        text-shadow:0 0 20px rgba(154,168,35,.5); }

      .bob-mottos { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:16px 0; }
      .bob-motto { display:flex; flex-direction:column; gap:2px; padding:12px; background:var(--surface); border:1px solid var(--line); border-radius:var(--r-sm); }
      .bob-muted { color:var(--muted); font-size:13px; font-weight:800; font-style:italic; }
      .bob-green-italic { color:#9aa823; font-size:15px; font-weight:900; font-style:italic; }

      .bob-details-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:16px 0; }
      .bob-detail { display:flex; flex-direction:column; align-items:center; gap:4px; padding:14px 10px;
        background:var(--surface); border:1px solid var(--line); border-radius:var(--r-sm); text-align:center; }
      .bob-detail-ico { font-size:20px; }
      .bob-detail-label { font-size:9px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
      .bob-detail-val { font-family:var(--display); text-transform:uppercase; font-size:13px; color:var(--text); }

      .bob-badge { text-align:center; padding:14px; margin:16px 0;
        background:linear-gradient(90deg,transparent,rgba(199,154,62,.15),transparent);
        border-top:1px solid rgba(199,154,62,.3); border-bottom:1px solid rgba(199,154,62,.3);
        font-family:var(--display); font-size:15px; letter-spacing:.1em; color:var(--gold); text-transform:uppercase; }

      .bob-sponsors { text-align:center; margin:16px 0; }
      .bob-sponsors-label { font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:10px; }
      .bob-sponsors-row { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }

      .bob-footer { text-align:center; padding:16px 0 0; font-size:12px; letter-spacing:.06em;
        color:#9aa823; text-transform:uppercase; font-weight:700; }
    `}</style>
  );
}
