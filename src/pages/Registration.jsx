import { useState } from 'react';
import { Link } from 'react-router-dom';

const TABS = [
  { id: 'mens-franchise', label: "Men's Franchise League", status: 'closed' },
  { id: 'ladies-franchise', label: 'Ladies Franchise League', status: 'closed' },
  { id: 'mens-legacy', label: "Men's Legacy League", status: 'closed' },
  { id: 'ladies-legacy', label: 'Ladies Legacy League', status: 'closed' },
  { id: 'ubuntu', label: 'Ubuntu Series', status: 'open' },
  { id: 'youth', label: 'Youth Championship Series', status: 'closed' },
];

const TEAMS = [
  'None', 'Other',
  'Arctic Angels', 'Backhand Blossoms', 'Desert Roses', 'Lunar Lillies', 'Net Novas', 'Phoenix Flames',
  'Cheetahs', 'Eagles', 'Honey Badgers', 'Jackals', 'Leopards', 'Rhinos',
  'Desert Falcons', 'Sonic Viboras', 'Globo Boomerangs',
];

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '12px 13px', borderRadius: 10,
  border: '1px solid var(--line)', background: 'var(--card)', color: 'inherit',
};

function Field({ label, children }) {
  return <label style={{ display: 'grid', gap: 7, fontSize: 12, fontWeight: 700 }}>{label}{children}</label>;
}

function ClosedRegistration({ name }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '48px 24px', borderTop: '3px solid var(--line)' }}>
      <div aria-hidden="true" style={{ fontSize: 34, marginBottom: 12 }}>🔒</div>
      <span className="chip">Closed for now</span>
      <h2 className="display" style={{ fontSize: 24, margin: '14px 0 10px' }}>{name}</h2>
      <p className="muted" style={{ maxWidth: 560, margin: '0 auto', lineHeight: 1.65 }}>
        Registrations are currently closed. When the next registration window opens, this tab will become active.
      </p>
    </div>
  );
}

function UbuntuRegistration() {
  const [consent, setConsent] = useState(false);
  const [minor, setMinor] = useState(false);

  return (
    <div className="card" style={{ padding: 22, borderTop: '3px solid var(--gold)' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="chip">Registration Open</span>
        <span className="chip">Ubuntu Series · Challenge 01</span>
      </div>
      <h2 className="display" style={{ margin: '14px 0 8px' }}>Ubuntu Series</h2>
      <p className="muted" style={{ lineHeight: 1.65, maxWidth: 760 }}>
        Your partner changes. Your score doesn’t. Register your player profile for the Lowveld Padel Ubuntu Series.
      </p>

      <form onSubmit={(e) => {
        e.preventDefault();
        alert('Your form is ready. Online submission will activate once the Google Sheets endpoint is connected.');
      }}>
        <div className="grid cols-2" style={{ gap: 14, marginTop: 20 }}>
          <Field label="Profile image / player photo">
            <input name="photo" type="file" accept="image/*" style={inputStyle} />
          </Field>
          <Field label="Gender">
            <select name="gender" required style={inputStyle} defaultValue="">
              <option value="" disabled>Select gender</option><option>Male</option><option>Female</option>
            </select>
          </Field>
          <Field label="Name"><input name="name" required autoComplete="given-name" style={inputStyle} /></Field>
          <Field label="Surname"><input name="surname" required autoComplete="family-name" style={inputStyle} /></Field>
          <Field label="Mobile number"><input name="mobile" required type="tel" autoComplete="tel" style={inputStyle} /></Field>
          <Field label="Date of birth">
            <input name="dob" required type="date" style={inputStyle} onChange={(e) => {
              const d = new Date(e.target.value); const now = new Date();
              let age = now.getFullYear() - d.getFullYear();
              if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) age--;
              setMinor(age < 18);
            }} />
          </Field>
          <Field label="Current team / franchise">
            <select name="team" required style={inputStyle} defaultValue="">
              <option value="" disabled>Select team / franchise</option>
              {TEAMS.map((team) => <option key={team}>{team}</option>)}
            </select>
          </Field>
        </div>

        {minor && (
          <div style={{ marginTop: 18, padding: 14, border: '1px solid rgba(212,175,55,.35)', borderRadius: 10 }}>
            <b>Junior participant</b>
            <p className="muted" style={{ fontSize: 12, lineHeight: 1.55, marginBottom: 0 }}>
              A parent, legal guardian or other competent person authorised to consent on the participant’s behalf must approve this registration.
            </p>
          </div>
        )}

        <label style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginTop: 22, fontSize: 12, lineHeight: 1.6 }}>
          <input required type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 4 }} />
          <span>
            <b>POPIA consent (required).</b> I confirm that I have read the <Link to="/privacy">Lowveld Padel Privacy & POPIA Notice</Link> and consent to Lowveld Padel collecting, storing and processing the information supplied for registration, competition administration, communication, results, rankings and related Lowveld Padel activities. Where the participant is under 18, I confirm that I am authorised to provide this consent on their behalf.
          </span>
        </label>

        <button type="submit" className="btn" disabled={!consent} style={{ marginTop: 20, opacity: consent ? 1 : .55 }}>
          Submit Ubuntu Series Registration
        </button>
      </form>
    </div>
  );
}

export function Registration() {
  const [tab, setTab] = useState('ubuntu');
  const active = TABS.find((item) => item.id === tab);

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <span className="chip">Lowveld Padel</span>
        <h1 className="display" style={{ marginBottom: 8 }}>Registration Centre</h1>
        <p className="muted" style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 700 }}>
          Select a competition below. The Ubuntu Series is currently open for registration; all other competitions are closed for now.
        </p>
      </div>

      <div className="registration-tabs" role="tablist" aria-label="Lowveld Padel registrations">
        {TABS.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={tab === item.id}
            className={tab === item.id ? 'on' : ''} onClick={() => setTab(item.id)}>
            <span>{item.label}</span>
            <small className={item.status === 'open' ? 'status-open' : 'status-closed'}>{item.status === 'open' ? 'OPEN' : 'CLOSED'}</small>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        {active?.status === 'open' ? <UbuntuRegistration /> : <ClosedRegistration name={active?.label} />}
      </div>

      <style>{`
        .registration-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
        .registration-tabs button{display:flex;justify-content:space-between;align-items:center;gap:10px;text-align:left;padding:13px 14px;border:1px solid var(--line);border-radius:11px;background:var(--card);color:inherit;cursor:pointer;font-weight:750}
        .registration-tabs button.on{border-color:var(--gold);box-shadow:0 0 0 1px var(--gold) inset}
        .registration-tabs small{font-size:9px;letter-spacing:.08em;padding:4px 6px;border-radius:999px}
        .status-open{color:#8ef0b0;background:rgba(48,180,94,.14)}
        .status-closed{color:var(--muted);background:rgba(255,255,255,.05)}
        @media(max-width:850px){.registration-tabs{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:650px){.grid.cols-2{grid-template-columns:1fr!important}.registration-tabs{display:flex;overflow-x:auto;padding-bottom:5px}.registration-tabs button{min-width:220px;flex-shrink:0}}
      `}</style>
    </div>
  );
}
