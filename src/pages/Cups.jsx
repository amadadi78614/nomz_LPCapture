import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Cups() {
  const [tab, setTab] = useState('unity');

  return (
    <div className="page">
      <h1 className="display">Cups</h1>

      <div className="tabbar mt">
        <button className={tab === 'unity' ? 'on' : ''} onClick={() => setTab('unity')}>Unity Cup</button>
        <button className={tab === 'youth' ? 'on' : ''} onClick={() => setTab('youth')}>Youth Championship</button>
      </div>

      {tab === 'unity' && (
        <div className="mt" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ borderRadius: 'var(--r)', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.6)' }}>
            <img src="/unity-cup-poster.jpg" alt="Unity Cup 2026" style={{ width: '100%', display: 'block' }} />
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <p className="eyebrow" style={{ marginBottom: 6 }}>International Nations Cup · Nelson Mandela Day</p>
            <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 20 }}>Unity Cup 2026</b>
            <p className="muted" style={{ margin: '8px 0 0', fontSize: 13 }}>18 July 2026 · Vodacom 4U The Grove · South Africa vs Eswatini</p>
            <p style={{ fontSize: 11, color: '#9aa823', margin: '8px 0 0', letterSpacing: '.08em', textTransform: 'uppercase' }}>#UnityCup2026 · Where Nations Unite. Legends Rise.</p>
          </div>
        </div>
      )}

      {tab === 'youth' && (
        <div className="mt">
          <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
            <div style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 20, marginBottom: 8 }}>
              Youth Championship Cup
            </div>
            <p className="muted" style={{ margin: '0 0 14px', fontSize: 13 }}>
              The Youth Championship Cup is coming — details will be announced here first.
            </p>
            <span className="chip">Coming Soon</span>
          </div>
        </div>
      )}
    </div>
  );
}
