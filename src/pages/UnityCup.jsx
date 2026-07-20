import { Link } from 'react-router-dom';

export default function UnityCup() {
  return (
    <div className="page">
      <span className="eyebrow" style={{ color: '#9aa823' }}>★ International Nations Cup · Nelson Mandela Day ★</span>
      <h1 className="display" style={{ margin: '6px 0 4px' }}>Unity Cup 2026</h1>
      <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
        <b style={{ color: 'var(--loss)', fontSize: 13 }}>⏸ Event currently on hold</b>
        <p style={{ color: 'var(--muted)', fontSize: 12, margin: '4px 0 0' }}>New dates will be confirmed and announced here first. Follow @LowveldPadel for updates.</p>
      </div>
      <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>Two Nations. One Trophy. One Vision.</p>

      {/* Poster */}
      <div style={{ borderRadius: 'var(--r)', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.6)', marginBottom: 16 }}>
        <img src="/unity-cup-poster.jpg" alt="Unity Cup 2026" style={{ width: '100%', display: 'block' }} />
      </div>

      {/* Event Details */}
      <div className="grid cols-2" style={{ gap: 10, marginBottom: 16 }}>
        {[
          ['Date', 'TBC — Date to be confirmed'],
          ['Venue', 'Vodacom 4U The Grove, Mbombela'],
          ['Format', 'Nations Cup · International Series'],
          ['Hashtag', '#UnityCup2026'],
        ].map(([label, val]) => (
          <div key={label} className="card" style={{ padding: '14px 16px' }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>{label}</div>
            <b style={{ fontSize: 14 }}>{val}</b>
          </div>
        ))}
      </div>

      {/* Teams */}
      <div className="grid cols-2" style={{ gap: 10, marginBottom: 16 }}>
        <div className="card" style={{ borderLeft: '3px solid #4fc078', paddingLeft: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🇿🇦</div>
          <div className="eyebrow">Team</div>
          <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 18 }}>South Africa</b>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Padel 24 · Mbombela</div>
        </div>
        <div className="card" style={{ borderLeft: '3px solid #6b9fd4', paddingLeft: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🇸🇿</div>
          <div className="eyebrow">Team</div>
          <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 18 }}>Eswatini</b>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>UVPadel · Everyone's Game</div>
        </div>
      </div>

      {/* Taglines */}
      <div className="card" style={{ textAlign: 'center', padding: '18px', marginBottom: 16, background: 'linear-gradient(135deg, rgba(154,168,35,.08), transparent)', border: '1px solid rgba(154,168,35,.2)' }}>
        <p style={{ margin: '0 0 6px', fontStyle: 'italic', color: 'var(--muted)', fontSize: 13 }}>Celebrating Unity. Building Respect. Together.</p>
        <p style={{ margin: 0, fontStyle: 'italic', color: '#9aa823', fontSize: 13, fontWeight: 700 }}>One Game. One People. One Future. · Diverse Roots. United Hearts.</p>
      </div>

      {/* Inaugural badge */}
      <div style={{ textAlign: 'center', padding: '14px', marginBottom: 16, background: 'linear-gradient(90deg, transparent, rgba(199,154,62,.15), transparent)', borderTop: '1px solid rgba(199,154,62,.35)', borderBottom: '1px solid rgba(199,154,62,.35)', fontFamily: 'var(--display)', fontSize: 14, letterSpacing: '.12em', color: 'var(--gold)', textTransform: 'uppercase' }}>
        ★ Inaugural Edition · 2026 ★
      </div>

      {/* Sponsors */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Proudly Supported By</div>
        <div className="row" style={{ gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Vodacom 4U · The Grove', 'Lowvelder', 'OSHEE Sport & Vitamin Drinks'].map((s) => (
            <b key={s} style={{ fontSize: 13, color: 'rgba(255,255,255,.7)' }}>{s}</b>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 10, color: '#9aa823', letterSpacing: '.1em', textTransform: 'uppercase' }}>
          #UnityCup2026 · Where Nations Unite. Legends Rise.
        </div>
      </div>

      <Link to="/" className="btn ghost">← Back to Home</Link>
    </div>
  );
}
