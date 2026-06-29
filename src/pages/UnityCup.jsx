import { Link } from 'react-router-dom';

export default function UnityCup() {
  return (
    <div className="page">
      <div className="uc-eyebrow">
        <span>Lowveld Padel Presents</span>
        <span className="uc-star">★ International Nations Cup ★</span>
        <span className="uc-mandela">— Nelson Mandela Day —</span>
      </div>

      <div style={{ margin: '16px 0', borderRadius: 'var(--r)', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.6)' }}>
        <img
          src="/unity-cup-poster.jpg"
          alt="Unity Cup — Lowveld Padel International Nations Cup"
          style={{ width: '100%', display: 'block' }}
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <Link to="/" className="btn ghost">← Back to Home</Link>
      </div>

      <style>{`
        .uc-eyebrow { text-align:center; margin-bottom:8px; }
        .uc-eyebrow span { display:block; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }
        .uc-star { color:var(--gold) !important; font-weight:800; margin:2px 0; }
        .uc-mandela { color:#9aa823 !important; font-weight:800; font-size:13px !important; }
      `}</style>
    </div>
  );
}
