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

      {/* ── POSTER ── */}
      <div style={{ margin: '16px 0', borderRadius: 'var(--r)', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.6)' }}>
        <img
          src="/battle-of-borders-poster.jpg"
          alt="Battle of Borders — Lowveld Padel International Nations Cup"
          style={{ width: '100%', display: 'block' }}
        />
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
    \`}</style>
  );
}
