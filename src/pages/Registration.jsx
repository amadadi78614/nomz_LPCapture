import { useState } from 'react';

const TABS = [
  { id: 'ladies', label: 'Ladies League' },
  { id: 'youth', label: 'Youth Championship' },
  { id: 'lpcup', label: 'LP Cup' },
];

function RegistrationsClosed() {
  return (
    <div
      className="card"
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        borderTop: '3px solid var(--gold)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 64,
          height: 64,
          margin: '0 auto 18px',
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: 'rgba(212, 175, 55, 0.12)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          fontSize: 30,
        }}
      >
        🔒
      </div>

      <span className="chip" style={{ marginBottom: 14 }}>
        Registrations Closed
      </span>

      <h2
        className="display"
        style={{
          textTransform: 'uppercase',
          fontSize: 24,
          margin: '14px 0 10px',
        }}
      >
        Ladies League — Season 2
      </h2>

      <p
        className="muted"
        style={{
          maxWidth: 620,
          margin: '0 auto',
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        Thank you to everyone who registered for the Lowveld Padel Ladies
        League. Registrations are now officially closed.
      </p>

      <p
        className="muted"
        style={{
          maxWidth: 620,
          margin: '12px auto 0',
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        Registered players will receive further league information directly
        from the Lowveld Padel team.
      </p>
    </div>
  );
}

function ComingSoonTab({ name }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div
        style={{
          fontFamily: 'var(--display)',
          textTransform: 'uppercase',
          fontSize: 20,
          marginBottom: 8,
        }}
      >
        {name}
      </div>

      <p className="muted" style={{ margin: '0 0 14px' }}>
        Registration opens soon — watch this space.
      </p>

      <span className="chip">Coming Soon</span>
    </div>
  );
}

export function Registration() {
  const [tab, setTab] = useState('ladies');

  return (
    <div className="page">
      <RegStyles />

      <h1 className="display">Registration</h1>

      <p className="muted" style={{ fontSize: 13 }}>
        View the current registration status for Lowveld Padel competitions.
      </p>

      <div className="tabbar mt" role="tablist" aria-label="Competition registrations">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={tab === item.id ? 'on' : ''}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        {tab === 'ladies' && <RegistrationsClosed />}
        {tab === 'youth' && <ComingSoonTab name="Youth Championship Cup" />}
        {tab === 'lpcup' && <ComingSoonTab name="LP Cup" />}
      </div>
    </div>
  );
}

function RegStyles() {
  return (
    <style>{`
      .tabbar button:focus-visible {
        outline: 2px solid var(--gold);
        outline-offset: 3px;
      }

      @media (max-width: 500px) {
        .tabbar {
          overflow-x: auto;
          justify-content: flex-start;
          scrollbar-width: thin;
        }

        .tabbar button {
          white-space: nowrap;
          flex-shrink: 0;
        }
      }
    `}</style>
  );
}
