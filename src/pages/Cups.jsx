import { useState } from 'react';

export function Cups() {
  const [tab, setTab] = useState('unity');

  return (
    <div className="page">
      <CupsStyles />
      <h1 className="display">Cups</h1>

      <div className="tabbar mt">
        <button className={tab === 'unity' ? 'on' : ''} onClick={() => setTab('unity')}>Unity Cup</button>
        <button className={tab === 'youth' ? 'on' : ''} onClick={() => setTab('youth')}>Youth Championship</button>
      </div>

      {tab === 'unity' && (
        <div className="mt cups-stack">
          <div className="unity-poster-frame">
            <img src="/unity-cup-poster.jpg" alt="Unity Cup 2026" className="unity-poster-image" />
            <div className="unity-on-hold" aria-label="Unity Cup competition temporarily on hold">
              <div className="unity-ribbon-wrap">
                <div className="unity-ribbon">Competition On Hold</div>
              </div>
              <div className="unity-hold-copy">
                <span>Unity Cup 2026</span>
                <p>A revised competition format and date will be announced by the Lowveld Padel Committee.</p>
              </div>
            </div>
          </div>

          <div className="card unity-status-card">
            <span className="unity-status-badge">On Hold</span>
            <p className="eyebrow unity-eyebrow">International Nations Cup</p>
            <b className="unity-title">Unity Cup 2026</b>
            <p className="muted unity-status-copy">
              The competition is temporarily suspended while the format and scheduling are reviewed. Further announcements will be published here.
            </p>
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

function CupsStyles() {
  return (
    <style>{`
      .cups-stack {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .unity-poster-frame {
        position: relative;
        border-radius: var(--r);
        overflow: hidden;
        box-shadow: 0 8px 40px rgba(0,0,0,.6);
        background: #080b13;
        isolation: isolate;
      }

      .unity-poster-image {
        width: 100%;
        display: block;
        filter: saturate(.55) brightness(.56) contrast(1.05);
        transform: scale(1.01);
      }

      .unity-on-hold {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: clamp(22px, 5vw, 48px);
        padding: 24px;
        background:
          linear-gradient(180deg, rgba(5,8,15,.28), rgba(5,8,15,.72)),
          radial-gradient(circle at center, rgba(232,184,75,.08), transparent 58%);
        backdrop-filter: blur(1.8px);
      }

      .unity-ribbon-wrap {
        width: 125%;
        display: flex;
        justify-content: center;
        transform: rotate(-8deg);
      }

      .unity-ribbon {
        min-width: min(680px, 92vw);
        padding: clamp(13px, 2.5vw, 20px) 28px;
        text-align: center;
        background: linear-gradient(90deg, #0b0f18, #171d29 50%, #0b0f18);
        color: var(--gold);
        border-top: 1px solid rgba(232,184,75,.72);
        border-bottom: 1px solid rgba(232,184,75,.72);
        box-shadow: 0 12px 36px rgba(0,0,0,.6), inset 0 0 24px rgba(232,184,75,.05);
        font-family: var(--display);
        font-size: clamp(18px, 4.4vw, 36px);
        font-weight: 900;
        letter-spacing: .16em;
        line-height: 1;
        text-transform: uppercase;
      }

      .unity-hold-copy {
        max-width: 620px;
        text-align: center;
        padding: 16px 20px;
        border: 1px solid rgba(255,255,255,.13);
        border-radius: 12px;
        background: rgba(7,10,18,.72);
        box-shadow: 0 12px 34px rgba(0,0,0,.34);
      }

      .unity-hold-copy span {
        display: block;
        color: #fff;
        font-family: var(--display);
        font-size: clamp(15px, 3vw, 22px);
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
      }

      .unity-hold-copy p {
        margin: 8px 0 0;
        color: rgba(255,255,255,.7);
        font-size: clamp(11px, 2.1vw, 14px);
        line-height: 1.55;
      }

      .unity-status-card {
        position: relative;
        overflow: hidden;
        text-align: center;
        padding: 24px 20px 22px;
        border-color: rgba(232,184,75,.24);
        background: linear-gradient(180deg, rgba(232,184,75,.055), var(--surface));
      }

      .unity-status-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        padding: 5px 12px;
        border: 1px solid rgba(232,184,75,.45);
        border-radius: 999px;
        color: var(--gold);
        background: rgba(232,184,75,.08);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: .16em;
        text-transform: uppercase;
      }

      .unity-eyebrow {
        margin: 0 0 7px;
      }

      .unity-title {
        display: block;
        font-family: var(--display);
        font-size: clamp(20px, 4vw, 27px);
        text-transform: uppercase;
      }

      .unity-status-copy {
        max-width: 610px;
        margin: 10px auto 0;
        font-size: 13px;
        line-height: 1.6;
      }

      @media (max-width: 560px) {
        .unity-on-hold {
          gap: 18px;
          padding: 16px 12px;
        }
        .unity-ribbon-wrap {
          width: 140%;
        }
        .unity-ribbon {
          letter-spacing: .11em;
          padding-left: 18px;
          padding-right: 18px;
        }
        .unity-hold-copy {
          max-width: 88%;
          padding: 12px 14px;
        }
      }
    `}</style>
  );
}
