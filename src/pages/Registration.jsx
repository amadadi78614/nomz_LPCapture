import { useState } from 'react';
import { Link } from 'react-router-dom';

const TABS = [
  { id: 'kruger-cup', label: 'Kruger Cup', status: 'open' },
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

function Consent({ consent, setConsent, children }) {
  return (
    <label style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginTop: 22, fontSize: 12, lineHeight: 1.6 }}>
      <input required type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 4 }} />
      <span>{children}</span>
    </label>
  );
}

function KrugerCupRegistration() {
  const [consent, setConsent] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  return (
    <div className="card" style={{ padding: 22, borderTop: '3px solid var(--gold)' }}>
      <div className="registration-hero">
        <div>
          <div className="registration-badges">
            <span className="chip">Registration Open</span>
            <span className="chip">Saturday · 10 October 2026</span>
          </div>
          <h2 className="display" style={{ margin: '14px 0 8px' }}>The Kruger Cup</h2>
          <p className="muted" style={{ lineHeight: 1.65, maxWidth: 760 }}>
            Register as a pair for Championship or Challenger. Entry is limited to 24 approved pairs and division placement is verified by Lowveld Padel before the draw.
          </p>
        </div>
        <div className="kruger-price"><small>PAIR ENTRY</small><strong>R800</strong><span>R400 per player</span></div>
      </div>

      <div className="registration-facts">
        <div><b>Championship</b><span>P1 &amp; P2 · 12 pairs</span></div>
        <div><b>Challenger</b><span>P2 &amp; P3 · 12 pairs</span></div>
        <div><b>Format</b><span>3 guaranteed group matches</span></div>
        <div><b>Prize pool</b><span>R6,000 across both divisions</span></div>
      </div>

      <div className="registration-note">
        <b>Division verification</b>
        <span>The stronger player determines the appropriate division. Lowveld Padel may reclassify a pair before the official draw to protect competitive balance.</span>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        alert('Kruger Cup registration and secure payment will activate once the registration database and PayFast merchant account are connected. No payment has been taken.');
      }}>
        <h3 className="form-section-title">Pair details</h3>
        <div className="grid cols-2 registration-fields">
          <Field label="Preferred division">
            <select name="division" required style={inputStyle} defaultValue="">
              <option value="" disabled>Select division</option>
              <option value="championship">Championship · P1 &amp; P2</option>
              <option value="challenger">Challenger · P2 &amp; P3</option>
              <option value="unsure">Not sure · let Lowveld Padel place us</option>
            </select>
          </Field>
          <Field label="Pair / team name (optional)"><input name="pairName" style={inputStyle} /></Field>
        </div>

        <h3 className="form-section-title">Player 1</h3>
        <div className="grid cols-2 registration-fields">
          <Field label="Name and surname"><input name="player1Name" required autoComplete="name" style={inputStyle} /></Field>
          <Field label="Mobile number"><input name="player1Mobile" required type="tel" autoComplete="tel" style={inputStyle} /></Field>
          <Field label="Email address"><input name="player1Email" required type="email" autoComplete="email" style={inputStyle} /></Field>
          <Field label="Current level"><select name="player1Level" required style={inputStyle} defaultValue=""><option value="" disabled>Select level</option><option>P1</option><option>P2</option><option>P3</option><option>Unranked / unsure</option></select></Field>
        </div>

        <h3 className="form-section-title">Player 2</h3>
        <div className="grid cols-2 registration-fields">
          <Field label="Name and surname"><input name="player2Name" required style={inputStyle} /></Field>
          <Field label="Mobile number"><input name="player2Mobile" required type="tel" style={inputStyle} /></Field>
          <Field label="Email address"><input name="player2Email" required type="email" style={inputStyle} /></Field>
          <Field label="Current level"><select name="player2Level" required style={inputStyle} defaultValue=""><option value="" disabled>Select level</option><option>P1</option><option>P2</option><option>P3</option><option>Unranked / unsure</option></select></Field>
        </div>

        <label className="rules-consent">
          <input required type="checkbox" checked={rulesAccepted} onChange={(e) => setRulesAccepted(e.target.checked)} />
          <span><b>Tournament acknowledgement (required).</b> We understand that entry is subject to division verification, available capacity and confirmation by Lowveld Padel. We agree to comply with the final published Kruger Cup rules.</span>
        </label>

        <Consent consent={consent} setConsent={setConsent}>
          <b>POPIA consent (required).</b> We have read the <Link to="/privacy">Lowveld Padel Privacy &amp; POPIA Notice</Link> and consent to the processing of the information supplied for tournament administration, communication, results and rankings.
        </Consent>

        <div className="payment-panel">
          <div><span className="chip">PAYMENT READY</span><h3>Secure online payment</h3><p>Once the PayFast merchant account is connected, approved pairs will pay the R800 entry fee by card or Instant EFT. No card or banking details will be stored by Lowveld Padel.</p></div>
          <button type="submit" className="btn" disabled={!consent || !rulesAccepted} style={{ opacity: consent && rulesAccepted ? 1 : .55 }}>
            Continue registration
          </button>
        </div>
      </form>
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
  const [tab, setTab] = useState('kruger-cup');
  const active = TABS.find((item) => item.id === tab);

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <span className="chip">Lowveld Padel</span>
        <h1 className="display" style={{ marginBottom: 8 }}>Registration Centre</h1>
        <p className="muted" style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 700 }}>
          Kruger Cup and Ubuntu Series registrations are open. Each competition has its own format, eligibility rules and registration form.
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
        {tab === 'kruger-cup' && <KrugerCupRegistration />}
        {tab === 'ubuntu' && <UbuntuRegistration />}
        {active?.status === 'closed' && <ClosedRegistration name={active?.label} />}
      </div>

      <style>{`
        .registration-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
        .registration-tabs button{display:flex;justify-content:space-between;align-items:center;gap:10px;text-align:left;padding:13px 14px;border:1px solid var(--line);border-radius:11px;background:var(--card);color:inherit;cursor:pointer;font-weight:750}
        .registration-tabs button.on{border-color:var(--gold);box-shadow:0 0 0 1px var(--gold) inset}
        .registration-tabs small{font-size:9px;letter-spacing:.08em;padding:4px 6px;border-radius:999px}
        .status-open{color:#8ef0b0;background:rgba(48,180,94,.14)}
        .status-closed{color:var(--muted);background:rgba(255,255,255,.05)}
        .registration-hero{display:flex;justify-content:space-between;gap:22px;align-items:flex-start}
        .registration-badges{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
        .kruger-price{min-width:150px;padding:14px 16px;border:1px solid rgba(212,175,55,.45);border-radius:12px;background:rgba(212,175,55,.08);display:grid;text-align:right}
        .kruger-price small{font-size:9px;letter-spacing:.12em;color:var(--muted)}
        .kruger-price strong{font-family:var(--display);font-size:32px;color:var(--gold);line-height:1.05}
        .kruger-price span{font-size:10px;color:var(--muted)}
        .registration-facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:20px 0}
        .registration-facts>div{display:grid;gap:4px;padding:13px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.025)}
        .registration-facts b{text-transform:uppercase;font-family:var(--display);font-size:13px}
        .registration-facts span{font-size:11px;color:var(--muted);line-height:1.45}
        .registration-note{display:grid;gap:5px;padding:14px;border-left:3px solid var(--gold);background:rgba(212,175,55,.07);font-size:12px;line-height:1.55}
        .registration-note span{color:var(--muted)}
        .form-section-title{margin:24px 0 10px;font-family:var(--display);font-size:15px;text-transform:uppercase;letter-spacing:.04em}
        .registration-fields{gap:14px}
        .rules-consent{display:flex;gap:11px;align-items:flex-start;margin-top:22px;font-size:12px;line-height:1.6}
        .rules-consent input{margin-top:4px}
        .payment-panel{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:22px;padding:18px;border:1px solid rgba(48,180,94,.32);border-radius:12px;background:rgba(48,180,94,.06)}
        .payment-panel h3{margin:8px 0 4px;font-family:var(--display);text-transform:uppercase;font-size:16px}
        .payment-panel p{margin:0;color:var(--muted);font-size:11px;line-height:1.55;max-width:650px}
        .payment-panel .btn{white-space:nowrap}
        @media(max-width:850px){.registration-tabs{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:850px){.registration-facts{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:650px){.grid.cols-2{grid-template-columns:1fr!important}.registration-tabs{display:flex;overflow-x:auto;padding-bottom:5px}.registration-tabs button{min-width:220px;flex-shrink:0}.registration-hero,.payment-panel{display:grid}.kruger-price{text-align:left}.registration-facts{grid-template-columns:1fr}.payment-panel .btn{width:100%}}
      `}</style>
    </div>
  );
}
